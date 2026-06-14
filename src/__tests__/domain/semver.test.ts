import { describe, it, expect } from "vitest";
import {
  parseSemVer,
  formatSemVer,
  determineVersionBump,
  applyBump,
  calculateNextVersion,
} from '@/domain';
import type { DiffResult } from '@/domain';

describe("SemVer Engine", () => {
  describe("parseSemVer", () => {
    it("should parse valid semver strings", () => {
      expect(parseSemVer("1.2.3")).toEqual({ major: 1, minor: 2, patch: 3 });
      expect(parseSemVer("0.0.0")).toEqual({ major: 0, minor: 0, patch: 0 });
    });

    it("should throw on invalid semver", () => {
      expect(() => parseSemVer("abc")).toThrow();
      expect(() => parseSemVer("1.2")).toThrow();
    });
  });

  describe("formatSemVer", () => {
    it("should format semver objects", () => {
      expect(formatSemVer({ major: 1, minor: 2, patch: 3 })).toBe("1.2.3");
    });
  });

  describe("determineVersionBump", () => {
    it("should return none for empty diff", () => {
      const diff: DiffResult = { addedSections: [], removedSections: [], modifiedProps: [] };
      expect(determineVersionBump(diff)).toBe("none");
    });

    it("should return patch for modifications only", () => {
      const diff: DiffResult = {
        addedSections: [],
        removedSections: [],
        modifiedProps: [{ sectionId: "a", sectionType: "hero", changes: [{ key: "title", oldValue: "a", newValue: "b" }] }],
      };
      expect(determineVersionBump(diff)).toBe("patch");
    });

    it("should return minor for additions", () => {
      const diff: DiffResult = {
        addedSections: [{ id: "new", type: "cta" }],
        removedSections: [],
        modifiedProps: [],
      };
      expect(determineVersionBump(diff)).toBe("minor");
    });

    it("should return major for removals", () => {
      const diff: DiffResult = {
        addedSections: [],
        removedSections: [{ id: "old", type: "hero" }],
        modifiedProps: [],
      };
      expect(determineVersionBump(diff)).toBe("major");
    });

    it("should return major when both additions and removals exist", () => {
      const diff: DiffResult = {
        addedSections: [{ id: "new", type: "cta" }],
        removedSections: [{ id: "old", type: "hero" }],
        modifiedProps: [],
      };
      expect(determineVersionBump(diff)).toBe("major");
    });

    it("should return major when a required property is removed", () => {
      const diff: DiffResult = {
        addedSections: [],
        removedSections: [],
        modifiedProps: [{
          sectionId: "hero-1",
          sectionType: "hero",
          changes: [{ key: "title", oldValue: "My Title", newValue: undefined }],
        }],
      };
      expect(determineVersionBump(diff)).toBe("major");
    });

    it("should return minor when an optional property is added", () => {
      const diff: DiffResult = {
        addedSections: [],
        removedSections: [],
        modifiedProps: [{
          sectionId: "hero-1",
          sectionType: "hero",
          changes: [{ key: "backgroundImage", oldValue: undefined, newValue: "https://example.com/bg.png" }],
        }],
      };
      expect(determineVersionBump(diff)).toBe("minor");
    });
  });

  describe("applyBump", () => {
    it("should apply patch bump", () => {
      expect(applyBump({ major: 1, minor: 0, patch: 0 }, "patch")).toEqual({
        major: 1, minor: 0, patch: 1,
      });
    });

    it("should apply minor bump and reset patch", () => {
      expect(applyBump({ major: 1, minor: 0, patch: 5 }, "minor")).toEqual({
        major: 1, minor: 1, patch: 0,
      });
    });

    it("should apply major bump and reset minor/patch", () => {
      expect(applyBump({ major: 1, minor: 3, patch: 5 }, "major")).toEqual({
        major: 2, minor: 0, patch: 0,
      });
    });
  });

  describe("calculateNextVersion", () => {
    it("should calculate full version from diff", () => {
      const diff: DiffResult = {
        addedSections: [{ id: "new", type: "featureGrid" }],
        removedSections: [],
        modifiedProps: [],
      };
      const result = calculateNextVersion("1.0.0", diff);
      expect(result.version).toBe("1.1.0");
      expect(result.bump).toBe("minor");
    });
  });
});
