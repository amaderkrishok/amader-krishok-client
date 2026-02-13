// Store status enum
export enum StoreStatus {
	APPROVED = 'approved',
	PENDING = 'pending',
	REJECTED = 'rejected',
	BLOCKED = 'blocked',
	ARCHIVED = 'archived',
	TRUSTED = 'trusted',
}

// Store category type
export interface StoreCategory {
	id: number;
	name: string;
	description?: string;
}

// Subscription plan type
export interface SubscriptionPlan {
	id: string;
	name: string;
	price: number;
	productLimit?: number;
	supportVariableProduct: boolean;
	analytics: boolean;
}

// Store subscription type
export interface StoreSubscription {
	id: string;
	startDate: string;
	endDate: string | null;
	subscriptionPlan: SubscriptionPlan;
}

// Store entity type
export interface Store {
	id: string;
	name: string;
	slug: string;
	address: string;
	storeImage?: string;
	storeCoverImage?: string;
	status: StoreStatus;
	division: string;
	district: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	ownerId?: string;
	storeCategories: StoreCategory[];
	storeSubscription?: StoreSubscription;
	trialUsed: boolean;
}

// Create store DTO
export interface CreateStoreDTO {
	name: string;
	slug: string;
	address: string;
	division: string;
	district: string;
	description: string;
	nidImageFront: string;
	nidImageBack: string;
	tradeLicenseImage?: string;
	storeImage?: string;
	storeCoverImage?: string;
	ownerId: string;
	status?: StoreStatus;
	storeCategoryIds: number[];
}

// Update store DTO
export interface UpdateStoreDTO {
	name?: string;
	slug?: string;
	address?: string;
	storeImage?: string;
	storeCoverImage?: string;
	division?: string;
	district?: string;
	description?: string;
	storeCategoryIds?: number[];
	status?: StoreStatus;
}

// Store filters for API queries
export interface StoreFilters {
	status?: StoreStatus;
	name?: string;
	address?: string;
	categoryId?: number;
	ownerId?: string;
	subscriptionStatus?: 'active' | 'expired' | 'none';
	subscriptionPlanId?: string;
	page?: number;
	limit?: number;
}

