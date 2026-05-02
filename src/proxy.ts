import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";

// Define public routes that don't need authentication
const publicRoutes = ["/", "/login", "/signup", "/api/auth"];

// Define admin-only routes
const adminRoutes = ["/admin", "/api/admin"];

export const proxy = withAuth(
  function proxyHandler(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
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

        // Allow public routes
        if (publicRoutes.some((route) => pathname.startsWith(route))) {
          return true;
        }

        // Check admin routes
        if (adminRoutes.some((route) => pathname.startsWith(route))) {
          return token?.role === "ADMIN";
        }

        // Protected dashboard routes requiring authentication
        const protectedDashboardRoutes = ["/dashboard", "/projects"];

        if (
          protectedDashboardRoutes.some((route) => pathname.startsWith(route))
        ) {
          return !!token;
        }

        // API routes protection
        if (pathname.startsWith("/api")) {
          const publicApiRoutes = ["/api/auth"];
          if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
            return true;
          }
          return !!token;
        }

        return true;
      },
    },
  },
);

// Matcher configuration
export const config = {
  matcher: [
    // Protected dashboard routes
    "/dashboard/:path*",
    "/projects/:path*",

    // API routes (except public ones)
    "/api/:path*",

    // Auth routes
    "/login",
    "/signup",

    // Exclude static files and next internals
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
