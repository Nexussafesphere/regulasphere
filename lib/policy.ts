export const USER_TYPES = ["Business", "Consultant", "Regulator"] as const;
export type UserType = (typeof USER_TYPES)[number];

export const POLICY_VERSION = "2026-08-23";

export const ADMIN_EMAILS = [
  "nexussafesphere@outlook.com",
  "nexusafesphere@outlook.com",
] as const;

export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/privacy",
  "/contact",
  "/login",
  "/signin",
  "/register",
  "/getstarted",
] as const;

export const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/contact",
] as const;

export function isAdminEmail(email: string | null | undefined): boolean {
  return email ? ADMIN_EMAILS.includes(email.toLowerCase() as (typeof ADMIN_EMAILS)[number]) : false;
}

export function isValidUserType(value: unknown): value is UserType {
  return typeof value === "string" && USER_TYPES.includes(value as UserType);
}
