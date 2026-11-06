# META.md

## Project: RegulaSphere

AI-Powered Compliance Operating System for Nigerian Businesses

## AI Stack

- **Primary Model:** Meta Llama 3.3 70B (via NVIDIA API)
- **Alternative Provider:** Groq (Llama 3.1 70B)
- **Embeddings:** (Planned - for semantic search over regulatory documents)
- **Fine-tuning:** (Planned - on Nigerian legal corpus)

## Role

You are assisting in building RegulaSphere, a production-grade compliance platform powered by Meta Llama 3.
You must always provide intentional, production-ready code with no placeholders,
no emojis, no unused imports, and proper TypeScript types.

## Coding Standards

1. Use TypeScript strict mode
2. No `any` types - always define interfaces
3. Use Lucide React icons (never emojis)
4. Use `useRef` guard for data-loading effects
5. Use `useCallback` for memoized functions
6. Error handling with `error: unknown` pattern
7. Every prop must be used
8. Every import must be used
9. No impure functions during render (e.g., `Date.now()`)
10. Use `useRouter().push()` for navigation (not `window.location`)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (PostgreSQL)
- Meta Llama 3 via NVIDIA API (primary)
- Groq (alternative LLM provider)
- Google Cloud Translation/TTS
- Tailwind CSS
- Recharts
- Lucide React

## Llama 3 Integration

### Model Configuration

```typescript
const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

const completion = await client.chat.completions.create({
  model: "meta/llama-3.3-70b-instruct",
  messages: [...],
  temperature: 0.2,
  max_tokens: 2048,
  top_p: 0.7,
});
System Prompt
The AI agent (RegulaSphere AI) must:

Provide accurate Nigerian regulatory guidance

Cite specific laws (CAMA 2020, NDPA 2023, NITDA AI Framework)

State exact penalties in Naira

Provide step-by-step remediation

Support English, Yoruba, Hausa, Igbo, and Pidgin

Be proactive and actionable

Use plain English for SME owners

Regulatory Knowledge
The AI agent covers these Nigerian regulators:
NDPC, NITDA, CAC, FIRS, CBN, SEC, PENCOM, ITF, NSITF, NAFDAC

Key Laws:

CAMA 2020

NDPA 2023

NITDA AI Governance Framework

CBN Guidelines

SEC ISA 2025

FIRS Tax Act 2025

PENCOM PRA 2014

NSITF ECA 2010

ITF Act

NAFDAC Regulations

Dataset
The dataset is built from 70+ regulatory PDFs across 9 regulators.

Processing pipeline:

extract_pdfs.py - Extract text from PDFs

build_datasets.py - Use Llama 3 to extract structured obligations

translate_dataset.py - Generate multilingual translations

load_to_supabase.py - Load into Supabase

Output files:

data/regulatory_obligations.json - Structured obligations

data/training_examples.json - Q&A pairs

data/multilingual_translations.json - Yoruba, Hausa, Igbo, Pidgin

File Structure
Key directories:

app/ - Pages and API routes

components/ - Reusable components

lib/ - Core logic and clients

types/ - TypeScript interfaces

scripts/ - Python scripts for dataset

sql/ - Database migrations

data/ - Extracted regulatory text

When Generating Code
Always:

Include proper imports

Define interfaces for props

Handle loading and error states

Add proper TypeScript return types

Use Lucide icons

Follow the established patterns

Never:

Use any types

Use emojis in code

Leave unused imports

Call impure functions during render

Use window.location for navigation

Skip error handling

Omit loading states

Testing
Before submitting code, verify:

TypeScript compiles without errors

ESLint passes

All imports are used

All props are used

No any types

Proper error handling

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
