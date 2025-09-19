import { useState } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { Badge } from "@progress/kendo-react-indicators";
import type { ResumeAnalysisResult } from "@shared/schema";
import { alignBottomIcon, copyIcon } from "@progress/kendo-svg-icons";
import { ResumeReview } from "./resume-review";
import { JobFitAnalysis } from "./job-fit-analysis";
import { ExportActions } from "./export-actions";
import { copyToClipboard } from "@/lib/api";
import { useToast } from "./providers/ToastProvider";

interface AnalysisResultsProps {
  result: ResumeAnalysisResult;
  onReset: () => void;
}

export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const { addToast } = useToast();
  const [selected, setSelected] = useState(0);

  const handleCopySuggestion = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      addToast("Copied!: Suggestion copied to clipboard", "success");
    } else {
      addToast("Copy Failed: Could not copy to clipboard", "error");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-8">
      {/* ATS Score Card */}
      <div className="p-6 rounded-lg shadow glass-card">
        <h2 className="text-2xl font-bold flex items-center">
          <i className="fas fa-chart-line text-blue-600 mr-3"></i>
          ATS Score Analysis
        </h2>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Score Circle */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg
                className="w-32 h-32 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-gray-300 stroke-current"
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
                <span
                  className={`text-3xl font-bold ${getScoreColor(
                    result.score
                  )}`}
                >
                  {result.score}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-semibold">Overall ATS Score</h3>
          </div>

          {/* Score Breakdown using Kendo ProgressBar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between p-4 bg-card rounded-lg">
              <span>Format & Structure</span>
              <ProgressBar
                value={Math.min(result.score + 7, 100)}
                style={{ width: 100 }}
                progressStyle={{ backgroundColor: "var(--primary)" }}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-card rounded-lg">
              <span>Keywords & Skills</span>
              <ProgressBar
                value={Math.max(result.score - 6, 0)}
                style={{ width: 100 }}
                progressStyle={{ backgroundColor: "var(--primary)" }}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-card rounded-lg">
              <span>Achievements</span>
              <ProgressBar
                value={Math.max(result.score - 10, 0)}
                style={{ width: 100 }}
                progressStyle={{ backgroundColor: "var(--primary)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6 rounded-lg shadow glass-card">
        <h2 className="text-2xl font-bold flex items-center">
          <i className="fas fa-lightbulb text-yellow-500 mr-3"></i>
          Key Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {result.high_level_advice.map((advice, index) => (
            <div key={index} className="p-4 bg-card rounded-lg">
              <p className="font-medium">{advice}</p>
              <Badge themeColor="info" className="mt-2">
                High Impact
              </Badge>

              <Button
                size={"small"}
                themeColor={"light"}
                fillMode={"clear"}
                svgIcon={copyIcon}
                onClick={() => handleCopySuggestion(advice)}
                style={{ marginTop: "0.75rem" }}
              >
                Copy
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Section using Kendo TabStrip */}
      <TabStrip
        selected={selected}
        onSelect={(e) => setSelected(e.selected)}
        tabContentStyle={{
          backgroundColor: "rgba(30, 41, 59, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TabStripTab title="Resume Data">
          <ResumeReview
            result={result}
            onCopySuggestion={handleCopySuggestion}
          />
        </TabStripTab>
        <TabStripTab title="Job Fit">
          <JobFitAnalysis
            fitData={result.fit_for_job}
            onCopySuggestion={handleCopySuggestion}
          />
        </TabStripTab>
        <TabStripTab title="Export">
          <ExportActions result={result} onReset={onReset} />
        </TabStripTab>
      </TabStrip>
    </div>
  );
}
