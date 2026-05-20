import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || "dev-nextauth-secret-change-me" });
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isAdminApiPath = request.nextUrl.pathname.startsWith("/api/admin");

  if (!token && (isAdminPath || isAdminApiPath)) {
    if (isAdminApiPath) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/admin-login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
