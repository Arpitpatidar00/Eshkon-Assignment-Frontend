import type { TestimonialProps } from '@/domain';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialSectionProps {
  props: Record<string, unknown>;
}

export default function TestimonialSection({ props }: TestimonialSectionProps) {
  const { quote, author, role, company, rating } = props as unknown as TestimonialProps;

  // Get author initials (e.g. "Sarah Jenkins" -> "SJ")
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <section className="py-24 px-6 bg-secondary border-b border-border" aria-labelledby="testimonial-author">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Left Side: Mock Growth Metric (2 cols) */}
          <Card className="lg:col-span-2 border border-border bg-card rounded-xl p-6 flex flex-col justify-between shadow-none select-none">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Customer Performance</span>
              <div className="space-y-1">
                <span className="text-3xl font-bold text-foreground">3.4x</span>
                <span className="text-xs text-muted-foreground block">Increase in conversion metrics</span>
              </div>
            </div>
            {/* Smooth bar graph illustration */}
            <div className="space-y-2 pt-6">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground font-mono w-8">Before</span>
                <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-border w-[30%] rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-primary font-mono w-8 font-bold">After</span>
                <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%] rounded-full" />
                </div>
              </div>
            </div>
          </Card>

          {/* Right Side: The testimonial quote (3 cols) */}
          <Card className="lg:col-span-3 border border-border shadow-none bg-card rounded-xl p-6 sm:p-10 flex flex-col justify-between">
            <CardContent className="flex flex-col space-y-6 p-0 h-full justify-between">
              {/* Stars */}
              {rating && (
                <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating 
                          ? "fill-primary text-primary" 
                          : "fill-border text-border"
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}

              {/* Blockquote Quote */}
              <blockquote className="text-base sm:text-lg font-normal leading-relaxed text-foreground font-sans">
                &ldquo;{quote}&rdquo;
              </blockquote>

              {/* Author details with initials avatar */}
              <figcaption className="flex items-center gap-3 pt-6 border-t border-border mt-auto">
                <div className="h-10 w-10 rounded-full bg-accent text-primary font-bold flex items-center justify-center text-xs border border-primary/20 select-none shrink-0">
                  {getInitials(author)}
                </div>
                <div className="text-left flex flex-col">
                  <span id="testimonial-author" className="font-semibold text-sm text-foreground leading-tight">
                    {author}
                  </span>
                  {(role || company) && (
                    <span className="text-xs text-muted-foreground leading-normal mt-0.5">
                      {role}{role && company ? " @ " : ""}{company}
                    </span>
                  )}
                </div>
              </figcaption>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}


