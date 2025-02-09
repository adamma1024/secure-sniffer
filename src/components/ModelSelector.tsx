
import React from 'react';
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const AVAILABLE_MODELS = [
  { id: 'gpt4', name: 'GPT-4', description: 'Recommended for detailed analysis' },
  { id: 'gemini', name: 'Gemini', description: 'Balanced performance' },
  { id: 'deepseek', name: 'Deepseek', description: 'Specialized in code analysis' },
];

export const ModelSelector = ({ 
  selectedModel, 
  onModelSelect 
}: { 
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}) => {
  return (
    <Card className="p-6 animate-fadeIn">
      <h3 className="text-lg font-semibold mb-4">Select Analysis Model</h3>
      <RadioGroup value={selectedModel} onValueChange={onModelSelect} className="space-y-4">
        {AVAILABLE_MODELS.map((model) => (
          <div key={model.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value={model.id} id={model.id} />
            <div className="flex flex-col">
              <Label htmlFor={model.id} className="font-medium">{model.name}</Label>
              <span className="text-sm text-muted-foreground">{model.description}</span>
            </div>
          </div>
        ))}
      </RadioGroup>
    </Card>
  );
};
