import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import {
  createSignedToken,
  isValidTimestamp,
  verifySignedToken,
} from "./signed-token";

export const OPERATOR_SESSION_TTL_MS = 8 * 60 * 60 * 1_000;
const CLOCK_SKEW_MS = 5 * 60 * 1_000;
const SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;
const MAX_PASSWORD_LENGTH = 1_024;

export interface OperatorSessionClaims {
  version: 1;
  purpose: "hgo-operator-session";
  subject: "operator";
  sessionId: string;
  issuedAt: number;
  expiresAt: number;
}

export type OperatorSessionVerification =
  | { valid: true; claims: OperatorSessionClaims }
  | { valid: false };

export function createOperatorSession(
  secret: string,
  options: { now?: number } = {},
): string {
  const now = options.now ?? Date.now();
  if (!isValidTimestamp(now)) throw new Error("Invalid operator session timestamp.");

  const claims: OperatorSessionClaims = {
    version: 1,
    purpose: "hgo-operator-session",
    subject: "operator",
    sessionId: randomUUID(),
    issuedAt: now,
    expiresAt: now + OPERATOR_SESSION_TTL_MS,
  };
  return createSignedToken(claims, secret);
}

export function verifyOperatorSession(
  token: unknown,
  secret: unknown,
  now = Date.now(),
): OperatorSessionVerification {
  if (!isValidTimestamp(now)) return { valid: false };
  const result = verifySignedToken(token, secret);
  if (!result.valid) return { valid: false };

  const { version, purpose, subject, sessionId, issuedAt, expiresAt } = result.claims;
  if (
    version !== 1 ||
    purpose !== "hgo-operator-session" ||
    subject !== "operator" ||
    typeof sessionId !== "string" ||
    !SESSION_ID_PATTERN.test(sessionId) ||
    !isValidTimestamp(issuedAt) ||
    !isValidTimestamp(expiresAt) ||
    issuedAt > now + CLOCK_SKEW_MS ||
    expiresAt <= now ||
    expiresAt <= issuedAt ||
    expiresAt - issuedAt > OPERATOR_SESSION_TTL_MS
  ) {
    return { valid: false };
  }

  return {
    valid: true,
    claims: { version, purpose, subject, sessionId, issuedAt, expiresAt },
  };
}

export function matchesOperatorPassword(
  candidate: unknown,
  configuredPassword: unknown,
): boolean {
  if (
    typeof candidate !== "string" ||
    typeof configuredPassword !== "string" ||
    candidate.length === 0 ||
    configuredPassword.length === 0 ||
    candidate.length > MAX_PASSWORD_LENGTH ||
    configuredPassword.length > MAX_PASSWORD_LENGTH
  ) {
    return false;
  }

  const candidateDigest = createHash("sha256").update(candidate, "utf8").digest();
  const configuredDigest = createHash("sha256")
    .update(configuredPassword, "utf8")
    .digest();
  return timingSafeEqual(candidateDigest, configuredDigest);
}
