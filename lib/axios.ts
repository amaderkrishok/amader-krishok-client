/**
 * @file axios.ts
 * @description Axios instance configuration with authentication interceptors
 * This module sets up a pre-configured axios instance with automatic token management,
 * including token refresh before expiration and request authentication.
 */

import axios, { InternalAxiosRequestConfig } from 'axios';
import { Session } from './types/auth';
import { isTokenExpiring, refreshToken } from './utils/token-refresh';

/**
 * Create a pre-configured Axios instance for API requests
 * - Sets the base URL from environment variables
 * - Configures default headers and credentials behavior
 */
const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true, // Important for sending cookies (refresh token)
});

/**
 * Flag to track if a token refresh is in progress
 * Prevents multiple simultaneous refresh attempts
 * @type {boolean}
 */
let isRefreshing = false;

/**
 * Store for requests that are waiting for a token refresh to complete
 * @type {Array<Function>}
 */
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Cache mechanism for the current session promise
 * Prevents multiple simultaneous session fetch requests
 * @type {Promise<Session | null> | null}
 */
let sessionPromise: Promise<Session | null> | null = null;

/**
 * Fetches the current session data from the API
 * Uses request caching to avoid redundant calls
 *
 * @function getClientSession
 * @returns {Promise<Session | null>} Promise resolving to session data or null
 */
const getClientSession = (): Promise<Session | null> => {
	if (!sessionPromise) {
		sessionPromise = fetch('/api/auth/session')
			.then((res) => {
				if (!res.ok) {
					sessionPromise = null;
					return null;
				}
				return res.json();
			})
			.then((data: Session | null) => {
				if (!data?.accessToken) {
					sessionPromise = null;
					return null;
				}
				return data;
			})
			.catch((err) => {
				console.error('Error fetching client session:', err);
				sessionPromise = null;
				return null;
			});
	}
	return sessionPromise;
};

/**
 * Clears the session promise cache
 * Should be called when the session is invalidated
 *
 * @function clearSessionCache
 */
const clearSessionCache = (): void => {
	sessionPromise = null;
};

/**
 * Notifies all subscribers that a new token is available
 *
 * @function onRefreshed
 * @param {string} token - The new access token
 */
const onRefreshed = (token: string): void => {
	refreshSubscribers.forEach((callback) => callback(token));
	refreshSubscribers = [];
};

/**
 * Adds a callback to the subscribers list
 * Will be called when token refresh completes
 *
 * @function addSubscriber
 * @param {Function} callback - Function to call after token refresh
 */
const addSubscriber = (callback: (token: string) => void): void => {
	refreshSubscribers.push(callback);
};

/**
 * Request interceptor that handles authentication tokens
 * - Checks if token is about to expire and refreshes if needed
 * - Adds authentication header to outgoing requests
 */
api.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		// Skip token handling for the refresh endpoint itself
		if (config.url?.includes('/api/auth/refresh')) {
			return config;
		}

		// Only add token if Authorization header doesn't already exist
		if (!config.headers['Authorization']) {
			try {
				let session = await getClientSession();

				// Check if token exists and is close to expiring (within 2 minutes)
				if (session?.accessToken && isTokenExpiring(session.accessToken, 120)) {
					console.log('Axios Interceptor: Token expiring soon, refreshing...');

					// If refresh already in progress, wait for it to complete
					if (isRefreshing) {
						return new Promise<InternalAxiosRequestConfig>((resolve) => {
							addSubscriber((token: string) => {
								config.headers['Authorization'] = `Bearer ${token}`;
								resolve(config);
							});
						});
					}

					// Start refreshing process
					isRefreshing = true;

					try {
						const refreshResult = await refreshToken();
						if (refreshResult.success && refreshResult.session) {
							// Update session cache with new token
							sessionPromise = Promise.resolve(refreshResult.session);
							session = refreshResult.session;

							// Notify waiting requests
							if (session.accessToken) {
								onRefreshed(session.accessToken);
							}
						}
					} catch (refreshError) {
						console.error('Token refresh failed:', refreshError);
						// Clear session cache on refresh failure
						clearSessionCache();
					} finally {
						isRefreshing = false;
					}
				}

				// Add token to request (either original or refreshed)
				if (session?.accessToken) {
					console.log('Axios Interceptor: Adding Auth token.');
					config.headers['Authorization'] = `Bearer ${session.accessToken}`;
				} else {
					console.log('Axios Interceptor: No valid session token found.');
				}
			} catch (error) {
				console.error('Axios Interceptor: Error getting session token:', error);
			}
		}
		return config;
	},
	(error) => {
		console.error('Axios Request Interceptor Error:', error);
		return Promise.reject(error);
	}
);

/**
 * Response interceptor that handles authentication errors
 * - Handles 401 Unauthorized responses
 * - Can implement redirect to login page on authentication failures
 */
api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		// Handle 401 Unauthorized errors (token expired or invalid)
		if (error.response?.status === 401 && !originalRequest._retry) {
			console.log(
				'Axios Interceptor: Received 401, attempting token refresh...'
			);

			// Mark request as retried to prevent infinite loops
			originalRequest._retry = true;

			// If refresh already in progress, wait for it to complete
			if (isRefreshing) {
				try {
					return new Promise((resolve) => {
						addSubscriber((token: string) => {
							originalRequest.headers['Authorization'] = `Bearer ${token}`;
							resolve(api(originalRequest));
						});
					});
				} catch (refreshError) {
					return Promise.reject(refreshError);
				}
			}

			// Start refreshing process
			isRefreshing = true;

			try {
				const refreshResult = await refreshToken();
				if (refreshResult.success && refreshResult.session?.accessToken) {
					// Update session cache
					sessionPromise = Promise.resolve(refreshResult.session);

					// Update authorization header
					originalRequest.headers[
						'Authorization'
					] = `Bearer ${refreshResult.session.accessToken}`;

					// Notify waiting requests
					onRefreshed(refreshResult.session.accessToken);

					// Retry the original request
					return api(originalRequest);
				} else {
					// If refresh fails, redirect to login (only if not already on login page)
					clearSessionCache();

					if (
						typeof window !== 'undefined' &&
						window.location.pathname !== '/auth/login'
					) {
						console.log(
							'Axios Interceptor: Session expired, redirecting to login...'
						);
						window.location.href = '/auth/login?sessionExpired=true';
					}
				}
			} catch (refreshError) {
				console.error(
					'Token refresh failed during 401 handling:',
					refreshError
				);
				clearSessionCache();
			} finally {
				isRefreshing = false;
			}
		}

		// Log all other errors
		console.error(
			'Axios Response Error:',
			error.response?.status,
			error.response?.data
		);

		return Promise.reject(error);
	}
);

export default api;
