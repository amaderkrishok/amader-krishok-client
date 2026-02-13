export interface User {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	phoneNumber: string;
	role: string;
	isBlocked: boolean;
	isApproved: boolean;
	image: string;
	createdAt: string;
	updatedAt: string;
	storeId: string | null;
}

export interface PostCategory {
	id: number;
	slug: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	featuredImage: string;
	postsCount: number;
}

export interface TableOfContentItem {
	id: string;
	level: number;
	title: string;
	children: TableOfContentItem[];
}

export interface PostDescription {
	content: string;
}

export interface PostType {
	id: number;
	slug: string;
	title: string;
	description: PostDescription;
	tableOfContent: TableOfContentItem[];
	createdAt: string;
	updatedAt: string;
	updatedById: string;
	published: boolean;
	featuredImage: string;
	excerpt: string;
	categories: PostCategory[];
	updatedBy?: User;
}

export interface PaginatedMeta {
	itemsPerPage: number;
	totalItems: number;
	currentPage: number;
	totalPages: number;
}

export interface PaginationLinks {
	first: string;
	last: string;
	current: string;
	next?: string;
	previous?: string;
}

export interface PaginatedResponse<T> {
	statusCode: number;
	message: string;
	data: T[];
	meta: PaginatedMeta;
	links: PaginationLinks;
}

export interface SingleResponse<T> {
	statusCode: number;
	message: string;
	data: T;
}
export interface PostCategoryType {
	id: number;
	slug: string;
	name: string;
	description?: string;
	featuredImage?: string;
	postsCount?: number;
	createdAt?: string;
	updatedAt?: string;
}


export interface PaginationMeta {
	itemsPerPage: number;
	totalItems: number;
	currentPage: number;
	totalPages: number;
}
