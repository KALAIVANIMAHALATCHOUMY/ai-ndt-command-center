import { supabase } from "@/integrations/supabase/client";

export interface DefectResult {
  label: string;
  confidence: number;
  severity: "Low" | "Medium" | "High";
  depth: string;
  x: number;
  y: number;
}

export interface DefectProbability {
  label: string;
  value: number;
}

export interface AnalysisResult {
  overallRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  overallConfidence: number;
  defects: DefectResult[];
  defectProbabilities: DefectProbability[];
  crackDepths: number[];
  summary: string;
}

export async function analyzeDefectImage(
  imageBase64: string,
  modality: string,
  material: string
): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke("analyze-defect", {
    body: { imageBase64, modality, material },
  });

  if (error) {
    throw new Error(error.message || "Failed to analyze image");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as AnalysisResult;
}
