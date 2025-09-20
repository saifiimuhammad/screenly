import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { SvgIcon } from "@progress/kendo-react-common";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import {
  blurIcon,
  trackChangesIcon,
  warningTriangleIcon,
} from "@progress/kendo-svg-icons";
import type { ResumeAnalysisResult } from "@shared/schema";

interface JobFitAnalysisProps {
  fitData: ResumeAnalysisResult["fit_for_job"];
  onCopySuggestion: (text: string) => void;
}

export default function JobFitAnalysis({
  fitData,
  onCopySuggestion,
}: Readonly<JobFitAnalysisProps>) {
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
    <Card
      style={{
        background: "transparent",
        color: "var(--foreground)",
        border: "none",
        boxShadow: "none",
      }}
    >
      <CardHeader>
        <CardTitle
          style={{
            color: "var(--foreground)",
            fontSize: "1.5rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <SvgIcon
            icon={trackChangesIcon}
            className="text-accent mr-3"
            size="xlarge"
          />
          Job Fit Analysis
        </CardTitle>
      </CardHeader>
      <CardBody style={{ background: "transparent" }}>
        {fitData.jd_title ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-2">
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

              <div className="w-full rounded-full h-3 mb-6">
                <ProgressBar
                  value={fitData.match_score}
                  animation={{ duration: 1000 }}
                  style={{
                    height: "10px",
                    color: "#ebebeb",
                  }}
                  progressStyle={{
                    backgroundColor:
                      fitData.match_score >= 80
                        ? "hsl(158, 64%, 52%)" // primary color
                        : fitData.match_score >= 60
                        ? "hsl(38, 92%, 50%)" // accent color
                        : "hsl(0, 62%, 30%)", // destructive color
                  }}
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
                    <SvgIcon
                      icon={warningTriangleIcon}
                      className="text-destructive mt-1"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {gap}
                      </p>
                    </div>
                    <Button
                      themeColor="light"
                      fillMode="clear"
                      size="small"
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
                    <SvgIcon
                      icon={blurIcon}
                      className="text-accent mt-1"
                      size="large"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {recommendation}
                      </p>
                    </div>
                    <Button
                      themeColor="light"
                      fillMode="clear"
                      size="small"
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
      </CardBody>
    </Card>
  );
}
