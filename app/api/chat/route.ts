import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, NVIDIA_SYSTEM_PROMPT } from "@/lib/nvidia";
import { adminSaveChatLog } from "@/lib/supabase-admin";
import { canAccessBusiness } from "@/lib/tenant-auth";
import { retrieveRelevantChunks, formatChunksForPrompt } from "@/lib/rag";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, businessId, businessContext, language = "English" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (message.length > 8000) {
      return NextResponse.json({ error: "Message must not exceed 8000 characters" }, { status: 400 });
    }

    if (businessId && !(await canAccessBusiness(req, businessId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // RAG: retrieve relevant regulatory chunks before generating a response
    const retrievedChunks = await retrieveRelevantChunks(message, language, 5);
    const contextBlock = formatChunksForPrompt(retrievedChunks);

    const systemPrompt = `${NVIDIA_SYSTEM_PROMPT}

The user's preferred language is: ${language}.
If the language is not English, respond in that language while keeping technical/legal terms in English.
${contextBlock ? `\nUse the following retrieved regulatory context to answer accurately. If it doesn't cover the question, rely on general knowledge but say so explicitly.\n\nRETRIEVED CONTEXT:\n${contextBlock}` : ""}`;

    const userPrompt = businessContext
      ? `Business Context: ${JSON.stringify(businessContext)}\n\nUser Question: ${message}`
      : `User Question: ${message}`;

    const response = await chatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.2, maxTokens: 2048 }
    );

    if (businessId) {
      await adminSaveChatLog(
        businessId,
        message,
        response,
        language,
        businessContext ? JSON.stringify(businessContext) : undefined
      );
    }

    return NextResponse.json({
      response,
      sources: retrievedChunks.map((c) => ({ title: c.title, regulator: c.regulator })),
    });
  } catch (error: unknown) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}