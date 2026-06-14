import type { FeatureGridProps } from '@/domain';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureGridSectionProps {
  props: Record<string, unknown>;
}

export default function FeatureGridSection({ props }: FeatureGridSectionProps) {
  const { heading, features } = props as unknown as FeatureGridProps;

  return (
    <section className="py-24 px-6 bg-background border-b border-border" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl space-y-16">
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-accent px-3 py-1 text-xs font-semibold text-primary">
            <span>FEATURES</span>
          </div>
          <h2 
            id="features-heading" 
            className="text-[32px] font-semibold tracking-tight text-foreground max-w-3xl leading-tight font-sans"
          >
            {heading}
          </h2>
        </div>

        {/* Dynamic Split Layout: Mock Dashboard Widget + Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mock Interactive Widget Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Widget 1: Analytics Graphic */}
            <Card className="border border-border bg-card rounded-xl p-5 shadow-none flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Performance Engine</span>
                <span className="text-[10px] font-semibold text-primary bg-accent px-2 py-0.5 rounded border border-primary/10">Active</span>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-bold text-foreground">99.98%</span>
                <span className="text-xs text-muted-foreground block">Global content delivery latency</span>
              </div>
              {/* CSS Line Chart SVG */}
              <div className="h-20 w-full pt-4">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path
                    d="M0,25 Q15,22 30,12 T60,18 T90,5 T100,2"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,25 Q15,22 30,12 T60,18 T90,5 T100,2 L100,30 L0,30 Z"
                    fill="rgba(224,145,69,0.05)"
                  />
                </svg>
              </div>
            </Card>

            {/* Widget 2: Integration Logs */}
            <Card className="border border-border bg-card rounded-xl p-5 shadow-none flex flex-col gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Integrations API</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs border-b border-border pb-1.5">
                  <span className="font-mono text-muted-foreground">GET /api/v1/contentful</span>
                  <span className="font-semibold text-emerald-600 font-mono">200 OK</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-border pb-1.5">
                  <span className="font-mono text-muted-foreground">POST /api/v1/publish</span>
                  <span className="font-semibold text-primary font-mono">202 Sent</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Features Column */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6" role="list">
            {features?.map((feature, index) => (
              <Card 
                key={index} 
                className="border border-border bg-card hover:border-primary/50 transition-colors rounded-xl p-6 relative overflow-hidden shadow-none flex flex-col justify-between"
                role="listitem"
              >
                <CardHeader className="p-0 pb-4 space-y-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-xl border border-border shadow-sm shrink-0">
                    <span aria-hidden="true">
                      {feature.icon}
                    </span>
                  </div>
                  <CardTitle className="text-[20px] font-semibold text-foreground font-sans">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


