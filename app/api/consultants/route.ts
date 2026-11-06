import { NextRequest, NextResponse } from "next/server";
import {
  adminGetConsultants,
  adminCreateAssignment,
} from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const specialization = searchParams.get("specialization") || undefined;

    const consultants = await adminGetConsultants();

    if (specialization && specialization !== "All") {
      const filtered = (consultants as unknown[]).filter((c) =>
        (c as { specialization: string[] }).specialization?.includes(
          specialization
        )
      );
      return NextResponse.json({ consultants: filtered });
    }

    return NextResponse.json({ consultants });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch consultants";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, consultantId, obligationId } = body;

    if (!businessId || !consultantId) {
      return NextResponse.json(
        { error: "businessId and consultantId are required" },
        { status: 400 }
      );
    }

    const assignment = await adminCreateAssignment(
      businessId,
      consultantId,
      obligationId
    );

    return NextResponse.json({ assignment });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to assign consultant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}