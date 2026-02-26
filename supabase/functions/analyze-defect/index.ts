import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, modality, material } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert NDT (Non-Destructive Testing) defect detection AI, trained on datasets like NEU Surface Defect Database using EfficientNetB0 architecture.

Analyze the provided NDT image and return a structured defect analysis. The inspection uses ${modality || "ultrasonic"} modality on ${material || "stainless steel"} material.

The defect categories you should classify are: Crazing, Inclusion, Patches, Pitted Surface, Rolled-in Scale, Scratches, and Porosity. These are based on the NEU Surface Defect Database classes.

For defectProbabilities, always return probabilities for ALL 7 categories even if some are 0.

You MUST respond by calling the report_defects function with your analysis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this NDT image for surface defects. Identify all defects with confidence scores, severity levels, estimated depth, and position coordinates (as percentages).`,
              },
              {
                type: "image_url",
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_defects",
              description: "Report the detected defects from the NDT image analysis",
              parameters: {
                type: "object",
                properties: {
                  overallRisk: {
                    type: "string",
                    enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
                    description: "Overall risk level based on detected defects",
                  },
                  overallConfidence: {
                    type: "number",
                    description: "Overall confidence score 0-100",
                  },
                  defects: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string", description: "Defect type name" },
                        confidence: { type: "number", description: "Confidence 0-100" },
                        severity: { type: "string", enum: ["Low", "Medium", "High"] },
                        depth: { type: "string", description: "Estimated depth e.g. 2.3mm" },
                        x: { type: "number", description: "X position as percentage 0-100" },
                        y: { type: "number", description: "Y position as percentage 0-100" },
                      },
                      required: ["label", "confidence", "severity", "depth", "x", "y"],
                      additionalProperties: false,
                    },
                  },
                  defectProbabilities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string" },
                        value: { type: "number", description: "Probability 0-100" },
                      },
                      required: ["label", "value"],
                      additionalProperties: false,
                    },
                    description: "Probability distribution across defect types (Crazing, Inclusion, Patches, Pitted Surface, Rolled-in Scale, Scratches, Porosity)",
                  },
                  crackDepths: {
                    type: "array",
                    items: { type: "number" },
                    description: "Array of crack depth measurements in mm",
                  },
                  summary: {
                    type: "string",
                    description: "Brief text summary of findings",
                  },
                },
                required: ["overallRisk", "overallConfidence", "defects", "defectProbabilities", "crackDepths", "summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_defects" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-defect error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
