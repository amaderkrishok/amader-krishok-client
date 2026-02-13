import jwt from 'jsonwebtoken';
import { AccessTokenPayload } from '@/lib/types/auth';

/**
 * Decodes the JWT token WITHOUT verification.
 * Assumes the token structure matches AccessTokenPayload.
 * Returns null if decoding fails or payload is invalid.
 */
export function decodeAccessToken(token: string): AccessTokenPayload | null {
	try {
		const decoded = jwt.decode(token);

		// Basic validation of payload structure
		if (
			!decoded ||
			typeof decoded !== 'object' ||
			!decoded.sub ||
			!decoded.id ||
			!decoded.name ||
			!decoded.phoneNumber ||
			!decoded.role ||
			!decoded.exp // Ensure expiry exists
		) {
			console.error('decodeAccessToken: Invalid payload structure', decoded);
			return null;
		}

		// Add type assertion if confident after checks
		return decoded as AccessTokenPayload;
	} catch (error) {
		console.error('decodeAccessToken: Error decoding token:', error);
		return null;
	}
}
