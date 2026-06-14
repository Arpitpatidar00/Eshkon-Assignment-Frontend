import { fetchDraftPage } from "@/contentful";
import { getSession } from "@/auth/session";
import { redirect } from "next/navigation";
import StudioEditor from "./StudioEditor";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `Studio — ${slug} — Page Studio`,
    description: `Editing ${slug} page in Page Studio`,
  };
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "viewer") {
    redirect(`/preview/${slug}`);
  }

  const { page, errors } = await fetchDraftPage(slug);

  if (!page) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        flexDirection: "column",
        gap: "1rem",
      }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#ef4444" }}>
          Page Not Found
        </h1>
        <p style={{ color: "#a0a0b8" }}>
          Page &ldquo;{slug}&rdquo; could not be loaded.
          {errors && ` Errors: ${errors.join(", ")}`}
        </p>
      </div>
    );
  }

  return <StudioEditor initialPage={page} userRole={user.role} />;
}
