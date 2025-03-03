
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { ModelSelector } from "@/components/ModelSelector";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParsedResponse } from './ChatMessage.tsx';

interface Message {
  role: 'user' | 'assistant';
  content?: string;
  response?: ParsedResponse;
}

const SUPPORTED_LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'auto', label: 'Auto Detect' },
] as const;

type Language = typeof SUPPORTED_LANGUAGES[number]['value'];

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt4');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python'); // Changed default to 'python'
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-security', {
        body: {
          code: userMessage,
          language: selectedLanguage,
          model: selectedModel,
        },
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: 'assistant', response: data }]);
    } catch (error) {
      console.error('Error analyzing code:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-none w-64 p-4 border-r space-y-4">
        <ModelSelector selectedModel={selectedModel} onModelSelect={setSelectedModel} />

        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Select value={selectedLanguage} onValueChange={(value: Language) => setSelectedLanguage(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
          </div>
        </ScrollArea>

        <Card className="m-4 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your code here..."
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
