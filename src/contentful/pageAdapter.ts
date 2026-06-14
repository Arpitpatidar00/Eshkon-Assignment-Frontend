import { safeParsePage } from "@/domain/schemas";
import type { Page } from "@/domain/types";
import { apiClient } from "@/lib/apiClient";

/**
 * Fetch the LATEST PUBLISHED page by slug from the Express Backend.
 * Uses the /api/publish/releases endpoint — returns only the most recent release.
 * Viewers always see the latest published version.
 */
export async function fetchPage(
  slug: string
): Promise<{ page: Page | null; errors?: string[] }> {
  try {
    const data = await apiClient<{ releases: any[] }>(`/publish/releases?slug=${slug}`);
    const releases = data.releases || [];
    
    if (releases.length === 0) return { page: null };
    
    // Always use the latest release (first one, sorted by publishedAt desc)
    const result = safeParsePage(releases[0].page);
    if (!result.success) {
      return { 
        page: null, 
        errors: result.error.issues.map(i => `${i.path.join(".")}: ${i.message}`) 
      };
    }
    
    return { page: result.data as Page };
  } catch (err) {
    console.error("Failed to fetch published page:", err);
    return { page: null, errors: ["Network error"] };
  }
}

/**
 * Fetch a page for draft editing from the Express Backend.
 * Uses the /api/pages/:slug endpoint to get the current draft state.
 */
export async function fetchDraftPage(
  slug: string
): Promise<{ page: Page | null; errors?: string[] }> {
  try {
    const data = await apiClient<{ page: any }>(`/pages/${slug}`);
    
    const result = safeParsePage(data.page);
    if (!result.success) {
      return { 
        page: null, 
        errors: result.error.issues.map(i => `${i.path.join(".")}: ${i.message}`) 
      };
    }
    
    return { page: result.data as Page };
  } catch (err) {
    console.error("Failed to fetch draft page:", err);
    return { page: null, errors: ["Network error"] };
  }
}

/**
 * Fetch all available page slugs from the Express Backend.
 */
export async function fetchAllSlugs(): Promise<string[]> {
  try {
    const data = await apiClient<{ pages: { slug: string }[] }>('/pages');
    return data.pages?.map(p => p.slug) || [];
  } catch (err) {
    console.error("Failed to fetch slugs:", err);
    return [];
  }
}
