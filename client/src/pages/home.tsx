import Header from "@/components/Header";
import { useToast } from "@/components/providers/ToastProvider";
import Sidebar from "@/components/Sidebar";
import { analyzeResume } from "@/lib/api";
import type { ResumeAnalysisResult } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { lazy, useCallback, useState, startTransition } from "react";

const UploadSection = lazy(() => import("@/components/upload-section"));
const AnalysisResults = lazy(() => import("@/components/analysis-results"));

export default function Home() {
  const [analysisResult, setAnalysisResult] =
    useState<ResumeAnalysisResult | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  console.log(analysisResult);
  const [progress, setProgress] = useState<number>(0);

  const { addToast } = useToast();

  const simulateProgress = (finalValue: number, duration = 1000) => {
    const start = performance.now();
    const step = (timestamp: number) => {
      const progressValue = Math.min(
        100,
        ((timestamp - start) / duration) * finalValue
      );
      setProgress(progressValue);
      if (progressValue < finalValue) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const analyzeMutation = useMutation({
    mutationFn: analyzeResume,
    onSuccess: (response) => {
      // simulate multiple steps of progress
      simulateProgress(70);

      startTransition(() => {
        setAnalysisResult(response.data);
        setProgress(100);
      });

      addToast(
        "Analysis Complete!: Your resume has been successfully analyzed",
        "success"
      );
    },
    onError: (error) => {
      setProgress(0);
      addToast(
        `Analysis Failed: ${error?.message || "Unexpected error"}`,
        "error"
      );
    },
  });

  const handleAnalyze = (data: {
    resumeText?: string;
    resumeFile?: File;
    jobDescription?: string;
  }) => {
    setProgress(20);
    analyzeMutation.mutate(data);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setProgress(0);
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-8">
        {!analysisResult ? (
          <UploadSection
            onAnalyze={handleAnalyze}
            isLoading={analyzeMutation.isPending}
            progress={progress}
          />
        ) : (
          <AnalysisResults result={analysisResult} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
