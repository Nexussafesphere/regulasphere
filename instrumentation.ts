import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.5,
      environment: process.env.NODE_ENV || "development",
    });
  }
}

export const onRequestError = Sentry.captureRequestError;