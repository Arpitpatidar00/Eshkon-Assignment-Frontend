"use client";

import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            padding: "2rem",
            margin: "1rem auto",
            maxWidth: "800px",
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⚠️</div>
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#ef4444",
              marginBottom: "0.5rem",
            }}
          >
            Something went wrong
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#a0a0b8" }}>
            {this.state.error?.message || "An unexpected error occurred while rendering this section."}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
