import type { Page } from '@/domain';

/**
 * Mock data source for development.
 * Provides realistic page data without requiring Contentful credentials.
 */

const MOCK_PAGES: Record<string, Page> = {
  home: {
    pageId: "home",
    slug: "home",
    title: "Homepage",
    sections: [
      {
        id: "hero-1",
        type: "hero",
        props: {
          title: "Build Beautiful Landing Pages",
          subtitle:
            "Create, edit, and publish stunning pages with our intuitive Page Studio platform. No coding required.",
          ctaLabel: "Get Started Free",
          ctaUrl: "/signup",
        },
      },
      {
        id: "features-1",
        type: "featureGrid",
        props: {
          heading: "Everything You Need",
          features: [
            {
              icon: "⚡",
              title: "Lightning Fast",
              description:
                "Pages load in milliseconds with our optimized rendering engine and global CDN.",
            },
            {
              icon: "🎨",
              title: "Visual Editor",
              description:
                "Drag and drop sections, edit content inline, and see changes in real-time.",
            },
            {
              icon: "🔒",
              title: "Enterprise Security",
              description:
                "Role-based access control, immutable versioning, and complete audit trails.",
            },
            {
              icon: "📊",
              title: "Analytics Built-in",
              description:
                "Track page performance, conversion rates, and user engagement automatically.",
            },
            {
              icon: "🌍",
              title: "Global CDN",
              description:
                "Content delivered from edge locations worldwide for the fastest possible experience.",
            },
            {
              icon: "🔄",
              title: "Version Control",
              description:
                "Every change is tracked with semantic versioning and complete rollback support.",
            },
          ],
        },
      },
      {
        id: "testimonial-1",
        type: "testimonial",
        props: {
          quote:
            "Page Studio transformed how our marketing team works. We went from weeks of developer dependency to publishing landing pages in hours.",
          author: "Sarah Chen",
          role: "VP of Marketing",
          company: "TechFlow Inc.",
          rating: 5,
        },
      },
      {
        id: "cta-1",
        type: "cta",
        props: {
          label: "Start Building Today",
          url: "/signup",
          description:
            "Join thousands of teams already using Page Studio to create high-converting landing pages.",
          variant: "primary",
        },
      },
    ],
  },
  about: {
    pageId: "about",
    slug: "about",
    title: "About Us",
    sections: [
      {
        id: "hero-about",
        type: "hero",
        props: {
          title: "Our Mission",
          subtitle:
            "Empowering marketing teams to create exceptional web experiences without engineering bottlenecks.",
        },
      },
      {
        id: "testimonial-about",
        type: "testimonial",
        props: {
          quote:
            "The structured content approach means our pages are always consistent, accessible, and on-brand.",
          author: "Marcus Johnson",
          role: "Design Director",
          company: "Creative Labs",
          rating: 5,
        },
      },
      {
        id: "cta-about",
        type: "cta",
        props: {
          label: "Join Our Team",
          url: "/careers",
          description: "We're hiring! Help us build the future of content management.",
          variant: "secondary",
        },
      },
    ],
  },
  pricing: {
    pageId: "pricing",
    slug: "pricing",
    title: "Pricing",
    sections: [
      {
        id: "hero-pricing",
        type: "hero",
        props: {
          title: "Simple, Transparent Pricing",
          subtitle: "Start free. Scale as you grow. No hidden fees.",
        },
      },
      {
        id: "features-pricing",
        type: "featureGrid",
        props: {
          heading: "All Plans Include",
          features: [
            {
              icon: "✅",
              title: "Unlimited Pages",
              description: "Create as many landing pages as you need.",
            },
            {
              icon: "✅",
              title: "Version History",
              description: "Full version history with rollback support.",
            },
            {
              icon: "✅",
              title: "Team Collaboration",
              description: "Invite your team with role-based access.",
            },
          ],
        },
      },
      {
        id: "cta-pricing",
        type: "cta",
        props: {
          label: "Start Free Trial",
          url: "/signup",
          description: "14-day free trial. No credit card required.",
          variant: "primary",
        },
      },
    ],
  },
};

/**
 * Get a page by slug from mock data.
 */
export function getMockPage(slug: string): Page | null {
  return MOCK_PAGES[slug] ?? null;
}

/**
 * Get all available page slugs from mock data.
 */
export function getMockPageSlugs(): string[] {
  return Object.keys(MOCK_PAGES);
}

/**
 * Get a deep copy of mock page data (for draft editing).
 */
export function getMockPageCopy(slug: string): Page | null {
  const page = MOCK_PAGES[slug];
  if (!page) return null;
  return JSON.parse(JSON.stringify(page));
}
