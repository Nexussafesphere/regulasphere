import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

interface ApiUser {
  id: string;
  email?: string;
}

function getAccessToken(req: NextRequest): string | null {
  const authorization = req.headers.get("authorization");
  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim() || null;
  }

  return req.cookies.get("sb-access-token")?.value || null;
}

export async function getApiUser(req: NextRequest): Promise<ApiUser | null> {
  const accessToken = getAccessToken(req);
  if (!accessToken) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const client = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await client.auth.getUser(accessToken);

  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email };
}

export async function requireApiUser(
  req: NextRequest
): Promise<{ user: ApiUser } | { response: NextResponse }> {
  const user = await getApiUser(req);
  if (!user) {
    return {
      response: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
    };
  }
  return { user };
}

export function isApiAuthResult(
  result: { user: ApiUser } | { response: NextResponse }
): result is { response: NextResponse } {
  return "response" in result;
}
