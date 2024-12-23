import { NextResponse } from "next/server";

export function middleware(req) {
  console.log("Middleware triggered for:", req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // Matches all routes
};
