import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { loadHermesConfig, getDefaultModelProvider, getModelForUseCase } from "@/lib/fedsignal/hermes-config";

/**
 * Hermes Chat API
 * 
 * Handles chat interactions with Hermes AI Agent
 * Supports context-aware conversations about SAM.gov operations
 */

export async function POST(req: NextRequest) {
  try {
    const { message, universityId, context, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Load Hermes configuration
    const hermesConfig = await loadHermesConfig();
    
    // Determine model to use
    const defaultProvider = getDefaultModelProvider(hermesConfig);
    const chatModel = getModelForUseCase(hermesConfig, "chat");
    
    // Get API key based on provider
    let apiKey: string | undefined;
    let modelName: string;

    if (defaultProvider === "openai") {
      apiKey = hermesConfig?.models?.providers?.openai?.apiKey || process.env.OPENAI_API_KEY;
      modelName = hermesConfig?.models?.providers?.openai?.model || "gpt-4";
    } else if (defaultProvider === "anthropic") {
      apiKey = hermesConfig?.models?.providers?.anthropic?.apiKey || process.env.ANTHROPIC_API_KEY;
      modelName = hermesConfig?.models?.providers?.anthropic?.model || "claude-3-opus-20240229";
    } else {
      // Fallback to OpenAI
      apiKey = process.env.OPENAI_API_KEY;
      modelName = "gpt-4";
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured for the selected provider" },
        { status: 500 }
      );
    }

    // Build system prompt with context
    const systemPrompt = `You are Hermes, an AI assistant for the HBCU FedSignal platform. Your role is to help users with SAM.gov operations, federal opportunity analysis, and automation tasks.

${universityId ? `Current university context: ${universityId}` : ""}

${context ? `Additional context: ${JSON.stringify(context)}` : ""}

You have access to information about:
- SAM.gov federal contract opportunities
- University profiles and capabilities
- NAICS codes and classification systems
- Set-aside programs (HBCU, 8(a), WOSB, etc.)
- Proposal writing assistance
- Compliance requirements

Be helpful, concise, and action-oriented. If you need more information to assist, ask specific questions.`;

    // Build conversation history
    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add recent history for context
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-5)) { // Last 5 messages
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      }
    }

    // Add current message
    messages.push({ role: "user", content: message });

    // Call LLM based on provider
    let response: string;

    if (defaultProvider === "openai" || !apiKey) {
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: modelName,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      response = completion.choices[0].message.content || "I apologize, but I couldn't generate a response.";
    } else if (defaultProvider === "anthropic") {
      // Anthropic implementation (if SDK is installed)
      try {
        const Anthropic = require("@anthropic-ai/sdk").default;
        const anthropic = new Anthropic({ apiKey });
        const msg = await anthropic.messages.create({
          model: modelName,
          max_tokens: 1000,
          system: systemPrompt,
          messages: messages.slice(1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

        response = msg.content[0]?.type === "text" ? msg.content[0].text : "I apologize, but I couldn't generate a response.";
      } catch (e) {
        // Fallback to OpenAI if Anthropic not available
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        });

        response = completion.choices[0].message.content || "I apologize, but I couldn't generate a response.";
      }
    } else {
      // Default to OpenAI
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      response = completion.choices[0].message.content || "I apologize, but I couldn't generate a response.";
    }

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Hermes chat error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process message" },
      { status: 500 }
    );
  }
}
