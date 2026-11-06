import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/admin-auth";
import { z } from "zod";

const DEFAULT_SETTINGS = {
  platform_name: "RegulaSphere",
  support_email: "nexusafesphere@outlook.com",
  admin_email: "nexussafesphere@outlook.com",
  auto_verify_businesses: false,
  auto_verify_consultants: false,
  email_notifications: true,
  push_notifications: true,
  maintenance_mode: false,
  ai_enabled: true,
  max_file_size: 10,
  default_language: "English",
};

const settingsSchema = z.object({
  platform_name: z.string().trim().min(1).max(100),
  support_email: z.string().email(),
  admin_email: z.string().email(),
  auto_verify_businesses: z.boolean(),
  auto_verify_consultants: z.boolean(),
  email_notifications: z.boolean(),
  push_notifications: z.boolean(),
  maintenance_mode: z.boolean(),
  ai_enabled: z.boolean(),
  max_file_size: z.number().int().min(1).max(1000),
  default_language: z.enum(["English", "Yoruba", "Hausa", "Igbo", "Pidgin"]),
});

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const userEmail = req.headers.get("x-regulasphere-user-email");

    if (!userEmail || !isAdminEmail(userEmail)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("platform_settings")
      .select("settings")
      .eq("singleton", true)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const settings = settingsSchema.safeParse(data?.settings);
    return NextResponse.json({ data: settings.success ? settings.data : DEFAULT_SETTINGS });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const userEmail = req.headers.get("x-regulasphere-user-email");

    if (!userEmail || !isAdminEmail(userEmail)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid platform settings" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("platform_settings")
      .upsert({
        singleton: true,
        settings: parsed.data,
        updated_at: new Date().toISOString(),
      })
      .select("settings")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data.settings });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}