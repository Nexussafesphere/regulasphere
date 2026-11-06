import { NextRequest, NextResponse } from "next/server";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      phone,
      email,
      alertTitle,
      alertSummary,
      actionRequired,
      deadline,
      channels,
    } = body;

    if (
      typeof userId !== "string" ||
      typeof alertTitle !== "string" ||
      alertTitle.length > 200 ||
      !Array.isArray(channels) ||
      channels.length === 0 ||
      channels.some((channel: unknown) => !["email", "sms"].includes(String(channel)))
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await sendNotification({
      userId,
      phone,
      email,
      alertTitle,
      alertSummary,
      actionRequired,
      deadline,
      channels,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Notification Error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}