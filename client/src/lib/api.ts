import type { ResumeAnalysisResult } from "@shared/schema";

export interface AnalyzeResponse {
  success: boolean;
  data: ResumeAnalysisResult;
  metadata: {
    fileName?: string;
    analyzedAt: string;
  };
}

export async function analyzeResume(data: {
  resumeText?: string;
  resumeFile?: File;
  jobDescription?: string;
}): Promise<AnalyzeResponse> {
  const formData = new FormData();

  if (data.resumeFile) {
    formData.append("resume", data.resumeFile);
  }

  if (data.resumeText) {
    formData.append("resumeText", data.resumeText);
  }

  if (data.jobDescription) {
    formData.append("jobDescription", data.jobDescription);
  }

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to analyze resume");
  }

  return await response.json();
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

export function downloadAsFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
