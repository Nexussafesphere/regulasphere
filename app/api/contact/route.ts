import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { cacheGet, cacheSet } from "@/lib/redis";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z
    .string()
    .trim()
    .min(3)
    .max(150)
    .refine((value) => !/[\r\n]/.test(value)),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(),
});

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

export async function POST(req: NextRequest) {
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide valid contact details." }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ipAddress) {
    const rateLimitKey = `contact-rate:${ipAddress}`;
    const requestCount = Number(await cacheGet(rateLimitKey)) || 0;
    if (requestCount >= 5) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }
    await cacheSet(rateLimitKey, String(requestCount + 1), 3600);
  }

  const { name, email, subject, message } = parsed.data;
  const html = `<p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;

  try {
    await sendEmail({
      to: process.env.CONTACT_EMAIL || "nexusafesphere@outlook.com",
      subject: `[RegulaSphere Contact] ${subject}`,
      html,
      replyTo: email,
    });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Contact form delivery failed:", error);
    return NextResponse.json(
      { error: "We could not send your message. Please try again or email us directly." },
      { status: 502 }
    );
  }
}