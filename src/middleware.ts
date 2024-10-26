// middleware.ts

"use-client";

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkVerified } from './components/pages/sign-up/endpoint';

export async function middleware(request: NextRequest) {
    const accessToken = localStorage.getItem("verify-token");

    const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

    // If no token and trying to access a protected route, redirect to login
    if (!isPublicRoute && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If token exists, verify it by calling the API route
    if (accessToken) {
        const verifyResponse = await checkVerified()

        // If the token is invalid, clear the cookie and redirect to login
        if (!verifyResponse.status) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}
