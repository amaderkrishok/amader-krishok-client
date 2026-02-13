// services/authService.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const forgetPasswordService = {
	// Request password reset OTP
	requestPasswordReset: async (phoneNumber: string) => {
		const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ phoneNumber }),
		});

		if (!response.ok) {
			throw await response.json();
		}

		return await response.json();
	},

	// Verify OTP
	verifyOtp: async (phoneNumber: string, otp: string) => {
		const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ phoneNumber, otp }),
		});

		if (!response.ok) {
			throw await response.json();
		}

		return await response.json();
	},

	// Reset password
	resetPassword: async (
		phoneNumber: string,
		otp: string,
		newPassword: string
	) => {
		const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ phoneNumber, otp, newPassword }),
		});

		if (!response.ok) {
			throw await response.json();
		}

		return await response.json();
	},
};
