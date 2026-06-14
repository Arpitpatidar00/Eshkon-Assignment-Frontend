import type { ComponentType } from "react";
import HeroSection from "./HeroSection";
import FeatureGridSection from "./FeatureGridSection";
import TestimonialSection from "./TestimonialSection";
import CTASection from "./CTASection";

/**
 * Component registry — single source of truth mapping section types to React components.
 * The renderer resolves components dynamically from this registry.
 */
export const sectionRegistry: Record<
  string,
  ComponentType<{ props: Record<string, unknown> }>
> = {
  hero: HeroSection,
  featureGrid: FeatureGridSection,
  testimonial: TestimonialSection,
  cta: CTASection,
};

/**
 * Get a section component by type.
 */
export function getSectionComponent(
  type: string
): ComponentType<{ props: Record<string, unknown> }> | null {
  return sectionRegistry[type] ?? null;
}

/**
 * Get all registered section types.
 */
export function getRegisteredTypes(): string[] {
  return Object.keys(sectionRegistry);
}
