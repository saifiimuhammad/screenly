import { useToast } from "@/components/providers/ToastProvider";
import { Button } from "@progress/kendo-react-buttons";
import { SvgIcon } from "@progress/kendo-react-common";
import { TextArea } from "@progress/kendo-react-inputs";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import {
  clipboardIcon,
  cloudIcon,
  fileAddIcon,
  sparklesIcon,
} from "@progress/kendo-svg-icons";
import { useCallback, useState } from "react";

interface UploadSectionProps {
  onAnalyze: (data: {
    resumeText?: string;
    resumeFile?: File;
    jobDescription?: string;
  }) => void;
  isLoading: boolean;
  progress: number;
}

export default function UploadSection({
  onAnalyze,
  isLoading,
  progress,
}: Readonly<UploadSectionProps>) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { addToast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      addToast(
        "Invalid File Type: Please upload a PDF, DOCX, or TXT file",
        "error"
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast("File Too Large: File size must be less than 10MB", "error");
      return;
    }

    setSelectedFile(file);
    setResumeText("");
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setResumeText(text);
      setSelectedFile(null); // Clear file when pasting text
      addToast(
        "Text Pasted: Resume text has been pasted from clipboard",
        "success"
      );
    } catch (error) {
      addToast(
        "Paste Failed: Could not access clipboard. Please paste manually.",
        "error"
      );
      console.error(error);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile && !resumeText.trim()) {
      addToast(
        "No Resume Provided: Please upload a file or enter resume text",
        "error"
      );
      return;
    }

    onAnalyze({
      resumeFile: selectedFile || undefined,
      resumeText: resumeText.trim() || undefined,
      jobDescription: jobDescription.trim() || undefined,
    });
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="glass-card rounded-2xl p-8 px-4 sm:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Upload Your Resume
          </h2>
          <p className="text-muted-foreground text-lg">
            Get instant AI-powered analysis and improvement suggestions
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`upload-area rounded-xl p-12 px-2 sm:px-12 text-center cursor-pointer transition-all duration-300 ${
            isDragOver ? "drag-over" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-testid="upload-area"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              {/* <i className="fas fa-cloud-upload-alt text-2xl text-primary"></i> */}
              <SvgIcon
                icon={cloudIcon}
                size="xxlarge"
                className="text-primary"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {selectedFile
                  ? selectedFile.name
                  : "Drag & drop your resume here"}
              </h3>
              <p className="text-muted-foreground">
                Supports PDF, DOCX files up to 10MB
              </p>
            </div>
            <div>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileInputChange}
                className="absolute z-50 w-[150px] ml-1 opacity-0"
                id="file-upload"
                data-testid="input-file"
              />
              <label htmlFor="file-upload">
                <Button
                  size={"medium"}
                  themeColor={"light"}
                  fillMode={"solid"}
                  rounded={"large"}
                  svgIcon={fileAddIcon}
                  style={{
                    padding: "0.25rem .5rem",
                    gap: "0.5rem",
                  }}
                  data-testid="button-choose-file"
                >
                  Choose File
                </Button>
              </label>
            </div>
          </div>

          {/* Progress Bar */}
          {isLoading && (
            <div className="mt-6" data-testid="upload-progress">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Analyzing resume...
                </span>
                <span className="text-sm text-primary font-medium">
                  Processing
                </span>
              </div>
              {/* <Progress value={undefined} className="w-full" /> */}
              {progress > 0 && progress < 100 && (
                <ProgressBar
                  value={progress}
                  animation={{ duration: 1000 }}
                  style={{ height: "10px", color: "#ebebeb" }}
                  progressStyle={{ backgroundColor: "var(--primary)" }}
                />
              )}
            </div>
          )}
        </div>

        {/* Alternative Text Input */}
        <div className="mt-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-muted-foreground text-sm">
              or paste text directly
            </span>
            <div className="h-px bg-border flex-1"></div>
          </div>

          <TextArea
            placeholder="Type the text here..."
            rows={6}
            style={{
              borderRadius: "12px",
              backgroundColor: "#020817",
              outline: isFocused
                ? "2px solid var(--primary)"
                : "1px solid #4B5563",
              color: "var(--foreground)",
            }}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value as string)}
            disabled={!!selectedFile}
            data-testid="textarea-resume"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          <div className="flex items-center flex-col gap-y-2 w-full sm:flex-row justify-between mt-4">
            <Button
              onClick={handlePasteFromClipboard}
              size={"large"}
              themeColor={"light"}
              fillMode={"outline"}
              rounded={"large"}
              svgIcon={clipboardIcon}
              style={{
                padding: "0.5rem 1rem",
                gap: "0.5rem",
              }}
            >
              Paste from Clipboard
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || (!selectedFile && !resumeText.trim())}
              size={"large"}
              rounded={"large"}
              svgIcon={isLoading ? undefined : sparklesIcon}
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                padding: "0.5rem 1rem",
                fontWeight: "medium",
                gap: "0.5rem",
              }}
              data-testid="button-analyze"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Analyzing...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Job Description Section */}
      <div className="glass-card rounded-2xl p-8 px-4 sm:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          <i className="fas fa-briefcase text-primary mr-3"></i>Job Description
          (Optional)
        </h2>
        <p className="text-muted-foreground mb-6">
          Add a job description to get role-specific fit analysis and
          recommendations
        </p>

        <TextArea
          placeholder="Paste the job description here for role-fit analysis..."
          rows={8}
          style={{
            borderRadius: "12px",
            backgroundColor: "#020817",
            outline: isFocused
              ? "2px solid var(--primary)"
              : "1px solid #4B5563",
            color: "var(--foreground)",
          }}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value as string)}
          data-testid="textarea-job-description"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <i className="fas fa-lightbulb text-accent"></i>
            <span>
              This helps provide targeted suggestions for the specific role
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
