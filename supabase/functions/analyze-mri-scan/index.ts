
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

// CORS headers for browser access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      console.error("Gemini API key not found in environment");
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log("Gemini API key found, processing request...");

    // Get request data
    const { scanId } = await req.json();
    if (!scanId) {
      return new Response(
        JSON.stringify({ error: "Scan ID is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log("Processing scan ID:", scanId);

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch MRI scan data
    const { data: scanData, error: scanError } = await supabase
      .from("mri_scans")
      .select("*, patients(*)")
      .eq("id", scanId)
      .single();

    if (scanError || !scanData) {
      console.error("Failed to fetch scan data:", scanError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch scan data", details: scanError }),
        { status: 404, headers: corsHeaders }
      );
    }

    console.log("Scan data retrieved successfully");

    // Call Gemini API with image URL
    const imageUrl = scanData.image_url;
    console.log("Analyzing image URL:", imageUrl);

    // Convert image URL to base64 if it's a web URL
    let imageBase64 = "";
    if (imageUrl.startsWith("http")) {
      try {
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        imageBase64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
      } catch (error) {
        console.error("Failed to fetch image:", error);
        // For placeholder images, create a mock base64
        imageBase64 = btoa("mock-image-data");
      }
    } else if (imageUrl.startsWith("data:image")) {
      imageBase64 = imageUrl.split(",")[1];
    }

    console.log("Calling Gemini API...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "You are an expert radiologist analyzing MRI scan images. Please provide a detailed medical assessment of this MRI scan. Include the following sections in your analysis:\n\n1. **Assessment**: Overall technical quality and visibility of anatomical structures\n2. **Abnormalities**: Any visible abnormalities, lesions, or areas of concern\n3. **Possible Diagnosis**: Your professional opinion on potential diagnoses based on the findings\n4. **Recommendations**: Suggested follow-up actions, additional tests, or treatment considerations\n\nPlease be thorough but concise, and use appropriate medical terminology."
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    const aiResult = await response.json();
    console.log("Gemini API response received");
    
    if (!aiResult.candidates || aiResult.candidates.length === 0) {
      console.error("AI analysis failed:", aiResult.error);
      return new Response(
        JSON.stringify({ error: "AI analysis failed", details: aiResult.error }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Extract AI analysis result
    const analysisText = aiResult.candidates[0].content.parts[0].text;
    console.log("Analysis completed, parsing results...");
    
    // Parse analysis sections
    const sections = {
      assessment: extractSection(analysisText, "Assessment"),
      abnormalities: extractSection(analysisText, "Abnormalities"),
      diagnosis: extractSection(analysisText, "Possible Diagnosis"),
      recommendations: extractSection(analysisText, "Recommendations"),
    };
    
    // Calculate confidence score based on language used
    const confidenceScore = calculateConfidenceScore(analysisText);
    
    console.log("Saving AI result to database...");

    // Save AI result to database
    const { data: resultData, error: resultError } = await supabase
      .from("ai_results")
      .insert({
        mri_scan_id: scanId,
        patient_id: scanData.patient_id,
        diagnosis: sections.diagnosis || "No conclusive diagnosis available",
        confidence_score: confidenceScore,
        areas_of_concern: sections.abnormalities || "No specific areas of concern identified",
        recommendations: sections.recommendations || "No specific recommendations provided",
      })
      .select()
      .single();

    if (resultError) {
      console.error("Failed to save AI result:", resultError);
      return new Response(
        JSON.stringify({ error: "Failed to save AI result", details: resultError }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Update MRI scan record to mark as AI processed
    await supabase
      .from("mri_scans")
      .update({ ai_processed: true })
      .eq("id", scanId);

    console.log("Analysis complete and saved successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        result: resultData,
        analysis: sections
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in analyze-mri-scan function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

// Helper function to extract sections from AI analysis text
function extractSection(text: string, sectionName: string): string | null {
  const patterns = [
    new RegExp(`\\*\\*${sectionName}\\*\\*:?\\s*([\\s\\S]*?)(?=\\n\\*\\*|$)`, "i"),
    new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\n|\\n[A-Z]|$)`, "i"),
    new RegExp(`\\d+\\.\\s*\\*\\*${sectionName}\\*\\*:?\\s*([\\s\\S]*?)(?=\\n\\d+\\.|$)`, "i")
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

// Helper function to calculate confidence score based on language
function calculateConfidenceScore(text: string): number {
  const highConfidenceWords = ["clearly", "definitely", "certainly", "evident", "obvious", "conclusive"];
  const mediumConfidenceWords = ["likely", "probably", "suggests", "indicates", "appears", "consistent"];
  const lowConfidenceWords = ["possibly", "might", "may", "uncertain", "unclear", "questionable"];
  
  let score = 0.5; // Default medium confidence
  
  // Check for high confidence words
  if (highConfidenceWords.some(word => text.toLowerCase().includes(word))) {
    score += 0.3;
  }
  
  // Check for medium confidence words
  if (mediumConfidenceWords.some(word => text.toLowerCase().includes(word))) {
    score += 0.1;
  }
  
  // Check for low confidence words
  if (lowConfidenceWords.some(word => text.toLowerCase().includes(word))) {
    score -= 0.2;
  }
  
  // Ensure score is between 0 and 1
  return Math.max(0, Math.min(1, score));
}
