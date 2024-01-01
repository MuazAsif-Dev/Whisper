export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - root page ($)
		 */
		// "/((?!api|_next/static|_next/image|favicon.ico|signin|$).*)",
		"/dashboard",
	],
};
