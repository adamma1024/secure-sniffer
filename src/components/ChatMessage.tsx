
import * as React from 'react';
import { Card } from "@/components/ui/card";
import { MessageSquare, User, BookText } from "lucide-react";
import Markdown from 'react-markdown';


interface ChatMessageProps {
  role: 'user' | 'assistant';
  response?: ParsedResponse;
  content?: string;
}

export interface ParsedResponse {
  analysis: string;
  issues?: Array<{
    id: string;
    severity: "info" | "warning";
    title: string;
    description: string;
  }>;
}

export function ChatMessage({ role, response, content }: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  const ParsedContent = () => {
    if (!isAssistant) {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    try {
      const data: ParsedResponse = response;

      return (
        <div className="space-y-6">
          <div className="text-muted-foreground space-y-2">
            <Markdown>{response?.analysis ?? "The server is busy! Please try it again later."}</Markdown>
          </div>
        </div>
      );
    } catch (e) {
      // Fallback to displaying original content in editor
      return <p className="whitespace-pre-wrap">{content ?? response?.analysis ?? ""}</p>;
    }
  }

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
