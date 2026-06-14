"use client";

import type { Page } from '@/domain';
import { getSectionComponent } from "@/components/sections/registry";
import UnsupportedSection from "@/components/sections/UnsupportedSection";
import ErrorBoundary from "./ErrorBoundary";
import { Sparkles, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PageRendererProps {
  page: Page;
  hideNavbar?: boolean;
  hideFooter?: boolean;
  showLogout?: boolean;
}

export default function PageRenderer({ 
  page, 
  hideNavbar = false, 
  hideFooter = false,
  showLogout = false 
}: PageRendererProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  // Generate dynamic navigation links based on page sections
  const navLinks = page.sections
    .filter((s) => s.type !== "hero")
    .map((section) => {
      const label = section.type === "featureGrid" 
        ? "Features" 
        : section.type === "testimonial" 
          ? "Testimonial" 
          : section.type === "cta" 
            ? "Convert" 
            : section.type;
      return { id: section.id, label };
    });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Dynamic Landing Page Header/Navbar */}
      {!hideNavbar && (
      <header className="w-full border-b border-border bg-card h-16 flex items-center justify-between px-6 shrink-0 select-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Sparkles className="h-5 w-5" />
            <span>Page Studio</span>
          </div>
          {navLinks.length > 0 && (
            <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold text-muted-foreground">
              {navLinks.map((link) => (
                <a key={link.id} href={`#${link.id}`} className="hover:text-foreground transition-colors">
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
        <div>
          {showLogout ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-4 py-2 shadow-sm transition-colors"
            >
              Get Started
            </a>
          )}
        </div>
      </header>
      )}

      {/* Main Content Area */}
      <main id="main-content" role="main" className="flex-1">
        {page.sections.map((section) => {
          const SectionComponent = getSectionComponent(section.type);

          if (!SectionComponent) {
            return (
              <ErrorBoundary key={section.id}>
                <div id={section.id}>
                  <UnsupportedSection type={section.type} id={section.id} />
                </div>
              </ErrorBoundary>
            );
          }

          return (
            <ErrorBoundary key={section.id}>
              <div id={section.id}>
                <SectionComponent props={section.props} />
              </div>
            </ErrorBoundary>
          );
        })}
      </main>

      {/* Dynamic Landing Page Footer */}
      <footer className="w-full border-t border-border bg-secondary py-16 px-6 select-none">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">Page Studio</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              Clean, structured editorial management and real-time CMS control.
            </p>
          </div>
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Product</span>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Builder Engine</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Analytics Dashboard</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Content API</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Company</span>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Legal & Trust</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Developer</span>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Guides</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Support Center</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-6xl mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] text-muted-foreground">
            &copy; 2026 Page Studio Inc. All rights reserved.
          </span>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

