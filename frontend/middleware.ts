import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // Handle auth errors
  if (error) {
    console.error("Error fetching session:", error.message);
    // Clear any existing session data
    await supabase.auth.signOut();
    const redirectUrl = new URL("/auth", req.url);
    redirectUrl.searchParams.set("error", "session_expired");
    return NextResponse.redirect(redirectUrl);
  }

  // Handle authenticated routes
  if (req.nextUrl.pathname.startsWith("/(authenticated)")) {
    if (!session) {
      // Store the attempted URL to redirect back after login
      const redirectUrl = new URL("/auth", req.url);
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle auth routes when already authenticated
  if (req.nextUrl.pathname.startsWith("/auth") && session) {
    // Redirect to home if trying to access auth pages while logged in
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/(authenticated)/:path*", "/auth/:path*"],
};
