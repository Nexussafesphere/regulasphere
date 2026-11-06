import * as Sentry from "@sentry/nextjs";

export function initSentry(): void {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.5,
      environment: process.env.NODE_ENV || "development",
      beforeSend(event: Sentry.ErrorEvent) {
        if (event.request?.data) {
          const data = event.request.data as Record<string, unknown>;
          delete data.password;
          delete data.password_hash;
          delete data.rc_number;
          delete data.tin;
        }
        return event;
      },
    });
  }
}

export function captureException(
  error: unknown,
  context?: Record<string, unknown>
): void {
  Sentry.captureException(error, {
    extra: context,
  });
}

export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: Record<string, unknown>
): void {
  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}