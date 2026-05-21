function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function responseData(caught: unknown): unknown {
  if (!isRecord(caught) || !isRecord(caught.response)) return undefined;

  return caught.response.data;
}

function cleanMessage(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const message = value.trim();
  return message.length > 0 ? message : undefined;
}

function fieldName(value: Record<string, unknown>): string | undefined {
  return (
    cleanMessage(value.field) ??
    cleanMessage(value.property) ??
    cleanMessage(value.path) ??
    cleanMessage(value.param)
  );
}

function collectLooseMessages(value: unknown): string[] {
  const message = cleanMessage(value);
  if (message) return [message];

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectLooseMessages(item));
  }

  if (!isRecord(value)) return [];

  return Object.values(value).flatMap((item) => collectLooseMessages(item));
}

function collectMessageValues(value: unknown): string[] {
  const message = cleanMessage(value);
  if (message) return [message];

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectMessageValues(item));
  }

  if (!isRecord(value)) return [];

  const messages = [
    ...collectMessageValues(value.message),
    ...collectMessageValues(value.messages),
    ...collectMessageValues(value.msg),
    ...collectMessageValues(value.reason),
    ...collectMessageValues(value.description),
    ...collectMessageValues(value.detail),
    ...collectMessageValues(value.title),
  ];

  return messages;
}

function collectFieldMessages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectFieldMessages(item));
  }

  if (!isRecord(value)) return collectMessageValues(value);

  const field = fieldName(value);
  const messages = [
    ...collectMessageValues(value),
    ...collectLooseMessages(value.constraints),
    ...collectFieldMessages(value.children),
  ];

  if (messages.length > 0) {
    return field ? messages.map((item) => `${field}: ${item}`) : messages;
  }

  if (field) {
    return [];
  }

  return Object.entries(value).flatMap(([field, fieldValue]) =>
    collectMessageValues(fieldValue).map((message) => `${field}: ${message}`),
  );
}

function uniqueMessages(messages: string[]) {
  return Array.from(new Set(messages));
}

function collectResponseMessages(data: unknown) {
  if (!isRecord(data)) return collectMessageValues(data);

  const error = data.error;
  const errorMessages = isRecord(error) ? [] : collectMessageValues(error);
  const messages: string[] = [];

  if (isRecord(error)) {
    messages.push(
      ...collectFieldMessages(error.details),
      ...collectFieldMessages(error.errors),
      ...collectFieldMessages(error.message),
      ...collectFieldMessages(error.messages),
    );
  }

  messages.push(
    ...collectFieldMessages(data.details),
    ...collectFieldMessages(data.errors),
    ...collectFieldMessages(data.message),
    ...collectFieldMessages(data.messages),
    ...collectMessageValues(data.detail),
    ...collectMessageValues(data.title),
  );

  return uniqueMessages(messages.length > 0 ? messages : errorMessages);
}

export function getErrorMessage(caught: unknown, fallback = "Đã có lỗi xảy ra.") {
  const message = getErrorMessages(caught, fallback)[0];

  return message ?? fallback;
}

export function getErrorCode(caught: unknown) {
  const data = responseData(caught);

  if (!isRecord(data)) return undefined;

  const error = data.error;
  if (isRecord(error)) return cleanMessage(error.code);

  return cleanMessage(data.code);
}

export function getErrorMessages(caught: unknown, fallback = "Đã có lỗi xảy ra.") {
  const responseMessages = collectResponseMessages(responseData(caught));
  if (responseMessages.length > 0) return responseMessages;

  const caughtMessages = collectMessageValues(caught);
  if (caughtMessages.length > 0) return uniqueMessages(caughtMessages);

  if (caught instanceof Error) return [caught.message];

  return [fallback];
}
