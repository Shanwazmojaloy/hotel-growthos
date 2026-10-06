import { describe, expect, it, vi } from "vitest";
import type { IntakeSubmission } from "../lib/domain/intake";
import { SupabaseLeadStore } from "../lib/server/supabase-lead-store";

const NOW = Date.UTC(2026, 9, 5, 12, 0, 0);
const submission: IntakeSubmission = {
  fullName: "Alex Morgan",
  email: "alex@example.com",
  propertyName: "Northstar Hotel",
  role: "General manager",
  hotelWebsite: "https://northstar.example/",
  message: "I would like to explore Hotel Growth OS.",
  contactPermission: true,
};

describe("SupabaseLeadStore", () => {
  it("creates a new lead and creation event when intakeId is new", async () => {
    const mockFetcher = vi.fn();

    // 1. First fetch: GET /rest/v1/leads?intake_id=... returns []
    mockFetcher.mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200, statusText: "OK" }),
    );

    // 2. Second fetch: POST /rest/v1/leads returns [created]
    mockFetcher.mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            id: "11111111-1111-4111-8111-111111111111",
            intake_id: "intake-123",
            full_name: "Alex Morgan",
            email: "alex@example.com",
            property_name: "Northstar Hotel",
            role: "General manager",
            hotel_website: "https://northstar.example/",
            message: "I would like to explore Hotel Growth OS.",
            status: "new",
            received_at: new Date(NOW).toISOString(),
            contact_permission_granted_at: new Date(NOW).toISOString(),
          },
        ]),
        { status: 201, statusText: "Created" },
      ),
    );

    // 3. Third fetch: POST /rest/v1/lead_events returns 201
    mockFetcher.mockResolvedValueOnce(new Response("", { status: 201 }));

    const store = new SupabaseLeadStore({
      url: "https://mock.supabase.co",
      apiKey: "mock-key",
      fetchFn: mockFetcher,
    });

    const result = await store.createOrGetLead({
      intakeId: "intake-123",
      submission,
      now: NOW,
    });

    expect(result.duplicate).toBe(false);
    expect(result.lead.id).toBe("11111111-1111-4111-8111-111111111111");
    expect(result.lead.fullName).toBe("Alex Morgan");
    expect(result.lead.email).toBe("alex@example.com");
    expect(mockFetcher).toHaveBeenCalledTimes(3);
  });

  it("handles duplicate replay by returning existing lead and auditing duplicate", async () => {
    const mockFetcher = vi.fn();

    // 1. GET /rest/v1/leads returns existing lead
    mockFetcher.mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            id: "11111111-1111-4111-8111-111111111111",
            intake_id: "intake-replay",
            full_name: "Alex Morgan",
            email: "alex@example.com",
            property_name: "Northstar Hotel",
            role: "General manager",
            hotel_website: "https://northstar.example/",
            message: "I would like to explore Hotel Growth OS.",
            status: "new",
            received_at: new Date(NOW).toISOString(),
            contact_permission_granted_at: new Date(NOW).toISOString(),
          },
        ]),
        { status: 200, statusText: "OK" },
      ),
    );

    // 2. GET /rest/v1/lead_events returns [] (not yet audited)
    mockFetcher.mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200, statusText: "OK" }),
    );

    // 3. POST /rest/v1/lead_events records lead.duplicate
    mockFetcher.mockResolvedValueOnce(new Response("", { status: 201 }));

    const store = new SupabaseLeadStore({
      url: "https://mock.supabase.co",
      apiKey: "mock-key",
      fetchFn: mockFetcher,
    });

    const result = await store.createOrGetLead({
      intakeId: "intake-replay",
      submission,
      now: NOW,
    });

    expect(result.duplicate).toBe(true);
    expect(result.lead.id).toBe("11111111-1111-4111-8111-111111111111");
    expect(mockFetcher).toHaveBeenCalledTimes(3);
  });

  it("lists leads and events properly", async () => {
    const mockFetcher = vi.fn();

    mockFetcher.mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            id: "lead-abc",
            intake_id: "intake-abc",
            full_name: "Morgan",
            email: "morgan@example.com",
            property_name: "Grand Hotel",
            role: null,
            hotel_website: null,
            message: "Hello",
            status: "new",
            received_at: new Date(NOW).toISOString(),
            contact_permission_granted_at: new Date(NOW).toISOString(),
          },
        ]),
        { status: 200 },
      ),
    );

    mockFetcher.mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            id: "evt-1",
            type: "lead.created",
            lead_id: "lead-abc",
            intake_id: "intake-abc",
            occurred_at: new Date(NOW).toISOString(),
          },
        ]),
        { status: 200 },
      ),
    );

    const store = new SupabaseLeadStore({
      url: "https://mock.supabase.co",
      apiKey: "mock-key",
      fetchFn: mockFetcher,
    });

    const leads = await store.listLeads();
    expect(leads).toHaveLength(1);
    expect(leads[0].id).toBe("lead-abc");

    const events = await store.listEvents();
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("lead.created");
  });

  it("throws on network or database errors", async () => {
    const mockFetcher = vi.fn().mockResolvedValue(new Response("Internal Server Error", { status: 500 }));
    const store = new SupabaseLeadStore({
      url: "https://mock.supabase.co",
      apiKey: "mock-key",
      fetchFn: mockFetcher,
    });

    await expect(
      store.createOrGetLead({ intakeId: "fail-test", submission, now: NOW }),
    ).rejects.toThrow(/Failed to query Supabase/);
  });
});
