import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadAsFile, copyToClipboard } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
import { useToast } from "./providers/ToastProvider";
import type { ResumeAnalysisResult } from "@shared/schema";

interface ExportActionsProps {
  result: ResumeAnalysisResult;
  onReset: () => void;
}

export function ExportActions({ result, onReset }: ExportActionsProps) {
  const { addToast } = useToast();

  const handleExportPDF = () => {
    // This would integrate with a PDF generation library
    addToast(
      "Export Coming Soon: PDF export functionality will be available in the next update",
      "info"
    );
  };

  const handleCopyAllSuggestions = async () => {
    const allSuggestions = [
      "HIGH-LEVEL RECOMMENDATIONS:",
      ...result.high_level_advice,
      "",
      "DETAILED SUGGESTIONS:",
      ...result.line_item_suggestions.flatMap((item) => item.suggested_bullets),
      "",
      "JOB FIT RECOMMENDATIONS:",
      ...result.fit_for_job.recommendations,
    ].join("\n");

    const success = await copyToClipboard(allSuggestions);
    if (success) {
      addToast("Copied!: All suggestions copied to clipboard", "success");
    } else {
      addToast("Copy Failed: Could not copy to clipboard", "error");
    }
  };

  const handleShareAnalysis = () => {
    // This would generate a shareable link
    addToast(
      "Share Coming Soon: Share functionality will be available in the next update",
      "info"
    );
  };

  const handleSaveAnalysis = () => {
    const analysisData = JSON.stringify(result, null, 2);
    downloadAsFile(analysisData, "resume-analysis.json", "application/json");
    addToast(
      "Analysis Saved: Analysis data downloaded as JSON file",
      "success"
    );
  };

  const handleExportOptimizedResume = () => {
    const optimizedText = [
      `${result.parsed.name || ""}`,
      `${result.parsed.title || ""}`,
      "",
      "CONTACT:",
      `Email: ${result.parsed.contact.email || ""}`,
      `Phone: ${result.parsed.contact.phone || ""}`,
      `LinkedIn: ${result.parsed.contact.linkedin || ""}`,
      "",
      "SUMMARY:",
      result.parsed.summary || "",
      "",
      "SKILLS:",
      result.parsed.skills.join(", "),
      "",
      "EXPERIENCE:",
      ...result.parsed.experience.flatMap((exp) => [
        `${exp.title} at ${exp.company} (${exp.start} - ${exp.end})`,
        ...exp.bullets,
        "",
      ]),
      "EDUCATION:",
      ...result.parsed.education.map(
        (edu) => `${edu.degree} from ${edu.school} (${edu.year || ""})`
      ),
      "",
      "PROJECTS:",
      ...result.parsed.projects.map(
        (project) => `${project.name}: ${project.desc}`
      ),
      "",
      "CERTIFICATIONS:",
      ...result.parsed.certifications,
    ]
      .filter((line) => line !== undefined)
      .join("\n");

    downloadAsFile(optimizedText, "optimized-resume.txt", "text/plain");
    addToast(
      "Resume Exported: Optimized resume downloaded as text file",
      "success"
    );
  };

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground flex items-center">
          <i className="fas fa-download text-primary mr-3"></i>Export & Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-auto bg-primary/10 border-primary/20 hover:bg-primary/20 group"
            onClick={handleExportPDF}
            data-testid="button-export-pdf"
          >
            <i className="fas fa-file-pdf text-primary text-2xl mb-3 group-hover:scale-110 transition-transform"></i>
            <h3 className="font-semibold text-foreground mb-1">Export PDF</h3>
            <p className="text-xs text-muted-foreground text-center">
              Download optimized resume
            </p>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-auto bg-accent/10 border-accent/20 hover:bg-accent/20 group"
            onClick={handleCopyAllSuggestions}
            data-testid="button-copy-suggestions"
          >
            <i className="fas fa-copy text-accent text-2xl mb-3 group-hover:scale-110 transition-transform"></i>
            <h3 className="font-semibold text-foreground mb-1">
              Copy All Suggestions
            </h3>
            <p className="text-xs text-muted-foreground text-center">
              Copy to clipboard
            </p>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-auto bg-secondary/10 border-secondary/20 hover:bg-secondary/20 group"
            onClick={handleShareAnalysis}
            data-testid="button-share"
          >
            <i className="fas fa-share-alt text-secondary-foreground text-2xl mb-3 group-hover:scale-110 transition-transform"></i>
            <h3 className="font-semibold text-foreground mb-1">
              Share Analysis
            </h3>
            <p className="text-xs text-muted-foreground text-center">
              Get shareable link
            </p>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-auto bg-muted/10 border-muted/20 hover:bg-muted/20 group"
            onClick={handleSaveAnalysis}
            data-testid="button-save"
          >
            <i className="fas fa-save text-muted-foreground text-2xl mb-3 group-hover:scale-110 transition-transform"></i>
            <h3 className="font-semibold text-foreground mb-1">
              Save Analysis
            </h3>
            <p className="text-xs text-muted-foreground text-center">
              Download as JSON
            </p>
          </Button>
        </div>

        {/* Additional Export Options */}
        <div className="space-y-4">
          <div className="border-t border-border pt-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Additional Export Options
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="justify-start"
                onClick={handleExportOptimizedResume}
                data-testid="button-export-text"
              >
                <i className="fas fa-file-alt mr-2"></i>
                Export as Text File
              </Button>

              <Button
                variant="outline"
                className="justify-start"
                onClick={() => {
                  const suggestions = result.high_level_advice.join("\n");
                  downloadAsFile(
                    suggestions,
                    "resume-suggestions.txt",
                    "text/plain"
                  );
                }}
                data-testid="button-export-suggestions"
              >
                <i className="fas fa-list mr-2"></i>
                Export Suggestions Only
              </Button>
            </div>
          </div>

          {/* Action Summary */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <i className="fas fa-check-circle text-primary"></i>
                <div>
                  <span className="font-medium text-foreground">
                    Analysis Complete
                  </span>
                  <p className="text-sm text-muted-foreground">
                    ATS Score: {result.score}/100 •{" "}
                    {result.high_level_advice.length} recommendations
                  </p>
                </div>
              </div>
              <Button onClick={onReset} data-testid="button-analyze-another">
                <i className="fas fa-redo mr-2"></i>Analyze Another Resume
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
