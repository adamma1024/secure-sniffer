
import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, User, Code, BookText } from "lucide-react";
import Markdown from 'react-markdown';


interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

interface ParsedResponse {
  analysis: string;
  issues?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  const getGeneratedCode = (data: ParsedResponse) => {
    const codeIssue = data.issues?.find(issue => issue.title === "Generated Code:");
    return codeIssue?.description || '';
  };

  const getEducationalAnalysis = (data: ParsedResponse) => {
    const analysisIssue = data.issues?.find(issue => issue.title === "Educational Analysis:");
    return analysisIssue?.description || data.analysis || '';
  };

  const ParsedContent = () => {
    if (!isAssistant) {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    try {
      const data: ParsedResponse = JSON.parse(content);
      const generatedCode = getGeneratedCode(data);
      const educationalAnalysis = getEducationalAnalysis(data);

      return (
        <div className="space-y-6">
          {generatedCode && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Code className="size-5" />
                <h3 className="text-lg font-semibold">Generated Code</h3>
              </div>
              <div className="rounded-lg overflow-hidden border">
                <Markdown>{generatedCode}</Markdown>
              </div>
            </div>
          )}

          {educationalAnalysis && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <BookText className="size-5" />
                <h3 className="text-lg font-semibold">Educational Analysis</h3>
              </div>
              <div className="text-muted-foreground space-y-2">
                <Markdown>{educationalAnalysis}</Markdown>
              </div>
            </div>
          )}
        </div>
      );
    } catch (e) {
      // Fallback to displaying original content in editor
      return <p className="whitespace-pre-wrap">{content}</p>;
    }
  };

  return (
    <Card className={`p-4 ${isAssistant ? 'bg-muted' : 'bg-background'}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {isAssistant ? (
            <div className="size-8 rounded-full bg-primary text-primary-foreground grid place-items-center">
              <MessageSquare className="size-5" />
            </div>
          ) : (
            <div className="size-8 rounded-full bg-muted text-muted-foreground grid place-items-center">
              <User className="size-5" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <ParsedContent />
        </div>
      </div>
    </Card>
  );
}
