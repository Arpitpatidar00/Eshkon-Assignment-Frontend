import Link from "next/link";
import { fetchPage, fetchAllSlugs, fetchDraftPage } from "@/contentful";
import { getSession } from "@/auth/session";
import { canEdit } from "@/auth/permissions";
import PageRenderer from "@/components/renderer/PageRenderer";
import LogoutButton from "./LogoutButton";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { page } = await fetchPage(slug);
  return {
    title: page ? `${page.title} — Page Studio Preview` : "Page Not Found",
    description: page ? `Preview of ${page.title}` : "The requested page was not found.",
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getSession();
  const { page, errors } = await fetchPage(slug);
  const allSlugs = await fetchAllSlugs();

  if (!page) {
    const { page: draftPage } = await fetchDraftPage(slug);

    return (
      <div className="flex min-h-screen flex-col bg-secondary">
        <div className="flex flex-1 flex-col items-center justify-center text-center p-6">
          {draftPage ? (
            <div className="max-w-md p-8 bg-card border border-border rounded-xl space-y-6">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Not Published</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The page &ldquo;{slug}&rdquo; exists as a draft, but it has not been published yet.
              </p>
              {user && canEdit(user.role) && (
                <Button asChild className="w-full bg-primary hover:bg-primary/95 text-white rounded-lg">
                  <Link href={`/studio/${slug}`}>Edit in Studio to Publish</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="max-w-md p-8 bg-card border border-border rounded-xl space-y-6">
              <h1 className="text-5xl font-bold tracking-tight text-destructive">404</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Page &ldquo;{slug}&rdquo; not found.
                {errors && errors.length > 0 && (
                  <span className="block mt-2 text-xs">Validation errors: {errors.join(", ")}</span>
                )}
              </p>
            </div>
          )}
          <Button variant="outline" asChild className="mt-6 border-border rounded-lg bg-card text-foreground">
            <Link href="/preview/home">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isViewer = user?.role === "viewer";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {!isViewer && (
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                {page.title}
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-2" aria-label="Page navigation">
              {allSlugs.map((s) => (
                <Button
                  key={s}
                  variant={s === slug ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                  className={s === slug ? "border border-border" : ""}
                >
                  <Link href={`/preview/${s}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:inline-flex items-center rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground capitalize">
                {user.role}
              </span>
            )}
            {user && canEdit(user.role) && (
              <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/95 text-white rounded-lg">
                <Link href={`/studio/${slug}`}>Edit in Studio</Link>
              </Button>
            )}
            <LogoutButton />
          </div>
        </header>
      )}
      <main className="flex-1">
        <PageRenderer page={page} showLogout={isViewer} />
      </main>
    </div>
  );
}

