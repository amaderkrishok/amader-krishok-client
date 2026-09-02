import api from '@/lib/axios';
import axios from 'axios';
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

export const OrderService = {
	createOrder: async (orderData: CreateOrderDTO): Promise<OrderResponse> => {
		const response = await axios.post(ORDERS_ENDPOINT, orderData);
		return response.data;
	},

	getAllOrders: async (filters: OrderFilters = {}): Promise<OrdersResponse> => {
		let url = `${ORDERS_ENDPOINT}?`;
		const queryParams = new URLSearchParams();

		if (filters.page) queryParams.append('page', filters.page.toString());
		if (filters.limit) queryParams.append('limit', filters.limit.toString());
		if (filters.status) queryParams.append('status', filters.status);
		if (filters.buyerId) queryParams.append('buyerId', filters.buyerId);
		if (filters.phoneNumber)
			queryParams.append('phoneNumber', filters.phoneNumber);
		if (filters.storeId) queryParams.append('storeId', filters.storeId);

		url += queryParams.toString();

		const response = await api.get(url);
		return response.data;
	},

	getOrderById: async (id: string): Promise<OrderResponse> => {
		const response = await axios.get(`${ORDERS_ENDPOINT}/${id}`);
		return response.data;
	},

	getStoreOrders: async (
		storeId: string,
		filters: OrderFilters = {}
	): Promise<OrdersResponse> => {
		let url = `${ORDERS_ENDPOINT}/store/${storeId}?`;
		const queryParams = new URLSearchParams();

		if (filters.page) queryParams.append('page', filters.page.toString());
		if (filters.limit) queryParams.append('limit', filters.limit.toString());
		if (filters.status) queryParams.append('status', filters.status);

		url += queryParams.toString();

		const response = await api.get(url);
		return response.data;
	},

	getUserOrders: async (
		userId: string,
		filters: OrderFilters = {}
	): Promise<OrdersResponse> => {
		let url = `${ORDERS_ENDPOINT}/user/${userId}?`;
		const queryParams = new URLSearchParams();

		if (filters.page) queryParams.append('page', filters.page.toString());
		if (filters.limit) queryParams.append('limit', filters.limit.toString());
		if (filters.status) queryParams.append('status', filters.status);

		url += queryParams.toString();

		const response = await api.get(url);
		return response.data;
	},

	updateOrder: async (
		id: string,
		updateData: UpdateOrderDTO
	): Promise<Order> => {
		const response = await api.patch(`${ORDERS_ENDPOINT}/${id}`, updateData);
		return response.data;
	},

	updateOrderStatus: async (
		id: string,
		status: OrderStatus
	): Promise<ApiResponse<Order>> => {
		const response = await api.patch(`${ORDERS_ENDPOINT}/${id}/status`, {
			status,
		});
		return response.data;
	},

	deleteOrder: async (id: string): Promise<void> => {
		await api.delete(`${ORDERS_ENDPOINT}/${id}`);
	},

	/**
	 * Calculates delivery charge consistently for any order.
	 * 1. Checks item.productDetails.deliveryCharge
	 * 2. Checks order.totalAmount vs itemsSubtotal
	 * 3. Fallback standard delivery charge if order has items
	 */
	getOrderDeliveryCharge: (order: Order): number => {
		if (!order || !order.orderItems || order.orderItems.length === 0) return 0;

		let explicitDeliveryCharge = 0;
		let hasExplicitDeliveryCharge = false;

		order.orderItems.forEach((item) => {
			if (item.productDetails && item.productDetails.deliveryCharge != null) {
				explicitDeliveryCharge += Number(item.productDetails.deliveryCharge);
				hasExplicitDeliveryCharge = true;
			}
		});

		if (hasExplicitDeliveryCharge && explicitDeliveryCharge >= 0) {
			return explicitDeliveryCharge;
		}

		const itemsSubtotal = order.orderItems.reduce(
			(sum, item) =>
				sum + (Number(item.total) || Number(item.price) * Number(item.quantity)),
			0
		);

		const totalAmountNum = Number(order.totalAmount || 0);

		if (totalAmountNum > itemsSubtotal) {
			return totalAmountNum - itemsSubtotal;
		}

		return itemsSubtotal > 0 ? 155 : 0;
	},

	/**
	 * Calculates grand total including items subtotal and delivery charge
	 */
	getOrderGrandTotal: (order: Order): number => {
		if (!order || !order.orderItems || order.orderItems.length === 0) {
			return Number(order?.totalAmount || 0);
		}

		const itemsSubtotal = order.orderItems.reduce(
			(sum, item) =>
				sum + (Number(item.total) || Number(item.price) * Number(item.quantity)),
			0
		);

		const deliveryCharge = OrderService.getOrderDeliveryCharge(order);
		return itemsSubtotal + deliveryCharge;
	},

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

	getProductImageUrl: (imageUrl: string): string => {
		if (!imageUrl) {
			return '/images/product-placeholder.png';
		}

		if (imageUrl.startsWith('http')) {
			return imageUrl;
		}

		return `${API_URL}/${imageUrl.replace(/^\//, '')}`;
	},

	canCancelOrder: (order: Order): boolean => {
		return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(
			order.orderStatus
		);
	},

	getValidNextStatuses: (currentStatus: OrderStatus): OrderStatus[] => {
		switch (currentStatus) {
			case OrderStatus.PENDING:
				return [OrderStatus.CONFIRMED, OrderStatus.CANCELLED];
			case OrderStatus.CONFIRMED:
				return [OrderStatus.DELIVERED, OrderStatus.CANCELLED];
			case OrderStatus.DELIVERED:
				return [];
			case OrderStatus.CANCELLED:
				return [];
			default:
				return [];
		}
	},
};
