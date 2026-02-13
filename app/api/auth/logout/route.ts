import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { destroySession } from '@/lib/utils/session';
import {
	REFRESH_COOKIE_NAME_BACKEND,
	SESSION_COOKIE_NAME,
	sessionCookieOptions, // Import options used for setting the session cookie
} from '@/lib/config/cookies';

/**
 * Helper function to attempt calling the backend logout endpoint.
 * Logs errors but does not throw, allowing frontend logout to proceed.
 */
async function tryCallBackendLogout(req: NextRequest): Promise<void> {
	const backendUrl = process.env.BACKEND_URL;
	if (!backendUrl) {
		console.warn(
			'Logout API: BACKEND_URL not configured. Skipping backend logout call.'
		);
		return;
	}

	try {
		console.log('Logout API: Calling backend logout endpoint...');
		const backendResponse = await fetch(`${backendUrl}/auth/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// Forward cookies so backend can identify the refresh token
				Cookie: req.headers.get('Cookie') || '',
			},
		});

		if (!backendResponse.ok) {
			const errorData = await backendResponse.text();
			console.warn(
				`Logout API: Backend logout call failed (Status: ${backendResponse.status}). Error: ${errorData}`
			);
		} else {
			console.log('Logout API: Backend logout call successful.');
			// Backend's response should include Set-Cookie headers to clear its refreshToken
		}
	} catch (backendError) {
		console.warn(
			'Logout API: Error calling backend logout endpoint.',
			backendError
		);
	}
}

/**
 * Helper function to explicitly delete a cookie using Next.js's mutable cookie store.
 * Logs errors but does not throw.
 */
async function tryDeleteCookie(
	cookieStore: Awaited<ReturnType<typeof cookies>>,
	name: string,
	options: { path?: string; domain?: string } = {}
): Promise<void> {
	try {
		cookieStore.set(name, '', {
			...options,
			maxAge: -1, // Setting maxAge to -1 effectively deletes the cookie
		});
		console.log(
			`Logout API: Explicitly deleted cookie "${name}" with path: ${options.path}, domain: ${options.domain}`
		);
	} catch (deleteErr) {
		console.error(
			`Logout API: Error explicitly deleting cookie "${name}":`,
			deleteErr
		);
	}
}

/**
 * POST handler for the /api/auth/logout route.
 * Handles logging out the user by:
 * 1. Optionally calling the backend logout endpoint.
 * 2. Destroying the frontend iron-session.
 * 3. Explicitly clearing frontend session and backend refresh token cookies.
 */
export async function POST(req: NextRequest) {
	console.log('Logout API: Received logout request.');
	// Get the mutable cookie store to modify response cookies
	const cookieStore = await cookies();
	try {
		// 1. Attempt to call backend logout (optional, handles its own errors)
		await tryCallBackendLogout(req);

		// 2. Attempt to destroy iron-session (primary way to clear session cookie)
		try {
			await destroySession();
			console.log(
				`Logout API: Attempted destroySession() for ${SESSION_COOKIE_NAME}.`
			);
		} catch (destroyErr) {
			console.error(
				'Logout API: Error during destroySession call:',
				destroyErr
			);
			// Continue cleanup even if this fails
		}

		// 3. Explicitly delete cookies as a robust measure
		// Delete frontend session cookie (using options from config)
		tryDeleteCookie(cookieStore, SESSION_COOKIE_NAME, {
			path: sessionCookieOptions.path,
			domain: sessionCookieOptions.domain,
		});

		// Delete backend refresh token cookie (assuming path='/')
		tryDeleteCookie(cookieStore, REFRESH_COOKIE_NAME_BACKEND, {
			path: '/', // Adjust if backend uses a different path
			// domain: 'your-domain.com' // Add domain if backend sets one
		});

		// 4. Return success response - cleanup actions were attempted
		console.log('Logout API: Logout process complete. Returning success.');
		return NextResponse.json(
			{ message: 'Logged out successfully' },
			{ status: 200 }
		);
	} catch (error: any) {
		// Catch unexpected errors during the overall process
		console.error('Logout API route unexpected error:', error);

		// Attempt cleanup again in case of unexpected error before completion
		tryDeleteCookie(cookieStore, SESSION_COOKIE_NAME, {
			path: sessionCookieOptions.path,
			domain: sessionCookieOptions.domain,
		});
		tryDeleteCookie(cookieStore, REFRESH_COOKIE_NAME_BACKEND, { path: '/' });

		return NextResponse.json(
			{ message: 'Internal server error during logout' },
			{ status: 500 }
		);
	}
}
