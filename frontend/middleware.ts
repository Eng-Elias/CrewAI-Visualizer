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

  if (error) {
    console.error("Error fetching session:", error.message);
    return NextResponse.redirect(new URL("/auth", req.url));
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

  return res;
}

export const config = {
  matcher: ["/(authenticated)/:path*", "/auth"],
};
