
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
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Get request data
    const { scanId } = await req.json();
    if (!scanId) {
      return new Response(
        JSON.stringify({ error: "Scan ID is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

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
      return new Response(
        JSON.stringify({ error: "Failed to fetch scan data", details: scanError }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Call Gemini API with image URL
    const imageUrl = scanData.image_url;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
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
                  text: "Analyze this MRI scan image. Provide a detailed assessment, identify any visible abnormalities, suggest a potential diagnosis, and recommend follow-up actions. Format the response with sections for Assessment, Abnormalities, Possible Diagnosis, and Recommendations."
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageUrl.startsWith("data:image") ? 
                      imageUrl.split(",")[1] : 
                      await fetch(imageUrl)
                        .then(res => res.arrayBuffer())
                        .then(buffer => btoa(String.fromCharCode(...new Uint8Array(buffer))))
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
    
    if (!aiResult.candidates || aiResult.candidates.length === 0) {
      return new Response(
        JSON.stringify({ error: "AI analysis failed", details: aiResult.error }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Extract AI analysis result
    const analysisText = aiResult.candidates[0].content.parts[0].text;
    
    // Parse analysis sections
    const sections = {
      assessment: extractSection(analysisText, "Assessment"),
      abnormalities: extractSection(analysisText, "Abnormalities"),
      diagnosis: extractSection(analysisText, "Possible Diagnosis"),
      recommendations: extractSection(analysisText, "Recommendations"),
    };
    
    // Calculate confidence score based on language used
    const confidenceScore = calculateConfidenceScore(analysisText);
    
    // Save AI result to database
    const { data: resultData, error: resultError } = await supabase
      .from("ai_results")
      .insert({
        mri_scan_id: scanId,
        patient_id: scanData.patient_id,
        diagnosis: sections.diagnosis || "No conclusive diagnosis",
        confidence_score: confidenceScore,
        areas_of_concern: sections.abnormalities || "None identified",
        recommendations: sections.recommendations || "None provided",
      })
      .select()
      .single();

    if (resultError) {
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
  const regex = new RegExp(`${sectionName}:(.*?)(?=\\n\\n|\\n[A-Z]|$)`, "s");
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

// Helper function to calculate confidence score based on language
function calculateConfidenceScore(text: string): number {
  const highConfidenceWords = ["clearly", "definitely", "certainly", "evident", "obvious"];
  const mediumConfidenceWords = ["likely", "probably", "suggests", "indicates", "appears"];
  const lowConfidenceWords = ["possibly", "might", "may", "uncertain", "unclear"];
  
  let score = 0.5; // Default medium confidence
  
  // Check for high confidence words
  if (highConfidenceWords.some(word => text.toLowerCase().includes(word))) {
    score += 0.3;
  }
  
  // Check for low confidence words
  if (lowConfidenceWords.some(word => text.toLowerCase().includes(word))) {
    score -= 0.2;
  }
  
  // Ensure score is between 0 and 1
  return Math.max(0, Math.min(1, score));
}
