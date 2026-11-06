import { NextRequest, NextResponse } from "next/server";
import { retrieveRelevantChunks, formatChunksForPrompt } from "@/lib/rag";
import { chatCompletion } from "@/lib/nvidia";

const SYSTEM_PROMPT = `You are RegulaSphere AI, an autonomous compliance agent built by Nexus SafeSphere Technologies Limited.

You have deep knowledge of Nigerian regulatory frameworks including:

1. CAMA 2020 (Corporate Affairs Commission) - Company registration, annual returns, share capital, directors, meetings, winding up
2. NDPA 2023 (Nigeria Data Protection Commission) - Data protection, DPIA, breach notification, data subject rights
3. NITDA Frameworks - AI Governance, Cloud Computing, Digital Economy, Blockchain, 5G, PKI, E-Invoicing
4. CBN Regulations - Fintech licensing, AML/CFT, E-Payment, DFS, Credit Bureaux
5. SEC Rules - ISA 2025, Digital Assets, Crowdfunding, Robo-Advisory, AML/CFT
6. NRS (Nigeria Revenue Service, formerly FIRS) - Nigeria Tax Act 2025 - CIT, VAT, WHT, Tax Clearance
7. PENCOM Pension Reform Act 2014 - Pension remittance, RSA, Micro-pension
8. NSITF Employee Compensation Act 2010 - Worker compensation
9. ITF Act - Skills Development Levy
10. NAFDAC Regulations - Product registration, Food, Drugs, Chemicals

You provide sector-specific compliance guidance, step-by-step remediation, exact penalties and deadlines, plain English explanations, and multilingual responses (English, Yoruba, Hausa, Igbo, Pidgin).

Always be proactive, specific, and actionable.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, businessContext, language = "English" } = body;

    if (typeof message !== "string" || message.trim().length === 0 || message.length > 8000) {
      return NextResponse.json({ error: "A message between 1 and 8000 characters is required" }, { status: 400 });
    }

    const retrievedChunks = await retrieveRelevantChunks(message, language, 5);
    const contextBlock = formatChunksForPrompt(retrievedChunks);

    const systemPrompt = `${SYSTEM_PROMPT}${
      contextBlock
        ? `\n\nUse the following retrieved regulatory context to answer accurately. If it doesn't cover the question, rely on general knowledge but say so explicitly.\n\nRETRIEVED CONTEXT:\n${contextBlock}`
        : ""
    }`;

    const contextPrompt = businessContext
      ? `Business Context: ${JSON.stringify(businessContext)}\n\nUser Question: ${message}`
      : `User Question: ${message}`;

    const response = await chatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: contextPrompt },
      ],
      { temperature: 0.2, maxTokens: 2048, topP: 0.7 }
    );

    if (!response.trim()) {
      return NextResponse.json({ error: "The AI provider returned an empty response" }, { status: 502 });
    }

    return NextResponse.json({
      response,
      sources: retrievedChunks.map((c) => ({ title: c.title, regulator: c.regulator })),
    });
  } catch (error: unknown) {
    console.error(
      "AI Agent Error:",
      error instanceof Error ? error.message : "Unknown AI provider error"
    );
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}