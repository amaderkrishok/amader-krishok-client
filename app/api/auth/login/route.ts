import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { decodeAccessToken } from '@/lib/utils/jwt';
import { saveSession } from '@/lib/utils/session';
import { Session, SessionUser } from '@/lib/types/auth';
import { REFRESH_COOKIE_NAME_BACKEND } from '@/lib/config/cookies';

export async function POST(req: NextRequest) {
	try {
		const { phoneNumber, password } = await req.json();

		if (!phoneNumber || !password) {
			return NextResponse.json(
				{ message: 'Phone number and password are required' },
				{ status: 400 }
			);
		}

		const backendUrl = process.env.BACKEND_URL;
		if (!backendUrl) {
			console.error('Login API: BACKEND_URL not configured.');
			return NextResponse.json(
				{ message: 'Internal server configuration error' },
				{ status: 500 }
			);
		}

		// 1. Call the actual backend
		const backendResponse = await fetch(`${backendUrl}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({ phoneNumber, password }),
		});

		const backendData = await backendResponse.json();

		if (!backendResponse.ok) {
			console.error(
				'Login API: Backend login failed:',
				backendResponse.status,
				backendData
			);

			return NextResponse.json(
				{
					message: backendData?.error || 'Invalid credentials or backend error',
				},
				{ status: backendResponse.status }
			);
		}

		// 2. Extract accessToken from backend response body
		const accessToken = backendData?.data?.accessToken;
		if (!accessToken || typeof accessToken !== 'string') {
			console.error(
				'Login API: Access Token not found or invalid in backend response:',
				backendData
			);
			return NextResponse.json(
				{
					message: 'Login failed: Invalid response from authentication server',
				},
				{ status: 500 }
			);
		}

		// 3. Decode accessToken to get user details and expiry
		const decodedPayload = decodeAccessToken(accessToken);
		if (!decodedPayload || !decodedPayload.exp) {
			console.error(
				'Login API: Failed to decode access token or missing expiry:',
				decodedPayload
			);
			return NextResponse.json(
				{ message: 'Login failed: Invalid token received' },
				{ status: 500 }
			);
		}

		// 4. Create Session Data
		const user: SessionUser = {
			id: decodedPayload.id,
			name: decodedPayload.name,
			phoneNumber: decodedPayload.phoneNumber,
			role: decodedPayload.role,
			storeId: decodedPayload.storeId,
		};
		const sessionExpires = decodedPayload.exp * 1000; // Convert expiry to milliseconds
		const sessionData: Session = {
			user: user,
			accessToken: accessToken,
			expires: sessionExpires,
		};

		// 5. Save the session using iron-session (this handles encryption and setting the session cookie)
		await saveSession(sessionData); // This function uses cookies() internally

		// 6. Mirror the backend's refreshToken cookie
		const setCookieHeader = backendResponse.headers.get('set-cookie');
		if (setCookieHeader) {
			const parsedCookie = parse(setCookieHeader);
			const refreshTokenValue = parsedCookie[REFRESH_COOKIE_NAME_BACKEND];

			if (refreshTokenValue) {
				const cookieOptions: Record<string, any> = {
					value: refreshTokenValue,
					httpOnly: true, // Assume HttpOnly from backend
					secure: process.env.NODE_ENV === 'production',
					path: parsedCookie.Path || parsedCookie.path || '/',
					sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Match backend logic
				};
				if (parsedCookie['Max-Age'] || parsedCookie['max-age']) {
					cookieOptions.maxAge = parseInt(
						parsedCookie['Max-Age'] || parsedCookie['max-age'],
						10
					);
				} else if (parsedCookie.Expires || parsedCookie.expires) {
					cookieOptions.expires = new Date(
						parsedCookie.Expires || parsedCookie.expires
					);
				}

				// Explicitly set the refreshToken cookie on the response
				const cookieStore = await cookies();
				cookieStore.set(
					REFRESH_COOKIE_NAME_BACKEND,
					cookieOptions.value,
					cookieOptions
				);
				console.log('Login API: Mirrored refreshToken cookie set.');
			} else {
				console.warn(
					`Login API: ${REFRESH_COOKIE_NAME_BACKEND} not found in backend Set-Cookie header.`
				);
			}
		} else {
			console.warn('Login API: Set-Cookie header not received from backend.');
		}
		console.log(
			{ message: 'Login successful', role: user.role },
			{ status: 200 }
		);
		// 7. Return success response (no body needed, session is in cookie)
		return NextResponse.json(
			{ message: 'Login successful', role: user.role },
			{ status: 200 }
		);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('Login API route error:', error.message);
		} else {
			console.error('Login API route error:', error);
		}
		return NextResponse.json(
			{ message: 'Internal server error during login' },
			{ status: 500 }
		);
	}
}
