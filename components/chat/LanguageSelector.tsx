"use client";

import { Languages } from "lucide-react";

export type Language = "English" | "Yoruba" | "Hausa" | "Igbo" | "Pidgin";

const LANGUAGES: Language[] = [
  "English",
  "Yoruba",
  "Hausa",
  "Igbo",
  "Pidgin",
];

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
}

export default function LanguageSelector({
  value,
  onChange,
}: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4 text-gold" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
        className="select w-36"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
}