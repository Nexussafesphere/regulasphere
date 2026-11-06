interface TermiiMessage {
  to: string;
  from: string;
  sms: string;
  type?: "plain" | "unicode";
  channel?: "generic" | "dnd" | "whatsapp";
}

interface TermiiResponse {
  message_id: string;
  message: string;
  balance: number;
  user: string;
}

const TERMII_API_KEY = process.env.TERMII_API_KEY;
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || "RegulaSphere";
const TERMII_BASE_URL = "https://api.ng.termii.com/api";

export async function sendSMS(
  to: string,
  message: string,
  channel: "generic" | "dnd" | "whatsapp" = "generic"
): Promise<TermiiResponse | null> {
  if (!TERMII_API_KEY) {
    throw new Error("TERMII_API_KEY is not set");
  }

  const body: TermiiMessage = {
    to,
    from: TERMII_SENDER_ID,
    sms: message,
    type: "plain",
    channel,
  };

  const response = await fetch(`${TERMII_BASE_URL}/sms/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TERMII_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Termii SMS failed: ${JSON.stringify(error)}`);
  }

  return response.json();
}

export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<TermiiResponse | null> {
  return sendSMS(to, message, "whatsapp");
}

export async function sendComplianceAlert(
  phone: string,
  alertTitle: string,
  deadline?: string
): Promise<TermiiResponse | null> {
  const message = `RegulaSphere Alert: ${alertTitle}${
    deadline ? ` | Deadline: ${deadline}` : ""
  }. Log in to your dashboard for details.`;

  return sendSMS(phone, message, "dnd");
}

export async function sendWhatsAppComplianceAlert(
  phone: string,
  alertTitle: string,
  actionRequired: string
): Promise<TermiiResponse | null> {
  const message = `*RegulaSphere Alert*\n\n${alertTitle}\n\nAction Required: ${actionRequired}\n\nLog in to your dashboard: https://regulasphere.ng/dashboard`;

  return sendWhatsAppMessage(phone, message);
}