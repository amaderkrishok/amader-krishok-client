export enum ProductType {
	SIMPLE = 'SIMPLE',
	VARIABLE = 'VARIABLE',
}

export enum StoreStatus {
	APPROVED = 'approved',
	PENDING = 'pending',
	REJECTED = 'rejected',
	BLOCKED = 'blocked',
	ARCHIVED = 'archived',
	TRUSTED = 'trusted',
}

// Simple product related types
export interface SimpleProductImage {
	id?: number;
	imageUrl: string;
	isPrimary?: boolean;
}

export interface SimpleProductData {
	id?: number;
	price: number | string; // Accept both number and string types
	discountPrice?: number | string; // Accept both number and string types
	images: SimpleProductImage[];
}

// Variable product related types
export interface VariantProductImage {
	id?: number;
	imageUrl: string;
}

export interface ProductVariant {
	id?: number;
	variantName: string;
	price: number | string; // Accept both number and string types
	discountPrice?: number | string; // Accept both number and string types
	images?: VariantProductImage[];
}

export interface VariableProductData {
	id?: number;
	variants: ProductVariant[];
}

// Supply calendar
// Update Supply Calendar to handle string months
export interface ProductSupplyCalendar {
	id?: number;
	months: (number | string)[]; // Accept both number and string types
	description?: string;
}

// Store type
export interface Store {
	id: string;
	name: string;
	status: StoreStatus;
	slug?: string;
	address?: string;
	storeImage?: string;
	storeCoverImage?: string;
	division?: string;
	district?: string;
	description?: string;
	createdAt?: string;
	updatedAt?: string;
	trialUsed?: boolean;
	ownerId?: string;
}

// Category type
export interface ProductCategory {
	id: number;
	name: string;
	description?: string;
	parentId?: number;
}

// Main product type
export interface Product {
	id: number;
	name: string;
	slug: string;
	description?: string;
	productType: ProductType;
	store: Store;
	productCategories: ProductCategory[];
	supplyCalendar?: ProductSupplyCalendar[];
	simpleProduct?: SimpleProductData;
	variableProduct?: VariableProductData;
	storeId?: string
	// Optional status for archival; backend may return this
	status?: 'active' | 'archived' | 'pending';
}

// Create and Update DTOs
export interface CreateSimpleProductDTO {
	name: string;
	slug?: string;
	description: string;
	productType: ProductType.SIMPLE;
	storeId: string;
	categoryIds: number[];
	supplyCalendar?: {
		months: number[];
		description?: string;
	};
	simpleProductData: {
		price: number;
		discountPrice?: number;
		images: {
			imageUrl: string;
			isPrimary?: boolean;
		}[];
	};
}

export interface CreateVariableProductDTO {
	name: string;
	slug?: string;
	description: string;
	productType: ProductType.VARIABLE;
	storeId: string;
	categoryIds: number[];
	supplyCalendar?: {
		months: number[];
		description?: string;
	};
	variableProductData: {
		variants: {
			variantName: string;
			price: number;
			discountPrice?: number;
			images?: {
				imageUrl: string;
			}[];
		}[];
	};
}

export type CreateProductDTO =
	| CreateSimpleProductDTO
	| CreateVariableProductDTO;
export type UpdateProductDTO = Partial<CreateProductDTO>;

// Filter and pagination types
export interface ProductFilters {
	storeId?: string;
	categoryId?: number;
	name?: string;
	minPrice?: number;
	maxPrice?: number;
	productType?: ProductType;
	page?: number;
	limit?: number;
}

export interface PaginationMeta {
	itemsPerPage: number;
	totalItems: number;
	currentPage: number;
	totalPages: number;
}

export interface PaginationLinks {
	first: string;
	previous: string | null;
	current: string;
	next: string | null;
	last: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: PaginationMeta;
	links: PaginationLinks;
}
