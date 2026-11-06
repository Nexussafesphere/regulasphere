import { NextRequest, NextResponse } from "next/server";
import { getApiUser } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  const user = await getApiUser(req);
  const response = NextResponse.json({ success: true });
  response.cookies.delete("sb-access-token");
  response.cookies.delete("sb-refresh-token");
  if (!user) return response;
  return response;
}