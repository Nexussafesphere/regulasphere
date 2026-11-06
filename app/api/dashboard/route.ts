// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  adminGetBusiness,
  adminGetObligations,
  adminGetDocuments,
  adminGetAlerts,
  adminGetBusinessRiskAssessment,
  adminGetAgentActivities,
} from "@/lib/supabase-admin";
import { canAccessBusiness } from "@/lib/tenant-auth";

export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "businessId is required" }, { status: 400 });
  }

  if (!(await canAccessBusiness(req, businessId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [business, obligations, documents, alerts, risk, activities] =
      await Promise.all([
        adminGetBusiness(businessId),
        adminGetObligations(businessId),
        adminGetDocuments(businessId),
        adminGetAlerts(),
        adminGetBusinessRiskAssessment(businessId),
        adminGetAgentActivities(businessId),
      ]);

    const completed = (obligations as { status: string }[]).filter(
      (o) => o.status === "Completed"
    ).length;
    const total = obligations.length;
    const complianceScore = total > 0 ? Math.round((completed / total) * 100) : 0;

    return NextResponse.json({
      business, obligations, documents, alerts, risk, activities, complianceScore,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}