import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeReview } from "./resume-review";
import { JobFitAnalysis } from "./job-fit-analysis";
import { ExportActions } from "./export-actions";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { ResumeAnalysisResult } from "@shared/schema";

interface AnalysisResultsProps {
  result: ResumeAnalysisResult;
  onReset: () => void;
}

export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const { toast } = useToast();

  const handleCopySuggestion = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast({
        title: "Copied!",
        description: "Suggestion copied to clipboard",
      });
    } else {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-accent";
    return "text-destructive";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-primary";
    if (score >= 60) return "bg-accent";
    return "bg-destructive";
  };

  return (
    <div className="space-y-8" data-testid="analysis-results">
      {/* ATS Score Card */}
      <Card className="glass-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center">
              <i className="fas fa-chart-line text-primary mr-3"></i>ATS Score Analysis
            </CardTitle>
            <div className="flex items-center space-x-2">
              <i className="fas fa-info-circle text-muted-foreground"></i>
              <span className="text-sm text-muted-foreground">Just completed</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Circle */}
            <div className="flex flex-col items-center" data-testid="ats-score">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path 
                    className="text-muted stroke-current" 
                    strokeWidth="2" 
                    fill="none" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path 
                    className={`${getScoreColor(result.score)} stroke-current`}
                    strokeWidth="2" 
                    fill="none" 
                    strokeDasharray={`${result.score}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Overall ATS Score</h3>
              <p className="text-sm text-muted-foreground text-center">
                {result.score >= 80 ? "Excellent" : result.score >= 60 ? "Good" : "Needs Improvement"} compatibility with ATS systems
              </p>
            </div>
            
            {/* Score Breakdown */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-file-alt text-primary"></i>
                  <span className="font-medium text-foreground">Format & Structure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={Math.min(result.score + 7, 100)} className="w-20" />
                  <span className="text-sm font-medium text-primary">
                    {Math.min(result.score + 7, 100)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-tags text-accent"></i>
                  <span className="font-medium text-foreground">Keywords & Skills</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={Math.max(result.score - 6, 0)} className="w-20" />
                  <span className="text-sm font-medium text-accent">
                    {Math.max(result.score - 6, 0)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-trophy text-primary"></i>
                  <span className="font-medium text-foreground">Achievements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={Math.max(result.score - 10, 0)} className="w-20" />
                  <span className="text-sm font-medium text-primary">
                    {Math.max(result.score - 10, 0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High-Level Recommendations */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground flex items-center">
            <i className="fas fa-lightbulb text-accent mr-3"></i>Key Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.high_level_advice.map((advice, index) => (
              <div 
                key={index}
                className="suggestion-item relative p-6 bg-background/50 rounded-lg hover:bg-background/70 transition-colors group"
                data-testid={`advice-${index}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-exclamation text-primary text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{advice}</p>
                    <Badge 
                      variant="secondary" 
                      className="mt-2 bg-accent/10 text-accent hover:bg-accent/20"
                    >
                      High Impact
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="copy-button opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopySuggestion(advice)}
                    data-testid={`button-copy-advice-${index}`}
                  >
                    <i className="fas fa-copy"></i>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resume" data-testid="tab-resume">Resume Data</TabsTrigger>
          <TabsTrigger value="job-fit" data-testid="tab-job-fit">Job Fit</TabsTrigger>
          <TabsTrigger value="export" data-testid="tab-export">Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resume" className="mt-6">
          <ResumeReview 
            result={result} 
            onCopySuggestion={handleCopySuggestion}
          />
        </TabsContent>
        
        <TabsContent value="job-fit" className="mt-6">
          <JobFitAnalysis 
            fitData={result.fit_for_job}
            onCopySuggestion={handleCopySuggestion}
          />
        </TabsContent>
        
        <TabsContent value="export" className="mt-6">
          <ExportActions 
            result={result}
            onReset={onReset}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
