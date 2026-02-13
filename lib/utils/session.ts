import { Session } from '@/lib/types/auth';
import {
	SESSION_COOKIE_NAME,
	sessionCookieOptions,
} from '@/lib/config/cookies';
// Import IronSession type and the main function
import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { ResponseCookies } from 'next/dist/server/web/spec-extension/cookies'; // Import for type checking

// Ensure SESSION_SECRET is set
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
	throw new Error(
		'Missing or insecure SESSION_SECRET environment variable. Needs to be at least 32 characters long.'
	);
}

// Define the shape of the data stored within the IronSession object
// Use this interface as the generic type for IronSession<SessionData>
interface SessionData {
	session?: Session | null;
}

// Type alias for the session object we get from iron-session
type AppSession = IronSession<SessionData>;

/**
 * Gets the current session data from the encrypted cookie.
 * Returns null if no session exists or decryption fails.
 */
export async function getSession(
	// Accept ReadonlyRequestCookies (from middleware/server components)
	// or ResponseCookies (from route handlers via cookies())
	providedCookies?: ReadonlyRequestCookies | ResponseCookies
): Promise<Session | null> {
	try {
		// Determine the correct cookie store to use.
		// getIronSession needs an object with at least a `get` method for reading.
		// Both ReadonlyRequestCookies and ResponseCookies have `get`.
		// If no store is provided, use cookies() from next/headers.
		const store = providedCookies || (await cookies());

		// Pass the store directly. getIronSession should handle reading.
		// The TS error on this line might be overly strict or indicate a version mismatch.
		// Using type assertion as a workaround for potential incorrect type inference.
		const ironSession: AppSession = await getIronSession<SessionData>(
			store as ReadonlyRequestCookies, // Assert as the base readable type
			{
				cookieName: SESSION_COOKIE_NAME,
				password: process.env.SESSION_SECRET!,
				cookieOptions: {
					// Read-only options
					secure: process.env.NODE_ENV === 'production',
				},
			}
		);
		const session = ironSession.session; // Get the session data

		// --- ADD EXPIRY CHECK ---
		if (session && session.expires !== null && session.expires < Date.now()) {
			console.log('getSession: Session found but expired.');
			// Optionally destroy the expired session here if called from a writable context,
			// but getSession might be called read-only (middleware).
			// await destroySession(); // Be careful where you call this
			return null; // Return null for expired sessions
		}
		// --- END EXPIRY CHECK ---

		return session ?? null; // Return valid session or null
	} catch (error) {
		console.error('getSession: Error retrieving session:', error);
		return null;
	}
}

/**
 * Saves the provided session data into an encrypted cookie.
 * Handles setting the cookie on the response via the iron-session instance.
 * MUST be called from a context where cookies() provides write access (Route Handlers, Server Actions).
 */
export async function saveSession(sessionData: Session | null): Promise<void> {
	try {
		// In Route Handlers/Server Actions, cookies() returns ResponseCookies, which has .set()
		// The TS error suggesting await or type mismatch is likely incorrect for this context.
		const cookieStore = await cookies();

		// Using type assertion to satisfy TypeScript, as cookies() in Route Handlers
		// returns the correct object type for writing at runtime.
		const ironSession: AppSession = await getIronSession<SessionData>(
			cookieStore,
			{
				cookieName: SESSION_COOKIE_NAME,
				password: process.env.SESSION_SECRET!,
				cookieOptions: sessionCookieOptions, // Use the full options for writing
			}
		);

		if (sessionData === null) {
			ironSession.destroy();
		} else {
			ironSession.session = sessionData;
		}
		await ironSession.save();
		console.log('saveSession: Session data saved/updated.');
	} catch (error) {
		console.error('saveSession: Error saving session:', error);
		throw new Error('Failed to save session.');
	}
}

/**
 * Destroys the current session by clearing the session cookie.
 * MUST be called from a context where cookies() provides write access (Route Handlers, Server Actions).
 */
export async function destroySession(): Promise<void> {
	try {
		const cookieStore = await cookies(); // Await the promise to resolve
		const ironSession: AppSession = await getIronSession<SessionData>(
			cookieStore as ResponseCookies, // Use assertion if TS complains
			{
				cookieName: SESSION_COOKIE_NAME,
				password: process.env.SESSION_SECRET!,
				cookieOptions: sessionCookieOptions, // Use full options
			}
		);
		ironSession.destroy(); // Mark session for destruction
		await ironSession.save(); // Apply destruction (sets removal cookie header)
		console.log('destroySession: Session destroyed and save called.');
	} catch (error) {
		console.error('destroySession: Error destroying session:', error);
	}
}
