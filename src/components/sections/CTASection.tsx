import type { CTAProps } from '@/domain';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface CTASectionProps {
  props: Record<string, unknown>;
}

export default function CTASection({ props }: CTASectionProps) {
  const { label, url, description, variant = "primary" } = props as unknown as CTAProps;

  return (
    <section className="py-24 px-6 bg-background border-b border-border" aria-labelledby="cta-title">
      <div className="mx-auto max-w-5xl">
        <Card className="relative overflow-hidden bg-accent border border-primary/20 text-foreground shadow-none rounded-xl p-8 sm:p-12">
          {/* Split layout: Text content + Mock deployment status */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            
            {/* Left side: Content & controls (3 cols) */}
            <CardContent className="lg:col-span-3 relative z-10 flex flex-col items-start text-left space-y-6 p-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3.5 py-1 text-xs font-semibold text-primary select-none">
                <span>Ready to publish?</span>
              </div>

              {description && (
                <h2 id="cta-title" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl max-w-xl leading-tight font-sans">
                  {description}
                </h2>
              )}
              
              <div className="pt-2 flex flex-col items-start gap-4 w-full max-w-md">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="email"
                    placeholder="Enter your work email..."
                    disabled
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none select-none shrink-0"
                  />
                  <Button 
                    size="lg" 
                    variant={variant === "secondary" ? "outline" : "default"} 
                    asChild 
                    className="group px-6 h-10 text-sm font-semibold rounded-lg shadow-sm transition-colors shrink-0"
                  >
                    <a id="cta-label" href={url} role="button" className="inline-flex items-center gap-2">
                      {label}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
                    </a>
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground select-none">
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary font-mono text-[10px]">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary font-mono text-[10px]">K</kbd>
                  <span>to trigger direct publish shortcut</span>
                </div>
              </div>
            </CardContent>

            {/* Right side: Mock Deployment Widget (2 cols) */}
            <Card className="lg:col-span-2 border border-border bg-card rounded-xl p-5 shadow-none flex flex-col gap-4 select-none shrink-0">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-foreground">Production Live</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">v1.8.4</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">URL:</span>
                  <span className="font-mono text-foreground font-medium">pagestudio.com/home</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Build Duration:</span>
                  <span className="font-mono text-foreground font-medium">18.4 seconds</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">CDN Cache hit rate:</span>
                  <span className="font-mono text-foreground font-medium text-emerald-600">100% (HIT)</span>
                </div>
              </div>
              <div className="bg-secondary rounded-lg p-2.5 border border-border flex items-center gap-2 text-[10px] text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Verified release snapshot successfully deployed to Edge servers</span>
              </div>
            </Card>

          </div>
        </Card>
      </div>
    </section>
  );
}

