"use client";

import { useState } from "react";
import { Volume2, Square } from "lucide-react";

interface TextToSpeechProps {
  text: string;
  language?: string;
}

export default function TextToSpeech({
  text,
  language = "English",
}: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        language === "Yoruba"
          ? "yo-NG"
          : language === "Hausa"
          ? "ha-NG"
          : language === "Igbo"
          ? "ig-NG"
          : "en-NG";
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <button
      onClick={isSpeaking ? stop : speak}
      className="text-xs text-gold flex items-center gap-1 hover:underline"
    >
      {isSpeaking ? (
        <>
          <Square className="w-3 h-3" /> Stop
        </>
      ) : (
        <>
          <Volume2 className="w-3 h-3" /> Listen
        </>
      )}
    </button>
  );
}