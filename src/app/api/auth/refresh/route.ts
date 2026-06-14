import { NextRequest, NextResponse } from "next/server";

const getApiBaseUrl = (): string => {
  let url =
    process.env.BACKEND_API_URL ||
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api";
  url = url.trim();
  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  while (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  if (url && !url.endsWith("/api")) {
    url = `${url}/api`;
  }
  return url;
};

const API_BASE = getApiBaseUrl();

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("page-studio-refresh")?.value;

    if (!refreshToken) {
      return NextResponse.json({ status: "error", message: "No refresh token available" }, { status: 401 });
    }

    // Forward to Express backend
    const backendRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      // If refresh fails (e.g. token expired/invalid), we should clear cookies
      const response = NextResponse.json(data, { status: backendRes.status });
      response.cookies.delete("page-studio-token");
      response.cookies.delete("page-studio-refresh");
      response.cookies.delete("page-studio-session");
      return response;
    }

    const response = NextResponse.json({ status: "success" });

    // Non-HttpOnly cookie for the new access token so client-side apiClient can read and inject it into headers
    response.cookies.set("page-studio-token", data.data.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    // Secure HttpOnly cookie for the rotated refresh token (if backend gave one)
    if (data.data.refreshToken) {
      response.cookies.set("page-studio-refresh", data.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Refresh service unavailable" },
      { status: 503 },
    );
  }
}
