/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
	'/',
	'/about',
	'/team',
	'/weather',
	'/crop-calculator',
	'/crop-cultivation',
	'/contact',
	'/carrer',
	'/post',
	'/static',
];

export const publicApiRoutes = ['/api/weather','/api/health'];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
	'/auth/login',
	'/auth/demo',
	'/auth/register',
	'/auth/error',
	'/auth/reset',
	'/auth/new-password',
	'/auth/forget-password',
];

/**
 * The prefix for api authentication route
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The prefix for private API routes
 * These are server-side API routes that require authentication for access.
 * Example: Fetching user data, updating settings, etc.
 * @type {string}
 */
export const PRIVATE_API_ROUTE_PREFIX = '/api/dashboard';
export const PRIVATE_API_ROUTE_ADMIN_ANALYTICS = '/api/analytics';
/**
 * The prefix for private routes
 * These are server-side API routes that require authentication for access.
 * Example: Fetching user data, updating settings, etc.
 * @type {string}
 */
export const privateRoutes = [
	'/user',
	'/admin',
	'/vendor',
	'/moderator',
	'/session',
	'/register/shop',
];

/**
 * The prefix for private (authenticated) routes
 * These routes require users to be logged in and will redirect to /auth/login if unauthenticated.
 * Example: Dashboard, user settings, etc.
 * @type {string}
 */
export const PRIVATE_ROUTE_PREFIX = '/dashboard';

/**
 * Enum for user roles that matches the backend roles
 * @enum {string}
 */
export enum UserRole {
	ADMIN = 'admin',
	MODERATOR = 'modreator', // Note: This matches your backend spelling
	VENDOR = 'vendor',
	USER = 'user',
}

/**
 * Function to get the default redirect path based on user role
 * @param {string | undefined} role - The user's role
 * @returns {string} The appropriate dashboard route for the user role
 */
export const getRedirectPathByRole = (role?: string): string => {
	switch (role) {
		case UserRole.ADMIN:
			return '/admin/dashboard';
		case UserRole.MODERATOR:
			return '/moderator/dashboard';
		case UserRole.VENDOR:
			return '/vendor/dashboard';
		case UserRole.USER:
			return '/user';
		default:
			return '/dashboard'; // Fallback path
	}
};

/**
 * The default redirect path after logging in (for middleware)
 * Note: This should be used in middleware where user role is available
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/';
