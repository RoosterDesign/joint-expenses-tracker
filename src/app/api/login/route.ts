import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { password } = await request.json();

    // Check password against the environment variable
    const validPassword = process.env.NEXT_PUBLIC_PASSWORD;

    if (password === validPassword) {
        // Set "isAuth" cookie to "true" and redirect to the homepage
        const response = NextResponse.redirect(new URL('/', request.nextUrl.origin));
        response.cookies.set('isAuth', 'true', { httpOnly: true });
        return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
