import { describe, expect, it } from "vitest";
import {
  INTAKE_TOKEN_TTL_MS,
  createIntakeToken,
  verifyIntakeToken,
} from "../lib/domain/intake-token";
import { validateIntakeSubmission } from "../lib/domain/intake";

const SECRET = "test-secret-that-is-at-least-32-bytes-long";
const NOW = Date.UTC(2026, 9, 5, 12, 0, 0);

function validSubmission(overrides: Record<string, unknown> = {}) {
  return {
    fullName: "  Alex Morgan  ",
    email: "  ALEX@Example.com ",
    propertyName: "  Northstar Hotel  ",
    role: "  General manager  ",
    hotelWebsite: "https://northstar.example",
    message: "  I would like to understand the concept.  ",
    contactPermission: "yes",
    ignoredField: "must not be retained",
    ...overrides,
  };
}

describe("validateIntakeSubmission", () => {
  it("normalizes and allow-lists a valid contact request", () => {
    const result = validateIntakeSubmission(validSubmission());

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toEqual({
      fullName: "Alex Morgan",
      email: "alex@example.com",
      propertyName: "Northstar Hotel",
      role: "General manager",
      hotelWebsite: "https://northstar.example/",
      message: "I would like to understand the concept.",
      contactPermission: true,
    });
    expect(result.data).not.toHaveProperty("ignoredField");
  });

  it.each([
    ["fullName", ""],
    ["fullName", "A"],
    ["email", "not-an-email"],
    ["propertyName", ""],
    ["message", ""],
  ])("requires a valid %s", (field, value) => {
    const result = validateIntakeSubmission(validSubmission({ [field]: value }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toHaveProperty(field);
  });

  it("requires explicit permission to reply to the request", () => {
    const result = validateIntakeSubmission(
      validSubmission({ contactPermission: "no" }),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.contactPermission).toBeDefined();
  });

  it.each(["<script>", "javascript:alert(1)", "ftp://northstar.example"]) (
    "rejects unsafe or malformed property URLs: %s",
    (hotelWebsite) => {
      const result = validateIntakeSubmission(validSubmission({ hotelWebsite }));
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors.hotelWebsite).toBeDefined();
    },
  );

  it("accepts an omitted optional property URL and role", () => {
    const result = validateIntakeSubmission(
      validSubmission({ hotelWebsite: "", role: "" }),
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.hotelWebsite).toBeNull();
      expect(result.data.role).toBeNull();
    }
  });

  it.each([
    ["fullName", "x".repeat(161)],
    ["email", `${"x".repeat(250)}@example.com`],
    ["propertyName", "x".repeat(161)],
    ["role", "x".repeat(101)],
    ["hotelWebsite", `https://example.com/${"x".repeat(300)}`],
    ["message", "x".repeat(1_401)],
  ])("rejects overlong %s input", (field, value) => {
    const result = validateIntakeSubmission(validSubmission({ [field]: value }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toHaveProperty(field);
  });

  it("rejects non-object payloads and non-string form fields", () => {
    expect(validateIntakeSubmission(null).ok).toBe(false);
    expect(
      validateIntakeSubmission(validSubmission({ email: { toString: () => "a@b.co" } }))
        .ok,
    ).toBe(false);
  });

  it.each(["role", "hotelWebsite"]) (
    "rejects non-string values for optional field %s",
    (field) => {
      const result = validateIntakeSubmission(validSubmission({ [field]: { value: "not-a-string" } }));
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors).toHaveProperty(field);
    },
  );
});

describe("signed intake tokens", () => {
  it("issues a unique, scoped token that can be verified", () => {
    const first = createIntakeToken(SECRET, { now: NOW });
    const second = createIntakeToken(SECRET, { now: NOW });
    const result = verifyIntakeToken(first, SECRET, NOW + 1);

    expect(first).not.toBe(second);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.claims.intakeId).toMatch(/^[0-9a-f-]{36}$/i);
      expect(result.claims.expiresAt).toBe(NOW + INTAKE_TOKEN_TTL_MS);
    }
  });

  it("rejects a changed payload, changed signature, and the wrong secret", () => {
    const token = createIntakeToken(SECRET, { now: NOW });
    const [payload, signature] = token.split(".");
    const tamperedPayload = `${Buffer.from(
      JSON.stringify({ v: 1, purpose: "intake", intakeId: "forged", issuedAt: NOW, expiresAt: NOW + INTAKE_TOKEN_TTL_MS }),
    ).toString("base64url")}.${signature}`;

    expect(verifyIntakeToken(tamperedPayload, SECRET, NOW).valid).toBe(false);
    expect(verifyIntakeToken(`${payload}.${"a".repeat(signature.length)}`, SECRET, NOW).valid).toBe(false);
    expect(verifyIntakeToken(token, `${SECRET}-wrong`, NOW).valid).toBe(false);
  });

  it("rejects malformed, expired, future-dated, and overlong-lived tokens", () => {
    expect(verifyIntakeToken("not-a-token", SECRET, NOW).valid).toBe(false);
    expect(verifyIntakeToken("a.b.c", SECRET, NOW).valid).toBe(false);

    const expired = createIntakeToken(SECRET, { now: NOW });
    expect(
      verifyIntakeToken(expired, SECRET, NOW + INTAKE_TOKEN_TTL_MS + 1).valid,
    ).toBe(false);

    const future = createIntakeToken(SECRET, { now: NOW + 10 * 60_000 });
    expect(verifyIntakeToken(future, SECRET, NOW).valid).toBe(false);

    expect(() =>
      createIntakeToken(SECRET, { now: NOW, ttlMs: INTAKE_TOKEN_TTL_MS * 10 }),
    ).toThrow();
  });

  it("refuses weak signing secrets", () => {
    expect(() => createIntakeToken("short", { now: NOW })).toThrow();
  });
});
