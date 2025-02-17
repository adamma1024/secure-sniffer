
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import OpenAI from "npm:openai";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  code: string;
  language: string;
  model: string;
}

const CHATGPT_Client = new OpenAI({
  apiKey: OPENAI_API_KEY
});

const DEEPSEEK_Client = new OpenAI({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

async function analyzeWithOpenAI(code: string, language: string) {
  const response = await CHATGPT_Client.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      {
        role: 'system',
        content: 'You are a security expert analyzing code for vulnerabilities. Provide a detailed analysis focusing on security issues.',
      },
      {
        role: 'user',
        content: `Please analyze this ${language} code for security vulnerabilities:\n\n${code}`,
      },
    ]
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response format from OpenAI API');
  }

  return data.choices[0].message.content;
}

async function analyzeWithGemini(code: string, language: string) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `As a security expert, analyze this ${language} code for vulnerabilities and provide a detailed report:\n\n${code}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    if (!analysis) {
      throw new Error('No analysis generated from Gemini');
    }

    return analysis;
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

async function analyzeWithDeepseek(code: string, language: string) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('Deepseek API key not configured');
  }

  const openai = new OpenAI({
    apiKey: DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
  });

  try {
    const completion = await DEEPSEEK_Client.chat.completions.create({
      model: 'deepseek-reasoner',
      messages: [
        {
          role: 'system',
          content: 'You are a security expert analyzing code for vulnerabilities.',
        },
        {
          role: 'user',
          content: `Please analyze this ${language} code for security vulnerabilities:\n\n${code}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 1000,
    });

    const analysis = completion.choices[0]?.message?.content;
    if (!analysis) {
      throw new Error('No analysis generated from Deepseek');
    }

    return analysis;
  } catch (error) {
    console.error('Deepseek analysis error:', error);
    throw new Error(`Deepseek API error: ${error.message}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, model } = await req.json() as AnalysisRequest;

    if (!code || !language || !model) {
      throw new Error('Missing required parameters');
    }

    let analysis;
    let issues = [];

    switch (model) {
      case 'gpt4':
        if (!OPENAI_API_KEY) throw new Error('OpenAI API key not configured');
        analysis = await analyzeWithOpenAI(code, language);
        break;
      case 'gemini':
        if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured');
        analysis = await analyzeWithGemini(code, language);
        break;
      case 'deepseek':
        if (!DEEPSEEK_API_KEY) throw new Error('Deepseek API key not configured');
        analysis = await analyzeWithDeepseek(code, language);
        break;
      default:
        throw new Error('Invalid model selected');
    }

    if (!analysis) {
      throw new Error('No analysis generated');
    }

    const severityKeywords = {
      critical: ['critical', 'severe', 'high risk', 'vulnerability'],
      warning: ['warning', 'moderate', 'potential risk'],
      info: ['info', 'suggestion', 'recommendation'],
    };

    const lines = analysis.split('\n');
    let currentIssue: any = null;

    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase();

      if (line.match(/^[A-Z]/) && line.length < 100) {
        if (currentIssue) {
          issues.push(currentIssue);
        }

        let severity = 'info';
        for (const [sev, keywords] of Object.entries(severityKeywords)) {
          if (keywords.some(keyword => lowerLine.includes(keyword))) {
            severity = sev;
            break;
          }
        }

        currentIssue = {
          id: `issue-${issues.length + 1}`,
          severity,
          title: line.trim(),
          description: '',
        };
      } else if (currentIssue) {
        currentIssue.description += line.trim() + ' ';
      }
    });

    if (currentIssue) {
      issues.push(currentIssue);
    }

    if (issues.length === 0) {
      issues.push({
        id: 'issue-1',
        severity: 'info',
        title: 'Analysis Complete',
        description: 'The analysis was completed but no specific issues were identified in the standard format. Please refer to the full analysis text for details.',
      });
    }

    return new Response(
      JSON.stringify({
        analysis,
        issues,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-security function:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
