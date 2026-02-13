import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/session';
import {
	REFRESH_COOKIE_NAME_BACKEND,
	SESSION_COOKIE_NAME,
} from '@/lib/config/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// Import routes from your central definition
import {
	publicRoutes,
	authRoutes,
	publicApiRoutes,
	apiAuthPrefix,
	privateRoutes,
	PRIVATE_API_ROUTE_PREFIX,
	getRedirectPathByRole,
	PRIVATE_API_ROUTE_ADMIN_ANALYTICS,
} from '@/routes/index';

const LOGIN_PATH = '/auth/login';

// --- Console Color Helpers ---
const consoleColors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
};

function logSuccess(message: string): void {
	console.log(`${consoleColors.green}${message}${consoleColors.reset}`);
}

function logError(message: string): void {
	console.log(`${consoleColors.red}${message}${consoleColors.reset}`);
}

function logInfo(message: string): void {
	console.log(`${consoleColors.blue}${message}${consoleColors.reset}`);
}

function logWarning(message: string): void {
	console.log(`${consoleColors.yellow}${message}${consoleColors.reset}`);
}

// --- redirectToLogin function ---
function redirectToLogin(request: NextRequest): NextResponse {
	const { pathname, search } = request.nextUrl;
	// Avoid redirect loop if already on login page
	if (pathname === LOGIN_PATH) {
		return NextResponse.next();
	}
	const callbackUrl = `${pathname}${search}`;
	const loginUrl = new URL(LOGIN_PATH, request.url);
	loginUrl.searchParams.set('callbackUrl', callbackUrl);
	logWarning(`Middleware: Redirecting to login. CallbackURL: ${callbackUrl}`);
	const response = NextResponse.redirect(loginUrl);
	// Attempt cleanup on redirect
	response.cookies.delete(SESSION_COOKIE_NAME);
	response.cookies.delete(REFRESH_COOKIE_NAME_BACKEND);
	return response;
}
// --- End redirectToLogin ---

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const requestCookies = request.cookies;

	// Special case for empty paths or root path after logout
	if (!pathname || pathname === '') {
		logWarning(`Middleware: Empty path detected, redirecting to home`);
		return NextResponse.redirect(new URL('/', request.url));
	}

	// --- 1. Check Public Routes ---
	// Allow access to public pages
	const isPublicRoute = publicRoutes.some(
		(route) => pathname === route || pathname.startsWith(route + '/')
	);
	if (isPublicRoute) {
		logSuccess(`Middleware: Allowing public route: ${pathname}`);
		return NextResponse.next();
	}

	// --- 2. Check Public API Routes ---
	const isPublicApiRoute = publicApiRoutes.some((route) =>
		pathname.startsWith(route)
	);
	if (isPublicApiRoute) {
		logSuccess(`Middleware: Allowing public API route: ${pathname}`);
		return NextResponse.next();
	}

	// --- 3. Check Auth Routes ---
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
	if (isAuthRoute) {
		const currentSession = await getSession(
			requestCookies as unknown as ReadonlyRequestCookies
		);

		// If logged in, redirect from auth pages to the default redirect path
		if (currentSession?.accessToken) {
			const redirectPath = getRedirectPathByRole(currentSession?.user?.role);
			logInfo(
				`Middleware: User already logged in, redirecting from auth route ${pathname} to ${redirectPath}`
			);
			return NextResponse.redirect(new URL(redirectPath, request.url));
		}

		// If not logged in, allow access to auth pages
		logSuccess(`Middleware: Allowing access to auth route: ${pathname}`);
		return NextResponse.next();
	}

	// --- 4. Check Auth API Routes ---
	const isAuthApiRoute = pathname.startsWith(apiAuthPrefix);
	if (isAuthApiRoute) {
		logSuccess(`Middleware: Allowing auth API route: ${pathname}`);
		return NextResponse.next();
	}

	// --- 5. Check Private Routes ---
	const isPrivateRoute = privateRoutes.some((route) =>
		pathname.startsWith(route)
	);
	if (isPrivateRoute) {
		logInfo(`Middleware: Checking session for private route: ${pathname}`);
		const currentSession = await getSession(
			requestCookies as unknown as ReadonlyRequestCookies
		);

		if (!currentSession?.accessToken) {
			logError(
				`Middleware: No valid session found for private route: ${pathname}. Redirecting to login.`
			);
			return redirectToLogin(request);
		}

		logSuccess(
			`Middleware: Valid session found for private route ${pathname}. Proceeding.`
		);
		return NextResponse.next();
	}

	// --- 6. Check Private API Routes ---
	const isPrivateApiRoute =
		pathname.startsWith(PRIVATE_API_ROUTE_PREFIX) ||
		pathname === PRIVATE_API_ROUTE_ADMIN_ANALYTICS;
	if (isPrivateApiRoute) {
		logInfo(`Middleware: Checking session for private API route: ${pathname}`);
		const currentSession = await getSession(
			requestCookies as unknown as ReadonlyRequestCookies
		);

		if (!currentSession?.accessToken) {
			logError(
				`Middleware: Unauthorized access to private API route: ${pathname}`
			);
			return new NextResponse(
				JSON.stringify({
					error: 'Unauthorized',
					message: 'Authentication required',
				}),
				{
					status: 401,
					headers: { 'content-type': 'application/json' },
				}
			);
		}

		logSuccess(
			`Middleware: Valid session found for private API route ${pathname}. Proceeding.`
		);
		return NextResponse.next();
	}

	// --- 7. Default Case: Allow unknown routes to proceed ---
	logInfo(`Middleware: Unmatched route ${pathname} - allowing access`);
	return NextResponse.next();
}

// Define which routes this middleware should run on
export const config = {
	matcher: [
		// Match all routes except static files, images, videos, and specific API routes
		'/((?!_next/static|_next/image|assets|images|videos|icons|favicon.ico|public|api/auth/session).*)',
	],
};
