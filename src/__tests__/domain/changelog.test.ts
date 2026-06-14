import { describe, it, expect } from "vitest";
import { generateChangelog } from '@/domain';
import type { DiffResult } from '@/domain';

describe("Changelog Generation", () => {
  it("should generate changelog with additions", () => {
    const diff: DiffResult = {
      addedSections: [{ id: "feat-1", type: "featureGrid" }],
      removedSections: [],
      modifiedProps: [],
    };
    const log = generateChangelog("1.1.0", diff);
    expect(log).toContain("Version 1.1.0");
    expect(log).toContain("Feature Grid Section");
    expect(log).toContain("Added:");
  });

  it("should generate changelog with modifications", () => {
    const diff: DiffResult = {
      addedSections: [],
      removedSections: [],
      modifiedProps: [
        {
          sectionId: "hero-1",
          sectionType: "hero",
          changes: [{ key: "title", oldValue: "Old", newValue: "New" }],
        },
      ],
    };
    const log = generateChangelog("1.0.1", diff);
    expect(log).toContain("Modified:");
    expect(log).toContain("Hero Section");
    expect(log).toContain("title");
  });

  it("should generate changelog with removals", () => {
    const diff: DiffResult = {
      addedSections: [],
      removedSections: [{ id: "cta-1", type: "cta" }],
      modifiedProps: [],
    };
    const log = generateChangelog("2.0.0", diff);
    expect(log).toContain("Removed:");
    expect(log).toContain("CTA Section");
  });

  it("should show 'None' when a category is empty", () => {
    const diff: DiffResult = {
      addedSections: [],
      removedSections: [],
      modifiedProps: [
        {
          sectionId: "hero-1",
          sectionType: "hero",
          changes: [{ key: "title", oldValue: "A", newValue: "B" }],
        },
      ],
    };
    const log = generateChangelog("1.0.1", diff);
    expect(log).toContain("Added:\n- None");
    expect(log).toContain("Removed:\n- None");
  });
});
