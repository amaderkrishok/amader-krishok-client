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
import { Eye, EyeOff, Loader2, ShieldCheck, Lock, KeyRound } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSession } from '@/components/providers/session-provider';
import api from '@/lib/axios';

const passwordFormSchema = z
	.object({
		currentPassword: z
			.string()
			.min(1, { message: 'বর্তমান পাসওয়ার্ড প্রদান আবশ্যক।' }),
		newPassword: z
			.string()
			.min(8, { message: 'পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।' })
			.regex(/[0-9]/, {
				message: 'পাসওয়ার্ডে অন্তত একটি সংখ্যা থাকতে হবে।',
			}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'নতুন পাসওয়ার্ড দুটি মিলছে না।',
		path: ['confirmPassword'],
	});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function PasswordForm() {
	const [isLoading, setIsLoading] = useState(false);
	const { data: session } = useSession();

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
			toast.error('পাসওয়ার্ড পরিবর্তন করতে আপনাকে লগইন করতে হবে');
			return;
		}

		setIsLoading(true);

		try {
			await api.post('/users/change-password', {
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			});

			toast.success('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে', {
				description: 'আপনার অ্যাকাউন্ট এখন নতুন পাসওয়ার্ড দিয়ে সুরক্ষিত।',
			});
			form.reset();

			setShowCurrentPassword(false);
			setShowNewPassword(false);
			setShowConfirmPassword(false);
		} catch (error: any) {
			console.error('Password change error:', error);

			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.message ||
				error.response?.data?.details?.message ||
				'পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।';

			toast.error(errorMessage, {
				description:
					error.response?.status === 401
						? 'আপনার বর্তমান পাসওয়ার্ডটি সঠিক নয়।'
						: 'অনুগ্রহ করে সমস্ত শর্তাবলী মেনে নতুন পাসওয়ার্ড তৈরি করুন।',
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='border-b border-[#E5E7EB] pb-4'>
				<h3 className='text-lg font-extrabold text-[#111827] flex items-center gap-2'>
					<Lock className='w-5 h-5 text-[#28321A]' />
					পাসওয়ার্ড পরিবর্তন
				</h3>
				<p className='text-xs text-[#64748B] font-medium mt-0.5'>
					আপনার অ্যাকাউন্ট নিরাপদ রাখতে নিয়মিত পাসওয়ার্ড আপডেট করুন।
				</p>
			</div>

			<Alert className='bg-[#FFF9E8] border-[#F4B400]/40 rounded-2xl p-4'>
				<ShieldCheck className='h-5 w-5 text-[#28321A]' />
				<AlertTitle className='font-bold text-[#111827] text-sm ml-2'>নিরাপত্তা বিষয়ক তথ্য</AlertTitle>
				<AlertDescription className='text-xs text-[#64748B] font-medium ml-2 mt-1'>
					পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে এবং তাতে অন্তত একটি সংখ্যা থাকতে হবে।
				</AlertDescription>
			</Alert>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 max-w-lg'>
					<FormField
						control={form.control}
						name='currentPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-xs font-bold text-[#111827] flex items-center gap-1.5 mb-1'>
									<KeyRound className='w-3.5 h-3.5 text-[#F4B400]' />
									বর্তমান পাসওয়ার্ড
								</FormLabel>
								<div className='relative'>
									<FormControl>
										<Input
											type={showCurrentPassword ? 'text' : 'password'}
											{...field}
											disabled={isLoading}
											placeholder='••••••••'
											className='rounded-xl border-[#E5E7EB] focus:border-[#28321A] text-sm font-medium h-11 pr-10 bg-white'
										/>
									</FormControl>
									<button
										type='button'
										className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#28321A]'
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
								<FormMessage className='text-xs text-red-600' />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='newPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-xs font-bold text-[#111827] flex items-center gap-1.5 mb-1'>
									<KeyRound className='w-3.5 h-3.5 text-[#F4B400]' />
									নতুন পাসওয়ার্ড
								</FormLabel>
								<div className='relative'>
									<FormControl>
										<Input
											type={showNewPassword ? 'text' : 'password'}
											{...field}
											disabled={isLoading}
											placeholder='••••••••'
											className='rounded-xl border-[#E5E7EB] focus:border-[#28321A] text-sm font-medium h-11 pr-10 bg-white'
										/>
									</FormControl>
									<button
										type='button'
										className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#28321A]'
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
								<FormMessage className='text-xs text-red-600' />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-xs font-bold text-[#111827] flex items-center gap-1.5 mb-1'>
									<KeyRound className='w-3.5 h-3.5 text-[#F4B400]' />
									নতুন পাসওয়ার্ড নিশ্চিত করুন
								</FormLabel>
								<div className='relative'>
									<FormControl>
										<Input
											type={showConfirmPassword ? 'text' : 'password'}
											{...field}
											disabled={isLoading}
											placeholder='••••••••'
											className='rounded-xl border-[#E5E7EB] focus:border-[#28321A] text-sm font-medium h-11 pr-10 bg-white'
										/>
									</FormControl>
									<button
										type='button'
										className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#28321A]'
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
								<FormMessage className='text-xs text-red-600' />
							</FormItem>
						)}
					/>

					<div className='flex justify-start pt-2'>
						<Button
							type='submit'
							disabled={isLoading}
							className='bg-[#F4B400] hover:bg-[#E5A700] text-[#28321A] font-extrabold rounded-xl px-6 py-2.5 shadow-xs border-0 transition-all hover:-translate-y-0.5'
						>
							{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							পাসওয়ার্ড পরিবর্তন করুন
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
