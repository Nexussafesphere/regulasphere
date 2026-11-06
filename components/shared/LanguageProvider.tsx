"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Language = "English" | "Yoruba" | "Hausa" | "Igbo" | "Pidgin";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  languageCode: string;
}

const LANGUAGES: Language[] = ["English", "Yoruba", "Hausa", "Igbo", "Pidgin"];

const LANGUAGE_CODES: Record<Language, string> = {
  English: "en-NG",
  Yoruba: "yo-NG",
  Hausa: "ha-NG",
  Igbo: "ig-NG",
  Pidgin: "en-NG",
};

const STORAGE_KEY = "regulasphere_language";

function getSavedLanguage(): Language {
  if (typeof window === "undefined") return "English";

  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved && LANGUAGES.includes(saved as Language)) {
    return saved as Language;
  }

  return "English";
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "English",
  setLanguage: () => {},
  languageCode: "en-NG",
});

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}

interface LanguageProviderProps {
  children: ReactNode;
}

export default function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() =>
    getSavedLanguage()
  );

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = LANGUAGE_CODES[lang];
  }, []);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    languageCode: LANGUAGE_CODES[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LANGUAGES, LANGUAGE_CODES };