import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  console.log(`Middleware processing path: ${pathname}`)
  console.log(`Auth token present: ${!!authToken}`)

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/recipes/new", "/recipes/edit"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Admin routes
  const adminRoutes = ["/admin"]
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Auth routes (login, register)
  const authRoutes = ["/login", "/register"]
  const isAuthRoute = authRoutes.some((route) => pathname === route)

  // If trying to access a protected route without being logged in
  if (isProtectedRoute && !authToken) {
    console.log(`Redirecting to login from protected route: ${pathname}`)
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If trying to access an auth route while logged in
  if (isAuthRoute && authToken) {
    console.log(`Redirecting to dashboard from auth route: ${pathname}`)
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Admin routes are handled in the page component to check the user role
  console.log(`Proceeding to next middleware/route handler for: ${pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/recipes/new", "/recipes/edit/:path*", "/admin/:path*", "/login", "/register"],
}
