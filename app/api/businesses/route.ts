import { NextRequest, NextResponse } from "next/server";
import { adminCreateBusiness, adminGetBusinessByUserId } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-regulasphere-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await adminGetBusinessByUserId(userId);
    if (existing) {
      return NextResponse.json({ business: existing }); // idempotent — don't create duplicates
    }

    const body = await req.json();

    const business = await adminCreateBusiness({
      user_id: userId,
      business_name: body.business_name,
      rc_number: body.rc_number,
      tin: body.tin,
      sector: body.sector,
      state: body.state,
      employee_count: body.employee_count,
      annual_revenue: body.annual_revenue,
      data_processing: body.data_processing,
      has_foreign_operations: body.has_foreign_operations,
      is_fintech: body.is_fintech,
      uses_ai: body.uses_ai,
      ai_systems_description: body.ai_systems_description,
    });

    return NextResponse.json({ business });
  } catch (error: unknown) {
    console.error("Create business error:", error);
    return NextResponse.json({ error: "Failed to create business" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-regulasphere-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const business = await adminGetBusinessByUserId(userId);
    return NextResponse.json({ business });
  } catch (error: unknown) {
    console.error("Get business error:", error);
    return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 });
  }
}