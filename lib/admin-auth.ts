import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/policy";

export { isAdminEmail } from "@/lib/policy";

export async function getAdminSession(req: NextRequest) {
  const res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          res.cookies.delete({ name, ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { session, supabase, res };
}

export async function requireAdmin(req: NextRequest) {
  const { session } = await getAdminSession(req);

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!isAdminEmail(session.user.email)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return null;
}