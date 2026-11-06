# RegulaSphere

AI-Powered Compliance Operating System for Nigerian Businesses

## Overview

RegulaSphere is a production-grade compliance platform that helps Nigerian SMEs avoid regulatory fines through proactive AI monitoring, document verification, and consultant collaboration. Built by Nexus SafeSphere Technologies Limited.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| AI | Meta Llama 3 via NVIDIA API |
| Translation | Google Cloud Translation API |
| Text-to-Speech | Google Cloud TTS |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel |

## Key Features

- Business onboarding with AI-generated compliance roadmap
- Compliance tracking across 10 Nigerian regulators
- Document upload and verification
- Consultant marketplace
- Regulator SupTech dashboard
- AI chat assistant with multilingual support
- Compliance report generation
- Risk assessment engine

## Regulators Covered

- NDPC (Nigeria Data Protection Commission)
- NITDA (National Information Technology Development Agency)
- CAC (Corporate Affairs Commission)
- FIRS (Federal Inland Revenue Service)
- CBN (Central Bank of Nigeria)
- SEC (Securities and Exchange Commission)
- PENCOM (National Pension Commission)
- ITF (Industrial Training Fund)
- NSITF (Nigeria Social Insurance Trust Fund)
- NAFDAC (National Agency for Food and Drug Administration)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- NVIDIA API key
- Google Cloud API key

### Installation

```bash
git clone https://github.com/zeenah-yusuf/regulasphere.git
cd regulasphere
npm install --legacy-peer-deps
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your API keys and Supabase credentials.

### Database Setup

Run the SQL migrations in this order:

1. `sql/schema.sql` - Create tables
2. `sql/rls_policies-functions.sql` - RLS and functions
3. `sql/seed_data.sql` - Seed remediation checklists

For an existing Supabase database, do not rerun `sql/schema.sql` because it contains clean-install table drops. Apply `sql/migrations/2026-08-23-policy-and-auth.sql` instead.

`sql/functions.sql` is retained for reference only. Do not run it after `sql/rls_policies-functions.sql`; the canonical function definitions and return shapes are in the latter file.

### Policy as Code

Security and data-access rules are version-controlled and enforced in both the application and PostgreSQL. The typed policy source is `lib/policy.ts`; request authentication and tenant authorization are enforced by `middleware.ts`, `lib/api-auth.ts`, and `lib/tenant-auth.ts`; database isolation is enforced by `sql/rls_policies-functions.sql`.

Run the policy consistency check before deployment:

```bash
npm run policy:check
```

See [docs/POLICY_AS_CODE.md](docs/POLICY_AS_CODE.md) for the rules, review process, and database rollout steps.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```text
regulasphere/
├── app/
│   ├── api/
│   │   ├── agent/
│   │   ├── alerts/
│   │   ├── analyze-business/
│   │   ├── chat/
│   │   ├── documents/
│   │   ├── onboarding/
│   │   ├── reports/
│   │   └── translate/
│   ├── dashboard/
│   │   ├── chat/
│   │   ├── consultants/
│   │   ├── documents/
│   │   ├── obligations/
│   │   ├── reports/
│   │   └── page.tsx
│   ├── consultant/
│   │   ├── assignments/
│   │   ├── clients/
│   │   ├── verify/
│   │   └── page.tsx
│   ├── regulator/
│   │   ├── analytics/
│   │   ├── watchlist/
│   │   └── page.tsx
│   ├── onboarding/
│   │   └── page.tsx
│   ├── marketplace/
│   │   └── page.tsx
│   ├── documents/
│   │   └── page.tsx
│   ├── reports/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── QuickActions.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── TextToSpeech.tsx
│   ├── dashboard/
│   │   ├── ComplianceScore.tsx
│   │   ├── ObligationsList.tsx
│   │   ├── AIInsightsFeed.tsx
│   │   ├── DeadlineCalendar.tsx
│   │   ├── SummaryCards.tsx
│   │   └── AlertsPanel.tsx
│   ├── documents/
│   │   ├── DocumentUpload.tsx
│   │   ├── DocumentCard.tsx
│   │   ├── VerificationBadge.tsx
│   │   └── VerificationQueue.tsx
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── LanguageProvider.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Badge.tsx
│       ├── Tabs.tsx
│       ├── Dropdown.tsx
│       └── Toast.tsx
├── lib/
│   ├── auth.ts
│   ├── compliance.ts
│   ├── constants.ts
│   ├── google.ts
│   ├── nvidia.ts
│   ├── supabase-admin.ts
│   ├── supabase.ts
│   └── utils.ts
├── scripts/
│   ├── build_datasets.py
│   ├── extract_pdfs.py
│   ├── load_to_supabase.py
│   ├── monitor_regulators.py
│   └── translate_dataset.py
├── sql/
│   ├── schema.sql
│   ├── rls_policies-functions.sql
│   └── seed_data.sql
├── docs/
│   └── POLICY_AS_CODE.md
├── types/
│   └── index.ts
├── public/
│   └── images/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Testing

```bash
npm run lint
npm run type-check
```

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

## License

Proprietary. All rights reserved. Nexus SafeSphere Technologies Limited.

## Support

For support, email nexusafesphere@outlook.com