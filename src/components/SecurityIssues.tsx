
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export interface SecurityIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  lineNumber?: number;
}

const SeverityIcon = ({ severity }: { severity: SecurityIssue['severity'] }) => {
  switch (severity) {
    case 'critical':
      return <AlertCircle className="w-5 h-5 text-critical" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    case 'info':
      return <Info className="w-5 h-5 text-success" />;
  }
};

const getSeverityColor = (severity: SecurityIssue['severity']) => {
  switch (severity) {
    case 'critical':
      return 'bg-critical/10 text-critical border-critical/20';
    case 'warning':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'info':
      return 'bg-success/10 text-success border-success/20';
  }
};

export const SecurityIssues = ({ issues }: { issues: SecurityIssue[] }) => {
  return (
    <Card className="p-6 animate-fadeIn">
      <h3 className="text-lg font-semibold mb-4">Security Analysis Results</h3>
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)} animate-slideUp`}
            >
              <div className="flex items-start space-x-3">
                <SeverityIcon severity={issue.severity} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{issue.title}</h4>
                    {issue.lineNumber && (
                      <Badge variant="outline">Line {issue.lineNumber}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
