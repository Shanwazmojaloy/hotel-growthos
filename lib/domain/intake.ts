export const INTAKE_LIMITS = {
  fullName: 160,
  email: 254,
  propertyName: 160,
  role: 100,
  hotelWebsite: 200,
  message: 1_400,
} as const;

export type IntakeField = keyof typeof INTAKE_LIMITS | "contactPermission";
export type IntakeFieldErrors = Partial<Record<IntakeField, string>>;

export interface IntakeSubmission {
  fullName: string;
  email: string;
  propertyName: string;
  role: string | null;
  hotelWebsite: string | null;
  message: string;
  contactPermission: true;
}

export type IntakeValidationResult =
  | { ok: true; data: IntakeSubmission }
  | { ok: false; errors: IntakeFieldErrors };

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/u;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readTrimmedString(value: unknown): string | null {
  return typeof value === "string" ? value.trim() : null;
}

function hasControlCharacters(value: string): boolean {
  return CONTROL_CHARACTERS.test(value);
}

function normalizeWebsite(value: string): string | null {
  if (!value) return null;
  if (value.length > INTAKE_LIMITS.hotelWebsite || hasControlCharacters(value)) {
    return null;
  }

  try {
    const url = new URL(value);
    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function validateIntakeSubmission(input: unknown): IntakeValidationResult {
  if (!isRecord(input)) {
    return {
      ok: false,
      errors: {
        fullName: "Enter your name.",
        email: "Enter a valid email address.",
        propertyName: "Enter your property name.",
        message: "Add a short note about your request.",
        contactPermission: "Please allow a reply to this request.",
      },
    };
  }

  const errors: IntakeFieldErrors = {};
  const fullName = readTrimmedString(input.fullName);
  const email = readTrimmedString(input.email)?.toLowerCase() ?? null;
  const propertyName = readTrimmedString(input.propertyName);
  const role = readTrimmedString(input.role);
  const rawWebsite = readTrimmedString(input.hotelWebsite);
  const message = readTrimmedString(input.message);

  if (input.role !== undefined && input.role !== null && typeof input.role !== "string") {
    errors.role = "Enter a text value for your role.";
  }
  if (
    input.hotelWebsite !== undefined &&
    input.hotelWebsite !== null &&
    typeof input.hotelWebsite !== "string"
  ) {
    errors.hotelWebsite = "Enter a text value for your property website.";
  }

  if (!fullName || fullName.length < 2 || hasControlCharacters(fullName)) {
    errors.fullName = "Enter at least 2 characters.";
  } else if (fullName.length > INTAKE_LIMITS.fullName) {
    errors.fullName = "Keep your name under 160 characters.";
  }

  if (!email || email.length > INTAKE_LIMITS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!propertyName || hasControlCharacters(propertyName)) {
    errors.propertyName = "Enter your property name.";
  } else if (propertyName.length > INTAKE_LIMITS.propertyName) {
    errors.propertyName = "Keep the property name under 160 characters.";
  }

  if (role !== null && (role.length > INTAKE_LIMITS.role || hasControlCharacters(role))) {
    errors.role = "Keep your role under 100 characters.";
  }

  let hotelWebsite: string | null = null;
  if (rawWebsite) {
    hotelWebsite = normalizeWebsite(rawWebsite);
    if (!hotelWebsite) errors.hotelWebsite = "Enter a valid http or https website.";
  }

  if (!message || hasControlCharacters(message)) {
    errors.message = "Add a short note about your request.";
  } else if (message.length > INTAKE_LIMITS.message) {
    errors.message = "Keep your note under 1,400 characters.";
  }

  if (input.contactPermission !== "yes" && input.contactPermission !== true) {
    errors.contactPermission = "Please allow a reply to this request.";
  }

  if (Object.keys(errors).length > 0 || !fullName || !email || !propertyName || !message) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      propertyName,
      role: role || null,
      hotelWebsite,
      message,
      contactPermission: true,
    },
  };
}
