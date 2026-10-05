import { randomUUID } from "node:crypto";
import {
  createSignedToken,
  isValidTimestamp,
  verifySignedToken,
} from "./signed-token";

export const INTAKE_TOKEN_TTL_MS = 2 * 60 * 60 * 1_000;
const CLOCK_SKEW_MS = 5 * 60 * 1_000;
const INTAKE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

export interface IntakeTokenClaims {
  version: 1;
  purpose: "hgo-intake";
  intakeId: string;
  issuedAt: number;
  expiresAt: number;
}

export interface CreateIntakeTokenOptions {
  now?: number;
  ttlMs?: number;
}

export type IntakeTokenVerification =
  | { valid: true; claims: IntakeTokenClaims }
  | { valid: false };

export function createIntakeToken(
  secret: string,
  options: CreateIntakeTokenOptions = {},
): string {
  const now = options.now ?? Date.now();
  const ttlMs = options.ttlMs ?? INTAKE_TOKEN_TTL_MS;
  if (!isValidTimestamp(now) || !isValidTimestamp(ttlMs) || ttlMs === 0 || ttlMs > INTAKE_TOKEN_TTL_MS) {
    throw new Error("Invalid intake token lifetime.");
  }

  const claims: IntakeTokenClaims = {
    version: 1,
    purpose: "hgo-intake",
    intakeId: randomUUID(),
    issuedAt: now,
    expiresAt: now + ttlMs,
  };
  return createSignedToken(claims, secret);
}

export function verifyIntakeToken(
  token: unknown,
  secret: unknown,
  now = Date.now(),
): IntakeTokenVerification {
  if (!isValidTimestamp(now)) return { valid: false };
  const result = verifySignedToken(token, secret);
  if (!result.valid) return { valid: false };

  const { version, purpose, intakeId, issuedAt, expiresAt } = result.claims;
  if (
    version !== 1 ||
    purpose !== "hgo-intake" ||
    typeof intakeId !== "string" ||
    !INTAKE_ID_PATTERN.test(intakeId) ||
    !isValidTimestamp(issuedAt) ||
    !isValidTimestamp(expiresAt) ||
    issuedAt > now + CLOCK_SKEW_MS ||
    expiresAt <= now ||
    expiresAt <= issuedAt ||
    expiresAt - issuedAt > INTAKE_TOKEN_TTL_MS
  ) {
    return { valid: false };
  }

  return {
    valid: true,
    claims: { version, purpose, intakeId, issuedAt, expiresAt },
  };
}
