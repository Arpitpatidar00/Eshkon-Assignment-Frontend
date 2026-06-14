/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL =
  process.env.BACKEND_API_URL ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api";

export class ApiError extends Error {
  public readonly status: number;
  public readonly data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/**
 * Read the JWT token from the page-studio-token cookie (browser-side).
 * The cookie is set as non-HttpOnly so client JS can read it.
 */
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("page-studio-token="));
  return match ? match.split("=")[1] : null;
}

// Queue system for handling concurrent requests during a token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Centralized API Client for the frontend.
 * Automatically attaches JWT Bearer token from cookies and handles 401 Refresh logic.
 */
export const apiClient = async <T>(
  endpoint: string,
  options?: RequestInit,
  _retryCount = 0,
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getTokenFromCookie();
  const authHeader = token ? `Bearer ${token}` : undefined;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authHeader ? { Authorization: authHeader } : {}),
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // Handle 401 Unauthorized by attempting to refresh the token
  if (response.status === 401 && _retryCount === 0) {
    if (isRefreshing) {
      // If a refresh is already happening, queue this request
      return new Promise<T>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient<T>(endpoint, options, 1))
        .catch((err) => {
          throw err;
        });
    }

    // Start refreshing
    isRefreshing = true;

    try {
      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshResponse.ok) {
        throw new Error("Session expired. Please log in again.");
      }

      // Refresh successful, unpause queue and retry original request
      processQueue(null);
      return apiClient<T>(endpoint, options, 1);
    } catch (refreshError: any) {
      processQueue(refreshError);

      // Force redirect to login if refresh fails completely
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new ApiError(401, refreshError.message || "Session expired");
    } finally {
      isRefreshing = false;
    }
  }

  // Handle standard errors
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    const message =
      errorData.error || errorData.message || "An unexpected error occurred";
    throw new ApiError(response.status, message, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};
