import api from '@/lib/axios';
import { ProductCategoryType } from '@/types/product-category';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

function mapBackendToFrontendCategory(category: any): ProductCategoryType {
	return {
		id: category.id,
		name: category.name,
		parent: category.parent, // Now directly using the parent object
		children: category.children?.map(mapBackendToFrontendCategory) || [],
	};
}

export const ProductCategoryService = {
	//public route
	getProductAllCategories: async () => {
		const response = await axios.get(`${API_URL}/product-categories`);

		// Map the response data to your frontend format
		const mappedCategories = response.data.data.map(
			mapBackendToFrontendCategory
		);

		return {
			...response.data,
			data: mappedCategories,
		};
	},
	//public route
	getProductCategory: async (id: number) => {
		const response = await axios.get(`${API_URL}/product-categories/${id}`);
		return response.data;
	},

	//Privte Route
	createProductCategory: async (category: ProductCategoryType) => {
		const payload = {
			name: category.name,
			parentId: category.parentId,
		};
		const response = await api.post(`${API_URL}/product-categories`, payload);
		return response.data;
	},

	//Privte Route
	updateProductCategory: async (
		id: number,
		category: Partial<ProductCategoryType>
	) => {
		const payload = {
			name: category.name,
			parentId: category.parentId,
		};
		console.log(payload);
		const response = await api.patch(
			`${API_URL}/product-categories/${id}`,
			payload
		);
		console.log(response.data);
		return response.data;
	},

	//Privte Route
	deleteProductCategory: async (id: number) => {
		const response = await api.delete(`${API_URL}/product-categories/${id}`);
		return response.data;
	},
};
