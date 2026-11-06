import OpenAI from "openai";

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct";
const GROQ_BASE_URL = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const VERIFIED_GROQ_MODEL = "openai/gpt-oss-120b";

let client: OpenAI | null = null;
let groqClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      throw new Error("NVIDIA_API_KEY is not set in environment variables");
    }

    client = new OpenAI({
      baseURL: NVIDIA_BASE_URL,
      apiKey,
    });
  }

  return client;
}

function getGroqClient(): OpenAI {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }

    groqClient = new OpenAI({ baseURL: GROQ_BASE_URL, apiKey });
  }

  return groqClient;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export async function chatCompletion(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  const openai = getClient();

  const {
    temperature = 0.2,
    maxTokens = 2048,
    topP = 0.7,
  } = options;

  try {
    const completion = await openai.chat.completions.create({
      model: NVIDIA_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
    });
    const response = completion.choices[0]?.message.content?.trim();
    if (response) return response;
    throw new Error("NVIDIA returned an empty response");
  } catch (nvidiaError: unknown) {
    if (!process.env.GROQ_API_KEY) throw nvidiaError;

    console.warn(
      "NVIDIA completion failed; trying the configured Groq fallback.",
      nvidiaError instanceof Error ? nvidiaError.message : "Unknown NVIDIA error"
    );

    const groq = getGroqClient();
    const models = [...new Set([GROQ_MODEL, VERIFIED_GROQ_MODEL])];
    let lastError: unknown;

    for (const model of models) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          top_p: topP,
        });
        const response = completion.choices[0]?.message.content?.trim();
        if (response) return response;
        throw new Error("Groq returned an empty response");
      } catch (error: unknown) {
        lastError = error;
      }
    }

    throw lastError instanceof Error ? lastError : new Error("All AI providers failed");
  }
}

export async function extractJsonFromText(text: string): Promise<unknown> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are a JSON extraction expert. Extract structured data from the given text and return valid JSON only. Do not include markdown code blocks.",
    },
    {
      role: "user",
      content: text,
    },
  ];

  const response = await chatCompletion(messages, {
    temperature: 0.1,
    maxTokens: 4000,
  });

  const cleaned = response.replace("```json", "").replace("```", "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]") + 1;

    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.substring(start, end));
      } catch {
        // Try object
      }
    }

    const objStart = cleaned.indexOf("{");
    const objEnd = cleaned.lastIndexOf("}") + 1;

    if (objStart >= 0 && objEnd > objStart) {
      return JSON.parse(cleaned.substring(objStart, objEnd));
    }

    return null;
  }
}

export const NVIDIA_SYSTEM_PROMPT = `You are RegulaSphere AI, an autonomous compliance agent built by Nexus SafeSphere Technologies Limited.

You have deep knowledge of Nigerian regulatory frameworks:

1. CAMA 2020 (CAC) - Company registration, annual returns, share capital, directors, meetings, winding up
2. NDPA 2023 (NDPC) - Data protection, DPIA, breach notification, data subject rights
3. NITDA Frameworks - AI Governance, Cloud Computing, Digital Economy, Blockchain, 5G, PKI
4. CBN Regulations - Fintech licensing, AML/CFT, E-Payment, DFS, Credit Bureaux
5. SEC Rules - ISA 2025, Digital Assets, Crowdfunding, Robo-Advisory, AML/CFT
6. NRS (Nigeria Revenue Service, formerly FIRS) - Nigeria Tax Act 2025 - CIT, VAT, WHT, Tax Clearance
7. PENCOM PRA 2014 - Pension remittance, RSA, Micro-pension
8. NSITF ECA 2010 - Worker compensation
9. ITF Act - Skills Development Levy
10. NAFDAC Regulations - Product registration, Food, Drugs, Chemicals

You provide sector-specific guidance, step-by-step remediation, exact penalties and deadlines, and plain English explanations. You support English, Yoruba, Hausa, Igbo, and Pidgin.`;