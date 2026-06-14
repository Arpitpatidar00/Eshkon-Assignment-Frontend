import { describe, it, expect } from "vitest";
import { diffPages } from '@/domain';
import type { Page } from '@/domain';

const basePage: Page = {
  pageId: "test",
  slug: "test",
  title: "Test",
  sections: [
    { id: "hero-1", type: "hero", props: { title: "Hello" } },
    { id: "cta-1", type: "cta", props: { label: "Click", url: "/go" } },
  ],
};

describe("Diff Engine", () => {
  it("should detect no changes for identical pages", () => {
    const diff = diffPages(basePage, basePage);
    expect(diff.addedSections).toHaveLength(0);
    expect(diff.removedSections).toHaveLength(0);
    expect(diff.modifiedProps).toHaveLength(0);
  });

  it("should detect added sections", () => {
    const draft: Page = {
      ...basePage,
      sections: [
        ...basePage.sections,
        { id: "new-1", type: "testimonial", props: { quote: "Great", author: "Jane" } },
      ],
    };
    const diff = diffPages(basePage, draft);
    expect(diff.addedSections).toHaveLength(1);
    expect(diff.addedSections[0].id).toBe("new-1");
    expect(diff.addedSections[0].type).toBe("testimonial");
  });

  it("should detect removed sections", () => {
    const draft: Page = {
      ...basePage,
      sections: [basePage.sections[0]],
    };
    const diff = diffPages(basePage, draft);
    expect(diff.removedSections).toHaveLength(1);
    expect(diff.removedSections[0].id).toBe("cta-1");
  });

  it("should detect modified props", () => {
    const draft: Page = {
      ...basePage,
      sections: [
        { id: "hero-1", type: "hero", props: { title: "Changed Title" } },
        basePage.sections[1],
      ],
    };
    const diff = diffPages(basePage, draft);
    expect(diff.modifiedProps).toHaveLength(1);
    expect(diff.modifiedProps[0].sectionId).toBe("hero-1");
    expect(diff.modifiedProps[0].changes[0].key).toBe("title");
  });

  it("should treat null published as all additions", () => {
    const diff = diffPages(null, basePage);
    expect(diff.addedSections).toHaveLength(2);
    expect(diff.removedSections).toHaveLength(0);
  });

  it("should detect section type changes as remove + add", () => {
    const draft: Page = {
      ...basePage,
      sections: [
        { id: "hero-1", type: "cta", props: { label: "New", url: "/new" } },
        basePage.sections[1],
      ],
    };
    const diff = diffPages(basePage, draft);
    expect(diff.removedSections.length).toBeGreaterThan(0);
    expect(diff.addedSections.length).toBeGreaterThan(0);
  });
});
