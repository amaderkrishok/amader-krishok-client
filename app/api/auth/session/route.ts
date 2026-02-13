import { NextRequest, NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/utils/session';
import { cookies } from 'next/headers';

export async function GET() {
	try {
		// Pass the request cookies to getSession
		const session = await getSession(await cookies());

		if (!session || !session.accessToken || !session.expires) {
			// No active session or invalid session data
			return NextResponse.json(null, { status: 200 }); // Return null, not an error
		}

		// Optional: Check expiry here as well, although middleware should handle most cases
		const now = Date.now();
		if (now >= session.expires) {
			console.log('Session API: Session found but access token expired.');
			// Ideally middleware would have caught this, but as a fallback:
			// You could try triggering a refresh here, but it's complex from a GET request.
			// Best to return null and let client/middleware handle re-auth.
			// Optionally clear cookies here if needed, but might interfere with refresh attempts.
			return NextResponse.json(null, { status: 200 });
		}

		// Return the session data (user, accessToken, expires)
		return NextResponse.json(session, { status: 200 });
	} catch (error) {
		console.error('Session API Error:', error);
		// Return null in case of errors reading/decrypting session
		return NextResponse.json(null, { status: 200 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const sessionData = await req.json();

		// Validate the session data
		if (!sessionData || !sessionData.user || !sessionData.accessToken) {
			return NextResponse.json(
				{ error: 'Invalid session data' },
				{ status: 400 }
			);
		}

		// Save the updated session
		await saveSession(sessionData);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error updating session:', error);
		return NextResponse.json(
			{ error: 'Failed to update session' },
			{ status: 500 }
		);
	}
}