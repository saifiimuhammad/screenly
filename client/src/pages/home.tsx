import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { analyzeResume } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { UploadSection } from "@/components/upload-section";
import { AnalysisResults } from "@/components/analysis-results";
import type { ResumeAnalysisResult } from "@shared/schema";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: analyzeResume,
    onSuccess: (response) => {
      setAnalysisResult(response.data);
      toast({
        title: "Analysis Complete!",
        description: "Your resume has been successfully analyzed",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = (data: {
    resumeText?: string;
    resumeFile?: File;
    jobDescription?: string;
  }) => {
    analyzeMutation.mutate(data);
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <i className="fas fa-brain text-primary-foreground text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Resume Analyzer</h1>
                <p className="text-sm text-muted-foreground">Professional Resume Analysis & Optimization</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-help"
              >
                <i className="fas fa-question-circle mr-2"></i>Help
              </button>
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                data-testid="button-upgrade"
              >
                <i className="fas fa-crown mr-2"></i>Upgrade
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {!analysisResult ? (
          <UploadSection 
            onAnalyze={handleAnalyze} 
            isLoading={analyzeMutation.isPending}
          />
        ) : (
          <AnalysisResults 
            result={analysisResult} 
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
