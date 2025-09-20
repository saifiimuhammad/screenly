import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { analyzeResumeWithGemini } from "./lib/gemini";
import { parseDocument, validateResumeText } from "./lib/parser";
import { analyzeRequestSchema, resumeAnalysisSchema } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, DOCX, and TXT files are allowed."
        )
      );
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Analyze resume endpoint - handles both file upload and text input
  app.post("/api/analyze", upload.single("resume"), async (req, res) => {
    try {
      let resumeText: string;
      let fileName: string | undefined;

      // Handle file upload
      if (req.file) {
        const parsedDoc = await parseDocument(req.file.path, req.file.mimetype);
        resumeText = parsedDoc.text;
        fileName = req.file.originalname;

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
      }
      // Handle text input
      else if (req.body.resumeText) {
        resumeText = req.body.resumeText;
      } else {
        return res.status(400).json({
          message:
            "No resume provided. Please upload a file or provide text input.",
        });
      }

      // Validate resume text
      const validation = validateResumeText(resumeText);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }

      // Validate request body
      const requestData = analyzeRequestSchema.parse({
        resumeText,
        jobDescription: req.body.jobDescription,
      });

      // Analyze with Gemini
      const analysisResult = await analyzeResumeWithGemini(
        requestData.resumeText,
        requestData.jobDescription
      );

      // Validate response schema
      const validatedResult = resumeAnalysisSchema.parse(analysisResult);

      // Store analysis (optional - comment out if not needed)
      // const savedAnalysis = await storage.createResumeAnalysis({
      //   userId: null, // No user system in this demo
      //   originalText: resumeText,
      //   fileName,
      //   analysisData: validatedResult,
      // });

      res.json({
        success: true,
        data: validatedResult,
        metadata: {
          fileName,
          analyzedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Resume analysis error:", error);

      if (error instanceof Error) {
        // Handle specific error types
        if (error.message.includes("Invalid file type")) {
          return res.status(400).json({ message: error.message });
        }
        if (error.message.includes("File too large")) {
          return res
            .status(400)
            .json({ message: "File size exceeds 10MB limit" });
        }
        if (error.message.includes("Failed to analyze resume")) {
          return res
            .status(500)
            .json({ message: "AI analysis failed. Please try again." });
        }
      }

      res.status(500).json({
        message:
          "An error occurred while analyzing your resume. Please try again.",
      });
    }
  });

  // Get analysis by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const analysis = await storage.getResumeAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json({ success: true, data: analysis });
    } catch (error) {
      console.error("Get analysis error:", error);
      res.status(500).json({ message: "Failed to retrieve analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
