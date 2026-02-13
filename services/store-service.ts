import api from '@/lib/axios';
import axios from 'axios';
import {
	Store,
	StoreFilters,
	CreateStoreDTO,
	UpdateStoreDTO,
	StoreSubscription,
} from '@/types/store';
import { PaginatedResponse } from '@/types/pagination/pagination';

/** Base API URL from environment variables */
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

/** Endpoint for store operations */
const STORES_ENDPOINT = `${API_URL}/stores`;

/**
 * Service for handling store-related operations
 */
export const StoreService = {
	/**
	 * Retrieves a paginated list of stores with optional filtering
	 *
	 * @param {StoreFilters} filters - Optional filters to apply to the query
	 * @returns {Promise<PaginatedResponse<Store>>} - Paginated list of stores
	 *
	 * @example
	 * // Get all approved stores, page 1 with 10 items per page
	 * const stores = await StoreService.getStores({
	 *   status: 'approved',
	 *   page: 1,
	 *   limit: 10
	 * });
	 */
	getStores: async (
		filters: StoreFilters = {}
	): Promise<PaginatedResponse<Store>> => {
		let url = `${STORES_ENDPOINT}?`;
		const queryParams = new URLSearchParams();

		// Add pagination params
		queryParams.append('page', (filters.page || 1).toString());
		queryParams.append('limit', (filters.limit || 10).toString());

		// Add filter params if they exist
		if (filters.status) queryParams.append('status', filters.status);
		if (filters.name) queryParams.append('name', filters.name);
		if (filters.address) queryParams.append('address', filters.address);
		if (filters.categoryId)
			queryParams.append('categoryId', filters.categoryId.toString());
		if (filters.ownerId) queryParams.append('ownerId', filters.ownerId);
		if (filters.subscriptionStatus)
			queryParams.append('subscriptionStatus', filters.subscriptionStatus);
		if (filters.subscriptionPlanId)
			queryParams.append('subscriptionPlanId', filters.subscriptionPlanId);

		url += queryParams.toString();

		const response = await axios.get(url);
		return response.data;
	},

	/**
	 * Retrieves a single store by its unique ID
	 *
	 * @param {string} id - The UUID of the store to retrieve
	 * @returns {Promise<Store>} - The requested store
	 * @throws {Error} - If store is not found or request fails
	 *
	 * @example
	 * const store = await StoreService.getStoreById("123e4567-e89b-12d3-a456-426614174000");
	 */
	getStoreById: async (id: string): Promise<Store> => {
		const response = await axios.get(`${STORES_ENDPOINT}/${id}`);
		return response.data;
	},

	/**
	 * Creates a new store (requires authentication)
	 *
	 * @param {CreateStoreDTO} storeData - Data for the new store
	 * @returns {Promise<Store>} - The created store with server-generated fields
	 * @throws {Error} - If validation fails or user doesn't have permission
	 *
	 * @example
	 * const newStore = await StoreService.createStore({
	 *   name: "Farm Fresh",
	 *   address: "123 Farm Road",
	 *   // other required fields...
	 * });
	 */
	createStore: async (storeData: CreateStoreDTO): Promise<Store> => {
		const response = await api.post(STORES_ENDPOINT, storeData);
		return response.data;
	},

	/**
	 * Updates an existing store (requires authentication)
	 *
	 * @param {string} storeId - The UUID of the store to update
	 * @param {UpdateStoreDTO} storeData - Updated store data
	 * @returns {Promise<Store>} - The updated store
	 * @throws {Error} - If store not found or user doesn't have permission
	 *
	 * @example
	 * const updatedStore = await StoreService.updateStore(
	 *   "123e4567-e89b-12d3-a456-426614174000",
	 *   { name: "New Store Name" }
	 * );
	 */
	updateStore: async (
		storeId: string,
		storeData: UpdateStoreDTO
	): Promise<Store> => {
		// Add validation for storeId
		if (!storeId || typeof storeId !== 'string') {
			console.error('[StoreService] Invalid store ID:', storeId);
			throw new Error('Invalid store ID');
		}

		try {
			console.log('[StoreService] Updating store:', {
				storeId,
				endpoint: `${STORES_ENDPOINT}/${storeId}`,
				data: storeData,
			});

			// Ensure storeId is a clean string
			const cleanId = String(storeId).trim();

			// Make the API call with the correct parameter name
			const response = await api.patch(
				`${STORES_ENDPOINT}/${cleanId}`,
				storeData
			);

			console.log('[StoreService] Update response:', response.data);

			if (!response.data) {
				console.error('[StoreService] Empty response received');
				throw new Error('Empty response received from server');
			}

			// Return the data according to your API structure
			return response.data.data || response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error('[StoreService] Update failed:', {
					status: error.response?.status,
					data: error.response?.data,
					message: error.message,
				});
			} else {
				console.error('[StoreService] Update failed:', error);
			}
			throw error;
		}
	},

	/**
	 * Deletes a store (Admin/Mod only)
	 *
	 * @param {string} id - The UUID of the store to delete
	 * @returns {Promise<{ message: string }>} - Success message
	 * @throws {Error} - If store not found or user doesn't have permission
	 *
	 * @example
	 * await StoreService.deleteStore("123e4567-e89b-12d3-a456-426614174000");
	 */
	deleteStore: async (id: string): Promise<{ message: string }> => {
		const response = await api.delete(`${STORES_ENDPOINT}/${id}`);
		return response.data;
	},

	/**
	 * Gets a store's subscription validity information
	 *
	 * @param {string} id - The UUID of the store
	 * @returns {Promise<StoreSubscription>} - Subscription details including plan information
	 * @throws {Error} - If store not found or request fails
	 *
	 * @example
	 * const validity = await StoreService.getStoreValidity("123e4567-e89b-12d3-a456-426614174000");
	 */
	getStoreValidity: async (id: string): Promise<StoreSubscription> => {
		const response = await api.get(`${STORES_ENDPOINT}/validity/${id}`);
		return response.data;
	},

	/**
	 * Gets the URL for a store's profile image with fallback to default
	 *
	 * @param {Store} store - The store object
	 * @returns {string} - URL to the store's profile image
	 *
	 * @example
	 * const imageUrl = StoreService.getStoreImageUrl(store);
	 */
	getStoreImageUrl: (store: Store): string => {
		if (!store.storeImage) {
			return '/images/store-placeholder.png';
		}

		// If already an absolute URL, return as is
		if (store.storeImage.startsWith('http')) {
			return store.storeImage;
		}

		// Otherwise, prepend your API URL if needed
		return `${API_URL}/${store.storeImage.replace(/^\//, '')}`;
	},

	/**
	 * Gets the URL for a store's cover image with fallback to default
	 *
	 * @param {Store} store - The store object
	 * @returns {string} - URL to the store's cover image
	 *
	 * @example
	 * const coverUrl = StoreService.getStoreCoverUrl(store);
	 */
	getStoreCoverUrl: (store: Store): string => {
		if (!store.storeCoverImage) {
			return '/images/store-cover-placeholder.png';
		}

		// If already an absolute URL, return as is
		if (store.storeCoverImage.startsWith('http')) {
			return store.storeCoverImage;
		}

		// Otherwise, prepend your API URL if needed
		return `${API_URL}/${store.storeCoverImage.replace(/^\//, '')}`;
	},

	/**
	 * Checks if a store has an active subscription
	 *
	 * @param {Store} store - The store object
	 * @returns {boolean} - True if subscription is active, false otherwise
	 *
	 * @example
	 * const isActive = StoreService.hasActiveSubscription(store);
	 * if (isActive) {
	 *   // Perform actions for stores with active subscriptions
	 * }
	 */
	hasActiveSubscription: (store: Store): boolean => {
		if (!store.storeSubscription) {
			return false;
		}

		// If endDate is null, it's a free subscription (always active)
		if (store.storeSubscription.endDate === null) {
			return true;
		}

		const now = new Date();
		const endDate = new Date(store.storeSubscription.endDate);

		return endDate > now;
	},

	/**
	 * Calculates remaining subscription days for a store
	 *
	 * @param {Store} store - The store object
	 * @returns {number | null} - Number of days remaining or null if no expiration
	 *
	 * @example
	 * const daysLeft = StoreService.getRemainingSubscriptionDays(store);
	 * if (daysLeft !== null && daysLeft < 7) {
	 *   // Show subscription expiry warning
	 * }
	 */
	getRemainingSubscriptionDays: (store: Store): number | null => {
		if (!store.storeSubscription || !store.storeSubscription.endDate) {
			return null; // Free plan or no subscription
		}

		const now = new Date();
		const endDate = new Date(store.storeSubscription.endDate);
		const diffTime = endDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return diffDays > 0 ? diffDays : 0;
	},

	/**
	 * Returns formatted status information for a store with styling classes
	 *
	 * @param {string} status - The store status
	 * @returns {Object} - Object containing label and CSS classes for styling
	 * @returns {string} returns.label - Human-readable status label
	 * @returns {string} returns.color - Background color CSS class
	 * @returns {string} returns.textColor - Text color CSS class
	 *
	 * @example
	 * const { label, color, textColor } = StoreService.getFormattedStatus(store.status);
	 * // Use in JSX: <span className={`${color} ${textColor} px-2 py-1 rounded`}>{label}</span>
	 */
	getFormattedStatus: (
		status: string
	): {
		label: string;
		color: string;
		textColor: string;
	} => {
		switch (status) {
			case 'approved':
				return {
					label: 'Approved',
					color: 'bg-green-100',
					textColor: 'text-green-800',
				};
			case 'trusted':
				return {
					label: 'Trusted',
					color: 'bg-blue-100',
					textColor: 'text-blue-800',
				};
			case 'pending':
				return {
					label: 'Pending',
					color: 'bg-yellow-100',
					textColor: 'text-yellow-800',
				};
			case 'rejected':
				return {
					label: 'Rejected',
					color: 'bg-red-100',
					textColor: 'text-red-800',
				};
			case 'blocked':
				return {
					label: 'Blocked',
					color: 'bg-red-100',
					textColor: 'text-red-800',
				};
			case 'archived':
				return {
					label: 'Archived',
					color: 'bg-gray-100',
					textColor: 'text-gray-800',
				};
			default:
				return {
					label: status,
					color: 'bg-gray-100',
					textColor: 'text-gray-800',
				};
		}
	},

	/**
	 * Formats store category names into a comma-separated string
	 *
	 * @param {Store} store - The store object
	 * @returns {string} - Comma-separated list of category names or "No categories"
	 *
	 * @example
	 * const categoryString = StoreService.formatCategories(store);
	 * // "Vegetables, Fruits, Organic"
	 */
	formatCategories: (store: Store): string => {
		if (!store.storeCategories || store.storeCategories.length === 0) {
			return 'No categories';
		}

		return store.storeCategories
			.map((category: { name: string }) => category.name)
			.join(', ');
	},

	/**
	 * Gets detailed subscription information for a store
	 *
	 * @param {Store} store - The store object
	 * @returns {Object} - Subscription details object
	 * @returns {string} returns.planName - Name of the subscription plan
	 * @returns {boolean} returns.isActive - Whether subscription is currently active
	 * @returns {number|null} returns.productLimit - Number of allowed products or null if unlimited
	 * @returns {string|null} returns.expiryDate - ISO date string of expiry or null if none
	 * @returns {number|null} returns.remainingDays - Days until expiry or null if no expiry
	 * @returns {boolean} returns.hasVariableProductSupport - Whether variable products are supported
	 * @returns {boolean} returns.hasAnalyticsSupport - Whether analytics are supported
	 *
	 * @example
	 * const subscription = StoreService.getSubscriptionDetails(store);
	 * if (subscription.isActive && subscription.remainingDays < 7) {
	 *   // Show "Subscription ending soon" message
	 * }
	 */
	getSubscriptionDetails: (
		store: Store
	): {
		planName: string;
		isActive: boolean;
		productLimit: number | null;
		expiryDate: string | null;
		remainingDays: number | null;
		hasVariableProductSupport: boolean;
		hasAnalyticsSupport: boolean;
	} => {
		const subscription = store.storeSubscription;

		if (!subscription) {
			return {
				planName: 'No Subscription',
				isActive: false,
				productLimit: null,
				expiryDate: null,
				remainingDays: null,
				hasVariableProductSupport: false,
				hasAnalyticsSupport: false,
			};
		}

		const isActive = StoreService.hasActiveSubscription(store);
		const remainingDays = StoreService.getRemainingSubscriptionDays(store);

		return {
			planName: subscription.subscriptionPlan.name,
			isActive,
			productLimit: subscription.subscriptionPlan.productLimit || null,
			expiryDate: subscription.endDate,
			remainingDays,
			hasVariableProductSupport:
				subscription.subscriptionPlan.supportVariableProduct,
			hasAnalyticsSupport: subscription.subscriptionPlan.analytics,
		};
	},

	/**
	 * Retrieves store information by owner ID
	 *
	 * @param {string} ownerId - The UUID of the store owner
	 * @returns {Promise<{storeId: string, storeName: string, storeLocation: string, ownerId: string, ownerName: string, ownerPhone: string}>} - Store and owner information
	 * @throws {Error} - If store not found or request fails
	 *
	 * @example
	 * const storeInfo = await StoreService.getStoreByOwnerId("0b6ff4c9-5ada-47c6-b90d-d2fda6c86b31");
	 */
	getStoreByOwnerId: async (
		ownerId: string
	): Promise<{
		storeId: string;
		storeName: string;
		storeLocation: string;
		ownerId: string;
		ownerName: string;
		ownerPhone: string;
	}> => {
		const response = await axios.get(`${STORES_ENDPOINT}/owner/${ownerId}`);
		return response.data.data;
	},

	/**
	 * Retrieves store NID information including document images (Admin only)
	 *
	 * @param {string} storeId - The UUID of the store
	 * @returns {Promise<{id: string, nidImageFront: string|null, nidImageBack: string|null, tradeLicenseImage: string|null}>} - Store NID and trade license information
	 * @throws {Error} - If store not found, user doesn't have admin permission, or request fails
	 *
	 * @example
	 * const nidInfo = await StoreService.getStoreNidInfo("0a1e88b1-725f-4da8-9093-3087b69e5e00");
	 * if (nidInfo.nidImageFront) {
	 *   // Display NID front image
	 * }
	 */
	getStoreNidInfo: async (
		storeId: string
	): Promise<{
		id: string;
		nidImageFront: string | null;
		nidImageBack: string | null;
		tradeLicenseImage: string | null;
	}> => {
		const response = await api.get(`${API_URL}/admin/stores/${storeId}/nid-info`);
		return response.data.data;
	},
};
