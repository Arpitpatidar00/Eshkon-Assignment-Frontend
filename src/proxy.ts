import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from '@/domain';

/**
 * Proxy (formerly middleware) — runs before route rendering.
 * Protects /studio/* routes from viewers and unauthenticated users.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read session cookie
  const sessionCookie = request.cookies.get("page-studio-session");
  let userRole: Role | null = null;

  if (sessionCookie?.value) {
    try {
      const parsed = JSON.parse(sessionCookie.value);
      if (parsed?.role) {
        userRole = parsed.role as Role;
      }
    } catch {
      // Invalid cookie
    }
  }

  // Protect /studio/* — requires editor or publisher role
  if (pathname.startsWith("/studio")) {
    if (!userRole) {
      // Not authenticated — redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (userRole === "viewer") {
      // Viewers cannot access studio — redirect to preview
      return NextResponse.redirect(new URL("/preview/home", request.url));
    }
  }

  // Protect /preview/* — requires authentication
  if (pathname.startsWith("/preview")) {
    if (!userRole) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect /api/publish — requires publisher role (additional server-side check in handler)
  if (pathname === "/api/publish" && request.method === "POST") {
    if (!userRole) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    if (userRole !== "publisher") {
      return NextResponse.json(
        { error: "Forbidden: Publisher role required" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/studio/:path*",
    "/preview/:path*",
    "/api/publish",
  ],
};
