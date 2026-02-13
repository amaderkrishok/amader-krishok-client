/**
 * @file token-refresh.ts
 * @description Utilities for JWT token management, including token refresh and session updates.
 * This module provides functions to handle authentication token lifecycle and session state.
 */

import { Session } from '@/lib/types/auth';
import { decodeAccessToken } from '@/lib/utils/jwt';

/**
 * Response interface for the token refresh operation
 * @interface RefreshResponse
 */
interface RefreshResponse {
	/** Indicates whether the refresh operation was successful */
	success: boolean;
	/** The updated session information if successful */
	session?: Session | null;
	/** Error message if the refresh operation failed */
	error?: string;
}

/**
 * Refreshes the authentication token using the refresh token stored in cookies.
 * This function calls the refresh API endpoint and returns the refreshed session data.
 *
 * @async
 * @function refreshToken
 * @returns {Promise<RefreshResponse>} Object containing refresh status, updated session (if successful), or error message
 *
 * @example
 * // Refresh token and handle result
 * const result = await refreshToken();
 * if (result.success) {
 *   console.log('Token refreshed successfully', result.session);
 * } else {
 *   console.error('Token refresh failed:', result.error);
 * }
 */
export async function refreshToken(): Promise<RefreshResponse> {
	try {
		console.log('Attempting to refresh token...');

		// Call the backend refresh endpoint through our Next.js API route
		const response = await fetch('/api/auth/refresh', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include', // Include cookies for refresh token
		});

		// Handle non-success responses
		if (!response.ok) {
			console.error('Token refresh failed:', response.status);
			return {
				success: false,
				error: `Refresh failed with status: ${response.status}`,
			};
		}

		// Parse the response
		const data = await response.json();

		// If we have a new session in the response, return it
		if (data.session) {
			return { success: true, session: data.session };
		}

		// If we have an access token in the response, we need to fetch the updated session
		else if (data.accessToken) {
			// Fetch the updated session to get the complete session object
			const sessionResponse = await fetch('/api/auth/session');
			if (sessionResponse.ok) {
				const updatedSession = await sessionResponse.json();
				return { success: true, session: updatedSession };
			}
		}

		return {
			success: false,
			error: 'Refresh successful but failed to get updated session',
		};
	} catch (error) {
		console.error('Error refreshing token:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

/**
 * Checks if the provided access token is expired or will expire soon.
 * Uses a buffer time to proactively identify tokens that will expire soon.
 *
 * @function isTokenExpiring
 * @param {string | null} token - The JWT access token to check
 * @param {number} [bufferSeconds=30] - How many seconds before actual expiration to consider token as expired
 * @returns {boolean} True if token is null, invalid, expired, or will expire within the buffer time
 *
 * @example
 * // Check if current token is expiring within next 60 seconds
 * const token = currentSession.accessToken;
 * if (isTokenExpiring(token, 60)) {
 *   console.log('Token will expire soon, refreshing...');
 *   await refreshToken();
 * }
 */
export function isTokenExpiring(
	token: string | null,
	bufferSeconds = 30
): boolean {
	if (!token) return true;

	try {
		const decoded = decodeAccessToken(token);
		if (!decoded || !decoded.exp) return true;

		const now = Math.floor(Date.now() / 1000);
		return decoded.exp <= now + bufferSeconds;
	} catch (error) {
		console.error('Error checking token expiration:', error);
		return true;
	}
}

/**
 * Updates the store ID in the user's session data.
 * Useful after vendor registration or store creation to associate a user with their store.
 *
 * @async
 * @function updateStoreIdInSession
 * @param {string} storeId - The store ID to set in the session
 * @returns {Promise<boolean>} True if store ID was successfully updated in the session
 *
 * @example
 * // After store creation, update the user's session
 * const newStoreId = 'store_12345';
 * const success = await updateStoreIdInSession(newStoreId);
 * if (success) {
 *   console.log('Store ID updated in session');
 *   router.push('/vendor/dashboard');
 * }
 */
export async function updateStoreIdInSession(
	storeId: string
): Promise<boolean> {
	try {
		// Get the current session
		const sessionResponse = await fetch('/api/auth/session');
		if (!sessionResponse.ok) return false;

		const currentSession = await sessionResponse.json();
		if (!currentSession) return false;

		// Update the storeId in the user object
		const updatedSession = {
			...currentSession,
			user: {
				...currentSession.user,
				storeId,
			},
		};

		// Save the updated session
		const updateResponse = await fetch('/api/auth/session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedSession),
		});

		return updateResponse.ok;
	} catch (error) {
		console.error('Error updating storeId in session:', error);
		return false;
	}
}
