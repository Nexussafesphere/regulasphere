const GOOGLE_TRANSLATE_API = "https://translation.googleapis.com/language/translate/v2";
const GOOGLE_TTS_API = "https://texttospeech.googleapis.com/v1/text:synthesize";

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_CLOUD_API_KEY is not set in environment variables");
  }

  return apiKey;
}

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage: string;
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<TranslationResult> {
  const apiKey = getApiKey();

  const url = new URL(GOOGLE_TRANSLATE_API);
  url.searchParams.append("key", apiKey);
  url.searchParams.append("q", text);
  url.searchParams.append("target", targetLanguage);

  if (sourceLanguage) {
    url.searchParams.append("source", sourceLanguage);
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Translation failed: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  const translation = data.data.translations[0];

  return {
    translatedText: translation.translatedText,
    detectedSourceLanguage: translation.detectedSourceLanguage || sourceLanguage || "",
  };
}

export const LANGUAGE_CODES: Record<string, string> = {
  English: "en",
  Yoruba: "yo",
  Hausa: "ha",
  Igbo: "ig",
  Pidgin: "pcm",
};

export async function translateToNigerianLanguage(
  text: string,
  language: string
): Promise<string> {
  const code = LANGUAGE_CODES[language];

  if (!code) {
    return text;
  }

  if (code === "en") {
    return text;
  }

  const result = await translateText(text, code);
  return result.translatedText;
}

export interface TTSSynthesisResult {
  audioContent: string;
  audioEncoding: string;
}

export async function synthesizeSpeech(
  text: string,
  languageCode: string = "en-NG",
  voiceName?: string
): Promise<TTSSynthesisResult> {
  const apiKey = getApiKey();

  const url = new URL(GOOGLE_TTS_API);
  url.searchParams.append("key", apiKey);

  const body: unknown = {
    input: { text },
    voice: {
      languageCode,
      name: voiceName || getVoiceForLanguage(languageCode),
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: 0.9,
      pitch: 0,
    },
  };

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`TTS failed: ${JSON.stringify(error)}`);
  }

  const data = await response.json();

  return {
    audioContent: data.audioContent,
    audioEncoding: data.audioConfig?.audioEncoding || "MP3",
  };
}

function getVoiceForLanguage(languageCode: string): string {
  const voices: Record<string, string> = {
    "en-NG": "en-NG-Standard-A",
    "yo-NG": "yo-NG-Standard-A",
    "ha-NG": "ha-NG-Standard-A",
    "ig-NG": "ig-NG-Standard-A",
  };

  return voices[languageCode] || "en-NG-Standard-A";
}

export function getLanguageCodeForNigerianLanguage(language: string): string {
  const codes: Record<string, string> = {
    English: "en-NG",
    Yoruba: "yo-NG",
    Hausa: "ha-NG",
    Igbo: "ig-NG",
    Pidgin: "en-NG",
  };

  return codes[language] || "en-NG";
}

export async function translateAndSpeak(
  text: string,
  language: string
): Promise<{
  originalText: string;
  translatedText: string;
  audioContent: string;
}> {
  const translatedText = await translateToNigerianLanguage(text, language);
  const languageCode = getLanguageCodeForNigerianLanguage(language);
  const audio = await synthesizeSpeech(translatedText, languageCode);

  return {
    originalText: text,
    translatedText,
    audioContent: audio.audioContent,
  };
}