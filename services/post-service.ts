import api from '@/lib/axios';
import axios from 'axios';
import type {
	PostType,
	SingleResponse,
	PostDescription,
	TableOfContentItem,
} from '@/types/post';
import { PaginatedResponse } from '@/types/pagination/pagination';
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export interface CreatePostData {
	title: string;
	slug: string;
	description: PostDescription;
	tableOfContent?: TableOfContentItem[];
	published?: boolean;
	featuredImage?: string;
	excerpt?: string;
	categoryIds: number[];
}

export interface UpdatePostData {
	title?: string;
	slug?: string;
	description?: PostDescription;
	tableOfContent?: TableOfContentItem[];
	published?: boolean;
	featuredImage?: string;
	excerpt?: string;
	categoryIds?: number[];
}

export const PostService = {
	// Public routes
	getPosts: async (params: {
		page?: number;
		limit?: number;
		search?: string;
		title?: string;
		slug?: string;
		categoryId?: number;
		categoryIds?: number[];
		published?: boolean;
		createdAfter?: string;
		createdBefore?: string;
		updatedById?: string;
	}) => {
		try {
			// Start with base URL and required parameters
			let url = `${API_URL}/posts?page=${params.page || 1}&limit=${
				params.limit || 10
			}`;

			// Add simple string/number parameters
			if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
			if (params.title) url += `&title=${encodeURIComponent(params.title)}`;
			if (params.slug) url += `&slug=${encodeURIComponent(params.slug)}`;
			if (params.categoryId) url += `&categoryId=${params.categoryId}`;
			if (params.published !== undefined)
				url += `&published=${params.published}`;
			if (params.createdAfter)
				url += `&createdAfter=${encodeURIComponent(params.createdAfter)}`;
			if (params.createdBefore)
				url += `&createdBefore=${encodeURIComponent(params.createdBefore)}`;
			if (params.updatedById)
				url += `&updatedById=${encodeURIComponent(params.updatedById)}`;

			// Special handling for categoryIds array - ensure each ID is added as a separate parameter
			if (params.categoryIds && params.categoryIds.length > 0) {
				// If there's only one ID in the array, use categoryId instead
				if (params.categoryIds.length === 1) {
					url += `&categoryId=${params.categoryIds[0]}`;
				} else {
					// Add each category ID as separate parameter
					params.categoryIds.forEach((id) => {
						url += `&categoryIds=${id}`;
					});
				}
			}

			const response = await axios.get<PaginatedResponse<PostType>>(url);
			return response.data;
		} catch (error) {
			console.error('Error fetching posts:', error);
			throw error;
		}
	},

	getPost: async (id: number) => {
		const response = await axios.get<SingleResponse<PostType>>(
			`${API_URL}/posts/${id}`
		);
		return response.data;
	},

	getPostBySlug: async (slug: string) => {
		const response = await axios.get<SingleResponse<PostType>>(
			`${API_URL}/posts/slug/${slug}`
		);
		return response.data;
	},

	// Protected routes
	createPost: async (data: CreatePostData) => {
		const response = await api.post<SingleResponse<PostType>>(
			`${API_URL}/posts`,
			data
		);
		return response.data;
	},

	updatePost: async (id: number, data: UpdatePostData) => {
		const response = await api.patch<SingleResponse<PostType>>(
			`${API_URL}/posts/${id}`,
			data
		);
		return response.data;
	},

	deletePost: async (id: number) => {
		const response = await api.delete<{ statusCode: number; message: string }>(
			`${API_URL}/posts/${id}`
		);
		return response.data;
	},

	// Change post publication status
	updatePostStatus: async (id: number, published: boolean) => {
		const response = await api.patch<SingleResponse<PostType>>(
			`${API_URL}/posts/${id}`,
			{ published }
		);
		return response.data;
	},

	// Get posts by author (current user)
	getMyPosts: async (params: {
		page?: number;
		limit?: number;
		search?: string;
		categoryId?: number;
		published?: boolean;
	}) => {
		let url = `${API_URL}/posts?page=${params.page || 1}&limit=${
			params.limit || 10
		}`;

		if (params.search) {
			url += `&search=${encodeURIComponent(params.search)}`;
		}

		if (params.categoryId) {
			url += `&categoryId=${params.categoryId}`;
		}

		if (params.published !== undefined) {
			url += `&published=${params.published}`;
		}

		const response = await api.get<PaginatedResponse<PostType>>(url);
		return response.data;
	},
};
