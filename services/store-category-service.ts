// services/storeCategoryService.ts
import api from '@/lib/axios';
import { CreateStoreCategoryDto, StoreCategory, UpdateStoreCategoryDto } from '@/types/store-category';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const BASE_URL = `${API_URL}/store-categories`;

export const StoreCategoryService = {
	// Public endpoints - using axios
	getAllCategories: async (): Promise<StoreCategory[]> => {
		const response = await axios.get(`${BASE_URL}`);
		return response.data;
	},

	getCategory: async (id: number): Promise<StoreCategory> => {
		const response = await axios.get(`${BASE_URL}/${id}`);
		return response.data;
	},

	// Protected endpoints - using private API instance with auth
	createCategory: async (
		categoryData: CreateStoreCategoryDto
	): Promise<StoreCategory> => {
		const response = await api.post(BASE_URL, categoryData);
		return response.data;
	},

	updateCategory: async (
		id: number,
		categoryData: UpdateStoreCategoryDto
	): Promise<StoreCategory> => {
		const response = await api.patch(`${BASE_URL}/${id}`, categoryData);
		return response.data;
	},

	deleteCategory: async (id: number): Promise<void> => {
		await api.delete(`${BASE_URL}/${id}`);
	},

	// Helper function for generating slugs
	generateSlug: (name: string): string => {
		return name
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	},
};
