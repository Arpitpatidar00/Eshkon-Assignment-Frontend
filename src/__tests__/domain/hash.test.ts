import { describe, it, expect } from "vitest";
import { hashPage, hashPageDeep, arePagesIdentical } from '@/domain';
import type { Page } from '@/domain';

const page1: Page = {
  pageId: "test",
  slug: "test",
  title: "Test Page",
  sections: [
    { id: "hero-1", type: "hero", props: { title: "Hello" } },
  ],
};

const page2: Page = {
  pageId: "test",
  slug: "test",
  title: "Test Page",
  sections: [
    { id: "hero-1", type: "hero", props: { title: "Hello" } },
  ],
};

const page3: Page = {
  pageId: "test",
  slug: "test",
  title: "Test Page Modified",
  sections: [
    { id: "hero-1", type: "hero", props: { title: "Hello" } },
  ],
};

describe("Hash Service", () => {
  it("should produce deterministic hashes", () => {
    const hash1 = hashPage(page1);
    const hash2 = hashPage(page1);
    expect(hash1).toBe(hash2);
  });

  it("should produce identical hashes for identical pages", () => {
    const hash1 = hashPageDeep(page1);
    const hash2 = hashPageDeep(page2);
    expect(hash1).toBe(hash2);
  });

  it("should produce different hashes for different pages", () => {
    const hash1 = hashPageDeep(page1);
    const hash3 = hashPageDeep(page3);
    expect(hash1).not.toBe(hash3);
  });

  it("arePagesIdentical should return true for same content", () => {
    expect(arePagesIdentical(page1, page2)).toBe(true);
  });

  it("arePagesIdentical should return false for different content", () => {
    expect(arePagesIdentical(page1, page3)).toBe(false);
  });
});
