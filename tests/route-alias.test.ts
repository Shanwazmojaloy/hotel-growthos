import { describe, expect, it } from "vitest";
import HotelGrowthOsAliasPage from "../app/(public)/hotelgrowthOS/page";

describe("legacy Hotel Growth OS URL", () => {
  it("permanently redirects /hotelgrowthOS to the canonical home page", () => {
    let redirectError: unknown;

    try {
      HotelGrowthOsAliasPage();
    } catch (error) {
      redirectError = error;
    }

    expect(redirectError).toMatchObject({
      digest: "NEXT_REDIRECT;replace;/;308;",
    });
  });
});
