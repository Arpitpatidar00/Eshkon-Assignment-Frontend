import { describe, it, expect } from "vitest";
import { safeParsePage, safeParseSection, validatePage } from '@/domain';

describe("Schema Validation", () => {
  describe("Page Schema", () => {
    it("should validate a correct page", () => {
      const validPage = {
        pageId: "home",
        slug: "home",
        title: "Homepage",
        sections: [
          {
            id: "hero-1",
            type: "hero",
            props: { title: "Welcome" },
          },
        ],
      };
      const result = safeParsePage(validPage);
      expect(result.success).toBe(true);
    });

    it("should reject a page missing required fields", () => {
      const invalidPage = { slug: "home" };
      const result = safeParsePage(invalidPage);
      expect(result.success).toBe(false);
    });

    it("should reject a page with empty title", () => {
      const invalidPage = {
        pageId: "home",
        slug: "home",
        title: "",
        sections: [],
      };
      const result = safeParsePage(invalidPage);
      expect(result.success).toBe(false);
    });

    it("should return detailed errors via validatePage", () => {
      const result = validatePage({ pageId: "", slug: "", title: "", sections: [] });
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });

  describe("Section Schema", () => {
    it("should validate a correct hero section", () => {
      const validSection = {
        id: "hero-1",
        type: "hero",
        props: { title: "Welcome" },
      };
      const result = safeParseSection(validSection);
      expect(result.success).toBe(true);
    });

    it("should reject a section with unknown type", () => {
      const invalidSection = {
        id: "unknown-1",
        type: "unknown",
        props: {},
      };
      const result = safeParseSection(invalidSection);
      expect(result.success).toBe(false);
    });

    it("should reject a hero section without title", () => {
      const invalidSection = {
        id: "hero-1",
        type: "hero",
        props: {},
      };
      const result = safeParseSection(invalidSection);
      expect(result.success).toBe(false);
    });

    it("should validate a CTA section with required fields", () => {
      const validCta = {
        id: "cta-1",
        type: "cta",
        props: { label: "Click", url: "/go" },
      };
      const result = safeParseSection(validCta);
      expect(result.success).toBe(true);
    });

    it("should reject a CTA section without url", () => {
      const invalidCta = {
        id: "cta-1",
        type: "cta",
        props: { label: "Click" },
      };
      const result = safeParseSection(invalidCta);
      expect(result.success).toBe(false);
    });
  });
});
