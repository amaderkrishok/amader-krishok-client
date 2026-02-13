/**
 * Pagination metadata
 */
export interface PaginationMeta {
	itemsPerPage: number;
	totalItems: number;
	currentPage: number;
	totalPages: number;
}

/**
 * Pagination links
 */
export interface PaginationLinks {
	first?: string;
	previous?: string | null;
	current: string;
	next?: string | null;
	last?: string;
}

/**
 * Paginated response structure matching backend pagination.provider.ts
 */
export interface PaginatedResponse<T> {
	data: T[];
	meta: PaginationMeta;
	links: PaginationLinks;
}
