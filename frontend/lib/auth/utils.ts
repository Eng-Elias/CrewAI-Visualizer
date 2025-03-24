import { AuthError } from "@supabase/supabase-js";

export class AuthenticationError extends Error {
  constructor(message: string = "Authentication failed") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export const isAuthError = (error: unknown): boolean => {
  return (
    error instanceof AuthError ||
    error instanceof AuthenticationError ||
    (error instanceof Error &&
      (error.message.includes("No active session") ||
        error.message.includes("Invalid Refresh Token") ||
        error.message.toLowerCase().includes("unauthorized") ||
        error.message.toLowerCase().includes("unauthenticated")))
  );
};

export const handleAuthError = (error: unknown): never => {
  // Clear any stored auth state if needed
  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/auth";
  }
  throw error;
}; 