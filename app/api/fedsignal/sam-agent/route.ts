import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
// Anthropic SDK is optional - will be used if installed
let Anthropic: any = null;
try {
  Anthropic = require("@anthropic-ai/sdk").default;
} catch (e) {
  // Anthropic SDK not installed
}

// SAM.gov API client
async function searchSamOpportunities(params: any) {
  const apiKey = process.env.SAM_API_KEY;
  if (!apiKey) {
    throw new Error("SAM_API_KEY not configured");
  }

  const baseUrl = "https://api.sam.gov/opportunities/v2/search";
  const queryParams = new URLSearchParams({
    api_key: apiKey,
    limit: "100",
    ...params,
  });

  const response = await fetch(`${baseUrl}?${queryParams}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`SAM.gov API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

// Parse natural language query using LLM
async function parseNaturalLanguageQuery(query: string, provider: "openai" | "anthropic" = "openai") {
  const systemPrompt = `You are a SAM.gov search expert. Parse the user's natural language query into structured search parameters for the SAM.gov API.

Available parameters:
- naics: NAICS code (e.g., "541511")
- psc: Product/Service Code (e.g., "D301")
- set_aside: Set-aside type (e.g., "SBA", "HBCU", "8(a)", "WOSB", "HUBZone")
- notice_type: Notice type (e.g., "o" for Solicitation, "a" for Award, "p" for Presolicitation)
- pop_state: State abbreviation for place of performance (e.g., "CA", "TX")
- is_active: "true" for active opportunities, "false" for inactive
- response_date_from: Response deadline start date (YYYY-MM-DD)
- response_date_to: Response deadline end date (YYYY-MM-DD)
- posted_date_from: Posted date start (YYYY-MM-DD)
- posted_date_to: Posted date end (YYYY-MM-DD)
- keywords: Search keywords for the title/description

Return ONLY a JSON object with the parameters that can be extracted from the query. Return empty object {} if no parameters can be extracted.`;

  try {
    if (provider === "openai") {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        temperature: 0.3,
      });

      const content = completion.choices[0].message.content || "{}";
      return JSON.parse(content);
    } else {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const message = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: query }],
      });

      const content = message.content[0].type === "text" ? message.content[0].text : "{}";
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("LLM parsing error:", error);
    return {}; // Return empty params on error
  }
}

// Generate AI recommendation for search results
async function generateRecommendation(query: string, results: any[], provider: "openai" | "anthropic" = "openai") {
  if (results.length === 0) {
    return "No opportunities found matching your search criteria.";
  }

  const systemPrompt = `You are a federal contracting expert. Analyze the SAM.gov search results and provide a brief recommendation (2-3 sentences) about the opportunities found. Focus on:
1. Relevance to the user's search intent
2. Key opportunities worth pursuing
3. Any strategic considerations

Keep it concise and actionable.`;

  const resultsSummary = results.slice(0, 5).map((r: any) => ({
    title: r.title,
    solicitationNumber: r.solicitationNumber,
    agency: r.organizationHierarchy,
    deadline: r.responseDeadLine,
  }));

  try {
    if (provider === "openai") {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `User Query: ${query}\n\nResults Summary:\n${JSON.stringify(resultsSummary, null, 2)}` 
          },
        ],
        temperature: 0.7,
      });

      return completion.choices[0].message.content || "";
    } else {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const message = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ 
          role: "user", 
          content: `User Query: ${query}\n\nResults Summary:\n${JSON.stringify(resultsSummary, null, 2)}` 
        }],
      });

      return message.content[0].type === "text" ? message.content[0].text : "";
    }
  } catch (error) {
    console.error("LLM recommendation error:", error);
    return `Found ${results.length} opportunities matching your search criteria. Review the results for opportunities that align with your capabilities.`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, filters = {}, llmProvider = "openai", useAgent = true } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    let searchParams = { ...filters };
    let usedAgent = false;

    // Use LLM to parse natural language if enabled
    if (useAgent) {
      const parsedParams = await parseNaturalLanguageQuery(query, llmProvider);
      searchParams = { ...searchParams, ...parsedParams, keywords: query };
      usedAgent = true;
    } else {
      searchParams.keywords = query;
    }

    // Search SAM.gov
    const samResponse = await searchSamOpportunities(searchParams);
    const opportunities = samResponse.opportunities || [];

    // Generate AI recommendation if LLM is available and results found
    let recommendation = null;
    if (useAgent && opportunities.length > 0) {
      const hasApiKey = llmProvider === "openai" 
        ? !!process.env.OPENAI_API_KEY 
        : !!process.env.ANTHROPIC_API_KEY;
      
      if (hasApiKey) {
        recommendation = await generateRecommendation(query, opportunities, llmProvider);
      }
    }

    return NextResponse.json({
      opportunities,
      total: samResponse.totalRecords || opportunities.length,
      recommendation,
      usedAgent,
      appliedParams: searchParams,
    });
  } catch (error: any) {
    console.error("SAM agent search error:", error);
    
    if (error.message?.includes("SAM_API_KEY")) {
      return NextResponse.json(
        { error: "SAM.gov API key not configured", missingApiKey: true },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}
