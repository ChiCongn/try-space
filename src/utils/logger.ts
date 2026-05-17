type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

interface SerializedError {
  message: string;
  name?: string;
  stack?: string;
}

interface LogEvent {
  app: string;
  context?: LogContext;
  environment: string;
  error?: SerializedError;
  event: string;
  level: LogLevel;
  release: string;
  sessionId: string;
  timestamp: string;
  url?: string;
  userAgent?: string;
}

const levelRank: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const sensitiveKeyPattern =
  /authorization|cookie|password|secret|token|refresh|access/i;

const logEndpoint = import.meta.env.VITE_LOG_ENDPOINT;
const logToConsole = import.meta.env.VITE_LOG_TO_CONSOLE === "true";
const configuredLevel = parseLogLevel(
  import.meta.env.VITE_LOG_LEVEL ?? (import.meta.env.PROD ? "warn" : "debug"),
);
const sampleRate = parseSampleRate(import.meta.env.VITE_LOG_SAMPLE_RATE);
const sessionId = createId("sess");

function parseLogLevel(value: string): LogLevel {
  if (value === "debug" || value === "info" || value === "warn" || value === "error") {
    return value;
  }

  return import.meta.env.PROD ? "warn" : "debug";
}

function parseSampleRate(value: string | undefined) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(1, Math.max(0, parsed));
}

function createId(prefix: string) {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}_${id}`;
}

function shouldLog(level: LogLevel) {
  if (levelRank[level] < levelRank[configuredLevel]) return false;
  if (level === "error" || level === "warn") return true;
  return Math.random() <= sampleRate;
}

function redact(value: unknown, depth = 0): unknown {
  if (depth > 5) return "[Truncated]";
  if (value instanceof Error) return serializeError(value);
  if (value === null || value === undefined) return value;
  if (typeof value !== "object") return value;

  if (Array.isArray(value)) {
    return value.map((item) => redact(item, depth + 1));
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      sensitiveKeyPattern.test(key) ? "[Redacted]" : redact(item, depth + 1),
    ]),
  );
}

function serializeError(error: unknown): SerializedError {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  }

  return { message: String(error) };
}

function toEvent(
  level: LogLevel,
  event: string,
  context?: LogContext,
  error?: unknown,
): LogEvent {
  return {
    app: "tryspace-web",
    context: context ? (redact(context) as LogContext) : undefined,
    environment: import.meta.env.MODE,
    error: error ? serializeError(error) : undefined,
    event,
    level,
    release:
      import.meta.env.VITE_RELEASE_VERSION ??
      import.meta.env.VITE_APP_VERSION ??
      "local",
    sessionId,
    timestamp: new Date().toISOString(),
    url: typeof window === "undefined" ? undefined : window.location.href,
    userAgent: typeof navigator === "undefined" ? undefined : navigator.userAgent,
  };
}

function writeTransport(logEvent: LogEvent) {
  if (!logEndpoint) return;

  const payload = JSON.stringify(logEvent);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const body = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(logEndpoint, body);
    return;
  }

  if (typeof fetch !== "undefined") {
    void fetch(logEndpoint, {
      body: payload,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      method: "POST",
    }).catch(() => undefined);
  }
}

function writeConsole(logEvent: LogEvent) {
  if (!logToConsole && import.meta.env.PROD) return;

  const payload = {
    context: logEvent.context,
    error: logEvent.error,
    event: logEvent.event,
    requestId:
      logEvent.context && typeof logEvent.context.requestId === "string"
        ? logEvent.context.requestId
        : undefined,
  };

  if (logEvent.level === "error") {
    console.error(logEvent.event, payload);
    return;
  }

  if (logEvent.level === "warn") {
    console.warn(logEvent.event, payload);
    return;
  }

  if (logEvent.level === "info") {
    console.info(logEvent.event, payload);
    return;
  }

  console.debug(logEvent.event, payload);
}

function log(level: LogLevel, event: string, context?: LogContext, error?: unknown) {
  if (!shouldLog(level)) return;

  const logEvent = toEvent(level, event, context, error);
  writeTransport(logEvent);
  writeConsole(logEvent);
}

export const logger = {
  debug: (event: string, context?: LogContext) => log("debug", event, context),
  error: (event: string, context?: LogContext, error?: unknown) =>
    log("error", event, context, error),
  info: (event: string, context?: LogContext) => log("info", event, context),
  requestId: () => createId("req"),
  sessionId,
  warn: (event: string, context?: LogContext, error?: unknown) =>
    log("warn", event, context, error),
};

export function initBrowserLogging() {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    logger.error(
      "browser.error",
      {
        colno: event.colno,
        filename: event.filename,
        lineno: event.lineno,
        message: event.message,
      },
      event.error ?? event.message,
    );
  });

  window.addEventListener("unhandledrejection", (event) => {
    logger.error(
      "browser.unhandled_rejection",
      { reason: String(event.reason) },
      event.reason,
    );
  });
}
