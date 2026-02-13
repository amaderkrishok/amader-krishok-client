import api from '@/lib/axios';
import { FertilizerCalculatorType } from '@/types/fertilizer';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const FertilizerService = {
	// Public routes
	getAllCalculators: async () => {
		const response = await axios.get(`${API_URL}/fertilizer-calculator`);
		return response.data;
	},

	getCalculator: async (id: number) => {
		const response = await axios.get(`${API_URL}/fertilizer-calculator/${id}`);
		return response.data;
	},

	// Protected routes
	createCalculator: async (calculator: FertilizerCalculatorType) => {
		const payload = {
			name: calculator.name,
			fertilizerAmounts: calculator.fertilizerAmounts,
		};const response = await api.post(
			`${API_URL}/fertilizer-calculator`,
			payload
		);
		
		return response.data;
	},

	updateCalculator: async (
		id: number,
		calculator: Partial<FertilizerCalculatorType>
	) => {
		const payload = {
			name: calculator.name,
			fertilizerAmounts: calculator.fertilizerAmounts,
		};
		const response = await api.patch(
			`${API_URL}/fertilizer-calculator/${id}`,
			payload
		);
		return response.data;
	},

	deleteCalculator: async (id: number) => {
		const response = await api.delete(`${API_URL}/fertilizer-calculator/${id}`);
		return response.data;
	},
};
