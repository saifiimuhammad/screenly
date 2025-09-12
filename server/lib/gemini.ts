import { GoogleGenAI } from "@google/genai";
import { type ResumeAnalysisResult } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeResumeWithGemini(
  resumeText: string,
  jobDescription?: string
): Promise<ResumeAnalysisResult> {
  try {
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) and resume analysis AI. 
Analyze the provided resume text and return a structured JSON response with the exact schema specified.

IMPORTANT PARSING RULES:
- Extract information conservatively - only include data that is clearly present
- Return null for missing fields, empty arrays for missing lists
- Be precise with dates, companies, and titles
- Focus on quantifiable achievements and metrics
- Provide actionable, specific suggestions (max 18 words each)

SCORING CRITERIA (0-100):
- Format & Structure (25%): Clear sections, proper formatting, length
- Keywords & Skills (30%): Industry-relevant terms, technical skills
- Achievements (25%): Quantified results, impact metrics
- ATS Compatibility (20%): Keyword density, formatting compatibility

${jobDescription ? `\nJOB DESCRIPTION FOR FIT ANALYSIS:\n${jobDescription}` : ''}

Respond with valid JSON matching this exact schema:
{
  "parsed": {
    "name": string|null,
    "title": string|null,
    "contact": { "email": string|null, "phone": string|null, "linkedin": string|null },
    "summary": string|null,
    "skills": string[],
    "experience": [{ "company": string, "title": string, "start": string|null, "end": string|null, "bullets": string[] }],
    "education": [{ "school": string, "degree": string, "year": string|null }],
    "projects": [{ "name": string, "desc": string }],
    "certifications": string[]
  },
  "score": number,
  "high_level_advice": string[],
  "line_item_suggestions": [{ "location": { "section": string, "index": number }, "suggested_bullets": string[] }],
  "fit_for_job": { "jd_title": string|null, "match_score": number, "gaps": string[], "recommendations": string[] }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            parsed: {
              type: "object",
              properties: {
                name: { type: ["string", "null"] },
                title: { type: ["string", "null"] },
                contact: {
                  type: "object",
                  properties: {
                    email: { type: ["string", "null"] },
                    phone: { type: ["string", "null"] },
                    linkedin: { type: ["string", "null"] }
                  },
                  required: ["email", "phone", "linkedin"]
                },
                summary: { type: ["string", "null"] },
                skills: { type: "array", items: { type: "string" } },
                experience: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      company: { type: "string" },
                      title: { type: "string" },
                      start: { type: ["string", "null"] },
                      end: { type: ["string", "null"] },
                      bullets: { type: "array", items: { type: "string" } }
                    },
                    required: ["company", "title", "start", "end", "bullets"]
                  }
                },
                education: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      school: { type: "string" },
                      degree: { type: "string" },
                      year: { type: ["string", "null"] }
                    },
                    required: ["school", "degree", "year"]
                  }
                },
                projects: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      desc: { type: "string" }
                    },
                    required: ["name", "desc"]
                  }
                },
                certifications: { type: "array", items: { type: "string" } }
              },
              required: ["name", "title", "contact", "summary", "skills", "experience", "education", "projects", "certifications"]
            },
            score: { type: "number", minimum: 0, maximum: 100 },
            high_level_advice: { type: "array", items: { type: "string" } },
            line_item_suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  location: {
                    type: "object",
                    properties: {
                      section: { type: "string" },
                      index: { type: "number" }
                    },
                    required: ["section", "index"]
                  },
                  suggested_bullets: { type: "array", items: { type: "string" } }
                },
                required: ["location", "suggested_bullets"]
              }
            },
            fit_for_job: {
              type: "object",
              properties: {
                jd_title: { type: ["string", "null"] },
                match_score: { type: "number", minimum: 0, maximum: 100 },
                gaps: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } }
              },
              required: ["jd_title", "match_score", "gaps", "recommendations"]
            }
          },
          required: ["parsed", "score", "high_level_advice", "line_item_suggestions", "fit_for_job"]
        },
      },
      contents: resumeText,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini model");
    }

    const data: ResumeAnalysisResult = JSON.parse(rawJson);
    return data;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
