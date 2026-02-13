import api from '@/lib/axios';
import axios from 'axios';
import type { SubscriptionPlanType } from '@/types/subscription-plan';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const SubscriptionPlanService = {
	// Public routes
	getAllPlans: async () => {
		const response = await axios.get(`${API_URL}/subscription-plans`);
		return response.data;
	},

	getPlan: async (id: number) => {
		const response = await axios.get(`${API_URL}/subscription-plans/${id}`);
		return response.data;
	},

	// Private routes
	createPlan: async (plan: SubscriptionPlanType) => {
		const payload = {
			name: plan.name,
			price: plan.price,
			productLimit: plan.productLimit,
			supportVariableProduct: plan.supportVariableProduct,
			analytics: plan.analytics,
		};
		const response = await api.post(`${API_URL}/subscription-plans`, payload);
		return response.data;
	},

	updatePlan: async (id: number, plan: Partial<SubscriptionPlanType>) => {
		const payload = {
			name: plan.name,
			price: plan.price,
			productLimit: plan.productLimit,
			supportVariableProduct: plan.supportVariableProduct,
			analytics: plan.analytics,
		};
		const response = await api.patch(
			`${API_URL}/subscription-plans/${id}`,
			payload
		);
		return response.data;
	},

	deletePlan: async (id: number) => {
		const response = await api.delete(`${API_URL}/subscription-plans/${id}`);
		return response.data;
	},
};
