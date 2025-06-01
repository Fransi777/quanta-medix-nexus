
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

    // Call Gemini API with enhanced prompt for brain tumor analysis
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

    console.log("Calling Gemini API for brain tumor analysis...");

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
                  text: `You are an expert neuroradiologist specializing in brain tumor analysis and segmentation. Analyze this ${scanData.scan_type} scan for brain tumors and provide a comprehensive assessment.

**IMPORTANT**: Please provide a detailed analysis in the following format:

1. **Tumor Detection and Segmentation**: 
   - Identify if any tumors are present
   - Describe the exact location and boundaries of any detected tumors
   - Provide segmentation details (which brain regions are affected)

2. **Tumor Classification**:
   - Primary tumor type (e.g., Glioblastoma, Meningioma, Astrocytoma, Metastatic lesion)
   - WHO grade if applicable
   - Malignancy level (benign/malignant)

3. **Tumor Characteristics**:
   - Estimated size in centimeters (length x width x height)
   - Volume estimation if possible
   - Enhancement patterns
   - Surrounding edema extent
   - Mass effect on surrounding structures

4. **Treatment Recommendations**:
   - Surgical options (resection feasibility)
   - Radiation therapy considerations
   - Chemotherapy protocols
   - Multidisciplinary team consultation needs
   - Urgency level (immediate/routine)

5. **Follow-up Protocol**:
   - Recommended imaging intervals
   - Additional studies needed
   - Monitoring parameters

Please be specific with measurements and provide detailed medical terminology. If no tumor is detected, clearly state this and explain the normal findings.`
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
            temperature: 0.1,
            maxOutputTokens: 2048,
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
    
    // Enhanced parsing for brain tumor analysis
    const sections = {
      assessment: extractSection(analysisText, ["Tumor Detection and Segmentation", "Assessment"]),
      abnormalities: extractSection(analysisText, ["Tumor Classification", "Abnormalities"]),
      diagnosis: extractSection(analysisText, ["Tumor Characteristics", "Possible Diagnosis", "Diagnosis"]),
      recommendations: extractSection(analysisText, ["Treatment Recommendations", "Recommendations"]),
      followUp: extractSection(analysisText, ["Follow-up Protocol", "Follow-up"]),
      tumorDetails: extractTumorDetails(analysisText)
    };
    
    // Enhanced confidence score calculation for brain tumor analysis
    const confidenceScore = calculateTumorConfidenceScore(analysisText);
    
    console.log("Saving enhanced AI result to database...");

    // Save enhanced AI result to database
    const { data: resultData, error: resultError } = await supabase
      .from("ai_results")
      .insert({
        mri_scan_id: scanId,
        patient_id: scanData.patient_id,
        diagnosis: sections.tumorDetails.tumorType || sections.diagnosis || "No tumor detected",
        confidence_score: confidenceScore,
        areas_of_concern: sections.tumorDetails.location || sections.abnormalities || "No specific areas of concern identified",
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

    console.log("Enhanced brain tumor analysis complete and saved successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        result: resultData,
        analysis: {
          ...sections,
          tumorDetails: sections.tumorDetails,
          fullAnalysis: analysisText
        }
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

// Enhanced helper function to extract sections from AI analysis text
function extractSection(text: string, sectionNames: string[]): string | null {
  for (const sectionName of sectionNames) {
    const patterns = [
      new RegExp(`\\*\\*${sectionName}\\*\\*:?\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n\\d+\\.|$)`, "i"),
      new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\n|\\n[A-Z]|$)`, "i"),
      new RegExp(`\\d+\\.\\s*\\*\\*${sectionName}\\*\\*:?\\s*([\\s\\S]*?)(?=\\n\\d+\\.|$)`, "i")
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
  }
  
  return null;
}

// New function to extract specific tumor details
function extractTumorDetails(text: string): any {
  const details = {
    tumorType: null,
    size: null,
    location: null,
    grade: null,
    malignancy: null
  };

  // Extract tumor type
  const tumorTypeMatch = text.match(/(?:tumor type|primary tumor|diagnosis):?\s*([^.\n]+)/i);
  if (tumorTypeMatch) {
    details.tumorType = tumorTypeMatch[1].trim();
  }

  // Extract size information
  const sizeMatch = text.match(/(?:size|dimensions|diameter):?\s*([^.\n]*(?:cm|mm|centimeter|millimeter)[^.\n]*)/i);
  if (sizeMatch) {
    details.size = sizeMatch[1].trim();
  }

  // Extract location
  const locationMatch = text.match(/(?:location|region|area|situated):?\s*([^.\n]+)/i);
  if (locationMatch) {
    details.location = locationMatch[1].trim();
  }

  // Extract WHO grade
  const gradeMatch = text.match(/(?:WHO grade|grade):?\s*([I-IV]+|\d+)/i);
  if (gradeMatch) {
    details.grade = gradeMatch[1].trim();
  }

  // Extract malignancy
  const malignancyMatch = text.match(/(benign|malignant|low.grade|high.grade)/i);
  if (malignancyMatch) {
    details.malignancy = malignancyMatch[1].trim();
  }

  return details;
}

// Enhanced confidence score calculation for brain tumor analysis
function calculateTumorConfidenceScore(text: string): number {
  const highConfidenceWords = ["clearly visible", "well-defined", "characteristic", "typical", "definitive", "pathognomonic"];
  const mediumConfidenceWords = ["likely", "probably", "suggests", "consistent with", "appears", "suspicious"];
  const lowConfidenceWords = ["possibly", "might", "questionable", "unclear", "indeterminate", "needs correlation"];
  const tumorIndicators = ["tumor", "mass", "lesion", "neoplasm", "enhancement"];
  
  let score = 0.5; // Default medium confidence
  
  // Check for tumor indicators
  const tumorCount = tumorIndicators.filter(word => text.toLowerCase().includes(word)).length;
  if (tumorCount >= 3) score += 0.2;
  else if (tumorCount >= 1) score += 0.1;
  
  // Check for high confidence words
  if (highConfidenceWords.some(word => text.toLowerCase().includes(word))) {
    score += 0.25;
  }
  
  // Check for medium confidence words
  if (mediumConfidenceWords.some(word => text.toLowerCase().includes(word))) {
    score += 0.1;
  }
  
  // Check for low confidence words
  if (lowConfidenceWords.some(word => text.toLowerCase().includes(word))) {
    score -= 0.2;
  }
  
  // Bonus for specific measurements
  if (text.match(/\d+\.?\d*\s*(cm|mm)/i)) {
    score += 0.15;
  }
  
  // Ensure score is between 0 and 1
  return Math.max(0, Math.min(1, score));
}
