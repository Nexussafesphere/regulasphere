import { NextRequest, NextResponse } from "next/server";
import {
  adminGetAlerts,
  adminCreateAlert,
} from "@/lib/supabase-admin";

export async function GET() {
  try {
    const alerts = await adminGetAlerts();

    return NextResponse.json({ alerts });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch alerts";
    console.error("Alerts Error:", message);
    return NextResponse.json(
      { error: "Failed to fetch alerts", details: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, regulator, summary, actionRequired, deadline, severity, affectedSectors } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const alert = await adminCreateAlert({
      title,
      regulator: regulator || null,
      summary: summary || null,
      action_required: actionRequired || null,
      deadline: deadline || null,
      severity: severity || "Medium",
      affected_sectors: affectedSectors || [],
      is_ai_generated: true,
    });

    return NextResponse.json({ alert });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create alert";
    console.error("Alert Creation Error:", message);
    return NextResponse.json(
      { error: "Failed to create alert", details: message },
      { status: 500 }
    );
  }
}