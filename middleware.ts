import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PAGES = ["/", "/login", "/register"];
const PROTECTED_PATH = "/dashboard";

const COOKIE_KEYS = [
  "access_token_admin_dev",
  "access_token_admin",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isProtectedRoute = pathname.startsWith(PROTECTED_PATH);

  let authToken: string | null = null;

  // Check for valid cookie
  for (const key of COOKIE_KEYS) {
    const cookie = request.cookies.get(key);
    if (cookie?.value) {
      authToken = cookie.value;
      break;
    }
  }

  // If user is authenticated and tries to access login/register/home
  if (authToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not authenticated and tries to access protected route
  if (!authToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
};
