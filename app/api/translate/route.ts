import { NextRequest, NextResponse } from "next/server";
import {
  translateToNigerianLanguage,
  synthesizeSpeech,
  getLanguageCodeForNigerianLanguage,
  LANGUAGE_CODES,
} from "@/lib/google";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, targetLanguage, includeSpeech = false } = body;

    if (!text || typeof text !== "string" || text.length > 8000) {
      return NextResponse.json(
        { error: "Text is required and must not exceed 8000 characters" },
        { status: 400 }
      );
    }

    if (!targetLanguage || !LANGUAGE_CODES[targetLanguage]) {
      return NextResponse.json(
        { error: "Valid target language is required" },
        { status: 400 }
      );
    }

    const translatedText = await translateToNigerianLanguage(
      text,
      targetLanguage
    );

    let audioContent: string | null = null;

    if (includeSpeech) {
      const languageCode = getLanguageCodeForNigerianLanguage(targetLanguage);
      const audio = await synthesizeSpeech(translatedText, languageCode);
      audioContent = audio.audioContent;
    }

    return NextResponse.json({
      originalText: text,
      translatedText,
      targetLanguage,
      audioContent,
    });
  } catch (error: unknown) {
    console.error("Translation Error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}