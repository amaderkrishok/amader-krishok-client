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
import { Loader2, Upload, User, Phone, Save, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/components/providers/session-provider';
import api from '@/lib/axios';
import { Session } from '@/lib/types/auth';

const profileFormSchema = z.object({
	name: z.string().min(2, { message: 'নাম অন্তত ২ অক্ষরের হতে হবে।' }),
	phoneNumber: z
		.string()
		.min(5, { message: 'ফোন নম্বর অন্তত ৫ অক্ষরের হতে হবে।' }),
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

	// Initialize form
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			name: '',
			phoneNumber: '',
		},
	});

	// Fetch user profile data
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

					setOriginalValues(initialValues);
					form.reset(initialValues);
				} catch (error) {
					console.error('Failed to fetch user profile:', error);

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
			toast.error('ইউজার আইডি খুঁজে পাওয়া যায়নি');
			return;
		}

		const hasNameChanged = data.name !== originalValues.name;
		const hasPhoneChanged = data.phoneNumber !== originalValues.phoneNumber;
		const hasImageChanged = imageFile !== null;

		if (!hasNameChanged && !hasPhoneChanged && !hasImageChanged) {
			toast.info('কোনো পরিবর্তন করা হয়নি');
			return;
		}

		setIsLoading(true);

		try {
			const formData = new FormData();

			if (hasNameChanged) {
				formData.append('name', data.name);
			}

			if (hasPhoneChanged) {
				formData.append('phoneNumber', data.phoneNumber);
			}

			if (imageFile) {
				formData.append('image', imageFile);
			}

			const response = await api.patch(`/users/${session.user.id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			const userData = response.data.data;

			const updatedUser = {
				...session.user,
				...(hasNameChanged && { name: data.name }),
				...(hasPhoneChanged && { phoneNumber: data.phoneNumber }),
				...(userData?.image && { image: userData.image }),
			};

			const updatedSession: Session = {
				...session,
				user: updatedUser,
			};

			await updateSession(updatedSession);

			await fetch('/api/auth/session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedSession),
			});

			setOriginalValues({
				name: data.name,
				phoneNumber: data.phoneNumber,
			});

			toast.success('প্রোফাইল সফলভাবে আপডেট হয়েছে');

			setImageFile(null);
			setImagePreview(null);
			setProfileData(userData);
		} catch (error: any) {
			console.error('Profile update error:', error);
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.details?.message ||
				'প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে';

			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}

	const userInitials = session?.user?.name
		? session.user.name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
		: 'U';

	const avatarSrc =
		imagePreview || profileData?.image || session?.user?.image || null;

	if (status === 'loading') {
		return (
			<div className='flex justify-center p-8'>
				<Loader2 className='h-8 w-8 animate-spin text-[#28321A]' />
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Card Title & Subtitle */}
			<div className='border-b border-[#E5E7EB] pb-4'>
				<h3 className='text-lg font-extrabold text-[#111827] flex items-center gap-2'>
					<UserCheck className='w-5 h-5 text-[#28321A]' />
					ব্যক্তিগত তথ্য
				</h3>
				<p className='text-xs text-[#64748B] font-medium mt-0.5'>
					আপনার ব্যক্তিগত তথ্য আপডেট ও সংরক্ষণ করুন
				</p>
			</div>

			<div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
				{/* 6. AVATAR SECTION */}
				<div className='flex flex-col items-center gap-3 p-4 bg-[#FFF9E8]/50 rounded-2xl border border-[#F4B400]/20 min-w-[200px]'>
					<div className='relative'>
						<Avatar className='h-28 w-28 border-4 border-white shadow-md'>
							<AvatarImage
								src={avatarSrc || ''}
								alt={session?.user?.name || 'User'}
							/>
							<AvatarFallback className='text-3xl bg-[#F4B400] text-[#172033] font-black'>
								{userInitials}
							</AvatarFallback>
						</Avatar>
					</div>

					<label htmlFor='avatar-upload' className='w-full'>
						<Button
							variant='outline'
							size='sm'
							type='button'
							className='w-full bg-white hover:bg-gray-50 text-[#28321A] border border-[#28321A]/30 font-bold rounded-xl text-xs cursor-pointer shadow-xs'
							asChild
						>
							<div>
								<Upload className='mr-1.5 h-3.5 w-3.5 text-[#F4B400]' />
								ছবি পরিবর্তন করুন
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

					{imageFile ? (
						<p className='text-[11px] font-bold text-[#15803D] truncate max-w-[180px]'>
							{imageFile.name}
						</p>
					) : (
						<p className='text-[10px] font-medium text-[#64748B] text-center'>
							JPG, PNG • সর্বোচ্চ 2MB
						</p>
					)}
				</div>

				{/* 5. FORM FIELDS */}
				<div className='flex-1 w-full space-y-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xs font-bold text-[#111827] flex items-center gap-1.5 mb-1'>
											<User className='w-3.5 h-3.5 text-[#F4B400]' />
											পূর্ণ নাম
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={isLoading}
												className='rounded-xl border-[#E5E7EB] focus:border-[#28321A] text-sm font-medium h-11 bg-white'
											/>
										</FormControl>
										<FormMessage className='text-xs text-red-600' />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='phoneNumber'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-xs font-bold text-[#111827] flex items-center gap-1.5 mb-1'>
											<Phone className='w-3.5 h-3.5 text-[#F4B400]' />
											ফোন নম্বর
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={isLoading}
												className='rounded-xl border-[#E5E7EB] focus:border-[#28321A] text-sm font-medium h-11 bg-white'
											/>
										</FormControl>
										<FormMessage className='text-xs text-red-600' />
									</FormItem>
								)}
							/>

							{/* Bottom Right Save Changes Button (Requirement #5: Warm Gold #F4B400) */}
							<div className='flex justify-end pt-2'>
								<Button
									type='submit'
									disabled={isLoading}
									className='bg-[#F4B400] hover:bg-[#E5A700] text-[#28321A] font-extrabold rounded-xl px-6 py-2.5 shadow-xs border-0 transition-all hover:-translate-y-0.5'
								>
									{isLoading ? (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									) : (
										<Save className='mr-2 h-4 w-4 text-[#28321A]' />
									)}
									পরিবর্তন সংরক্ষণ করুন
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
