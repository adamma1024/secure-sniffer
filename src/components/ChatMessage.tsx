
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
  
  // Parse the message content if it's from the assistant
  const ParsedContent = () => {
    if (!isAssistant) return <p className="whitespace-pre-wrap">{content}</p>;

    // Try to extract sections
    const sections = {
      generatedCode: '',
      potentialRisks: [] as string[],
      vulnerabilities: [] as string[],
      remainingText: '',
    };

    const lines = content.split('\n');
    let currentSection = 'remainingText';
    let codeBlock = false;
    let language = '';

    lines.forEach(line => {
      if (line.startsWith('Generated Code:')) {
        currentSection = 'generatedCode';
        return;
      } else if (line.startsWith('**Potential Risks**:')) {
        currentSection = 'potentialRisks';
        return;
      } else if (line.startsWith('**Vulnerability Detection**:')) {
        currentSection = 'vulnerabilities';
        return;
      } else if (line.match(/^```(\w+)?/)) {
        codeBlock = !codeBlock;
        if (codeBlock) {
          language = line.replace('```', '').trim();
        }
        return;
      }

      if (currentSection === 'generatedCode') {
        if (!codeBlock) return;
        sections.generatedCode += line + '\n';
      } else if (currentSection === 'potentialRisks' && line.startsWith('- ')) {
        sections.potentialRisks.push(line.replace('- ', '').replace(/\*\*/g, ''));
      } else if (currentSection === 'vulnerabilities' && line.startsWith('- ')) {
        sections.vulnerabilities.push(line.replace('- ', '').replace(/\*\*/g, ''));
      } else {
        sections.remainingText += line + '\n';
      }
    });

    return (
      <div className="space-y-4">
        {sections.remainingText && (
          <p className="whitespace-pre-wrap text-muted-foreground">
            {sections.remainingText}
          </p>
        )}
        
        {sections.generatedCode && (
          <div className="space-y-2">
            <h3 className="font-semibold">Generated Code</h3>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
              <code>{sections.generatedCode}</code>
            </pre>
          </div>
        )}

        {sections.potentialRisks.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Potential Risks</h3>
            <ul className="list-disc list-inside space-y-1">
              {sections.potentialRisks.map((risk, index) => (
                <li key={index} className="text-warning">{risk}</li>
              ))}
            </ul>
          </div>
        )}

        {sections.vulnerabilities.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Vulnerability Detection</h3>
            <ul className="list-disc list-inside space-y-1">
              {sections.vulnerabilities.map((vuln, index) => (
                <li key={index} className="text-critical">{vuln}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
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
