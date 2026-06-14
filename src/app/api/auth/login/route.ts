import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Forward login request to Express backend
    const backendRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    // Set the JWT token and user info as HttpOnly cookies
    const response = NextResponse.json({
      status: "success",
      user: data.data.user,
    });

    // Non-HttpOnly cookie for the short-lived access token so client-side apiClient can read and inject it into headers
    response.cookies.set("page-studio-token", data.data.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    // Secure HttpOnly cookie for the long-lived refresh token
    response.cookies.set("page-studio-refresh", data.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Non-HttpOnly cookie for the session (so client JS can read user info)
    response.cookies.set(
      "page-studio-session",
      JSON.stringify(data.data.user),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      },
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Login service unavailable" },
      { status: 503 },
    );
  }
}
