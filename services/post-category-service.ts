import api from '@/lib/axios';
import axios from 'axios';
import type {
	PostCategoryType,
	PaginatedResponse,
	SingleResponse,
} from '@/types/post';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const PostCategoryService = {
	// Public routes
	getAllCategories: async (
		params: {
			page?: number;
			limit?: number;
			search?: string;
			name?: string;
			hasPostsOnly?: boolean;
		} = {}
	) => {
		let url = `${API_URL}/post-categories?page=${params.page ?? 1}&limit=${
			params.limit ?? 100
		}`;

		if (params.search) {
			url += `&search=${encodeURIComponent(params.search)}`;
		}
		if (params.name) {
			url += `&name=${encodeURIComponent(params.name)}`;
		}
		if (params.hasPostsOnly !== undefined) {
			url += `&hasPostsOnly=${params.hasPostsOnly}`;
		}

		const response = await axios.get<PaginatedResponse<PostCategoryType>>(url);
		return response.data;
	},

	getCategory: async (id: number) => {
		const response = await axios.get<SingleResponse<PostCategoryType>>(
			`${API_URL}/post-categories/${id}`
		);
		return response.data;
	},

	getCategoryBySlug: async (slug: string) => {
		const response = await axios.get<SingleResponse<PostCategoryType>>(
			`${API_URL}/post-categories/slug/${slug}`
		);
		return response.data;
	},

	// Protected routes
	createCategory: async (
		category: Omit<
			PostCategoryType,
			'id' | 'createdAt' | 'updatedAt' | 'postsCount'
		>
	) => {
		const response = await api.post<SingleResponse<PostCategoryType>>(
			`${API_URL}/post-categories`,
			category
		);
		return response.data;
	},

	updateCategory: async (
		id: number,
		category: Partial<
			Omit<PostCategoryType, 'id' | 'createdAt' | 'updatedAt' | 'postsCount'>
		>
	) => {
		const response = await api.patch<SingleResponse<PostCategoryType>>(
			`${API_URL}/post-categories/${id}`,
			category
		);
		return response.data;
	},

	deleteCategory: async (id: number) => {
		const response = await api.delete<{ statusCode: number; message: string }>(
			`${API_URL}/post-categories/${id}`
		);
		return response.data;
	},

	// Synchronization routes
	syncPostCounts: async () => {
		const response = await api.post<{ updatedCategories: number }>(
			`${API_URL}/post-categories/sync-counts`
		);
		return response.data;
	},

	syncCategoryPostCount: async (id: number) => {
		const response = await api.post<{ updated: boolean }>(
			`${API_URL}/post-categories/sync-counts/${id}`
		);
		return response.data;
	},
};
