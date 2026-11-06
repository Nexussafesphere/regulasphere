import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/nvidia";

const ANALYSIS_PROMPT = `You are RegulaSphere AI. Analyze this Nigerian business profile and generate a compliance roadmap.

Return valid JSON with this structure:
{
  "applicable_regulators": ["CAC", "NDPC", "NITDA", "NRS", "CBN"],
  "total_obligations": 12,
  "critical_obligations": 4,
  "high_priority": 5,
  "medium_priority": 3,
  "obligations": [
    {
      "title": "CAC Annual Returns Filing",
      "regulator": "CAC",
      "category": "CAC",
      "deadline": "2026-06-30",
      "priority": "Critical",
      "description": "File annual returns with Corporate Affairs Commission",
      "legal_basis": "CAMA 2020 Section 417",
      "penalty": "NGN 5,000 - NGN 50,000 per year of default",
      "remediation_steps": [
        "Login to CAC portal",
        "Fill Form CAC 10",
        "Pay filing fee",
        "Submit returns"
      ]
    }
  ],
  "recommended_consultants": [
    { "specialization": "CAC", "reason": "Annual returns filing assistance" }
  ],
  "risk_level": "High",
  "risk_score": 65
}`;

export async function POST(req: NextRequest) {
  try {
    const business = await req.json();

    if (!business || typeof business !== "object" || Array.isArray(business)) {
      return NextResponse.json({ error: "A valid business profile is required" }, { status: 400 });
    }

    const prompt = `Business Profile:
- Name: ${business.business_name}
- Sector: ${business.sector}
- Employees: ${business.employee_count}
- Revenue: ${business.annual_revenue}
- Data Processing: ${business.data_processing ? "Yes" : "No"}
- Uses AI: ${business.uses_ai ? "Yes" : "No"}
- AI Systems: ${business.ai_systems_description || "None"}
- Fintech: ${business.is_fintech ? "Yes" : "No"}
- Foreign Operations: ${business.has_foreign_operations ? "Yes" : "No"}
- RC Number: ${business.rc_number || "Not provided"}
- TIN: ${business.tin || "Not provided"}

Generate a complete compliance roadmap for this business.`;

    const content = await chatCompletion(
      [
        { role: "system", content: ANALYSIS_PROMPT },
        { role: "user", content: prompt },
      ],
      { temperature: 0.1, maxTokens: 4000, topP: 0.7 }
    );

    const cleaned = content.replace("```json", "").replace("```", "").trim() || "{}";

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}") + 1;
      result = JSON.parse(cleaned.substring(start, end));
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error(
      "Analysis Error:",
      error instanceof Error ? error.message : "Unknown AI provider error"
    );
    return NextResponse.json({ error: "Failed to analyze business" }, { status: 500 });
  }
}