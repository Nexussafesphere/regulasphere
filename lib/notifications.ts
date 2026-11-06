import { sendSMS, sendWhatsAppComplianceAlert } from "./termii";
import { sendComplianceAlertEmail } from "./email";
import { captureException } from "./sentry";

interface NotificationPayload {
  userId: string;
  phone?: string;
  email?: string;
  alertTitle: string;
  alertSummary: string;
  actionRequired: string;
  deadline?: string;
  channels: ("email" | "sms" | "whatsapp")[];
}

export async function sendNotification(
  payload: NotificationPayload
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];

  if (payload.channels.includes("email") && payload.email) {
    try {
      await sendComplianceAlertEmail(
        payload.email,
        payload.alertTitle,
        payload.alertSummary,
        payload.actionRequired,
        payload.deadline
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Email failed";
      errors.push(`Email: ${message}`);
      captureException(error, { channel: "email", userId: payload.userId });
    }
  }

  if (payload.channels.includes("whatsapp") && payload.phone) {
    try {
      await sendWhatsAppComplianceAlert(
        payload.phone,
        payload.alertTitle,
        payload.actionRequired
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "WhatsApp failed";
      errors.push(`WhatsApp: ${message}`);
      captureException(error, { channel: "whatsapp", userId: payload.userId });
    }
  }

  if (payload.channels.includes("sms") && payload.phone) {
    try {
      await sendSMS(
        payload.phone,
        `${payload.alertTitle} - ${payload.actionRequired}`
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "SMS failed";
      errors.push(`SMS: ${message}`);
      captureException(error, { channel: "sms", userId: payload.userId });
    }
  }

  return { success: errors.length === 0, errors };
}