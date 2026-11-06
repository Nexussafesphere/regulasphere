import { NextResponse, type NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { isAdminEmail, PUBLIC_API_ROUTES, PUBLIC_ROUTES } from "@/lib/policy";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/")) {
    if (PUBLIC_API_ROUTES.includes(path as (typeof PUBLIC_API_ROUTES)[number])) {
      return NextResponse.next();
    }

    const user = await getApiUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (path.startsWith("/api/admin/") && !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-regulasphere-user-id", user.id);
    if (user.email) requestHeaders.set("x-regulasphere-user-email", user.email);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Check for Supabase session cookies
  const accessToken = req.cookies.get("sb-access-token")?.value;
  const refreshToken = req.cookies.get("sb-refresh-token")?.value;
  const hasSession = Boolean(accessToken || refreshToken);

  const authPaths = ["/login", "/register", "/signin", "/getstarted"];
  
  const isPublic = PUBLIC_ROUTES.some((p) => path === p);
  const isAuthPath = authPaths.some((p) => path === p);

  // If no session and trying to access protected page, redirect to login
  if (!hasSession && !isPublic && !isAuthPath) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};