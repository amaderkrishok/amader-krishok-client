# Authentication Token Refresh API Documentation

## Overview

The token refresh API endpoint (`/api/auth/refresh`) provides a secure mechanism to renew authentication tokens without requiring users to re-authenticate. This documentation explains how the refresh endpoint works, its security considerations, and how developers can utilize it in their applications.

## API Route Details

- **Route Path**: `/api/auth/refresh`
- **HTTP Method**: POST
- **Purpose**: Refresh expired access tokens using HTTP-only refresh token cookies
- **Response Format**: JSON containing new access token and session data

## Security Architecture

This endpoint implements a proxy pattern that securely handles authentication token renewal:

1. **Token Separation**: 
   - Access tokens: Short-lived JWTs for API authorization
   - Refresh tokens: Long-lived tokens stored in HTTP-only cookies

2. **Security Measures**:
   - Refresh tokens are never exposed to client-side JavaScript (HTTP-only)
   - SameSite cookie policies prevent CSRF attacks
   - Secure flag ensures cookies only transmitted over HTTPS in production
   - Tokens are validated before updating sessions

## Implementation Flow

The token refresh process follows these steps:

1. **Request Forwarding**: 
   - Forwards the client's refresh token cookie to the backend auth server
   - Maintains all original request headers and cookies

2. **Token Extraction & Validation**:
   - Receives and validates the new access token from backend response
   - Extracts access token from the data property of the backend response
   - Decodes JWT to extract user profile and expiration time

3. **Session Management**:
   - Creates a new session with user data from token payload
   - Updates session storage using iron-session

4. **Cookie Synchronization**:
   - Extracts the refresh token value from the Set-Cookie header
   - Uses regex to match and extract the non-empty refresh token value
   - Sets the extracted token as an HTTP-only cookie with appropriate security settings

5. **Response Delivery**:
   - Returns new session data and token to the client
   - Includes expiration time for client-side awareness

## Error Handling

The endpoint implements comprehensive error handling:

| Error Type | HTTP Status | Response | Description |
|------------|-------------|----------|-------------|
| Configuration | 500 | Internal server configuration error | Missing backend URL |
| Backend Error | (from backend) | Failed to refresh token | Auth server rejected token |
| Validation Error | 500 | Invalid response from server | Missing or malformed token |
| Decoding Error | 500 | Invalid token received | Token couldn't be decoded |
| Cookie Processing Error | 500 | Failed to extract refresh token | Unable to parse Set-Cookie header |
| Unexpected Error | 500 | Internal server error during token refresh | Any unhandled exception |

## Usage Examples

### Basic Token Refresh

```javascript
/**
 * Refreshes the authentication token
 * @returns {Promise<Object>} Refreshed session data
 */
async function refreshAuthToken() {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include' // Critical: needed to include cookies
    });
    
    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Token refreshed, valid until:", new Date(data.session.expires));
    return data.session;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    // Handle authentication failure (redirect to login)
    window.location.href = '/auth/login?expired=true';
    return null;
  }
}
```

### Automatic Token Refresh in API Client

```javascript
// Example integration with an API client (e.g., axios)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Call the refresh endpoint
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (!refreshResponse.ok) throw new Error('Refresh failed');
        
        const refreshData = await refreshResponse.json();
        
        // Update authorization header with new token
        originalRequest.headers['Authorization'] = 
          `Bearer ${refreshData.accessToken}`;
        
        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login on refresh failure
        window.location.href = '/auth/login?sessionExpired=true';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### Scheduled Token Refresh

```javascript
/**
 * Sets up automatic token refresh before expiration
 * @param {number} expiresAt - Token expiration timestamp in milliseconds
 */
function setupTokenRefreshSchedule(expiresAt) {
  // Calculate time until token expiry (with 5 minute buffer)
  const timeToExpiry = expiresAt - Date.now() - 5 * 60 * 1000;
  const refreshTime = Math.max(timeToExpiry, 30000); // At least 30 seconds
  
  console.log(`Scheduling token refresh in ${Math.floor(refreshTime/1000)} seconds`);
  
  // Set up timer to refresh before expiration
  setTimeout(async () => {
    try {
      const session = await refreshAuthToken();
      if (session?.expires) {
        // Set up next refresh cycle with new expiration time
        setupTokenRefreshSchedule(session.expires);
      }
    } catch (error) {
      console.error('Scheduled token refresh failed:', error);
    }
  }, refreshTime);
}
```

## Environment Configuration

Required environment variables:

```
BACKEND_URL=https://api.example.com
SESSION_SECRET=your_secure_session_secret
# Other session-related variables may be required for iron-session
```

## Integration Points

This API route integrates with these parts of the application:

1. **Session Provider**: Uses refreshed tokens to update client-side authentication state
2. **API Client**: Used by interceptors to refresh tokens before/after API requests
3. **Backend Auth Server**: Communicates with the main authentication service
4. **Iron Session**: Stores the refreshed session data securely

## Troubleshooting

Common issues and solutions:

1. **401 Errors After Refresh**:
   - Check that the refresh token cookie is being properly forwarded
   - Verify the backend is returning a valid new access token
   - Ensure the session is being properly saved with iron-session

2. **Missing Refresh Token**:
   - Check that `credentials: 'include'` is set in fetch calls
   - Verify the regex pattern is correctly extracting the token value
   - Ensure the SameSite and Secure settings match your environment

3. **Invalid Token Format**:
   - Check that the JWT format from the backend matches expected format
   - Verify the token contains all required user fields (id, name, role, etc.)
   - Make sure the JWT exp claim is properly set

4. **Cookie Processing Issues**:
   - Check for multiple cookies in Set-Cookie header (e.g., deletion cookie followed by new cookie)
   - Verify regex pattern is correctly matching the token value
   - Look for commas in cookie values which might interfere with parsing

## Security Considerations

1. **Token Storage**: 
   - Never store refresh tokens in localStorage or sessionStorage
   - Access tokens should only be kept in memory when possible

2. **Cookie Protection**:
   - Always use HTTP-only, SameSite and Secure flags in production
   - Consider adding CSRF protection for sensitive operations

3. **Token Validation**:
   - Always validate tokens before trusting their contents
   - Check expiration times before using tokens for authentication

4. **Multiple Cookie Handling**:
   - Be aware that backend might send multiple cookies (deletion + new)
   - Ensure proper extraction of the valid token

## Performance Considerations

1. **Caching**: The endpoint doesn't cache responses as tokens are unique per request
2. **Response Size**: Minimizes response size by only returning essential session data
3. **Connection Reuse**: Uses the same connection to the backend for optimal performance

