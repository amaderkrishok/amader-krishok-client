'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { UserType } from '@/types/user';

interface UserFormProps {
	user: UserType | null;
	onSubmit: (user: UserType) => void;
	onCancel: () => void;
}

// Define the form schema type
const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	phoneNumber: z.string().optional(),
	role: z.enum(['user', 'admin', 'moderator', 'vendor']),
	isBlocked: z.boolean(),
	isApproved: z.boolean(),
	password: z
		.string()
		.min(6, {
			message: 'Password must be at least 6 characters.',
		})
		.optional()
		.or(z.literal('')),
});

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user?.name || '',
			email: user?.email || '',
			phoneNumber: user?.phoneNumber || '',
			role: (user?.role as 'user' | 'admin' | 'moderator' | 'vendor') || 'user',
			isBlocked: user?.isBlocked ?? false,
			isApproved: user?.isApproved ?? true,
			password: '',
		},
	});

	function onFormSubmit(values: FormValues) {
		const userData: UserType = {
			id: user?.id || '',
			name: values.name,
			email: values.email,
			emailVerified: user?.emailVerified || false,
			phoneNumber: values.phoneNumber || '',
			role: values.role,
			isBlocked: values.isBlocked,
			isApproved: values.isApproved,
			image: user?.image || null,
			createdAt: user?.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			storeId: user?.storeId || null,
		};

		// Only include password if it's provided and not empty
		if (values.password) {
			userData.password = values.password;
		}

		onSubmit(userData);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onFormSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder='Enter name' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type='email'
										placeholder='Enter email address'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='phoneNumber'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone Number</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter phone number (optional)'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<FormField
						control={form.control}
						name='role'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Role</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Select a role' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value='user'>User</SelectItem>
										<SelectItem value='vendor'>Vendor</SelectItem>
										<SelectItem value='moderator'>Moderator</SelectItem>
										<SelectItem value='admin'>Admin</SelectItem>
									</SelectContent>
								</Select>
								<FormDescription>
									The user&#39;s role determines their permissions in the system.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{user ? 'New Password (optional)' : 'Password'}
								</FormLabel>
								<FormControl>
									<Input
										type='password'
										placeholder={
											user
												? 'Leave blank to keep current password'
												: 'Enter password'
										}
										{...field}
									/>
								</FormControl>
								<FormDescription>
									{user
										? 'Leave blank to keep the current password.'
										: 'Password must be at least 6 characters long.'}
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<FormField
						control={form.control}
						name='isBlocked'
						render={({ field }) => (
							<FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
								<div className='space-y-0.5'>
									<FormLabel className='text-base'>Block Status</FormLabel>
									<FormDescription>
										Blocked users cannot log in or use the system.
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='isApproved'
						render={({ field }) => (
							<FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
								<div className='space-y-0.5'>
									<FormLabel className='text-base'>Approval Status</FormLabel>
									<FormDescription>
										Approved users have been verified and can access all
										features.
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				<div className='flex justify-end space-x-2'>
					<Button variant='outline' type='button' onClick={onCancel}>
						Cancel
					</Button>
					<Button type='submit'>{user ? 'Update' : 'Create'} User</Button>
				</div>
			</form>
		</Form>
	);
}
