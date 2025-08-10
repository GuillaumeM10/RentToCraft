import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://f310a934560d8b1bbb388e8ce68e3bf5@o4509778000740352.ingest.de.sentry.io/4509820006629456",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === "development",
});
