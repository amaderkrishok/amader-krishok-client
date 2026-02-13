/**
 * Order status enum matching the backend
 */
export enum OrderStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	CANCELLED = 'CANCELLED',
	DELIVERED = 'DELIVERED',
}

/**
 * Order item representing a product in the order
 */
export interface OrderItem {
	id: number;
	orderId: string;
	productId: number;
	storeId: string;
	productName: string;
	productImage: string;
	price: number;
	quantity: number;
	variantName: string | null;
	productDetails: Record<string, any> | null;
	total: number;
}

/**
 * Complete order interface matching the backend response
 */
export interface Order {
	id: string;
	buyerId: string | null;
	name: string;
	address: string;
	phoneNumber: string;
	totalAmount: string;
	orderStatus: OrderStatus;
	storeCount: number;
	orderDate: string;
	updatedAt: string;
	orderItems: OrderItem[];
}

/**
 * Data transfer object for creating an order item
 */
export interface CreateOrderItemDTO {
	productId: number;
	storeId: string;
	quantity: number;
	variantName?: string | null;
	productDetails?: Record<string, any>;
}

/**
 * Data transfer object for creating an order
 */
export interface CreateOrderDTO {
	buyerId?: string | null;
	name: string;
	address: string;
	phoneNumber: string;
	orderItems: CreateOrderItemDTO[];
	orderStatus?: OrderStatus;
}

/**
 * Data transfer object for updating an order
 */
export interface UpdateOrderDTO {
	name?: string;
	address?: string;
	phoneNumber?: string;
	orderStatus?: OrderStatus;
}

/**
 * Order filters for API queries
 */
export interface OrderFilters {
	status?: OrderStatus;
	buyerId?: string;
	phoneNumber?: string;
	storeId?: string;
	page?: number;
	limit?: number;
}

/**
 * Paginated response structure for orders
 */
export interface PaginatedOrders {
	data: Order[];
	meta: {
		itemsPerPage: number;
		totalItems: number;
		currentPage: number;
		totalPages: number;
	};
	links: {
		first: string;
		last: string;
		current: string;
		next?: string | null;
		previous?: string | null;
	};
}

/**
 * API response wrapper structure
 */
export interface ApiResponse<T> {
	statusCode: number;
	message: string;
	data: T;
}

/**
 * Type for a single order response
 */
export type OrderResponse = ApiResponse<Order>;

/**
 * Type for paginated orders response
 */
// Replace with:
export interface OrdersResponse {
	statusCode: number;
	message: string;
	data: Order[];
	meta: PaginatedOrders['meta'];
	links: PaginatedOrders['links'];
}
