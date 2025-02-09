
import React, { useState } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { ModelSelector } from '@/components/ModelSelector';
import { SecurityIssues, SecurityIssue } from '@/components/SecurityIssues';
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [selectedModel, setSelectedModel] = useState('gpt4');
  const [issues, setIssues] = useState<SecurityIssue[]>([]);
  const [llmResponse, setLlmResponse] = useState<string>('');

  const handleAnalyze = async (code: string, language: string) => {
    // TODO: Implement actual analysis logic with selected model
    // This is a mock response for demonstration
    const mockIssues: SecurityIssue[] = [
      {
        id: '1',
        severity: 'critical',
        title: 'SQL Injection Vulnerability',
        description: 'Direct use of user input in SQL queries can lead to SQL injection attacks.',
        lineNumber: 23,
      },
      {
        id: '2',
        severity: 'warning',
        title: 'Insecure Password Storage',
        description: 'Passwords should be hashed using a strong algorithm before storage.',
        lineNumber: 45,
      },
      {
        id: '3',
        severity: 'info',
        title: 'Missing Input Validation',
        description: 'Consider adding input validation to prevent potential security issues.',
        lineNumber: 12,
      },
    ];
    
    setIssues(mockIssues);
    setLlmResponse("I've analyzed the code and found several security concerns. The most critical issue is an SQL injection vulnerability on line 23, where user input is directly concatenated into SQL queries without proper sanitization. Additionally, there's an insecure password storage mechanism that should be updated to use modern hashing algorithms. I recommend implementing prepared statements for database queries and using bcrypt or Argon2 for password hashing.");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold text-center mb-8">Code Security Analysis</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CodeEditor onAnalyze={handleAnalyze} />
          </div>
          <div>
            <ModelSelector selectedModel={selectedModel} onModelSelect={setSelectedModel} />
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {llmResponse && (
            <Card className="p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold mb-4">LLM Analysis</h3>
              <ScrollArea className="h-[300px] pr-4">
                <div className="prose prose-sm">
                  {llmResponse.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          )}
          
          {issues.length > 0 && (
            <SecurityIssues issues={issues} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
