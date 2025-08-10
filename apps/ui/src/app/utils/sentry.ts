import * as Sentry from "@sentry/nextjs";

type ContextData = Record<string, Record<string, boolean | number | string | null | undefined>>;
type TagsData = Record<string, string>;
type UserData = {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: boolean | number | string | null | undefined;
};

export const captureError = (
  error: Error | string,
  context?: ContextData,
  tags?: TagsData
) => {
  if (typeof error === "string") {
    Sentry.captureMessage(error, {
      level: "error",
      contexts: context,
      tags,
    });
  } else {
    Sentry.captureException(error, {
      contexts: context,
      tags,
    });
  }
};

export const captureInfo = (
  message: string,
  context?: ContextData,
  tags?: TagsData
) => {
  Sentry.captureMessage(message, {
    level: "info",
    contexts: context,
    tags,
  });
};

export const captureWarning = (
  message: string,
  context?: ContextData,
  tags?: TagsData
) => {
  Sentry.captureMessage(message, {
    level: "warning",
    contexts: context,
    tags,
  });
};

export const setGlobalTags = (tags: TagsData) => {
  Sentry.setTags(tags);
};

export const setGlobalContext = (context: Record<string, boolean | number | string | null | undefined>) => {
  Sentry.setContext("global", context);
};

export const setUser = (user: UserData) => {
  Sentry.setUser(user);
};

export const withErrorCapture = <T extends readonly unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context?: ContextData
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError(error as Error, context);
      throw error;
    }
  };
};
