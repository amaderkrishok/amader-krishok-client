/**
 * @file route.ts
 * @description Next.js API route handler for token refresh operations.
 * This API endpoint acts as a proxy between the frontend client and the backend authentication server.
 * It handles refresh token validation, session updates, and cookie management.
 *
 * The authentication system follows a pattern where:
 * - Short-lived access tokens are used for API authorization
 * - HTTP-only cookies store refresh tokens for secure token renewal
 * - This proxy route handles the secure exchange and updates client session state
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decodeAccessToken } from '@/lib/utils/jwt';
import { saveSession, getSession } from '@/lib/utils/session';
import { Session, SessionUser } from '@/lib/types/auth';
import { REFRESH_COOKIE_NAME_BACKEND } from '@/lib/config/cookies';

/**
 * Handles POST requests to refresh authentication tokens.
 *
 * This route implements a proxy pattern that:
 * 1. Forwards the client's refresh token cookie to the backend auth server
 * 2. Receives a new access token if refresh is successful
 * 3. Decodes the new access token to extract user data and expiration time
 * 4. Creates and saves an updated session with the user profile and new token
 * 5. Mirrors any refresh token cookies from the backend to maintain session
 * 6. Returns the updated session data to the client for immediate use
 *
 * Security considerations:
 * - Refresh tokens are stored only in HTTP-only cookies for XSS protection
 * - Cookies use SameSite policy to prevent CSRF attacks
 * - Secure flag is enabled in production environments
 * - Token validation occurs before session update
 *
 * Error handling:
 * - Configuration errors return 500 with diagnostic message
 * - Backend errors are propagated with appropriate status codes
 * - Validation failures return 500 with specific error context
 * - Unexpected errors are caught and logged with generic 500 response
 *
 * @async
 * @function POST
 * @param {NextRequest} req - The incoming Next.js request object containing cookies
 * @returns {Promise<NextResponse>} JSON response with refreshed token data or error message
 *
 * @example
 * // Client-side usage to refresh an expired token:
 * const response = await fetch('/api/auth/refresh', {
 *   method: 'POST',
 *   credentials: 'include' // Important: needed to include cookies
 * });
 *
 * if (response.ok) {
 *   const data = await response.json();
 *   // data contains: {
 *   //   message: "Token refreshed successfully",
 *   //   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   //   session: { user: {...}, accessToken: "...", expires: 1621234567890 }
 *   // }
 *   console.log("New token valid until:", new Date(data.session.expires));
 * } else {
 *   // Handle refresh failure - typically redirecting to login
 *   const error = await response.json();
 *   console.error("Token refresh failed:", error.error);
 * }
 */
export async function POST(req: NextRequest) {
	try {
		// Step 1: Validate environment configuration
		const backendUrl = process.env.BACKEND_URL;
		if (!backendUrl) {
			console.error('Refresh API: BACKEND_URL not configured.');
			return NextResponse.json(
				{ error: 'Internal server configuration error' },
				{ status: 500 }
			);
		}

		// Step 2: Forward request to backend authentication server
		// The refresh token should already be in the cookies
		const backendResponse = await fetch(`${backendUrl}/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Cookie: req.headers.get('cookie') || '', // Forward cookies from client request
			},
			credentials: 'include',
		});

		console.log(
			'All response headers:',
			Object.fromEntries(backendResponse.headers.entries())
		);

		// Step 3: Handle backend errors
		if (!backendResponse.ok) {
			console.error(
				'Refresh API: Backend refresh failed:',
				backendResponse.status,
				backendResponse
			);
			return NextResponse.json(
				{ error: 'Failed to refresh token' },
				{ status: backendResponse.status }
			);
		}

		// Step 4: Process successful response
		const backendData = await backendResponse.json();

		// Step 5: Extract and validate access token
		const accessToken = backendData?.data?.accessToken;
		if (!accessToken || typeof accessToken !== 'string') {
			console.error(
				'Refresh API: Access Token not found in backend response:',
				backendData
			);
			return NextResponse.json(
				{ error: 'Token refresh failed: Invalid response from server' },
				{ status: 500 }
			);
		}

		// Step 6: Decode token to extract user profile and expiration
		const decodedPayload = decodeAccessToken(accessToken);
		if (!decodedPayload || !decodedPayload.exp) {
			console.error(
				'Refresh API: Failed to decode access token or missing expiry:',
				decodedPayload
			);
			return NextResponse.json(
				{ error: 'Token refresh failed: Invalid token received' },
				{ status: 500 }
			);
		}

		// Step 7: Get current session (if any) to preserve additional data
		const currentSession = await getSession();

		// Step 8: Build user object from token payload
		const user: SessionUser = {
			id: decodedPayload.id,
			name: decodedPayload.name,
			phoneNumber: decodedPayload.phoneNumber,
			role: decodedPayload.role,
			storeId: decodedPayload.storeId,
		};

		// Step 9: Create new session data with updated token and expiration
		const sessionExpires = decodedPayload.exp * 1000; // Convert expiry to milliseconds
		const sessionData: Session = {
			user,
			accessToken,
			expires: sessionExpires,
		};

		// Step 10: Persist session with iron-session
		await saveSession(sessionData);

		// Step 11: Handle the refresh token cookie directly
		const setCookieHeader = backendResponse.headers.get('set-cookie');
		if (setCookieHeader) {
			console.log('Set-Cookie header received:', setCookieHeader);

			// Match for the refresh token with a non-empty value
			// This regex looks for the pattern: refreshToken=<value> (where value is not empty)
			const refreshTokenRegex = /refreshToken=([^;]+)/;
			const match = setCookieHeader.match(refreshTokenRegex);

			if (match && match[1] && match[1].length > 1) {
				const refreshTokenValue = match[1];
				console.log('Found refresh token value:', refreshTokenValue);

				// Create cookie options
				const cookieOptions = {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					path: '/',
					sameSite:
						process.env.NODE_ENV === 'production'
							? 'none'
							: ('lax' as 'none' | 'lax' | 'strict'),
					// Set maxAge to 7 days (to match your backend)
					maxAge: 604800,
				};

				// Set the cookie using the Next.js cookies API
				const cookieStore = await cookies();
				cookieStore.set(
					REFRESH_COOKIE_NAME_BACKEND,
					refreshTokenValue,
					cookieOptions
				);
				console.log('Refresh token cookie set with value:', refreshTokenValue);
			} else {
				console.warn(
					'Could not find valid refresh token in the Set-Cookie header'
				);
			}
		}

		// Return the response
		return NextResponse.json({
			message: 'Token refreshed successfully',
			accessToken,
			session: sessionData,
		});
	} catch (error) {
		// Step 15: Handle unexpected errors
		console.error('Refresh API error:', error);
		return NextResponse.json(
			{ error: 'Internal server error during token refresh' },
			{ status: 500 }
		);
	}
}
