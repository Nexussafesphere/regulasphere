import { NextRequest, NextResponse } from "next/server";
import {
  adminGetObligations,
  adminUpdateObligation,
} from "@/lib/supabase-admin";
import { canAccessBusiness, canAccessObligation } from "@/lib/tenant-auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId is required" },
        { status: 400 }
      );
    }

    if (!(await canAccessBusiness(req, businessId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const obligations = await adminGetObligations(businessId);

    return NextResponse.json({ obligations });
  } catch (error: unknown) {
    console.error("Obligations Error:", error);
    return NextResponse.json({ error: "Failed to fetch obligations" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { obligationId, status } = body;

    if (!obligationId || !status) {
      return NextResponse.json(
        { error: "obligationId and status are required" },
        { status: 400 }
      );
    }

    if (!(await canAccessObligation(req, obligationId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validStatuses = [
      "Pending",
      "In Progress",
      "Completed",
      "Overdue",
      "Under Review",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const obligation = await adminUpdateObligation(obligationId, { status });

    return NextResponse.json({ obligation });
  } catch (error: unknown) {
    console.error("Obligation update error:", error);
    return NextResponse.json({ error: "Failed to update obligation" }, { status: 500 });
  }
}