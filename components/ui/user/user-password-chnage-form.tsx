'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSession } from '@/components/providers/session-provider';
import api from '@/lib/axios';

const passwordFormSchema = z
	.object({
		currentPassword: z
			.string()
			.min(1, { message: 'Current password is required.' }),
		newPassword: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters.' })
			.regex(/[0-9]/, {
				message: 'Password must contain at least one number.',
			}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword'],
	});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function PasswordForm() {
	const [isLoading, setIsLoading] = useState(false);
	const { data: session } = useSession();

	// State for password visibility toggles
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(data: PasswordFormValues) {
		if (!session?.user?.id) {
			toast.error('You must be logged in to change your password');
			return;
		}

		setIsLoading(true);

		try {
			// Send request to change password API endpoint
			const response = await api.post('/users/change-password', {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			});

			// Handle successful password change
			toast.success('Password changed successfully', {
				description: 'Your account is now secured with your new password.',
			});
			form.reset();

			// Reset visibility states
			setShowCurrentPassword(false);
			setShowNewPassword(false);
			setShowConfirmPassword(false);
		} catch (error: any) {
			console.error('Password change error:', error);

			// Display error from API response
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				error.response?.data?.details?.message ||
				'Failed to change password. Please try again.';

			toast.error(errorMessage, {
				description:
					error.response?.status === 401
						? 'Your current password appears to be incorrect.'
						: 'Please ensure your new password meets all requirements.',
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className='space-y-6'>
			<Alert>
				<ShieldAlert className='h-4 w-4' />
				<AlertTitle>Password Security</AlertTitle>
				<AlertDescription>
					Your password must be at least 6 characters and include at least one
					number. For maximum security, consider using a password manager.
				</AlertDescription>
			</Alert>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={form.control}
						name='currentPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Current Password</FormLabel>
								<div className='relative'>
									<FormControl>
										<Input
											type={showCurrentPassword ? 'text' : 'password'}
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<button
										type='button'
										className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
										onClick={() => setShowCurrentPassword(!showCurrentPassword)}
										tabIndex={-1}
									>
										{showCurrentPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
									</button>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='newPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<div className='relative'>
									<FormControl>
										<Input
											type={showNewPassword ? 'text' : 'password'}
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<button
										type='button'
										className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
										onClick={() => setShowNewPassword(!showNewPassword)}
										tabIndex={-1}
									>
										{showNewPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
									</button>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm New Password</FormLabel>
								<div className='relative'>
									<FormControl>
										<Input
											type={showConfirmPassword ? 'text' : 'password'}
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<button
										type='button'
										className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										tabIndex={-1}
									>
										{showConfirmPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
									</button>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex justify-end'>
						<Button type='submit' disabled={isLoading}>
							{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Update Password
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
