import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://f310a934560d8b1bbb388e8ce68e3bf5@o4509778000740352.ingest.de.sentry.io/4509820006629456",

  sendDefaultPii: true,
  integrations: [
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
