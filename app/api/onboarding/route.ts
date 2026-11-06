import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, NVIDIA_SYSTEM_PROMPT } from "@/lib/nvidia";
import { adminCreateObligation } from "@/lib/supabase-admin";
import { canAccessBusiness } from "@/lib/tenant-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, businessProfile } = body;

    if (!businessId || !businessProfile) {
      return NextResponse.json(
        { error: "businessId and businessProfile are required" },
        { status: 400 }
      );
    }

    if (!(await canAccessBusiness(req, businessId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const prompt = `Analyze this Nigerian business profile and generate a compliance roadmap.

Business Profile:
${JSON.stringify(businessProfile, null, 2)}

Return a JSON array of compliance obligations with these fields:
{
  "title": "Short name of requirement",
  "regulator": "CAC | NDPC | NITDA | NRS | CBN | SEC | PENCOM | ITF | NSITF | NAFDAC",
  "description": "What the business must do",
  "legal_basis": "Specific law section",
  "deadline": "YYYY-MM-DD",
  "penalty": "Description of penalty",
  "category": "CAC | Data Protection | AI Governance | Tax | Licensing | Pension | Employment",
  "priority": "Critical | High | Medium | Low",
  "remediation_steps": ["step1", "step2", "step3"]
}`;

    const response = await chatCompletion(
      [
        { role: "system", content: NVIDIA_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      { temperature: 0.1, maxTokens: 4000 }
    );

    let obligations;

    try {
      const cleaned = response
        .replace("```json", "")
        .replace("```", "")
        .trim();
      const start = cleaned.indexOf("[");
      const end = cleaned.lastIndexOf("]") + 1;
      obligations = JSON.parse(cleaned.substring(start, end));
    } catch {
      obligations = [];
    }

    const createdObligations = [];

    for (const ob of obligations) {
      try {
        const created = await adminCreateObligation({
          business_id: businessId,
          title: ob.title,
          regulator: ob.regulator,
          description: ob.description,
          legal_basis: ob.legal_basis,
          deadline: ob.deadline,
          penalty: ob.penalty,
          category: ob.category,
          priority: ob.priority,
          status: "Pending",
          remediation_steps: ob.remediation_steps || [],
        });
        createdObligations.push(created);
      } catch (err) {
        console.error("Failed to create obligation:", err);
      }
    }

    return NextResponse.json({
      success: true,
      obligationsCreated: createdObligations.length,
      obligations: createdObligations,
    });
  } catch (error: unknown) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: "Onboarding failed" }, { status: 500 });
  }
}