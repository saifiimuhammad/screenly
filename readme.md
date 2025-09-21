# Overview

This is an AI-powered Resume Analyzer web application that allows users to upload resumes and receive detailed analysis with ATS scoring and job fit recommendations. The application uses a full-stack JavaScript architecture with React frontend and Express backend, powered by Google's Gemini AI for resume analysis.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and React hooks for local state
- **UI Components**: Kendoreact Free components, Shadcn & Tailwindcss for styling
- **Styling**: Tailwind CSS with a dark theme design system using CSS custom properties
- **Forms**: React Hook Form with Zod validation for type-safe form handling

The frontend follows a component-based architecture with clear separation between UI components, pages, and utility functions. The design system uses a modern dark theme with accent colors and glass-morphism effects.

## Backend Architecture

- **Framework**: Express.js with TypeScript running on Node.js
- **File Upload**: Multer middleware for handling multipart form data with file type validation
- **Document Parsing**: Supports PDF, DOCX, and plain text files using pdf-parse and mammoth libraries
- **API Structure**: RESTful endpoints with proper error handling and request logging
- **Storage**: In-memory storage implementation with interface-based design for future database integration

The backend uses a modular architecture with separate layers for routing, business logic, and data storage. The API design follows REST principles with proper HTTP status codes and JSON responses.

## Data Storage Solutions

- **Current Implementation**: In-memory storage using Map data structures for development
- **Database Schema**: Drizzle ORM with PostgreSQL schema definitions ready for production
- **Migration Support**: Drizzle migrations configured for schema versioning
- **Future-Ready**: Interface-based storage layer allows easy migration to PostgreSQL

The storage layer is designed with interfaces to allow seamless transition from in-memory storage to PostgreSQL when needed.

## Authentication and Authorization

- **Current State**: Basic user schema defined but authentication not yet implemented
- **Planned Architecture**: Session-based authentication with PostgreSQL user storage
- **Security**: Password hashing and session management ready for implementation

## External Dependencies

### AI Integration

- **Google Gemini AI**: Core resume analysis engine using the @google/genai SDK
- **Model**: Gemini-2.5-pro for advanced text analysis and structured JSON responses
- **API Management**: Server-side API calls to protect API keys from client exposure

### Document Processing

- **PDF Parsing**: pdf-parse library for extracting text from PDF files
- **DOCX Processing**: mammoth library for Microsoft Word document parsing
- **File Validation**: Multer with MIME type filtering for security

### UI Libraries

- **Component Library**: Kendoreact Free components & Shadcn
- **Icons**: Kendoreact icons & Font-awesome
- **Styling**: Tailwind CSS with clsx and tailwind-merge for conditional styling
- **Fonts**: Google Fonts integration (Inter, DM Sans, Fira Code, Geist Mono)

### Development Tools

- **Build Tool**: Vite with React plugin and TypeScript support
- **Type Safety**: Zod schemas for runtime validation and type inference
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Environment**: Replit-specific plugins for development environment integration

### Database and ORM (Not yet implemented)

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: @neondatabase/serverless for cloud PostgreSQL connectivity
- **Schema Management**: Type-safe schema definitions with Zod integration
