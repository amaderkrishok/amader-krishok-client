'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/components/providers/session-provider';
import api from '@/lib/axios';
import { Session } from '@/lib/types/auth';

const profileFormSchema = z.object({
	name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
	phoneNumber: z
		.string()
		.min(5, { message: 'Phone number must be at least 5 characters.' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function UserProfileForm() {
	const { data: session, status, update: updateSession } = useSession();
	const [isLoading, setIsLoading] = useState(false);
	const [profileData, setProfileData] = useState<any>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [originalValues, setOriginalValues] = useState<ProfileFormValues>({
		name: '',
		phoneNumber: '',
	});

	// Initialize form with empty values
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			name: '',
			phoneNumber: '',
		},
	});

	// Fetch user profile data including image URL
	useEffect(() => {
		const fetchUserProfile = async () => {
			if (status === 'authenticated' && session?.user?.id) {
				try {
					const response = await api.get(`/users/${session.user.id}`);
					setProfileData(response.data);

					const initialValues = {
						name: response.data.name || session.user.name || '',
						phoneNumber:
							response.data.phoneNumber || session.user.phoneNumber || '',
					};

					// Store original values for change detection
					setOriginalValues(initialValues);

					// Update form with fetched data
					form.reset(initialValues);
				} catch (error) {
					console.error('Failed to fetch user profile:', error);

					// Fallback to session data if API request fails
					const fallbackValues = {
						name: session.user.name || '',
						phoneNumber: session.user.phoneNumber || '',
					};

					setOriginalValues(fallbackValues);
					form.reset(fallbackValues);
				}
			}
		};

		fetchUserProfile();
	}, [session, status, form]);

	// Handle image selection
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setImageFile(file);

			// Create preview URL
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	// Form submission handler
	async function onSubmit(data: ProfileFormValues) {
		if (!session?.user?.id) {
			toast.error('User ID not found in session');
			return;
		}

		// Check if any values have changed
		const hasNameChanged = data.name !== originalValues.name;
		const hasPhoneChanged = data.phoneNumber !== originalValues.phoneNumber;
		const hasImageChanged = imageFile !== null;

		// If nothing has changed, show message and return early
		if (!hasNameChanged && !hasPhoneChanged && !hasImageChanged) {
			toast.info('No changes detected');
			return;
		}

		setIsLoading(true);

		try {
			// Create FormData for multipart/form-data submission
			const formData = new FormData();

			// Only append changed fields
			if (hasNameChanged) {
				formData.append('name', data.name);
			}

			if (hasPhoneChanged) {
				formData.append('phoneNumber', data.phoneNumber);
			}

			// Append image if selected
			if (imageFile) {
				formData.append('image', imageFile);
			}

			// Make API request
			const response = await api.patch(`/users/${session.user.id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			console.log('Server response:', response.data);

			// The server returns data in a nested 'data' object
			const userData = response.data.data;

			// Create updated user object
			const updatedUser = {
				...session.user,
				...(hasNameChanged && { name: data.name }),
				...(hasPhoneChanged && { phoneNumber: data.phoneNumber }),
				...(userData?.image && { image: userData.image }),
			};

			// Update session in React state
			const updatedSession: Session = {
				...session,
				user: updatedUser,
			};

			await updateSession(updatedSession);

			// ALSO update the session cookie
			await fetch('/api/auth/session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedSession),
			});

			// Update original values to match current values
			setOriginalValues({
				name: data.name,
				phoneNumber: data.phoneNumber,
			});

			toast.success('Profile updated successfully');

			// Reset image preview state
			setImageFile(null);
			setImagePreview(null);

			// Update profile data with response
			setProfileData(userData);
		} catch (error: any) {
			console.error('Profile update error:', error);

			// Display detailed error message from API
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.details?.message ||
				'Failed to update profile';

			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}

	// Generate user initials for avatar fallback
	const userInitials = session?.user?.name
		? session.user.name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
		: 'U';

	// Determine avatar image source
	const avatarSrc =
		imagePreview || profileData?.image || session?.user?.image || null;

	if (status === 'loading') {
		return (
			<div className='flex justify-center p-4'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex flex-col items-center sm:flex-row sm:items-start gap-6'>
				<div className='flex flex-col items-center gap-2'>
					<Avatar className='h-24 w-24'>
						<AvatarImage
							src={avatarSrc || ''}
							alt={session?.user?.name || 'User'}
						/>
						<AvatarFallback className='text-2xl'>{userInitials}</AvatarFallback>
					</Avatar>
					<label htmlFor='avatar-upload'>
						<Button
							variant='outline'
							size='sm'
							className='mt-2 cursor-pointer'
							asChild
						>
							<div>
								<Upload className='mr-2 h-4 w-4' />
								Change Avatar
								<input
									id='avatar-upload'
									type='file'
									accept='image/*'
									className='hidden'
									onChange={handleImageChange}
									disabled={isLoading}
								/>
							</div>
						</Button>
					</label>
					{imageFile && (
						<p className='text-xs text-muted-foreground mt-1'>
							{imageFile.name}
						</p>
					)}
				</div>

				<div className='flex-1 space-y-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input {...field} disabled={isLoading} />
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
											<Input {...field} disabled={isLoading} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='flex justify-end'>
								<Button type='submit' disabled={isLoading}>
									{isLoading && (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									)}
									Save Changes
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
