import { NextRequest, NextResponse } from "next/server";

interface LLMConfig {
  provider: "claude" | "openai" | "ollama" | "lmstudio" | "openai-compatible";
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, llmConfig } = body as { query: string; llmConfig: LLMConfig };

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a SAM.gov search assistant. Convert natural language queries into structured search parameters.

Available parameters:
- keyword: Main search terms
- naics: NAICS code (6 digits, e.g., 541511 for software development)
- psc: PSC code (e.g., D301 for IT)
- state: 2-letter state code (e.g., CA)
- typeOfSetAside: Set-aside codes (SBA, 8A, HUBZone, SDVOSBC, WOSB)
- noticeType: Notice type codes (o=Solicitation, p=Presolicitation, k=Combined, r=Sources Sought)

Respond with ONLY a JSON object containing the extracted parameters and a brief interpretation.

Example:
Query: "Find software development contracts in California for small businesses"
Response: {
  "filters": {
    "keyword": "software development",
    "state": "CA",
    "typeOfSetAside": "SBA",
    "naics": "541511"
  },
  "interpretation": "Searching for small business software development opportunities in California (NAICS 541511)"
}`;

    const userPrompt = `Convert this query to SAM.gov search parameters: "${query}"`;

    let llmResponse: string;

    switch (llmConfig.provider) {
      case "openai":
        llmResponse = await callOpenAI(systemPrompt, userPrompt, llmConfig);
        break;
      case "claude":
        llmResponse = await callClaude(systemPrompt, userPrompt, llmConfig);
        break;
      case "ollama":
        llmResponse = await callOllama(systemPrompt, userPrompt, llmConfig);
        break;
      case "lmstudio":
        llmResponse = await callLMStudio(systemPrompt, userPrompt, llmConfig);
        break;
      case "openai-compatible":
        llmResponse = await callOpenAICompatible(systemPrompt, userPrompt, llmConfig);
        break;
      default:
        throw new Error("Unsupported LLM provider");
    }

    const parsed = JSON.parse(llmResponse);

    return NextResponse.json({
      success: true,
      filters: parsed.filters || {},
      interpretation: parsed.interpretation || "Query interpreted",
    });
  } catch (error) {
    console.error("LLM interpretation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to interpret query",
      },
      { status: 500 }
    );
  }
}

async function callOpenAI(systemPrompt: string, userPrompt: string, config: LLMConfig): Promise<string> {
  if (!config.apiKey) {
    throw new Error("OpenAI API key is required");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "{}";
}

async function callClaude(systemPrompt: string, userPrompt: string, config: LLMConfig): Promise<string> {
  if (!config.apiKey) {
    throw new Error("Anthropic API key is required");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model || "claude-3-opus-20240229",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || "{}";
}

async function callOllama(systemPrompt: string, userPrompt: string, config: LLMConfig): Promise<string> {
  const baseUrl = config.baseUrl || "http://localhost:11434";

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model || "llama2",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: false,
      format: "json",
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.message?.content || "{}";
}

async function callLMStudio(systemPrompt: string, userPrompt: string, config: LLMConfig): Promise<string> {
  const baseUrl = config.baseUrl || "http://localhost:1234/v1";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model || "local-model",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`LM Studio API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "{}";
}

async function callOpenAICompatible(systemPrompt: string, userPrompt: string, config: LLMConfig): Promise<string> {
  if (!config.baseUrl) {
    throw new Error("Base URL is required for OpenAI-compatible endpoint");
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
    },
    body: JSON.stringify({
      model: config.model || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI-compatible API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "{}";
}
