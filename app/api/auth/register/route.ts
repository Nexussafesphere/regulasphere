import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isValidUserType } from "@/lib/policy";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, full_name, user_type, phone } = body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof full_name !== "string" ||
      !isValidUserType(user_type) ||
      email.length > 254 ||
      password.length < 8 ||
      password.length > 128 ||
      full_name.trim().length < 2 ||
      full_name.length > 120 ||
      (phone !== undefined && (typeof phone !== "string" || phone.length > 30))
    ) {
      return NextResponse.json({ error: "Invalid registration details" }, { status: 400 });
    }

    if (!email || !password || !full_name || !user_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Registration failed" },
        { status: 500 }
      );
    }

    const { data: userData, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email,
        user_type,
        full_name,
        phone: phone || null,
      })
      .select()
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user: userData
        ? {
            id: userData.id,
            email: userData.email,
            user_type: userData.user_type,
            full_name: userData.full_name,
            phone: userData.phone,
          }
        : null,
    });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}