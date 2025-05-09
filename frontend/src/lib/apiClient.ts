import { apiRequest } from "./queryClient";
import { AnalysisResult, AppAnalysis } from "@shared/schema";


export async function analyzeAppReviews(appName: string): Promise<AnalysisResult> {
  const response = await apiRequest("POST", "/api/reviews/analyze", { appName });
  return await response.json();
}

export async function getAnalysisHistory(): Promise<AppAnalysis[]> {
  const response = await apiRequest("GET", "/api/reviews/history");
  return await response.json();
}

export async function getAnalysisById(id: number): Promise<AnalysisResult> {
  const response = await apiRequest("GET", `/api/reviews/${id}`);
  return await response.json();
}

export async function clearAnalysisHistory(): Promise<void> {
  await apiRequest("DELETE", "/api/reviews/history");
}
