// ✅ BUG FIX: Ye file project ROOT mein honi chahiye — src/proxy.ts nahi
// Filename: middleware.ts (root level, next to package.json)
// src/proxy.ts DELETE karo aur ye file root mein rakho

import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";

const publicRoutes = ["/", "/login", "/signup", "/api/auth"];

// ✅ Default export hona chahiye — proxy export nahi
export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;

    // Already logged in → login/signup pe redirect to dashboard
    if (
      (pathname === "/login" || pathname === "/signup") &&
      req.nextauth.token
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes — no auth needed
        if (publicRoutes.some((route) => pathname.startsWith(route))) {
          return true;
        }

        // Protected pages
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/projects") ||
          pathname.startsWith("/tasks")
        ) {
          return !!token;
        }

        // API routes — public auth routes allow, rest need token
        if (pathname.startsWith("/api")) {
          if (pathname.startsWith("/api/auth")) return true;
          return !!token;
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/api/:path*",
    "/login",
    "/signup",
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};