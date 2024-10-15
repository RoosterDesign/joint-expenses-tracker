import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    // Delete the "isAuth" cookie and redirect to the login page
    const response = NextResponse.redirect(new URL('/login', request.nextUrl.origin));
    response.cookies.delete('isAuth');
    return response;
}
