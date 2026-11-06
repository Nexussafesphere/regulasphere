import { NextRequest, NextResponse } from "next/server";
import { adminGetObligations } from "@/lib/supabase-admin";
import { canAccessBusiness } from "@/lib/tenant-auth";
import { computeFrameworkRiskScores } from "@/lib/risk-scoring";

export async function GET(req: NextRequest) {
  try {
    const businessId = req.nextUrl.searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 });
    }

    if (!(await canAccessBusiness(req, businessId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const obligations = await adminGetObligations(businessId);

    const scores = computeFrameworkRiskScores(
      obligations.map((o) => ({
        regulator: o.regulator,
        status: o.status || "Pending",
        priority: o.priority,
      }))
    );

    return NextResponse.json({ scores });
  } catch (error: unknown) {
    console.error("Risk score error:", error);
    return NextResponse.json({ error: "Failed to compute risk scores" }, { status: 500 });
  }
}