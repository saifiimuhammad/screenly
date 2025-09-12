import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ResumeAnalysisResult } from "@shared/schema";

interface ResumeReviewProps {
  result: ResumeAnalysisResult;
  onCopySuggestion: (text: string) => void;
}

export function ResumeReview({ result, onCopySuggestion }: ResumeReviewProps) {
  const [editMode, setEditMode] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState<{ [key: string]: boolean }>({});

  const toggleSuggestions = (key: string) => {
    setShowSuggestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getSuggestionsForSection = (section: string, index?: number) => {
    return result.line_item_suggestions.filter(
      suggestion => 
        suggestion.location.section === section && 
        (index === undefined || suggestion.location.index === index)
    );
  };

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center">
            <i className="fas fa-user text-primary mr-3"></i>Parsed Resume Data
          </CardTitle>
          <Button
            variant="secondary"
            onClick={() => setEditMode(!editMode)}
            data-testid="button-edit-mode"
          >
            <i className={`fas ${editMode ? 'fa-save' : 'fa-edit'} mr-2`}></i>
            {editMode ? 'Save' : 'Edit Mode'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Contact Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
              <Input 
                value={result.parsed.name || ""}
                readOnly={!editMode}
                className={editMode ? "" : "bg-muted"}
                data-testid="input-name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Professional Title</label>
              <Input 
                value={result.parsed.title || ""}
                readOnly={!editMode}
                className={editMode ? "" : "bg-muted"}
                data-testid="input-title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
              <Input 
                type="email"
                value={result.parsed.contact.email || ""}
                readOnly={!editMode}
                className={editMode ? "" : "bg-muted"}
                data-testid="input-email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Phone</label>
              <Input 
                value={result.parsed.contact.phone || ""}
                readOnly={!editMode}
                className={editMode ? "" : "bg-muted"}
                data-testid="input-phone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">LinkedIn</label>
              <Input 
                value={result.parsed.contact.linkedin || ""}
                readOnly={!editMode}
                className={editMode ? "" : "bg-muted"}
                data-testid="input-linkedin"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Skills & Summary
            </h3>
            
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Technical Skills</label>
              <div className="bg-input border border-border rounded-lg p-3 max-h-32 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {result.parsed.skills.map((skill, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="bg-primary/20 text-primary hover:bg-primary/30"
                      data-testid={`skill-${index}`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Professional Summary</label>
              <Textarea 
                value={result.parsed.summary || ""}
                readOnly={!editMode}
                className={`h-24 resize-none ${editMode ? "" : "bg-muted"}`}
                data-testid="textarea-summary"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Experience Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Work Experience
          </h3>
          
          {result.parsed.experience.map((exp, expIndex) => {
            const suggestions = getSuggestionsForSection("experience", expIndex);
            const suggestionKey = `experience-${expIndex}`;
            
            return (
              <div key={expIndex} className="bg-background/50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Company</label>
                    <Input 
                      value={exp.company}
                      readOnly={!editMode}
                      className={editMode ? "" : "bg-muted"}
                      data-testid={`input-company-${expIndex}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Position</label>
                    <Input 
                      value={exp.title}
                      readOnly={!editMode}
                      className={editMode ? "" : "bg-muted"}
                      data-testid={`input-position-${expIndex}`}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Start Date</label>
                    <Input 
                      value={exp.start || ""}
                      readOnly={!editMode}
                      className={editMode ? "" : "bg-muted"}
                      data-testid={`input-start-${expIndex}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">End Date</label>
                    <Input 
                      value={exp.end || ""}
                      readOnly={!editMode}
                      className={editMode ? "" : "bg-muted"}
                      data-testid={`input-end-${expIndex}`}
                    />
                  </div>
                </div>
                
                {/* Achievement Bullets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-muted-foreground">Key Achievements</label>
                    {suggestions.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSuggestions(suggestionKey)}
                        data-testid={`button-suggestions-${expIndex}`}
                      >
                        <i className="fas fa-magic text-accent mr-2"></i>
                        {showSuggestions[suggestionKey] ? 'Hide' : 'Show'} AI Suggestions
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="relative group">
                        <Textarea 
                          value={bullet}
                          readOnly={!editMode}
                          className={`resize-none ${editMode ? "pr-12" : "bg-muted"}`}
                          rows={2}
                          data-testid={`textarea-bullet-${expIndex}-${bulletIndex}`}
                        />
                        {editMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => toggleSuggestions(`${suggestionKey}-${bulletIndex}`)}
                          >
                            <i className="fas fa-magic text-accent"></i>
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {/* AI Suggestions */}
                    {showSuggestions[suggestionKey] && suggestions.length > 0 && (
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-accent flex items-center">
                            <i className="fas fa-lightbulb mr-2"></i>AI Suggestions
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSuggestions(suggestionKey)}
                          >
                            <i className="fas fa-times text-xs"></i>
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {suggestions[0]?.suggested_bullets.map((suggestion, suggestionIndex) => (
                            <div 
                              key={suggestionIndex}
                              className="suggestion-item p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-colors group/suggestion"
                            >
                              <div className="flex items-start justify-between">
                                <p className="text-sm text-foreground pr-4">{suggestion}</p>
                                <div className="flex space-x-1 opacity-0 group-hover/suggestion:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onCopySuggestion(suggestion)}
                                    data-testid={`button-copy-suggestion-${expIndex}-${suggestionIndex}`}
                                  >
                                    <i className="fas fa-copy text-xs"></i>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-primary/20"
                                    data-testid={`button-apply-suggestion-${expIndex}-${suggestionIndex}`}
                                  >
                                    <i className="fas fa-check text-xs text-primary"></i>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Education Section */}
        {result.parsed.education.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Education
            </h3>
            
            {result.parsed.education.map((edu, index) => (
              <div key={index} className="bg-background/50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">School</label>
                  <Input 
                    value={edu.school}
                    readOnly={!editMode}
                    className={editMode ? "" : "bg-muted"}
                    data-testid={`input-school-${index}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Degree</label>
                  <Input 
                    value={edu.degree}
                    readOnly={!editMode}
                    className={editMode ? "" : "bg-muted"}
                    data-testid={`input-degree-${index}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Year</label>
                  <Input 
                    value={edu.year || ""}
                    readOnly={!editMode}
                    className={editMode ? "" : "bg-muted"}
                    data-testid={`input-year-${index}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects Section */}
        {result.parsed.projects.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Projects
            </h3>
            
            {result.parsed.projects.map((project, index) => (
              <div key={index} className="bg-background/50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Project Name</label>
                  <Input 
                    value={project.name}
                    readOnly={!editMode}
                    className={editMode ? "" : "bg-muted"}
                    data-testid={`input-project-name-${index}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
                  <Textarea 
                    value={project.desc}
                    readOnly={!editMode}
                    className={`resize-none ${editMode ? "" : "bg-muted"}`}
                    rows={2}
                    data-testid={`textarea-project-desc-${index}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {result.parsed.certifications.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Certifications
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {result.parsed.certifications.map((cert, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="text-foreground border-border"
                  data-testid={`cert-${index}`}
                >
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
