/**
 * @file session-provider.tsx
 * @module SessionProvider
 * @description This file provides authentication session management for the application.
 * It implements a React Context that handles fetching, storing, and updating user session data.
 * The provider manages token refresh, session persistence, and role-based access control utilities.
 */

'use client';

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	ReactNode,
} from 'react';
import { Session, SessionContextValue } from '@/lib/types/auth';
import { refreshToken } from '@/lib/utils/token-refresh';

/**
 * Context for sharing session state throughout the application.
 * Provides access to authentication data and methods for session management.
 * @type {React.Context<SessionContextValue | undefined>}
 */
const SessionContext = createContext<SessionContextValue | undefined>(
	undefined
);

/**
 * Props interface for the SessionProvider component.
 * @interface SessionProviderProps
 */
interface SessionProviderProps {
	/** Child components that will have access to the session context */
	children: ReactNode;
}

/**
 * Provider component that manages authentication state for the application.
 * Handles session fetching, token refreshing, and authentication state management.
 *
 * This component:
 * - Fetches and stores session data from server-side cookies
 * - Provides authentication status (loading, authenticated, unauthenticated)
 * - Handles token refreshing before expiration
 * - Provides utilities for role checking and store verification
 * - Exposes methods for session management through React Context
 *
 * @component
 * @param {SessionProviderProps} props - Component props
 * @param {ReactNode} props.children - Child components that will be wrapped by the provider
 * @returns {JSX.Element} The SessionProvider component
 *
 * @example
 * // Wrap your application with the SessionProvider
 * <SessionProvider>
 *   <App />
 * </SessionProvider>
 */
export const SessionProvider: React.FC<SessionProviderProps> = ({
	children,
}) => {
	/**
	 * State for storing the current session data
	 * Contains user information, access token and expiration time
	 * @type {[Session | null, React.Dispatch<React.SetStateAction<Session | null>>]}
	 */
	const [sessionData, setSessionData] = useState<Session | null>(null);

	/**
	 * State for storing error messages related to authentication operations
	 * @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]}
	 */
	const [error, setError] = useState<string | null>(null);

	/**
	 * State for tracking the authentication status
	 * - 'loading': Initial state when fetching the session
	 * - 'authenticated': User is logged in with a valid session
	 * - 'unauthenticated': No valid session exists or session has expired
	 *
	 * @type {[string, React.Dispatch<React.SetStateAction<'loading' | 'authenticated' | 'unauthenticated'>>]}
	 */
	const [status, setStatus] = useState<
		'loading' | 'authenticated' | 'unauthenticated'
	>('loading');

	/**
	 * Fetches the current session from the server.
	 * Updates session data and authentication status based on the response.
	 * Validates token expiration before considering a session valid.
	 * 
	 * On initial mount (no existing session), sets status to 'loading'.
	 * On subsequent fetches (e.g., refresh), keeps current status to avoid UI flicker.
	 * Uses AbortController with 10s timeout to prevent indefinite hanging.
	 *
	 * @async
	 * @function fetchSession
	 * @returns {Promise<void>}
	 */
	const fetchSession = useCallback(async (isInitial = false) => {
		console.log('SessionProvider: Fetching session...');
		// Only show loading spinner on initial mount, not on subsequent refreshes
		if (isInitial) {
			setStatus('loading');
		}

		// Create abort controller with timeout to prevent hanging requests
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

		try {
			const response = await fetch('/api/auth/session', {
				signal: controller.signal,
			});
			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`Session fetch failed with status: ${response.status}`);
			}
			const data: Session | null = await response.json();

			// Validate session with token and expiration
			if (data?.accessToken && data.expires && Date.now() < data.expires) {
				setSessionData(data);
				setStatus('authenticated');
				console.log('SessionProvider: Session loaded - Authenticated.');
			} else {
				setSessionData(null);
				setStatus('unauthenticated');
				console.log('SessionProvider: Session loaded - Unauthenticated.');
			}
		} catch (error: any) {
			clearTimeout(timeoutId);
			if (error?.name === 'AbortError') {
				console.warn('SessionProvider: Session fetch timed out after 10s');
			} else {
				console.error('SessionProvider: Error fetching session:', error);
			}
			setSessionData(null);
			setStatus('unauthenticated'); // Treat errors/timeouts as unauthenticated
		}
	}, []);

	// Fetch session on initial mount
	useEffect(() => {
		fetchSession(true); // Pass isInitial=true for the first load
	}, [fetchSession]);

	/**
	 * Updates the session data locally and on the server.
	 * If provided with session data, updates the local state and persists to server.
	 * If called without arguments, re-fetches the session from the server.
	 *
	 * @async
	 * @function update
	 * @param {Session | null} [newSessionData] - Optional new session data to set
	 * @returns {Promise<void>}
	 *
	 * @example
	 * // Re-fetch session from server
	 * await update();
	 *
	 * @example
	 * // Update with new session data
	 * await update(newSessionData);
	 *
	 * @example
	 * // Clear session (logout)
	 * await update(null);
	 */
	const update = useCallback(
		async (newSessionData?: Session | null) => {
			if (newSessionData !== undefined) {
				// If specific data is provided (e.g., after login/logout client-side action)
				setSessionData(newSessionData);
				setStatus(newSessionData ? 'authenticated' : 'unauthenticated');

				// Also send the update to the server to persist in cookies
				if (newSessionData) {
					try {
						await fetch('/api/auth/session', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(newSessionData),
						});
						console.log('SessionProvider: Session updated on server');
					} catch (error) {
						console.error(
							'SessionProvider: Failed to update session on server',
							error
						);
					}
				}
			} else {
				// Otherwise, refetch from the server
				await fetchSession();
			}
		},
		[fetchSession]
	);

	/**
	 * Refreshes the authentication token using the refresh token cookie.
	 * Updates the session data with the new token upon success.
	 *
	 * This function is used both manually and by the automatic refresh mechanism.
	 *
	 * @async
	 * @function refreshSession
	 * @returns {Promise<boolean>} True if refresh was successful, false otherwise
	 */
	const refreshSession = useCallback(async () => {
		console.log('SessionProvider: Refreshing token...');
		setError(null);
		try {
			const result = await refreshToken();
			if (result.success && result.session) {
				setSessionData(result.session);
				setStatus('authenticated');
				console.log('SessionProvider: Token refreshed successfully');
				return true;
			} else {
				setError(result.error || 'Failed to refresh session');
				console.error('SessionProvider: Token refresh failed:', result.error);
				return false;
			}
		} catch (error) {
			console.error('SessionProvider: Token refresh error:', error);
			setError(error instanceof Error ? error.message : 'Unknown error');
			return false;
		}
	}, []);

	/**
	 * Logs the user out by calling the logout API endpoint.
	 * Clears the session data and updates authentication status on success.
	 *
	 * @async
	 * @function logout
	 * @returns {Promise<boolean>} True if logout was successful, false otherwise
	 */
	const logout = useCallback(async () => {
		try {
			const response = await fetch('/api/auth/logout', {
				method: 'POST',
			});

			if (response.ok) {
				setSessionData(null);
				setStatus('unauthenticated');
				console.log('SessionProvider: User logged out successfully');
			} else {
				console.error('SessionProvider: Logout failed:', response.status);
				setError('Failed to log out');
			}
			return response.ok;
		} catch (error) {
			console.error('SessionProvider: Logout error:', error);
			setError(error instanceof Error ? error.message : 'Unknown error');
			return false;
		}
	}, []);

	/**
	 * Updates the store ID in the user's session data.
	 * Used after vendor registration or store creation.
	 *
	 * @async
	 * @function updateStoreId
	 * @param {string} storeId - The store ID to set in the session
	 * @returns {Promise<boolean>} True if update was successful, false otherwise
	 */
	const updateStoreId = useCallback(
		async (storeId: string) => {
			if (!sessionData || !sessionData.user) return false;

			try {
				// Create a new session object with the updated store ID
				const updatedSession = {
					...sessionData,
					user: {
						...sessionData.user,
						storeId: storeId,
					},
				};

				// Update both local state and server-side session
				await update(updatedSession);
				console.log('SessionProvider: Store ID updated successfully');
				return true;
			} catch (error) {
				console.error('SessionProvider: Error updating store ID:', error);
				setError(error instanceof Error ? error.message : 'Unknown error');
				return false;
			}
		},
		[sessionData, update, setError]
	);

	/**
	 * Sets up automatic token refresh based on token expiration time.
	 * Calculates optimal refresh time with a 5-minute buffer before expiration.
	 * Ensures minimum refresh interval of 30 seconds to prevent excessive API calls.
	 *
	 * The effect is re-triggered when:
	 * - Authentication status changes
	 * - Session expiration time changes
	 * - refreshSession function reference changes
	 */
	useEffect(() => {
		// Only set up refresh interval if authenticated
		if (status !== 'authenticated' || !sessionData?.expires) return;

		// Calculate time until token expires (with 5 minute buffer)
		const timeToExpiry = sessionData.expires - Date.now() - 5 * 60 * 1000;
		const refreshTime = Math.max(timeToExpiry, 30000); // At least 30 seconds

		console.log(
			`SessionProvider: Setting token refresh in ${Math.floor(
				refreshTime / 1000
			)} seconds`
		);

		const refreshInterval = setInterval(() => {
			refreshSession();
		}, refreshTime);

		// Clean up interval on unmount or when dependencies change
		return () => clearInterval(refreshInterval);
	}, [status, sessionData?.expires, refreshSession]);

	/**
	 * Checks if the current user has a specific role or one of multiple roles.
	 *
	 * @function hasRole
	 * @param {string | string[]} role - Role(s) to check against
	 * @returns {boolean} True if user has the specified role, false otherwise
	 *
	 * @example
	 * // Check for a single role
	 * if (hasRole('admin')) {
	 *   // Show admin features
	 * }
	 *
	 * @example
	 * // Check for multiple roles
	 * if (hasRole(['admin', 'moderator'])) {
	 *   // Show content management features
	 * }
	 */
	const hasRole = useCallback(
		(role: string | string[]): boolean => {
			if (!sessionData?.user?.role) return false;

			if (Array.isArray(role)) {
				return role.includes(sessionData.user.role);
			}

			return sessionData.user.role === role;
		},
		[sessionData?.user?.role]
	);

	/**
	 * Checks if the current user (vendor) has an associated store.
	 *
	 * @function hasStore
	 * @returns {boolean} True if user has a store ID, false otherwise
	 *
	 * @example
	 * // Check if vendor has a store
	 * if (hasStore()) {
	 *   // Show store management features
	 * } else {
	 *   // Show store creation workflow
	 * }
	 */
	const hasStore = useCallback((): boolean => {
		return !!sessionData?.user?.storeId;
	}, [sessionData?.user?.storeId]);

	/**
	 * The complete value object provided to the SessionContext.
	 * Contains all session data, status, and management functions.
	 *
	 * @type {SessionContextValue}
	 */
	const contextValue: SessionContextValue = {
		data: sessionData,
		user: sessionData?.user || null,
		status,
		error,
		update,
		refreshSession,
		logout,
		updateStoreId,
		hasRole,
		hasStore,
		isAuthenticated: status === 'authenticated',
		isLoading: status === 'loading',
	};

	return (
		<SessionContext.Provider value={contextValue}>
			{children}
		</SessionContext.Provider>
	);
};

/**
 * Custom hook to access the session context from any component.
 * Provides access to authentication state and session management functions.
 *
 * @function useSession
 * @returns {SessionContextValue} The session context value containing session data and methods
 * @throws {Error} If used outside of a SessionProvider
 *
 * @example
 * // Basic usage
 * const { user, status, isAuthenticated } = useSession();
 *
 * @example
 * // Access authentication status
 * const { isAuthenticated, isLoading } = useSession();
 * if (isLoading) return <LoadingSpinner />;
 * if (!isAuthenticated) return <LoginForm />;
 *
 * @example
 * // Role-based rendering
 * const { hasRole } = useSession();
 * if (hasRole('admin')) {
 *   return <AdminDashboard />;
 * }
 *
 * @example
 * // Vendor store checking
 * const { hasRole, hasStore } = useSession();
 * if (hasRole('vendor') && !hasStore()) {
 *   return <StoreCreationForm />;
 * }
 *
 * @example
 * Logout functionality
 * const { logout } = useSession();
 * const handleLogout = async () => {
 *   await logout();
 *   router.push('auth/login');
 * };
 */
export const useSession = (): SessionContextValue => {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error('useSession must be used within a SessionProvider');
	}
	return context;
};
