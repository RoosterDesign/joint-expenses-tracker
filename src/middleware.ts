import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isAuth = request.cookies.get('isAuth');

    // If the "isAuth" cookie is present and equals "true", allow access
    if (isAuth?.value === 'true') {
        return NextResponse.next();
    }

    // Redirect to login if not authenticated
    const url = new URL('/login', request.nextUrl.origin);
    return NextResponse.redirect(url);
}

// Apply middleware to the homepage, archive pages, and dynamic archive routes
export const config = {
    matcher: [
        '/',                      // Protect the homepage
        '/archive/:path*',  // Protect archive pages and dynamic routes
    ],
};
