// middleware.ts

"use-client";

import { checkVerified } from '@/components/pages/sign-up/endpoint';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('verify-token');

    console.log(accessToken, "accessToken")

    const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

    // Allow access to CSS and static files
    if (
        request.nextUrl.pathname.startsWith('/_next/') || // Next.js static files
        request.nextUrl.pathname.startsWith('/public/') || // Public assets
        request.nextUrl.pathname.startsWith('/assets/') // Your asset folder if applicable
    ) {
        return NextResponse.next();
    }

    // If no token and trying to access a protected route, redirect to login
    if (!isPublicRoute && !accessToken) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // If token exists, verify it by calling the API route
    if (accessToken) {
        const verifyResponse = await checkVerified()

        // If the token is invalid, clear the cookie and redirect to login
        if (!verifyResponse.status) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }

    return NextResponse.next();
}
