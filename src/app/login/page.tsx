"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister
      ? JSON.stringify({ name, email, password })
      : JSON.stringify({ email, password });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || (isRegister ? "Registration failed" : "Invalid email or password"));
        setLoading(false);
        return;
      }

      const role = data.user?.role;
      if (role === "viewer") {
        router.push("/preview/home");
      } else {
        router.push("/studio/home");
      }
    } catch {
      setError("Unable to connect to the server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background">
      {/* Left Column: Auth form (5 cols) - Flat Stripe/Linear style */}
      <div className="lg:col-span-5 flex flex-col justify-center px-8 py-12 sm:px-16 md:px-20 bg-card">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <div className="space-y-2 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mt-4">
              Page Studio
            </h1>
            <p className="text-muted-foreground text-sm">
              {isRegister ? "Create a viewer account to preview drafts" : "Sign in to access your builder studio"}
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-foreground text-sm font-medium">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required={isRegister}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary h-10 rounded-lg"
                    autoFocus
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary h-10 rounded-lg"
                  autoFocus={!isRegister}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  minLength={6}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary h-10 rounded-lg"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs text-destructive font-medium" role="alert">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/95 text-white font-medium shadow-sm transition-colors mt-2 h-10 rounded-lg" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading
                  ? (isRegister ? "Creating account..." : "Signing in...")
                  : (isRegister ? "Create Account" : "Sign In")}
              </Button>
            </form>

            <div className="flex flex-col items-start gap-4 pt-4 border-t border-border">
              {isRegister ? (
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setIsRegister(false); setError(""); }}
                    className="font-medium text-primary hover:text-primary/90 transition-colors underline underline-offset-4"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Need a viewer account?{" "}
                    <button
                      type="button"
                      onClick={() => { setIsRegister(true); setError(""); }}
                      className="font-medium text-primary hover:text-primary/90 transition-colors underline underline-offset-4"
                    >
                      Sign up
                    </button>
                  </p>
                  <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <span>Editors and Publishers are seeded by admin</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: High-fidelity Interface Preview (7 cols) - Desktop Only */}
      <div className="hidden lg:flex lg:col-span-7 bg-secondary border-l border-border flex-col items-center justify-center p-12 select-none overflow-hidden relative">
        {/* Mock workspace container */}
        <div className="w-full max-w-2xl border border-border bg-card rounded-xl shadow-sm overflow-hidden flex flex-col aspect-[16/10]">
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
      </div>
    </div>
  );
}
