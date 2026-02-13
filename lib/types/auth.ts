import { JwtPayload } from 'jsonwebtoken';

// Payload decoded from your accessToken
export interface AccessTokenPayload extends JwtPayload {
	sub: string;
	id: string;
	name: string;
	phoneNumber: string;
	role: string;
	storeId: string | null;
	iat?: number;
	exp?: number;
}

// Structure for the user object in the session
export interface SessionUser {
	id: string;
	name: string;
	phoneNumber: string;
	role: string;
	storeId?: string | null;
	image?: string | null; // URL to the user's image
	// Add any other non-sensitive fields you want readily available
}

// Structure for the overall session state
export interface Session {
	user: SessionUser | null;
	accessToken: string | null; // The JWT accessToken itself
	expires: number | null; // Expiry timestamp (in ms) of the accessToken
}

// Structure for the session context value
export interface SessionContextValue {
	data: Session | null;
	user: SessionUser | null;
	status: 'loading' | 'authenticated' | 'unauthenticated';
	error: string | null;
	update: (newSession?: Session | null) => Promise<void>;
	refreshSession: () => Promise<boolean>;
	logout: () => Promise<boolean>;
	updateStoreId: (storeId: string) => Promise<boolean>;
	hasRole: (role: string | string[]) => boolean;
	hasStore: () => boolean;
	isAuthenticated: boolean;
	isLoading: boolean;
}
