import type { HeroProps } from '@/domain';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  props: Record<string, unknown>;
}

export default function HeroSection({ props }: HeroSectionProps) {
  const { title, subtitle, ctaLabel, ctaUrl } = props as unknown as HeroProps;

  return (
    <section 
      className="relative flex flex-col items-center justify-center bg-card px-6 pt-32 pb-20 text-center border-b border-border" 
      aria-labelledby="hero-title"
    >
      <div className="relative z-10 mx-auto max-w-5xl space-y-8 flex flex-col items-center">
        {/* Modern Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-accent px-4 py-1.5 text-xs font-semibold text-primary">
          <span>Enterprise CMS Platform</span>
        </div>

        <h1 
          id="hero-title" 
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-[48px] leading-[1.2] max-w-4xl font-sans"
        >
          {title}
        </h1>
        
        {subtitle && (
          <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-[16px] leading-relaxed">
            {subtitle}
          </p>
        )}
        
        {ctaLabel && ctaUrl && (
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              asChild 
              className="bg-primary hover:bg-primary/95 text-white font-semibold shadow-sm transition-colors px-6 h-12 text-sm rounded-lg"
            >
              <a href={ctaUrl} role="button" className="inline-flex items-center gap-2">
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* CMS Interface Mockup Illustration */}
      <div className="mt-16 w-full max-w-4xl mx-auto border border-border bg-card rounded-xl shadow-sm overflow-hidden flex flex-col text-left aspect-[16/10]">
        {/* Header/Title Bar */}
        <div className="h-10 border-b border-border bg-secondary flex items-center px-4 justify-between shrink-0 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground font-mono">app.pagestudio.com/home</span>
          <div className="w-12" />
        </div>

        {/* CMS Workspace Mockup */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-border bg-secondary p-4 space-y-4 hidden sm:block shrink-0">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Structure</span>
              <div className="h-7 rounded-lg bg-card border border-border flex items-center px-2 text-[10px] text-foreground font-semibold">Hero Section</div>
              <div className="h-7 rounded-lg hover:bg-card/50 border border-transparent flex items-center px-2 text-[10px] text-muted-foreground">Feature Grid</div>
              <div className="h-7 rounded-lg hover:bg-card/50 border border-transparent flex items-center px-2 text-[10px] text-muted-foreground">Testimonial</div>
              <div className="h-7 rounded-lg hover:bg-card/50 border border-transparent flex items-center px-2 text-[10px] text-muted-foreground">CTA Footer</div>
            </div>
          </div>

          {/* Settings Column */}
          <div className="w-56 border-r border-border bg-card p-4 space-y-4 hidden md:block shrink-0">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Settings</span>
            <div className="space-y-1.5">
              <div className="h-2 w-16 bg-muted-foreground/30 rounded" />
              <div className="h-8 rounded-lg bg-secondary border border-border" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-24 bg-muted-foreground/30 rounded" />
              <div className="h-16 rounded-lg bg-secondary border border-border" />
            </div>
          </div>

          {/* Workspace Render Area */}
          <div className="flex-1 bg-secondary p-8 flex flex-col justify-center items-center">
            <div className="max-w-md w-full text-center space-y-4 border border-border bg-card p-6 rounded-lg shadow-sm">
              <div className="h-4 w-32 bg-accent text-primary border border-primary/20 rounded-full mx-auto flex items-center justify-center text-[8px] font-semibold">Enterprise CMS Platform</div>
              <div className="h-6 w-3/4 bg-foreground/10 rounded-full mx-auto" />
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-muted-foreground/10 rounded-full" />
                <div className="h-2.5 w-5/6 bg-muted-foreground/10 rounded-full mx-auto" />
              </div>
              <div className="h-8 w-24 bg-primary rounded-lg mx-auto mt-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

