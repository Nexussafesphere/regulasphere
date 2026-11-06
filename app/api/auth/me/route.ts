import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (userError) {
      return NextResponse.json({ user: null }, { status: 500 });
    }

    return NextResponse.json({ user: userData });
  } catch {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}