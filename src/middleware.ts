// middleware.ts

import { verifyToken } from '@/components/pages/sign-up/endpoint';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('accessToken')?.value; // Adjust if using another storage method
    const isOnboarded = request.cookies.get('isOnboarded')?.value; // Adjust if using another storage method
    const referer = request.headers.get('Referer'); // Get the Referer header

    const publicRoutes = ['/sign-in', '/sign-up', '/reset-password', '/forgot-password']

    // Skip public routes and API routes (if desired)
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);


    console.log("first", referer)
    // console.log("second", cookies)

    // Allow access to CSS and static files
    if (
        request.nextUrl.pathname.startsWith('/_next/') || // Next.js static files
        request.nextUrl.pathname.startsWith('/public/') || // Public assets
        request.nextUrl.pathname.startsWith('/assets/') // Your asset folder if applicable
    ) {
        return NextResponse.next();
    }

    // console.log(request.nextUrl, "request.nextUrl")

    // Redirect to login if trying to access a protected route without a token
    if (!isPublicRoute && !token) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }


    // If token is present, verify it
    if (token) {
        const isValid = await verifyToken(token);

        if (!isValid) {
            // Redirect to login if token is invalid
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }


        if (isPublicRoute) {
            const redirectUrl = referer ? new URL(referer).href : (isOnboarded == 'false' ? new URL('/onboarding', request.url).href : new URL('/', request.url).href); // Fallback to home if no referrer
            return NextResponse.redirect(redirectUrl);
        }


    }

    return NextResponse.next();
}
