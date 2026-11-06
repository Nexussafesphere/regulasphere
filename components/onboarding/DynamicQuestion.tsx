"use client";

import type { OnboardingQuestion, OnboardingAnswers } from "@/lib/onboarding-questions";

interface Props {
  question: OnboardingQuestion;
  value: OnboardingAnswers[keyof OnboardingAnswers];
  onChange: (key: keyof OnboardingAnswers, value: string | number | boolean) => void;
}

export default function DynamicQuestion({ question, value, onChange }: Props) {
  const { key, label, helpText, type, options } = question;

  if (type === "boolean") {
    const boolValue = Boolean(value);
    return (
      <div className="flex items-center justify-between gap-3 py-2 md:py-3 border-b border-border last:border-none">
        <div className="min-w-0">
          <span className="text-xs sm:text-sm text-secondary block">{label}</span>
          {helpText && <span className="text-[10px] text-muted block mt-0.5">{helpText}</span>}
        </div>
        <button
          type="button"
          onClick={() => onChange(key, !boolValue)}
          className={`relative w-10 md:w-11 h-5 md:h-6 rounded-full transition-colors shrink-0 ${
            boolValue ? "bg-gold" : "bg-border"
          }`}
          aria-pressed={boolValue}
          aria-label={label}
        >
          <span
            className={`absolute top-0.5 w-4 md:w-5 h-4 md:h-5 rounded-full bg-white transition-all ${
              boolValue ? "left-5 md:left-5" : "left-0.5"
            }`}
          />
        </button>
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="w-full py-2">
        <label className="label">{label}</label>
        {helpText && <p className="text-[10px] text-muted mb-1">{helpText}</p>}
        <select
          className="select w-full"
          value={String(value ?? "")}
          onChange={(e) => onChange(key, e.target.value)}
        >
          {(options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "number") {
    return (
      <div className="w-full py-2">
        <label className="label">{label}</label>
        {helpText && <p className="text-[10px] text-muted mb-1">{helpText}</p>}
        <input
          type="number"
          className="input w-full"
          value={value === "" || value === undefined ? "" : String(value)}
          onChange={(e) => onChange(key, e.target.value === "" ? "" : Number(e.target.value))}
          min="0"
        />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="w-full py-2">
        <label className="label">{label}</label>
        {helpText && <p className="text-[10px] text-muted mb-1">{helpText}</p>}
        <textarea
          className="input w-full"
          rows={3}
          value={String(value ?? "")}
          onChange={(e) => onChange(key, e.target.value)}
        />
      </div>
    );
  }

  // "text" fallback
  return (
    <div className="w-full py-2">
      <label className="label">{label}</label>
      {helpText && <p className="text-[10px] text-muted mb-1">{helpText}</p>}
      <input
        type="text"
        className="input w-full"
        value={String(value ?? "")}
        onChange={(e) => onChange(key, e.target.value)}
      />
    </div>
  );
}
