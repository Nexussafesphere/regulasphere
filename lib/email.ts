const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const RESEND_BASE_URL = "https://api.resend.com/emails";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: EmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const body: Record<string, string | undefined> = {
    from: `RegulaSphere <${RESEND_FROM_EMAIL}>`,
    to,
    subject,
    html,
    "reply-to": replyTo || RESEND_FROM_EMAIL,
  };

  const response = await fetch(RESEND_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend email failed: ${JSON.stringify(error)}`);
  }

  return true;
}

export async function sendWelcomeEmail(
  to: string,
  userName: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #0B1120;">Welcome to RegulaSphere</h1>
      <p>Hello ${userName},</p>
      <p>Thank you for joining RegulaSphere. Your AI-powered compliance journey starts now.</p>
      <p>Get started by:</p>
      <ol>
        <li>Completing your business onboarding</li>
        <li>Reviewing your AI-generated compliance roadmap</li>
        <li>Uploading your compliance documents</li>
      </ol>
      <a href="https://regulasphere.ng/dashboard" style="background-color: #C9A84C; color: #0B1120; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">Go to Dashboard</a>
      <p style="color: #8A94A3; font-size: 12px; margin-top: 30px;">Nexus SafeSphere Technologies Limited</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: "Welcome to RegulaSphere",
    html,
  });
}

export async function sendComplianceAlertEmail(
  to: string,
  alertTitle: string,
  alertSummary: string,
  actionRequired: string,
  deadline?: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #C9A84C;">Compliance Alert</h1>
      <h2 style="color: #0B1120;">${alertTitle}</h2>
      <p>${alertSummary}</p>
      <p><strong>Action Required:</strong> ${actionRequired}</p>
      ${deadline ? `<p><strong>Deadline:</strong> ${deadline}</p>` : ""}
      <a href="https://regulasphere.ng/dashboard" style="background-color: #C9A84C; color: #0B1120; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">View Dashboard</a>
    </div>
  `;

  return sendEmail({
    to,
    subject: `[RegulaSphere] ${alertTitle}`,
    html,
  });
}

export async function sendDocumentVerifiedEmail(
  to: string,
  documentName: string,
  status: "Verified" | "Rejected" | "Needs Review"
): Promise<boolean> {
  const statusColor =
    status === "Verified" ? "#10B981" : status === "Rejected" ? "#EF4444" : "#F59E0B";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #0B1120;">Document Update</h1>
      <p>Your document <strong>${documentName}</strong> has been updated.</p>
      <p>Status: <span style="color: ${statusColor}; font-weight: bold;">${status}</span></p>
      <a href="https://regulasphere.ng/dashboard/documents" style="background-color: #C9A84C; color: #0B1120; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">View Documents</a>
    </div>
  `;

  return sendEmail({
    to,
    subject: `[RegulaSphere] Document ${status}`,
    html,
  });
}