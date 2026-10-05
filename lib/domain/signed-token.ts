import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_TOKEN_LENGTH = 2_048;
const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/u;

export function hasStrongSigningSecret(secret: unknown): secret is string {
  return typeof secret === "string" && Buffer.byteLength(secret, "utf8") >= 32;
}

export function assertStrongSigningSecret(secret: string): void {
  if (!hasStrongSigningSecret(secret)) {
    throw new Error("Signing secrets must contain at least 32 UTF-8 bytes.");
  }
}

export function createSignedToken(claims: object, secret: string): string {
  assertStrongSigningSecret(secret);
  const encodedClaims = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
  const signature = createHmac("sha256", secret).update(encodedClaims).digest("base64url");
  return `${encodedClaims}.${signature}`;
}

export function verifySignedToken(
  token: unknown,
  secret: unknown,
): { valid: true; claims: Record<string, unknown> } | { valid: false } {
  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > MAX_TOKEN_LENGTH ||
    !hasStrongSigningSecret(secret)
  ) {
    return { valid: false };
  }

  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };

  const [encodedClaims, signature] = parts;
  if (
    !BASE64URL_PATTERN.test(encodedClaims) ||
    !BASE64URL_PATTERN.test(signature)
  ) {
    return { valid: false };
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(encodedClaims)
    .digest("base64url");
  const suppliedBytes = Buffer.from(signature, "utf8");
  const expectedBytes = Buffer.from(expectedSignature, "utf8");
  if (
    suppliedBytes.length !== expectedBytes.length ||
    !timingSafeEqual(suppliedBytes, expectedBytes)
  ) {
    return { valid: false };
  }

  try {
    const value: unknown = JSON.parse(Buffer.from(encodedClaims, "base64url").toString("utf8"));
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return { valid: false };
    }
    return { valid: true, claims: value as Record<string, unknown> };
  } catch {
    return { valid: false };
  }
}

export function isValidTimestamp(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
