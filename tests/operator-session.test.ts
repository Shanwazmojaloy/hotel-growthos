import { describe, expect, it } from "vitest";
import { createIntakeToken } from "../lib/domain/intake-token";
import {
  OPERATOR_SESSION_TTL_MS,
  createOperatorSession,
  matchesOperatorPassword,
  verifyOperatorSession,
} from "../lib/domain/operator-session";

const SECRET = "test-session-secret-that-is-at-least-32-bytes";
const NOW = Date.UTC(2026, 9, 5, 12, 0, 0);

describe("signed operator sessions", () => {
  it("issues a session for the operator with a bounded expiry", () => {
    const token = createOperatorSession(SECRET, { now: NOW });
    const result = verifyOperatorSession(token, SECRET, NOW + 1);

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.claims.subject).toBe("operator");
      expect(result.claims.expiresAt).toBe(NOW + OPERATOR_SESSION_TTL_MS);
    }
  });

  it("rejects altered, malformed, and incorrectly signed cookies", () => {
    const token = createOperatorSession(SECRET, { now: NOW });
    const [payload, signature] = token.split(".");

    expect(verifyOperatorSession("invalid", SECRET, NOW).valid).toBe(false);
    expect(
      verifyOperatorSession(`${payload}.${"a".repeat(signature.length)}`, SECRET, NOW)
        .valid,
    ).toBe(false);
    expect(verifyOperatorSession(token, `${SECRET}-wrong`, NOW).valid).toBe(false);
  });

  it("expires sessions and rejects timestamps too far in the future", () => {
    const token = createOperatorSession(SECRET, { now: NOW });
    expect(
      verifyOperatorSession(token, SECRET, NOW + OPERATOR_SESSION_TTL_MS + 1).valid,
    ).toBe(false);

    const future = createOperatorSession(SECRET, { now: NOW + 10 * 60_000 });
    expect(verifyOperatorSession(future, SECRET, NOW).valid).toBe(false);
  });

  it("does not accept an intake token as an operator session", () => {
    const intakeToken = createIntakeToken(SECRET, { now: NOW });
    expect(verifyOperatorSession(intakeToken, SECRET, NOW).valid).toBe(false);
  });

  it("refuses weak signing keys", () => {
    expect(() => createOperatorSession("short", { now: NOW })).toThrow();
  });
});

describe("operator password comparison", () => {
  it("matches the configured password exactly", () => {
    expect(matchesOperatorPassword("a-long-demo-password", "a-long-demo-password")).toBe(
      true,
    );
    expect(matchesOperatorPassword("a-long-demo-password ", "a-long-demo-password")).toBe(
      false,
    );
    expect(matchesOperatorPassword("wrong", "a-long-demo-password")).toBe(false);
  });

  it("never matches an empty or missing configured password", () => {
    expect(matchesOperatorPassword("anything", "")).toBe(false);
    expect(matchesOperatorPassword("anything", undefined)).toBe(false);
    expect(matchesOperatorPassword("", "a-long-demo-password")).toBe(false);
  });
});
