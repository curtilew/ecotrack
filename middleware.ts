import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-up',
]);

export default clerkMiddleware(async (auth, request) => {
  // Check if the route is a protected route.
  if (!isPublicRoute(request)) {
    // The route is protected. Now check if the user is signed in.
    // With clerkMiddleware, we access auth.userId directly.

      // The user is not signed in, so we need to redirect them.
      // Build the sign-in URL, preserving the protocol and host.

      const { userId } = await auth()


      if (!userId) {
        const signInUrl = new URL('/sign-in', request.url);

        // Add a 'redirect_url' search parameter so Clerk knows where to send
        // the user back to after they log in.
        signInUrl.searchParams.set('redirect_url', request.url);

        // Return the redirect response.
        return NextResponse.redirect(signInUrl);
      }
    }
  });


  export const config = {
  matcher: [
    // Include API routes so auth() works in API endpoints
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Explicitly include API routes
    '/(api|trpc)(.*)',
  ],
};