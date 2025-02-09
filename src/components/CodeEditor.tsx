
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUPPORTED_LANGUAGES = ['javascript', 'python', 'java'];

export const CodeEditor = ({ onAnalyze }: { onAnalyze: (code: string, language: string) => void }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  return (
    <Card className="p-6 w-full animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => onAnalyze(code, language)}
          className="bg-primary hover:bg-primary/90"
          disabled={!code.trim()}
        >
          Analyze Security
        </Button>
      </div>
      <textarea
        className="w-full h-[400px] p-4 code-editor bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        spellCheck={false}
      />
    </Card>
  );
};
