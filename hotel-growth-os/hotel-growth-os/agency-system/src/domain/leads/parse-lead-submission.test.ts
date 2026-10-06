import { describe, expect, it } from "vitest";
import { parseLeadSubmission } from "./parse-lead-submission";

describe("parseLeadSubmission", () => {
  it("trims allowed fields and normalizes email without retaining unknown input", () => {
    const result = parseLeadSubmission({
      name: "  Ada Example  ",
      email: "  ADA@Example.COM ",
      serviceInterest: "  Website project  ",
      consentToRespond: true,
      marketingOptIn: false,
      utm_source: "untrusted-client-value",
      admin: true,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value).toEqual({
      name: "Ada Example",
      email: "ada@example.com",
      serviceInterest: "Website project",
      contactConsent: true,
      marketingConsent: false,
    });
    expect("admin" in result.value).toBe(false);
    expect("utm_source" in result.value).toBe(false);
  });

  it("accepts a phone-only inquiry without inventing an email", () => {
    const result = parseLeadSubmission({
      name: "Sam Example",
      phone: " +880 1700 000000 ",
      consentToRespond: true,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.phone).toBe("+880 1700 000000");
    expect("email" in result.value).toBe(false);
  });

  it("requires explicit permission to respond to the inquiry", () => {
    const result = parseLeadSubmission({
      name: "Ada Example",
      email: "ada@example.com",
      consentToRespond: false,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toContainEqual({
      field: "consentToRespond",
      code: "contact_permission_required",
    });
  });

  it("requires at least one usable contact method", () => {
    const result = parseLeadSubmission({
      name: "Ada Example",
      consentToRespond: true,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toContainEqual({
      field: "contact",
      code: "email_or_phone_required",
    });
  });

  it("rejects malformed email even when another contact field is supplied", () => {
    const result = parseLeadSubmission({
      name: "Ada Example",
      email: "not-an-email",
      phone: "+8801700000000",
      consentToRespond: true,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toContainEqual({
      field: "email",
      code: "invalid_email",
    });
  });

  it("defaults marketing opt-in to false and never infers it from contact permission", () => {
    const result = parseLeadSubmission({
      name: "Ada Example",
      email: "ada@example.com",
      consentToRespond: true,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.marketingConsent).toBe(false);
  });

  it("rejects a non-boolean marketing opt-in instead of coercing it", () => {
    const result = parseLeadSubmission({
      name: "Ada Example",
      email: "ada@example.com",
      consentToRespond: true,
      marketingOptIn: "yes",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toContainEqual({
      field: "marketingOptIn",
      code: "invalid_boolean",
    });
  });
});
