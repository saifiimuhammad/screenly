import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResumeAnalysisResult } from "@shared/schema";

interface JobFitAnalysisProps {
  fitData: ResumeAnalysisResult["fit_for_job"];
  onCopySuggestion: (text: string) => void;
}

export function JobFitAnalysis({
  fitData,
  onCopySuggestion,
}: JobFitAnalysisProps) {
  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-accent";
    return "text-destructive";
  };

  const getMatchText = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Needs Improvement";
  };

  return (
    <Card className="border-none bg-transparent shadow-none max-w-max mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground flex items-center">
          <i className="fas fa-target text-accent mr-3"></i>Job Fit Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fitData.jd_title ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Role Match Score
                </h3>
                <span
                  className={`text-2xl font-bold ${getMatchColor(
                    fitData.match_score
                  )}`}
                  data-testid="match-score"
                >
                  {fitData.match_score}%
                </span>
              </div>

              <div className="w-full bg-muted rounded-full h-3 mb-6">
                <div
                  className={`h-3 rounded-full ${
                    fitData.match_score >= 80
                      ? "bg-primary"
                      : fitData.match_score >= 60
                      ? "bg-accent"
                      : "bg-destructive"
                  }`}
                  style={{ width: `${fitData.match_score}%` }}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Target Role
                  </h4>
                  <p
                    className="text-muted-foreground"
                    data-testid="target-role"
                  >
                    {fitData.jd_title}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Match Strength
                  </h4>
                  <p className="text-muted-foreground">
                    {getMatchText(fitData.match_score)} -{" "}
                    {fitData.match_score >= 80
                      ? "Strong alignment with role requirements"
                      : fitData.match_score >= 60
                      ? "Good alignment with most requirements"
                      : "Several areas need improvement"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Skill Gaps & Recommendations
              </h3>

              <div className="space-y-3">
                {fitData.gaps.map((gap, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
                    data-testid={`gap-${index}`}
                  >
                    <i className="fas fa-exclamation-triangle text-destructive text-sm mt-1"></i>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {gap}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCopySuggestion(gap)}
                      data-testid={`button-copy-gap-${index}`}
                    >
                      <i className="fas fa-copy text-xs"></i>
                    </Button>
                  </div>
                ))}

                {fitData.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-accent/10 border border-accent/20 rounded-lg"
                    data-testid={`recommendation-${index}`}
                  >
                    <i className="fas fa-lightbulb text-accent text-sm mt-1"></i>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {recommendation}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCopySuggestion(recommendation)}
                      data-testid={`button-copy-recommendation-${index}`}
                    >
                      <i className="fas fa-copy text-xs"></i>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-briefcase text-2xl text-muted-foreground"></i>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Job Description Provided
            </h3>
            <p className="text-muted-foreground mb-6">
              Add a job description during analysis to get role-specific fit
              analysis and recommendations
            </p>
            <Badge variant="outline" className="text-muted-foreground">
              Feature Available in Analysis
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
