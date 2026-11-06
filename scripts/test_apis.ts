/**
 * Generate translated text + TTS audio for Yoruba, Igbo, Hausa, and Nigerian Pidgin,
 * using dedicated per-language voices instead of one generic English voice.
 *
 * Usage:
 *   npx tsx scripts/test_apis.ts
 */

import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLAB_API_KEY;

const OUTPUT_DIR = path.join(process.cwd(), "scripts", "output");
const SOURCE_TEXT = "Stay compliant. Stay ahead.";

// ---------------------------------------------------------------------------
// Per-language voice IDs. Fill these in after auditioning voices from
// elevenlabs.io/app/voice-library (search "Yoruba", "Igbo", "Hausa", "Nigerian").
// Add each to "My Voices" first — that's what makes it show up via listMyVoices().
// Leave a slot empty ("") to fall back to FALLBACK_VOICE_ID for that language.
// ---------------------------------------------------------------------------
const VOICE_IDS: Record<string, string> = {
  yoruba: "MtiXQ0OcNRgys9ZxVgSw", // e.g. "9Dbo4hEvXQ5l7MXGZFQA" (Olufunmilola)
  igbo: "MtiXQ0OcNRgys9ZxVgSw",
  hausa: "MtiXQ0OcNRgys9ZxVgSw",
  pidgin: "MtiXQ0OcNRgys9ZxVgSw", // Pidgin is English-based — often sounds fine on a standard English voice
};

const FALLBACK_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George — used if a language has no ID set above

const VOICE_SETTINGS = {
  stability: 0.4,
  similarityBoost: 0.75,
  style: 0.3,
  useSpeakerBoost: true,
};

interface LanguageJob {
  key: string;
  label: string;
  translateCode?: string;
  hardcodedText?: string;
}

const LANGUAGES: LanguageJob[] = [
  { key: "yoruba", label: "Yoruba", translateCode: "yo" },
  { key: "igbo", label: "Igbo", translateCode: "ig" },
  { key: "hausa", label: "Hausa", translateCode: "ha" },
  {
    key: "pidgin",
    label: "Nigerian Pidgin",
    hardcodedText: "Make you stay compliant. Make you stay ahead.",
  },
];

async function translateText(text: string, targetLang: string, apiKey: string): Promise<string> {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, target: targetLang, format: "text" }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Translate API HTTP ${response.status}: ${body}`);
  }

  const data = await response.json();
  return data.data.translations[0].translatedText;
}

async function generateAudio(
  text: string,
  voiceId: string,
  outputPath: string,
  client: ElevenLabsClient
): Promise<number> {
  const audioStream = await client.textToSpeech.convert(voiceId, {
    text,
    modelId: "eleven_multilingual_v2",
    outputFormat: "mp3_44100_128",
    voiceSettings: VOICE_SETTINGS,
  });

  const reader = audioStream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  const audioBuffer = Buffer.concat(chunks);
  await writeFile(outputPath, audioBuffer);
  return audioBuffer.length;
}
/** Lists voices already added to your account — confirms an ID is valid before you hardcode it. */
async function listMyVoices(client: ElevenLabsClient) {
  console.log("=== Voices available on your account ===");
  try {
    const response = await client.voices.getAll();
    if (response.voices.length === 0) {
      console.log(
        "  (none yet — add voices from elevenlabs.io/app/voice-library first, " +
          "then re-run to see their IDs here)"
      );
    } else {
      for (const voice of response.voices) {
        console.log(`  ${voice.name} → ${voice.voiceId}`);
      }
    }
  } catch (err) {
    console.error(
      "  ✗ Couldn't list voices — check your API key has the 'Voices: Read' permission enabled " +
        "in ElevenLabs → Settings → API Keys."
    );
    console.error(`  ${(err as Error).message}`);
  }
  console.log();
}

async function main() {
  if (!GOOGLE_CLOUD_API_KEY) {
    console.error("✗ GOOGLE_CLOUD_API_KEY not found in .env.local");
    process.exit(1);
  }
  if (!ELEVENLABS_API_KEY) {
    console.error("✗ ELEVENLABS_API_KEY not found in .env.local");
    process.exit(1);
  }

  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  const elevenlabs = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });

  await listMyVoices(elevenlabs);

  console.log(`Source: "${SOURCE_TEXT}"\n`);

  for (const lang of LANGUAGES) {
    try {
      const text = lang.hardcodedText
        ? lang.hardcodedText
        : await translateText(SOURCE_TEXT, lang.translateCode!, GOOGLE_CLOUD_API_KEY);

      const voiceId = VOICE_IDS[lang.key] || FALLBACK_VOICE_ID;
      const usingFallback = !VOICE_IDS[lang.key];

      console.log(`${lang.label}: "${text}"`);
      console.log(`  Voice: ${voiceId}${usingFallback ? " (fallback — no dedicated voice set)" : ""}`);

      const outputPath = path.join(OUTPUT_DIR, `${lang.key}.mp3`);
      const bytes = await generateAudio(text, voiceId, outputPath, elevenlabs);

      console.log(`  ✓ Audio generated (${bytes} bytes) → ${outputPath}\n`);
    } catch (err) {
      console.error(`  ✗ ${lang.label} failed: ${(err as Error).message}\n`);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});