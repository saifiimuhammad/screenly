import * as fs from "fs";
import * as path from "path";

export interface ParsedDocument {
  text: string;
  metadata?: {
    fileName: string;
    fileSize: number;
    mimeType: string;
  };
}

export async function parseDocument(filePath: string, mimeType: string): Promise<ParsedDocument> {
  try {
    if (mimeType === "application/pdf") {
      return await parsePDF(filePath);
    } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return await parseDOCX(filePath);
    } else if (mimeType === "text/plain") {
      return await parseText(filePath);
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }
  } catch (error) {
    throw new Error(`Failed to parse document: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

async function parsePDF(filePath: string): Promise<ParsedDocument> {
  // For now, return a basic implementation
  // In production, you'd use pdf-parse or similar library
  const stats = fs.statSync(filePath);
  return {
    text: "PDF parsing not fully implemented - please use text input",
    metadata: {
      fileName: path.basename(filePath),
      fileSize: stats.size,
      mimeType: "application/pdf"
    }
  };
}

async function parseDOCX(filePath: string): Promise<ParsedDocument> {
  // For now, return a basic implementation
  // In production, you'd use mammoth or similar library
  const stats = fs.statSync(filePath);
  return {
    text: "DOCX parsing not fully implemented - please use text input",
    metadata: {
      fileName: path.basename(filePath),
      fileSize: stats.size,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }
  };
}

async function parseText(filePath: string): Promise<ParsedDocument> {
  const text = fs.readFileSync(filePath, "utf-8");
  const stats = fs.statSync(filePath);
  return {
    text,
    metadata: {
      fileName: path.basename(filePath),
      fileSize: stats.size,
      mimeType: "text/plain"
    }
  };
}

export function validateResumeText(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: "Resume text cannot be empty" };
  }
  
  if (text.length < 100) {
    return { valid: false, error: "Resume text appears too short (minimum 100 characters)" };
  }
  
  if (text.length > 50000) {
    return { valid: false, error: "Resume text is too long (maximum 50,000 characters)" };
  }
  
  return { valid: true };
}
