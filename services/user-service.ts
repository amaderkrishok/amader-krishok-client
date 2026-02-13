import api from '@/lib/axios';
import axios from 'axios';
import type { UserType } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const UserService = {
	// Public routes
	getUsers: async (params: {
		page?: number;
		limit?: number;
		search?: string;
		role?: string | null;
		isBlocked?: boolean | null;
	}) => {
		let url = `${API_URL}/users?page=${params.page || 1}&limit=${
			params.limit || 10
		}`;

		if (params.search) {
			url += `&search=${encodeURIComponent(params.search)}`;
		}

		if (params.role) {
			url += `&role=${params.role}`;
		}

		if (params.isBlocked !== null) {
			url += `&isBlocked=${params.isBlocked}`;
		}

		const response = await axios.get(url);
		return response.data;
	},

	getUser: async (id: string) => {
		const response = await api.get(`${API_URL}/users/${id}`);
		return response.data;
	},

	// Private routes
	createUser: async (user: UserType) => {
		const payload = {
			name: user.name,
			email: user.email,
			phoneNumber: user.phoneNumber,
			password: user.password,
			role: user.role,
		};
		const response = await api.post(`${API_URL}/users`, payload);
		return response.data;
	},

	updateUser: async (id: string, user: Partial<UserType>) => {
		const payload = {
			name: user.name,
			email: user.email,
			phoneNumber: user.phoneNumber,
		};

		// Only include password if it's provided
		if (user.password) {
			payload.password = user.password;
		}

		const response = await api.patch(`${API_URL}/users/${id}`, payload);
		return response.data;
	},

	deleteUser: async (id: string) => {
		const response = await api.delete(`${API_URL}/users/${id}`);
		return response.data;
	},

	// Status update - for blocking/unblocking users
	updateUserStatus: async (id: string, isBlocked: boolean) => {
		const response = await api.patch(`${API_URL}/users/${id}/status`, {
			isBlocked,
		});
		return response.data;
	},

	// Approval update - for approving/rejecting users
	approveUser: async (id: string, isApproved: boolean) => {
		const response = await api.patch(`${API_URL}/users/${id}/status`, {
			isApproved,
		});
		return response.data;
	},

	// Role update - for changing user roles
	updateUserRole: async (id: string, role: string) => {
		const response = await api.patch(`${API_URL}/users/${id}/status`, {
			role,
		});
		return response.data;
	},

	// Complete status update - for updating multiple status fields at once
	updateCompleteStatus: async (
		id: string,
		data: { role?: string; isApproved?: boolean; isBlocked?: boolean }
	) => {
		const response = await api.patch(`${API_URL}/users/${id}/status`, data);
		return response.data;
	},

	changePassword: async (currentPassword: string, newPassword: string) => {
		const response = await api.post(`${API_URL}/users/change-password`, {
			currentPassword,
			newPassword,
		});
		return response.data;
	},
};
