import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { analyzeResume } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import { UploadSection } from "@/components/upload-section";
import { AnalysisResults } from "@/components/analysis-results";
import type { ResumeAnalysisResult } from "@shared/schema";
import { Button } from "@progress/kendo-react-buttons";
import { questionCircleIcon } from "@progress/kendo-svg-icons";
import { Typography } from "@progress/kendo-react-common";
import {
  ProgressBar,
  ChunkProgressBar,
} from "@progress/kendo-react-progressbars";

export default function Home() {
  const [analysisResult, setAnalysisResult] =
    useState<ResumeAnalysisResult | null>(null);

  console.log(analysisResult);
  const [progress, setProgress] = useState<number>(0);

  const { addToast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: analyzeResume,
    onSuccess: (response) => {
      // simulate multiple steps of progress
      setProgress(40);
      setTimeout(() => setProgress(60), 300);
      setTimeout(() => setProgress(80), 600);
      setTimeout(() => {
        setAnalysisResult(response.data);
        setProgress(100);
      }, 1000);

      addToast(
        "Analysis Complete!: Your resume has been successfully analyzed",
        "success"
      );
    },
    onError: (error) => {
      setProgress(0);
      addToast(`Analysis Failed: ${error.message}`, "error");
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-[999] backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <i className="fas fa-brain text-primary-foreground text-lg"></i>
              </div>
              <div>
                {/* <h1 className="text-xl font-bold text-foreground">
                  AI Resume Analyzer
                </h1> */}
                <Typography.h4
                  style={{ lineHeight: "0.2", marginTop: ".85rem" }}
                >
                  AI Resume Analyzer
                </Typography.h4>
                <p className="text-sm text-muted-foreground">
                  Professional Resume Analysis & Optimization
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                size={"large"}
                themeColor={"light"}
                fillMode={"clear"}
                svgIcon={questionCircleIcon}
                style={{
                  padding: "0.5rem 1rem",
                  gap: "0.5rem",
                }}
              >
                Help
              </Button>
              <Button
                size={"large"}
                rounded={"large"}
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  padding: "0.5rem 1rem",
                }}
                disabled={true}
              >
                <i className="fas fa-crown mr-2"></i> Upgrade
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress section */}

      {progress > 0 && progress < 100 && (
        <ProgressBar
          value={progress}
          animation={{ duration: 1000 }}
          style={{ height: "10px", color: "#ebebeb" }}
          progressStyle={{ backgroundColor: "var(--primary)" }}
        />
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {!analysisResult ? (
          <UploadSection
            onAnalyze={handleAnalyze}
            isLoading={analyzeMutation.isPending}
          />
        ) : (
          <AnalysisResults result={analysisResult} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}

// {
//             parsed: {
//               name: "NAZIA KABIR",
//               title: "Principal",
//               contact: {
//                 email: null,
//                 phone: "+92 317 3884767",
//                 linkedin: null,
//               },
//               summary:
//                 "I am an experienced education professional currently serving as the Principal at Saifee College. With a strong commitment to fostering educational success, I have successfully led teams to develop new curricula and coordinated impactful school events. My background includes collaborative leadership roles, where I prioritized a positive learning environment and effective communication with staff, students, and parents.",
//               skills: [
//                 "Leadership",
//                 "Relationship Management",
//                 "Curriculum Development",
//                 "Event Coordination",
//                 "Goal-Oriented Approach",
//                 "Parent-Teacher Communication",
//               ],
//               experience: [
//                 {
//                   company: "Saifee College",
//                   title: "Principal",
//                   start: "01/2013",
//                   end: "Present",
//                   bullets: [
//                     "Leading the college, providing guidance to the teachers and staff",
//                     "Ensuring a safe and positive learning environment for the students",
//                   ],
//                 },
//                 {
//                   company: "American Communication Council School System",
//                   title: "Coordinator & Senior English Teacher",
//                   start: "01/2007",
//                   end: "01/2013",
//                   bullets: [
//                     "Supporting the principal in leading the school and collaborating with teachers and staff to ensure the academic success of the students",
//                     "Developing and delivering lesson plans, grading and providing feedback on student assignments",
//                     "Creating a positive and engaging learning environment for your students",
//                   ],
//                 },
//                 {
//                   company: "Hyderabad Grammar High School",
//                   title: "English & Science Teacher",
//                   start: "01/2002",
//                   end: "01/2007",
//                   bullets: [
//                     "Developing and delivering lesson plans for both subjects, grading and creating a positive and engaging learning environment for your students",
//                   ],
//                 },
//                 {
//                   company: "Eden Grammar School",
//                   title: "Sindhi Teacher",
//                   start: "01/1998",
//                   end: "01/2002",
//                   bullets: [
//                     "Providing guidance and support to students, and collaborating with teachers and parents to ensure the academic success and emotional well-being of the students",
//                   ],
//                 },
//               ],
//               education: [
//                 {
//                   school: "University Of Sindh, Jamshoro",
//                   degree: "Bachelor Of Arts",
//                   year: null,
//                 },
//                 {
//                   school: "Zubaida Government Degree Girls College",
//                   degree: "Intermediate",
//                   year: null,
//                 },
//               ],
//               projects: [],
//               certifications: [],
//             },
//             score: 68,
//             high_level_advice: [
//               "Quantify your experience with specific numbers, like staff managed, students served, or budget sizes.",
//               "Add specific graduation years to your education section to provide a clear timeline.",
//               "Replace vague bullet points with action-verb-led statements that highlight concrete results and achievements.",
//             ],
//             line_item_suggestions: [
//               {
//                 location: {
//                   section: "experience",
//                   index: 0,
//                 },
//                 suggested_bullets: [
//                   "Led a faculty of 50+ educators, driving professional development and curriculum adherence.",
//                   "Increased parent engagement by 30% by implementing a new communication protocol and regular conferences.",
//                 ],
//               },
//               {
//                 location: {
//                   section: "experience",
//                   index: 1,
//                 },
//                 suggested_bullets: [
//                   "Coordinated academic planning for 12 departments, aligning curriculum with national standards.",
//                   "Improved student English proficiency scores by 15% through innovative lesson plans and targeted feedback.",
//                 ],
//               },
//             ],
//             fit_for_job: {
//               jd_title: null,
//               match_score: 0,
//               gaps: ["No Job Description provided to compare against."],
//               recommendations: [
//                 "Provide a Job Description for a detailed analysis of resume fit, skill gaps, and recommendations.",
//               ],
//             },
//           }
