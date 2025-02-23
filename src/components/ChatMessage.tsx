
import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, User } from "lucide-react";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === 'assistant';
  
  const ParsedContent = () => {
    if (!isAssistant) return <p className="whitespace-pre-wrap">{content}</p>;

    try {
      const data = JSON.parse(content);
      
      return (
        <div className="space-y-6">
          {data.issues?.map((issue: { id: string; title: string; description: string }) => (
            <div key={issue.id} className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                {issue.title}
              </h3>
              {issue.title === "Generated Code:" ? (
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{issue.description}</code>
                </pre>
              ) : (
                <div className="text-muted-foreground">
                  {issue.description.split('\n').map((line: string, i: number) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {data.analysis && (
            <div className="text-muted-foreground">
              {data.analysis}
            </div>
          )}
        </div>
      );
    } catch (e) {
      // Fallback to the original content if it's not JSON
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
