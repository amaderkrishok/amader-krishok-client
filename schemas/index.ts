import * as z from 'zod';

export const LoginSchema = z.object({
	phoneNumber: z
		.string({ required_error: 'Phone number is required' })
		.regex(
			/^01\d{9}$/,
			'Phone number must start with 01 and be 11 digits long'
		),
	password: z
		.string({ required_error: 'Password is required' })
		.min(1, 'Password is required')
		.min(6, 'Password must be more than 6 characters')
		.max(32, 'Password must be less than 32 characters'),
});
