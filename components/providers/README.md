# Session Provider Documentation

## Overview

The session-provider.tsx file provides a comprehensive authentication system for React applications built with Next.js. It serves as a central state management solution for user authentication, handling token refreshing, role-based access control, and vendor-specific store management.

## Table of Contents

1. Basic Setup
2. Core Features
3. API Reference
4. Usage Examples
5. Advanced Usage
6. Architecture and Design
7. Troubleshooting


## Basic Setup

1. **Import the Provider**: Add the SessionProvider to your app's root component:

```tsx
// app/layout.tsx or _app.tsx
import { SessionProvider } from '@/components/providers/session-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

2. **Access Session Data**: Use the `useSession` hook in any component:

```tsx
// components/profile.tsx
'use client';

import { useSession } from '@/components/providers/session-provider';

export default function Profile() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Role: {user.role}</p>
      {user.storeId && <p>Store ID: {user.storeId}</p>}
    </div>
  );
}
```

## Core Features

### 1. Authentication State Management

The provider tracks three main authentication states:
- `loading`: Initial state when fetching session
- `authenticated`: User is logged in with a valid session
- `unauthenticated`: No valid session exists or session has expired

### 2. Automatic Token Refresh

The system automatically refreshes authentication tokens before expiration, maintaining a seamless user experience.

### 3. Role-Based Access Control

Built-in utilities for role checking make it easy to implement role-based UI and access restrictions.

### 4. Vendor Store Management

Special handling for vendor stores, including utilities to check store existence and update store IDs.

### 5. Session Persistence

Sessions are stored securely and synchronized between client and server.

## API Reference

### `useSession()` Hook

Returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `data` | `Session \| null` | The complete session data including tokens |
| `user` | `User \| null` | User information (id, name, role, etc.) |
| `status` | `'loading' \| 'authenticated' \| 'unauthenticated'` | Current authentication status |
| `error` | `string \| null` | Error message if authentication operation failed |
| `isAuthenticated` | `boolean` | `true` if user is authenticated |
| `isLoading` | `boolean` | `true` if session is being loaded |
| `update` | `(newSession?: Session \| null) => Promise<void>` | Update or refresh session data |
| `refreshSession` | `() => Promise<boolean>` | Manually refresh the session token |
| `logout` | `() => Promise<boolean>` | Log out the current user |
| `updateStoreId` | `(storeId: string) => Promise<boolean>` | Update vendor's store ID |
| `hasRole` | `(role: string \| string[]) => boolean` | Check if user has specified role(s) |
| `hasStore` | `() => boolean` | Check if vendor user has a store |

## Usage Examples

### Authentication Status Checks

```tsx
const { status } = useSession();

switch (status) {
  case 'loading':
    return <LoadingSpinner />;
  case 'authenticated':
    return <Dashboard />;
  case 'unauthenticated':
    return <LoginPage />;
}
```

### Using Convenience Properties

```tsx
const { isAuthenticated, isLoading } = useSession();

if (isLoading) return <LoadingSpinner />;
if (!isAuthenticated) return <LoginRequired />;
```

### Role-Based Access Control

```tsx
const { hasRole } = useSession();

return (
  <div>
    {hasRole('admin') && <AdminPanel />}
    {hasRole('vendor') && <VendorDashboard />}
    {hasRole(['admin', 'moderator']) && <ContentModeration />}
  </div>
);
```

### Vendor Store Management

```tsx
const { hasRole, hasStore, updateStoreId } = useSession();

// Redirect vendor without store to create one
useEffect(() => {
  if (hasRole('vendor') && !hasStore()) {
    router.push('/vendor/create-store');
  }
}, [hasRole, hasStore, router]);

// After store creation
const handleStoreCreated = async (newStoreId) => {
  const success = await updateStoreId(newStoreId);
  if (success) {
    router.push('/vendor/dashboard');
  }
};
```

### Manual Session Refresh

```tsx
const { refreshSession } = useSession();

// Refresh token before making an important API call
const handleImportantAction = async () => {
  await refreshSession();
  // Now proceed with the API call with fresh token
  const result = await api.performImportantAction();
};
```

### Logout Handling

```tsx
const { logout } = useSession();
const router = useRouter();

const handleLogout = async () => {
  const success = await logout();
  if (success) {
    router.push('/auth/login');
  }
};
```

## Advanced Usage

### Creating Protected Routes

```tsx
// components/protected-route.tsx
'use client';

import { useSession } from '@/components/providers/session-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ 
  children,
  requiredRoles = [],
  requireStore = false,
  redirectTo = '/auth/login'
}) {
  const { status, user, hasRole, hasStore } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Check authentication
    if (status === 'unauthenticated') {
      router.push(redirectTo);
      return;
    }
    
    // Check if loaded and has required roles
    if (status === 'authenticated') {
      // Role check
      if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
        router.push('/dashboard');
        return;
      }
      
      // Store check for vendors
      if (requireStore && hasRole('vendor') && !hasStore()) {
        router.push('/vendor/create-store');
        return;
      }
    }
  }, [status, hasRole, hasStore, requiredRoles, requireStore, router, redirectTo]);
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (status === 'authenticated') {
    return <>{children}</>;
  }
  
  return null;
}
```

Usage:

```tsx
<ProtectedRoute requiredRoles={['admin']} redirectTo="/auth/login">
  <AdminDashboard />
</ProtectedRoute>
```

### Integrating with API Clients

```tsx
// lib/api-client.ts
import axios from 'axios';
import { getSession } from '@/lib/utils/session';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
  } catch (error) {
    console.error('Error adding auth token to request:', error);
  }
  
  return config;
});

export default apiClient;
```

## Architecture and Design

### Authentication Flow

1. **Initial Load**:
   - `SessionProvider` mounts and calls `fetchSession()`
   - Session is retrieved from server-side storage
   - Authentication state is set based on token validity

2. **Token Refresh**:
   - An effect calculates time until token expiry
   - Sets up a timer to refresh shortly before expiration
   - Calls `refreshSession()` which uses `refreshToken()` utility

3. **Session Updates**:
   - When session changes (login, token refresh, store updates)
   - Client state is updated with `setSessionData()`
   - Server state is updated through `/api/auth/session` POST endpoint

4. **Logout**:
   - User triggers logout
   - Client calls `/api/auth/logout` endpoint
   - Cookies are cleared on server, state is reset on client

### Dependencies

- **Session API Routes**: The provider depends on several API endpoints:
  - `/api/auth/session` (GET/POST): Fetch and update session
  - `/api/auth/logout` (POST): Handle user logout
  - `/api/auth/refresh` (POST): Refresh authentication token

- **Utilities**:
  - `refreshToken`: Function to handle token refresh logic
  - Token decoding utilities for JWT handling

## Troubleshooting

### Common Issues

1. **"useSession must be used within a SessionProvider" Error**:
   - Ensure `SessionProvider` is wrapping your component hierarchy
   - Check for nested app structures that might create multiple React trees

2. **Session Not Persisting After Page Refresh**:
   - Verify server-side session storage is properly configured
   - Check that cookies are being set with appropriate attributes

3. **Token Refresh Not Working**:
   - Ensure the refresh token cookie is properly being set
   - Verify the backend refresh endpoint is correctly configured
   - Check console for error messages related to token refresh

4. **Role-Based Access Not Working**:
   - Confirm the user object in session includes the correct `role` property
   - Verify `hasRole` is called with the correct role name(s)

### Debugging Tools

```tsx
// Debug component to inspect session state
const SessionDebugger = () => {
  const session = useSession();
  
  return (
    <div className="p-4 border rounded bg-gray-100">
      <h3 className="font-bold">Session Debug</h3>
      <div><strong>Status:</strong> {session.status}</div>
      <div><strong>Is Authenticated:</strong> {session.isAuthenticated ? 'Yes' : 'No'}</div>
      <div><strong>User:</strong> {session.user ? session.user.name : 'None'}</div>
      <div><strong>Role:</strong> {session.user?.role || 'None'}</div>
      <div><strong>Store ID:</strong> {session.user?.storeId || 'None'}</div>
      <div><strong>Token Expires:</strong> {session.data?.expires ? new Date(session.data.expires).toLocaleString() : 'N/A'}</div>
      <div><strong>Error:</strong> {session.error || 'None'}</div>
      <button 
        onClick={() => session.refreshSession()} 
        className="px-3 py-1 bg-blue-500 text-white rounded mt-2">
        Refresh Token
      </button>
    </div>
  );
};
```

---

This session management system provides a robust, secure, and developer-friendly solution for handling authentication in Next.js applications. By centralizing authentication logic in the SessionProvider, it simplifies the implementation of secure, role-based applications while maintaining a clean separation of concerns.