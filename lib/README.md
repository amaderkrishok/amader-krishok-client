# Axios API Client Documentation

## Overview

The axios.ts module provides a pre-configured Axios instance with built-in authentication, token management, and error handling. It's designed to simplify API interactions and automatically handle token refreshing, making it the recommended way to perform authenticated API calls in the application.

## Features

- **Automatic Authentication**: Adds authorization headers to requests
- **Token Expiration Management**: Proactively refreshes tokens before they expire
- **Request Queueing**: Pauses requests during token refresh and resumes them after
- **Consistent Error Handling**: Centralizes response error processing
- **Session Caching**: Optimizes performance by avoiding redundant session fetches
- **401 Response Handling**: Automatically attempts token refresh on authentication failures

## Basic Usage

### Example 1: Simple GET Request

```typescript
import api from '@/lib/axios';

// Basic GET request (token automatically added)
async function fetchProducts() {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
```

### Example 2: POST Request with Data

```typescript
import api from '@/lib/axios';

// POST request with data
async function createOrder(orderData) {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}
```

### Example 3: Request with URL Parameters

```typescript
import api from '@/lib/axios';

// GET with URL parameters
async function getProductsByCategory(categoryId, page = 1, limit = 10) {
  try {
    const response = await api.get('/products', {
      params: {
        categoryId,
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}
```

### Example 4: File Upload

```typescript
import api from '@/lib/axios';

// File upload example
async function uploadProductImage(productId, imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Auth header will be automatically added
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading product image:', error);
    throw error;
  }
}
```

## Advanced Usage

### Creating Service Modules

For better organization, you can create service modules that use the API client:

```typescript
// services/product-service.ts
import api from '@/lib/axios';

export const ProductService = {
  getAllProducts: async (page = 1, limit = 20) => {
    const response = await api.get('/products', { params: { page, limit } });
    return response.data;
  },
  
  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  createProduct: async (productData: any) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  
  updateProduct: async (id: string, productData: any) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};
```

### Using React Query with the API Client

```typescript
// hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export function useProducts() {
  const queryClient = useQueryClient();

  const fetchProducts = async () => {
    const response = await api.get('/products');
    return response.data;
  };

  const createProduct = async (product) => {
    const response = await api.post('/products', product);
    return response.data;
  };

  // Query hook for fetching products
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  // Mutation hook for creating products
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate and refetch products query after successful creation
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    createProduct: createProductMutation.mutate
  };
}
```

## How It Works

### Token Management Flow

1. **Initial Request**: When an API call is made, the request interceptor checks for a valid session
2. **Token Check**: If a token exists but is close to expiring (within 2 minutes), a refresh is triggered
3. **Request Queueing**: During refresh, new requests are queued using the subscriber pattern
4. **Token Refresh**: After successful refresh, all queued requests proceed with the new token
5. **Request Completion**: The original API call continues with the valid token

### Authentication Error Handling

1. **401 Response**: If a request receives a 401 Unauthorized response, automatic recovery is attempted
2. **Token Refresh**: The system tries to refresh the token (if not already in progress)
3. **Request Retry**: If refresh succeeds, the original request is retried with the new token
4. **Failure Handling**: If refresh fails, the user is redirected to the login page

## Future Modifications

### Adding Support for Different Authentication Types

To support different authentication methods (e.g., API keys, OAuth):

```typescript
// Extend the request interceptor
api.interceptors.request.use(async (config) => {
  // Get auth type from config or context
  const authType = config.authType || 'bearer';
  
  switch (authType) {
    case 'bearer':
      // Current token logic
      // ...
      break;
    case 'apiKey':
      config.headers['X-API-Key'] = await getApiKey();
      break;
    case 'none':
      // Skip authentication
      break;
  }
  
  return config;
});

// Usage example
api.get('/public-endpoint', { authType: 'none' });
api.get('/api-key-endpoint', { authType: 'apiKey' });
```

### Implementing Offline Support

For offline-first applications:

```typescript
// Add request queue for offline mode
const offlineRequestQueue = [];

// Check if offline and queue requests
api.interceptors.request.use(async (config) => {
  if (!navigator.onLine) {
    return new Promise((resolve, reject) => {
      offlineRequestQueue.push({
        config,
        resolve,
        reject
      });
      
      // Save to IndexedDB or localStorage
      saveOfflineRequest(config);
      
      // Optionally reject with custom error
      reject(new Error('Device is offline, request queued'));
    });
  }
  
  return config;
});

// Process queued requests when back online
window.addEventListener('online', () => {
  offlineRequestQueue.forEach(async ({config, resolve, reject}) => {
    try {
      const response = await api(config);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
  
  // Clear queue
  offlineRequestQueue.length = 0;
});
```

### Adding Request Throttling/Debouncing

To prevent API abuse:

```typescript
import { debounce, throttle } from 'lodash';

// Create request cache for debouncing
const requestCache = new Map();

// Add debounce/throttle to specific endpoints
api.interceptors.request.use((config) => {
  const key = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
  
  if (config.debounce && typeof config.debounce === 'number') {
    if (!requestCache.has(key)) {
      const debouncedRequest = debounce((resolve) => {
        resolve(config);
      }, config.debounce);
      
      requestCache.set(key, debouncedRequest);
    }
    
    return new Promise((resolve) => {
      requestCache.get(key)(resolve);
    });
  }
  
  return config;
});

// Usage
api.get('/search', {
  params: { query: 'keywords' },
  debounce: 300 // Debounce by 300ms
});
```

## Best Practices

1. **Always Use the API Client**: Rather than using `fetch` or vanilla `axios`, use this pre-configured instance for consistent behavior

2. **Handle Errors at Call Site**: While the interceptor handles authentication errors, you should handle business logic errors where the API is called

3. **Don't Modify Tokens Directly**: Let the client handle all token management; don't manually set auth headers

4. **Create Service Abstractions**: Group related API calls into service modules for better organization

5. **Monitor Token Refreshes**: Excessive refreshes may indicate a configuration issue with token expiration times

6. **Use TypeScript Interfaces**: Define proper types for API request/response data for better type safety:

```typescript
// Example of typed request
interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
  categoryId: string;
}

interface Product extends CreateProductRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
}

async function createProduct(data: CreateProductRequest): Promise<Product> {
  const response = await api.post<Product>('/products', data);
  return response.data;
}
```

## Troubleshooting

### Common Issues

1. **Infinite Login Redirects**: 
   - Check that the login page doesn't make authenticated API calls
   - Ensure `window.location.pathname !== '/auth/login'` check is working

2. **Multiple Simultaneous Refreshes**:
   - The `isRefreshing` flag should prevent this
   - Check for race conditions in your code

3. **Token Not Being Added**:
   - Verify the session is being properly stored
   - Check browser console for "No valid session token found" messages

4. **CORS Issues**:
   - Ensure backend has appropriate CORS headers
   - Check that `withCredentials` is properly configured

### Debug Helpers

```typescript
// Add this to your code for debugging
api.interceptors.request.use((config) => {
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    hasAuthHeader: !!config.headers['Authorization']
  });
  return config;
});

// Test token refresh mechanism
function debugTokenRefresh() {
  clearSessionCache(); // Force a new session fetch
  console.log('Testing token refresh mechanism...');
  api.get('/debug/test-endpoint')
    .then(response => console.log('Debug response:', response))
    .catch(error => console.error('Debug error:', error));
}
```

---

By following this documentation, you'll be able to effectively use the authenticated API client for all backend interactions while benefiting from its automatic token management and error handling capabilities.