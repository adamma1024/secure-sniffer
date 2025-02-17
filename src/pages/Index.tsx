
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (code: string, language: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(
        'https://YOUR_PROJECT_REF.supabase.co/functions/v1/analyze-security',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            language,
            model: selectedModel,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setLlmResponse(data.analysis);
      setIssues(data.issues);
    } catch (error) {
      console.error('Error analyzing code:', error);
      setLlmResponse('Error analyzing code. Please try again.');
      setIssues([]);
    } finally {
      setIsAnalyzing(false);
    }
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
