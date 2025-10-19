import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {

  const response = await auth0.middleware(request);
  if (request.nextUrl.pathname ==='/profile' || request.nextUrl.pathname ==='/moderation') {
      const session =  await auth0.getSession(request)
      if (!session){
        return NextResponse.redirect(new URL('/', request.url))
      }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};