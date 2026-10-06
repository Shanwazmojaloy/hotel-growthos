export type LeadSubmissionErrorCode =
  | "invalid_object"
  | "name_required"
  | "invalid_name"
  | "invalid_email"
  | "invalid_phone"
  | "email_or_phone_required"
  | "contact_permission_required"
  | "invalid_boolean"
  | "field_too_long"
  | "invalid_string";

export interface LeadSubmissionError {
  field: string;
  code: LeadSubmissionErrorCode;
}

export interface ParsedLeadSubmission {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  message?: string;
  contactConsent: true;
  marketingConsent: boolean;
}

export type ParseLeadSubmissionResult =
  | { ok: true; value: ParsedLeadSubmission }
  | { ok: false; errors: LeadSubmissionError[] };

const OPTIONAL_TEXT_FIELDS = {
  company: 160,
  serviceInterest: 120,
  message: 1000,
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readOptionalText(
  input: Record<string, unknown>,
  field: keyof typeof OPTIONAL_TEXT_FIELDS,
  errors: LeadSubmissionError[],
): string | undefined {
  const raw = input[field];
  if (raw === undefined || raw === null || raw === "") return undefined;
  if (typeof raw !== "string") {
    errors.push({ field, code: "invalid_string" });
    return undefined;
  }

  const value = raw.trim();
  if (value.length === 0) return undefined;
  if (value.length > OPTIONAL_TEXT_FIELDS[field]) {
    errors.push({ field, code: "field_too_long" });
    return undefined;
  }
  return value;
}

function readContactText(
  input: Record<string, unknown>,
  field: "email" | "phone",
  errors: LeadSubmissionError[],
): string | undefined {
  const raw = input[field];
  if (raw === undefined || raw === null || raw === "") return undefined;
  if (typeof raw !== "string") {
    errors.push({ field, code: field === "email" ? "invalid_email" : "invalid_phone" });
    return undefined;
  }

  const value = raw.trim();
  if (value.length === 0) return undefined;

  if (field === "email") {
    const normalized = value.toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (normalized.length > 254 || !emailPattern.test(normalized)) {
      errors.push({ field, code: "invalid_email" });
      return undefined;
    }
    return normalized;
  }

  const digits = value.replace(/\D/g, "");
  if (value.length > 32 || digits.length < 6 || !/^[+\d().\s-]+$/.test(value)) {
    errors.push({ field, code: "invalid_phone" });
    return undefined;
  }
  return value;
}

/**
 * Parses an inbound inquiry into an allowlisted, normalized object.
 * This is input validation only; it does not store or transmit contact data.
 * Marketing permission is always separate from permission to respond to the inquiry.
 */
export function parseLeadSubmission(input: unknown): ParseLeadSubmissionResult {
  if (!isRecord(input)) {
    return { ok: false, errors: [{ field: "submission", code: "invalid_object" }] };
  }

  const errors: LeadSubmissionError[] = [];
  const rawName = input.name;
  const name = typeof rawName === "string" ? rawName.trim() : "";
  if (name.length === 0) {
    errors.push({ field: "name", code: "name_required" });
  } else if (name.length < 2 || name.length > 120) {
    errors.push({ field: "name", code: "invalid_name" });
  }

  const email = readContactText(input, "email", errors);
  const phone = readContactText(input, "phone", errors);
  if (!email && !phone) {
    errors.push({ field: "contact", code: "email_or_phone_required" });
  }

  if (input.consentToRespond !== true) {
    errors.push({ field: "consentToRespond", code: "contact_permission_required" });
  }

  const rawMarketingOptIn = input.marketingOptIn;
  let marketingConsent = false;
  if (rawMarketingOptIn === true) {
    marketingConsent = true;
  } else if (rawMarketingOptIn !== undefined && rawMarketingOptIn !== false) {
    errors.push({ field: "marketingOptIn", code: "invalid_boolean" });
  }

  const company = readOptionalText(input, "company", errors);
  const serviceInterest = readOptionalText(input, "serviceInterest", errors);
  const message = readOptionalText(input, "message", errors);

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      name,
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
      ...(company ? { company } : {}),
      ...(serviceInterest ? { serviceInterest } : {}),
      ...(message ? { message } : {}),
      contactConsent: true,
      marketingConsent,
    },
  };
}
