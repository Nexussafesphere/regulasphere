// lib/onboarding-questions.ts
//
// Sector-adaptive question bank for onboarding. Each question:
//   - maps directly to a column on the `businesses` table (via `key`)
//   - is tagged with a `regulator` + `category`, so later risk-scoring can
//     group "which questions/obligations belong to which framework"
//   - has an optional `showIf`, evaluated against answers collected SO FAR
//     in the current session, to decide whether to render it
//
// This keeps the questionnaire in sync with:
//   - the `businesses` table schema (no new columns needed for this pass)
//   - lib/policy-engine.ts's Business interface (same field names)

export type QuestionType = "boolean" | "number" | "select" | "textarea" | "text";

export interface OnboardingAnswers {
  businessName: string;
  rcNumber: string;
  tin: string;
  sector: string;
  state: string;
  employeeCount: number | "";
  annualRevenue: string;
  dataProcessing: boolean;
  hasSensitiveData: boolean;
  hasCrossBorderTransfer: boolean;
  dataSubjectsCount: number | "";
  hasDataProtectionOfficer: boolean;
  dpcoEngaged: boolean;
  hasForeignOperations: boolean;
  isFintech: boolean;
  usesAI: boolean;
  aiSystemsDescription: string;
}

export const initialAnswers: OnboardingAnswers = {
  businessName: "",
  rcNumber: "",
  tin: "",
  sector: "Fintech",
  state: "Lagos",
  employeeCount: "",
  annualRevenue: "Under 25M",
  dataProcessing: false,
  hasSensitiveData: false,
  hasCrossBorderTransfer: false,
  dataSubjectsCount: "",
  hasDataProtectionOfficer: false,
  dpcoEngaged: false,
  hasForeignOperations: false,
  isFintech: false,
  usesAI: false,
  aiSystemsDescription: "",
};

export interface OnboardingQuestion {
  key: keyof OnboardingAnswers;
  label: string;
  helpText?: string;
  type: QuestionType;
  options?: string[];
  regulator: string;   // which framework this feeds into for risk scoring
  category: string;
  /** Return true to show this question, given answers collected so far. */
  showIf?: (answers: OnboardingAnswers) => boolean;
}

export const SECTORS = [
  "Fintech",
  "Healthcare",
  "Manufacturing",
  "Agriculture",
  "Trading",
  "Technology",
  "Construction",
  "Education",
  "Other",
];

export const STATES = [
  "Lagos", "Abuja", "Ogun", "Oyo", "Rivers", "Kano", "Kaduna", "Enugu", "Other",
];

export const REVENUE_OPTIONS = ["Under 25M", "25M-100M", "100M-500M", "Over 500M"];

// Questions rendered after core company info (name/RC/TIN/sector/state) is filled in.
// Order matters — earlier questions can unlock later ones via showIf.
export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    key: "employeeCount",
    label: "Number of employees",
    type: "number",
    regulator: "General",
    category: "Company Profile",
  },
  {
    key: "annualRevenue",
    label: "Annual revenue",
    type: "select",
    options: REVENUE_OPTIONS,
    regulator: "General",
    category: "Company Profile",
  },
  {
    key: "dataProcessing",
    label: "Do you process personal data (customer or employee records, contact details, etc.)?",
    type: "boolean",
    regulator: "NDPC",
    category: "Data Protection",
  },

  // --- Unlocked only if dataProcessing = true ---
  {
    key: "hasSensitiveData",
    label: "Do you process sensitive personal data (health, biometric, financial, or genetic data)?",
    type: "boolean",
    regulator: "NDPC",
    category: "Data Protection",
    showIf: (a) => a.dataProcessing,
  },
  {
    key: "dataSubjectsCount",
    label: "Roughly how many individuals' data do you hold?",
    helpText: "A rough estimate is fine — this affects which NDPC thresholds apply to you.",
    type: "number",
    regulator: "NDPC",
    category: "Data Protection",
    showIf: (a) => a.dataProcessing,
  },
  {
    key: "hasCrossBorderTransfer",
    label: "Do you transfer personal data outside Nigeria (e.g. cloud servers, foreign vendors)?",
    type: "boolean",
    regulator: "NDPC",
    category: "Data Protection",
    showIf: (a) => a.dataProcessing,
  },
  {
    key: "hasDataProtectionOfficer",
    label: "Have you appointed a Data Protection Officer?",
    type: "boolean",
    regulator: "NDPC",
    category: "Data Protection",
    showIf: (a) => a.dataProcessing,
  },
  {
    key: "dpcoEngaged",
    label: "Have you engaged a licensed Data Protection Compliance Organisation (DPCO)?",
    type: "boolean",
    regulator: "NDPC",
    category: "Data Protection",
    showIf: (a) => a.dataProcessing,
  },

  // --- Sector-specific ---
  {
    key: "isFintech",
    label: "Are you a fintech or financial services company?",
    type: "boolean",
    regulator: "CBN",
    category: "Licensing",
    showIf: (a) => a.sector === "Fintech" || a.sector === "Technology",
  },

  // --- AI usage — asked broadly since NITDA's AI governance framework is general-purpose ---
  {
    key: "usesAI",
    label: "Do you use AI systems in your operations (chatbots, credit scoring, automation, etc.)?",
    type: "boolean",
    regulator: "NITDA",
    category: "AI Governance",
  },
  {
    key: "aiSystemsDescription",
    label: "Briefly describe your AI systems",
    type: "textarea",
    regulator: "NITDA",
    category: "AI Governance",
    showIf: (a) => a.usesAI,
  },

  {
    key: "hasForeignOperations",
    label: "Do you operate outside Nigeria?",
    type: "boolean",
    regulator: "General",
    category: "Company Profile",
  },
];

/** Returns only the questions that should currently be visible, given answers so far. */
export function getVisibleQuestions(answers: OnboardingAnswers): OnboardingQuestion[] {
  return ONBOARDING_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}