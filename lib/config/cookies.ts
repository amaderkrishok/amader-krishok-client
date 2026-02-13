import { CookieSerializeOptions } from 'cookie'; // npm install cookie @types/cookie

export const SESSION_COOKIE_NAME = 'app.session-token'; // Choose a unique name
export const REFRESH_COOKIE_NAME_BACKEND = 'refreshToken'; // The name backend uses

const isProduction = process.env.NODE_ENV === 'production';

export const sessionCookieOptions: CookieSerializeOptions = {
	httpOnly: true,
	secure: isProduction,
	path: '/',
	sameSite: 'lax', // 'lax' is a good default for session cookies
	// maxAge: undefined, // Let session expiry be dictated by the JWT expiry within the cookie
	// expires: undefined, // Mutually exclusive with maxAge
	// domain: isProduction ? '.yourdomain.com' : undefined, // Set for subdomains in production
};

// We won't typically set the backend's refresh token cookie directly,
// but these would be its typical options if we needed to mirror it.
export const backendRefreshCookieOptions: CookieSerializeOptions = {
	httpOnly: true,
	secure: isProduction,
	path: '/', // Should match the path backend sets
	sameSite: isProduction ? 'none' : 'lax', // Backend needs 'none' for cross-site in prod (HTTPS required), 'lax' often works for dev
	// maxAge: number // Should match backend's maxAge
};
