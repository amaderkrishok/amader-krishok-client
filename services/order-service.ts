import api from '@/lib/axios'; // Your authenticated axios instance
import axios from 'axios'; // Regular axios for public endpoints
import {
	Order,
	OrderStatus,
	CreateOrderDTO,
	UpdateOrderDTO,
	OrderFilters,
	OrderResponse,
	OrdersResponse,
	ApiResponse,
} from '@/types/order';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const ORDERS_ENDPOINT = `${API_URL}/orders`;

/**
 * Service for interacting with the order-related endpoints
 */
export const OrderService = {
	/**
	 * Creates a new order (public endpoint - works for both authenticated and guest users)
	 *
	 * @param {CreateOrderDTO} orderData - Order creation data
	 * @returns {Promise<Order>} - The newly created order
	 */
	createOrder: async (orderData: CreateOrderDTO): Promise<OrderResponse> => {
		const response = await axios.post(ORDERS_ENDPOINT, orderData);
		return response.data;
	},

	/**
	 * Gets a paginated list of all orders (admin/mod only)
	 *
	 * @param {OrderFilters} filters - Filter and pagination options
	 * @returns {Promise<OrdersResponse>} - Paginated list of orders
	 */
	getAllOrders: async (filters: OrderFilters = {}): Promise<OrdersResponse> => {
		let url = `${ORDERS_ENDPOINT}?`;
		const queryParams = new URLSearchParams();

		// Add pagination params
		if (filters.page) queryParams.append('page', filters.page.toString());
		if (filters.limit) queryParams.append('limit', filters.limit.toString());

		// Add filter params
		if (filters.status) queryParams.append('status', filters.status);
		if (filters.buyerId) queryParams.append('buyerId', filters.buyerId);
		if (filters.phoneNumber)
			queryParams.append('phoneNumber', filters.phoneNumber);
		if (filters.storeId) queryParams.append('storeId', filters.storeId);

		url += queryParams.toString();

		const response = await api.get(url);
		return response.data;
	},

	/**
	 * Gets a single order by its ID (public endpoint but with proper access control)
	 *
	 * @param {string} id - Order ID
	 * @returns {Promise<OrderResponse>} - The requested order
	 */
	getOrderById: async (id: string): Promise<OrderResponse> => {
		const response = await axios.get(`${ORDERS_ENDPOINT}/${id}`);
		return response.data;
	},

	/**
	 * Gets orders for a specific store (vendor/admin/mod only)
	 *
	 * @param {string} storeId - Store ID
	 * @param {OrderFilters} filters - Filter and pagination options
	 * @returns {Promise<OrdersResponse>} - Paginated list of store orders
	 */
	getStoreOrders: async (
		storeId: string,
		filters: OrderFilters = {}
	): Promise<OrdersResponse> => {
		let url = `${ORDERS_ENDPOINT}/store/${storeId}?`;
		const queryParams = new URLSearchParams();

		// Add pagination params
		if (filters.page) queryParams.append('page', filters.page.toString());
		if (filters.limit) queryParams.append('limit', filters.limit.toString());

		// Add filter params
		if (filters.status) queryParams.append('status', filters.status);

		url += queryParams.toString();

		const response = await api.get(url);
		return response.data;
	},

	/**
	 * Gets orders for a specific user (user/admin/mod only)
	 *
	 * @param {string} userId - User ID
	 * @param {OrderFilters} filters - Filter and pagination options
	 * @returns {Promise<OrdersResponse>} - Paginated list of user orders
	 */
	getUserOrders: async (
		userId: string,
		filters: OrderFilters = {}
	): Promise<OrdersResponse> => {
		let url = `${ORDERS_ENDPOINT}/user/${userId}?`;
		const queryParams = new URLSearchParams();

		// Add pagination params
		if (filters.page) queryParams.append('page', filters.page.toString());
		if (filters.limit) queryParams.append('limit', filters.limit.toString());

		// Add filter params
		if (filters.status) queryParams.append('status', filters.status);

		url += queryParams.toString();

		const response = await api.get(url);
		return response.data;
	},

	/**
	 * Updates an order (admin/mod only)
	 *
	 * @param {string} id - Order ID
	 * @param {UpdateOrderDTO} updateData - Updated order data
	 * @returns {Promise<Order>} - The updated order
	 */
	updateOrder: async (
		id: string,
		updateData: UpdateOrderDTO
	): Promise<Order> => {
		const response = await api.patch(`${ORDERS_ENDPOINT}/${id}`, updateData);
		return response.data;
	},

	/**
	 * Updates only the status of an order (vendor/admin/mod only)
	 *
	 * @param {string} id - Order ID
	 * @param {OrderStatus} status - New order status
	 * @returns {Promise<Order>} - The updated order
	 */
	updateOrderStatus: async (
		id: string,
		status: OrderStatus
	): Promise<ApiResponse<Order>> => {
		const response = await api.patch(`${ORDERS_ENDPOINT}/${id}/status`, {
			status,
		});
		return response.data;
	},

	/**
	 * Deletes an order (admin/mod only)
	 *
	 * @param {string} id - Order ID
	 * @returns {Promise<void>}
	 */
	deleteOrder: async (id: string): Promise<void> => {
		await api.delete(`${ORDERS_ENDPOINT}/${id}`);
	},

	/**
	 * Helper function to get order status display information with Bengali labels
	 *
	 * @param {OrderStatus} status - The order status
	 * @returns {{ label: string; color: string; textColor: string; icon: string }}
	 */
	getOrderStatusInfo: (
		status: OrderStatus
	): {
		label: string;
		color: string;
		textColor: string;
		icon: string;
	} => {
		switch (status) {
			case OrderStatus.PENDING:
				return {
					label: 'অপেক্ষমান',
					color: 'bg-yellow-100',
					textColor: 'text-yellow-800',
					icon: 'clock',
				};
			case OrderStatus.CONFIRMED:
				return {
					label: 'নিশ্চিত করা হয়েছে',
					color: 'bg-blue-100',
					textColor: 'text-blue-800',
					icon: 'check',
				};
			case OrderStatus.DELIVERED:
				return {
					label: 'ডেলিভারিতে পাঠিয়ে দেয়া হয়েছে',
					color: 'bg-green-100',
					textColor: 'text-green-800',
					icon: 'check-circle',
				};
			case OrderStatus.CANCELLED:
				return {
					label: 'বাতিল',
					color: 'bg-red-100',
					textColor: 'text-red-800',
					icon: 'x-circle',
				};
			default:
				return {
					label: typeof status === 'string' ? status : 'অজানা',
					color: 'bg-gray-100',
					textColor: 'text-gray-800',
					icon: 'question',
				};
		}
	},

	/**
	 * Format a readable date from order timestamps
	 *
	 * @param {string} dateString - ISO date string
	 * @returns {string} - Formatted date string
	 */
	formatOrderDate: (dateString: string): string => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date);
	},

	/**
	 * Get product image URL with fallback
	 *
	 * @param {string} imageUrl - Product image URL
	 * @returns {string} - Complete image URL or fallback
	 */
	getProductImageUrl: (imageUrl: string): string => {
		if (!imageUrl) {
			return '/images/product-placeholder.png';
		}

		// If already an absolute URL, return as is
		if (imageUrl.startsWith('http')) {
			return imageUrl;
		}

		// Otherwise, prepend your API URL if needed
		return `${API_URL}/${imageUrl.replace(/^\//, '')}`;
	},

	/**
	 * Check if an order can be cancelled based on its status
	 *
	 * @param {Order} order - The order
	 * @returns {boolean} - Whether the order can be cancelled
	 */
	canCancelOrder: (order: Order): boolean => {
		// Only PENDING and CONFIRMED orders can be cancelled
		return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(
			order.orderStatus
		);
	},

	/**
	 * Get valid next statuses based on current status
	 *
	 * @param {OrderStatus} currentStatus - Current order status
	 * @returns {OrderStatus[]} - Array of valid next statuses
	 */
	getValidNextStatuses: (currentStatus: OrderStatus): OrderStatus[] => {
		switch (currentStatus) {
			case OrderStatus.PENDING:
				return [OrderStatus.CONFIRMED, OrderStatus.CANCELLED];
			case OrderStatus.CONFIRMED:
				return [OrderStatus.DELIVERED, OrderStatus.CANCELLED];
			case OrderStatus.DELIVERED:
				return []; // Terminal state, no next statuses
			case OrderStatus.CANCELLED:
				return []; // Terminal state, no next statuses
			default:
				return [];
		}
	},
};
