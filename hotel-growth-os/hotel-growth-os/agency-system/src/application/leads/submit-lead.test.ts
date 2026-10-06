import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AgencyLeadCrmPort } from "./agency-lead-crm-port";
import { submitLead } from "./submit-lead";

describe("submitLead", () => {
  let crm: AgencyLeadCrmPort;

  beforeEach(() => {
    crm = {
      upsertLead: vi.fn().mockResolvedValue({ disposition: "created" }),
    };
  });

  it("does not call the CRM when the inquiry is invalid", async () => {
    const result = await submitLead(
      {
        name: "Incomplete inquiry",
        consentToRespond: true,
      },
      crm,
    );

    expect(result.status).toBe("invalid");
    expect(crm.upsertLead).not.toHaveBeenCalled();
  });

  it("passes only the normalized, consented allowlist to the CRM port", async () => {
    const result = await submitLead(
      {
        name: "  Ada Example ",
        email: "ADA@example.com",
        consentToRespond: true,
        marketingOptIn: false,
        admin: true,
        privateNote: "must not pass through",
      },
      crm,
    );

    expect(result).toEqual({ status: "accepted", disposition: "created" });
    expect(crm.upsertLead).toHaveBeenCalledWith({
      name: "Ada Example",
      email: "ada@example.com",
      contactConsent: true,
      marketingConsent: false,
    });
  });

  it("returns a generic delivery failure without exposing CRM error details", async () => {
    vi.mocked(crm.upsertLead).mockRejectedValueOnce(
      new Error("private provider response with sensitive detail"),
    );

    const result = await submitLead(
      {
        name: "Ada Example",
        email: "ada@example.com",
        consentToRespond: true,
      },
      crm,
    );

    expect(result).toEqual({ status: "delivery_failed" });
  });
});
