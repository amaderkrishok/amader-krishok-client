# Token Refresh Utilities Documentation

## Overview

The token-refresh.ts module provides essential utilities for JWT (JSON Web Token) authentication management in our Next.js application. It handles token refresh operations, expiration checks, and session state updates, making it a critical part of the authentication infrastructure.

## Key Features

- Automatic token refresh functionality
- Token expiration detection
- Store ID updates for vendor accounts
- Consistent error handling

## API Reference

### `refreshToken()`

Refreshes the authentication token using the refresh token cookie stored in the browser.

```typescript
async function refreshToken(): Promise<RefreshResponse>
```

#### Returns

An object with the following properties:
- `success` (boolean): Indicates if the operation was successful
- `session` (Session | null | undefined): Updated session data if refresh was successful
- `error` (string | undefined): Error message if refresh failed

#### Example

```typescript
import { refreshToken } from '@/lib/utils/token-refresh';

// When user performs an action requiring fresh authentication
async function handleSecureAction() {
  const refreshResult = await refreshToken();
  
  if (refreshResult.success) {
    // Proceed with action using fresh token
    console.log("Using refreshed token:", refreshResult.session?.accessToken);
    await performSecureAction();
  } else {
    // Handle authentication error
    console.error("Authentication expired:", refreshResult.error);
    redirectToLogin();
  }
}
```

### `isTokenExpiring(token, bufferSeconds)`

Checks if a JWT token is expired or about to expire within a specified buffer time.

```typescript
function isTokenExpiring(token: string | null, bufferSeconds?: number): boolean
```

#### Parameters

- `token` (string | null): The JWT token to check
- `bufferSeconds` (number, optional): Time buffer in seconds before expiration to consider token as "expiring". Default is 30 seconds.

#### Returns

- `boolean`: True if token is null, invalid, expired, or will expire within buffer time

#### Example

```typescript
import { isTokenExpiring } from '@/lib/utils/token-refresh';

// Check if we should refresh token before making an API call
function prepareForApiCall() {
  const currentToken = session.accessToken;
  
  // Check if token will expire in the next 2 minutes
  if (isTokenExpiring(currentToken, 120)) {
    console.log("Token expiring soon, refreshing before API call");
    return refreshToken().then(() => makeApiCall());
  }
  
  return makeApiCall();
}
```

### `updateStoreIdInSession(storeId)`

Updates the store ID in the user's session data, particularly useful after vendor registration or store creation.

```typescript
async function updateStoreIdInSession(storeId: string): Promise<boolean>
```

#### Parameters

- `storeId` (string): The store ID to associate with the user

#### Returns

- `boolean`: True if the update was successful, false otherwise

#### Example

```typescript
import { updateStoreIdInSession } from '@/lib/utils/token-refresh';

// After vendor creates a new store
async function handleStoreCreated(response) {
  const { storeId } = response.data;
  
  const updateSuccess = await updateStoreIdInSession(storeId);
  
  if (updateSuccess) {
    toast.success("Store created successfully!");
    router.push('/vendor/dashboard');
  } else {
    toast.error("Store created but session update failed. Please refresh.");
  }
}
```

## Implementation Details

### Token Refresh Flow

1. The `refreshToken()` function calls the `/api/auth/refresh` endpoint, forwarding cookies
2. If successful, it extracts the session data directly or fetches it from the session endpoint
3. If unsuccessful, it returns an error with status details

### Session Update Flow

1. The `updateStoreIdInSession()` function first fetches the current session
2. It then creates a new session object with the updated store ID
3. Finally, it sends the updated session data to be stored server-side

## Error Handling

All functions include robust error handling:

- HTTP errors are logged with status codes
- JavaScript exceptions are caught and logged with trace information
- All errors are translated into appropriate return values (boolean or error message)

## Best Practices

1. **Proactive Refresh**: Use `isTokenExpiring()` to check tokens before critical operations
2. **Error Recovery**: Always handle failed refresh operations gracefully
3. **Session Awareness**: After updating store IDs, ensure UI reflects the new state
4. **Logging**: Monitor token refresh operations for authentication issues

## Integration with Other Systems

This module integrates with:

- `SessionProvider` for maintaining authentication state
- JWT utilities for token decoding
- Session API endpoints for persistence
- Axios interceptors for automatic token management

## Security Considerations

- Tokens are never stored in localStorage or sessionStorage (XSS protection)
- Refresh tokens are handled via HTTP-only cookies (CSRF protection)
- Token expiration checks prevent use of stale credentials
- All token operations are performed through secure API endpoints

---

By utilizing these utilities correctly, your application will maintain a seamless authentication experience for users while ensuring security best practices are followed.