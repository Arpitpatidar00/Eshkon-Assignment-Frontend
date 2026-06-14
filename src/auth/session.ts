import { cookies } from "next/headers";
import type { User } from "@/domain/types";
import { isValidRole } from "./roles";

const SESSION_COOKIE = "page-studio-session";
const TOKEN_COOKIE = "page-studio-token";

/**
 * Get the current session user from the session cookie (server-side only).
 */
export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionValue) return null;

  try {
    const parsed = JSON.parse(sessionValue);
    if (parsed && typeof parsed === "object" && parsed.id && parsed.role) {
      if (isValidRole(parsed.role)) {
        return parsed as User;
      }
    }
  } catch {
    // Invalid cookie data
  }

  return null;
}

/**
 * Get the JWT token from the HttpOnly cookie (server-side only).
 */
export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value || null;
}

/**
 * Get session user or throw (for protected routes).
 */
export async function requireSession(): Promise<User> {
  const user = await getSession();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export { SESSION_COOKIE, TOKEN_COOKIE };
