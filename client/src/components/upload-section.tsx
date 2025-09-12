import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface UploadSectionProps {
  onAnalyze: (data: {
    resumeText?: string;
    resumeFile?: File;
    jobDescription?: string;
  }) => void;
  isLoading: boolean;
}

export function UploadSection({ onAnalyze, isLoading }: UploadSectionProps) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

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
      "text/plain"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOCX, or TXT file",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    setResumeText(""); // Clear text input when file is selected
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
      toast({
        title: "Text Pasted",
        description: "Resume text has been pasted from clipboard",
      });
    } catch (error) {
      toast({
        title: "Paste Failed",
        description: "Could not access clipboard. Please paste manually.",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile && !resumeText.trim()) {
      toast({
        title: "No Resume Provided",
        description: "Please upload a file or enter resume text",
        variant: "destructive",
      });
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
      <div className="glass-card rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3">Upload Your Resume</h2>
          <p className="text-muted-foreground text-lg">Get instant AI-powered analysis and improvement suggestions</p>
        </div>
        
        {/* Upload Area */}
        <div 
          className={`upload-area rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragOver ? "drag-over" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-testid="upload-area"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <i className="fas fa-cloud-upload-alt text-2xl text-primary"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {selectedFile ? selectedFile.name : "Drag & drop your resume here"}
              </h3>
              <p className="text-muted-foreground">Supports PDF, DOCX files up to 10MB</p>
            </div>
            <div>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileInputChange}
                className="hidden"
                id="file-upload"
                data-testid="input-file"
              />
              <label htmlFor="file-upload">
                <Button
                  type="button"
                  className="cursor-pointer"
                  data-testid="button-choose-file"
                >
                  <i className="fas fa-folder-open mr-2"></i>Choose File
                </Button>
              </label>
            </div>
          </div>
          
          {/* Progress Bar */}
          {isLoading && (
            <div className="mt-6" data-testid="upload-progress">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Analyzing resume...</span>
                <span className="text-sm text-primary font-medium">Processing</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}
        </div>
        
        {/* Alternative Text Input */}
        <div className="mt-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-muted-foreground text-sm">or paste text directly</span>
            <div className="h-px bg-border flex-1"></div>
          </div>
          
          <Textarea 
            className="w-full h-32 resize-none"
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={!!selectedFile}
            data-testid="textarea-resume"
          />
          
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="secondary"
              onClick={handlePasteFromClipboard}
              disabled={!!selectedFile}
              data-testid="button-paste"
            >
              <i className="fas fa-paste mr-2"></i>Paste from Clipboard
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || (!selectedFile && !resumeText.trim())}
              size="lg"
              className="text-lg font-bold"
              data-testid="button-analyze"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-magic mr-2"></i>Analyze Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Job Description Section */}
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          <i className="fas fa-briefcase text-primary mr-3"></i>Job Description (Optional)
        </h2>
        <p className="text-muted-foreground mb-6">Add a job description to get role-specific fit analysis and recommendations</p>
        
        <Textarea 
          className="w-full h-40 resize-none"
          placeholder="Paste the job description here for role-fit analysis..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          data-testid="textarea-job-description"
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <i className="fas fa-lightbulb text-accent"></i>
            <span>This helps provide targeted suggestions for the specific role</span>
          </div>
        </div>
      </div>
    </div>
  );
}
