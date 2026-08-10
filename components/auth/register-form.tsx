'use client';

import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
	User,
	UserPlus,
	Phone,
	Mail,
	Lock,
	Eye,
	EyeOff,
	ArrowRight,
	ArrowLeft,
	ShieldCheck,
	Sprout,
	CloudSun,
	UserCheck,
	Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { FormError } from './form-message/form-error';
import { FormSuccess } from './form-message/form-success';

// Define the base form schema (Bangla)
const BaseRegisterSchema = z
	.object({
		name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে'),
		phoneNumber: z
			.string()
			.min(11, 'ফোন নম্বর কমপক্ষে ১১ অক্ষরের হতে হবে'),
		password: z
			.string()
			.min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে')
			.regex(/[0-9]/, 'পাসওয়ার্ডে অন্তত একটি সংখ্যা থাকতে হবে'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'পাসওয়ার্ড মিলছে না',
		path: ['confirmPassword'],
	});

// Extended schema with optional email for non-user roles (Bangla)
const ExtendedRegisterSchema = z.object({
	...BaseRegisterSchema._def.schema.shape,
	email: z.string().email('ইমেইল ফরম্যাট সঠিক নয়'),
});

// Type definitions
type BaseRegisterSchemaType = z.infer<typeof BaseRegisterSchema>;
type ExtendedRegisterSchemaType = z.infer<typeof ExtendedRegisterSchema>;

interface RegisterFormProps {
	role?: string;
	showImageUpload?: boolean;
}

// Helper to convert raw English registration error messages to clear Bengali
const formatRegisterErrorMessageInBengali = (rawMessage?: string): string => {
	if (!rawMessage) return 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে। তথ্যগুলো পুনরায় পরীক্ষা করুন।';
	const lower = rawMessage.toLowerCase();
	if (
		lower.includes('already exists') ||
		lower.includes('already registered') ||
		lower.includes('duplicate')
	) {
		return 'এই ফোন নম্বর দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।';
	}
	if (lower.includes('invalid phone') || lower.includes('phone number')) {
		return 'ফোন নম্বরটি সঠিকভাবে প্রদান করুন (যেমন: 01XXXXXXXXX)।';
	}
	if (lower.includes('password') && lower.includes('match')) {
		return 'পাসওয়ার্ড দুটি মিলছে না।';
	}
	if (
		lower.includes('network') ||
		lower.includes('fetch failed') ||
		lower.includes('failed to fetch')
	) {
		return 'ইন্টারনেট বা নেটওয়ার্ক সংযোগের সমস্যা দেখা দিয়েছে।';
	}
	// If message already contains Bengali characters (\u0980-\u09FF)
	if (/[\u0980-\u09FF]/.test(rawMessage)) {
		return rawMessage;
	}
	return 'রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি। তথ্য পুনরায় পরীক্ষা করুন।';
};

export function RegisterForm({
	role = 'user',
	showImageUpload = false,
}: RegisterFormProps) {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');

	// Determine if we should show email and image fields
	const isAdvancedUser = role !== 'user' && role !== undefined;

	// Choose the appropriate schema based on role
	const schema = isAdvancedUser ? ExtendedRegisterSchema : BaseRegisterSchema;

	const form = useForm<BaseRegisterSchemaType | ExtendedRegisterSchemaType>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			phoneNumber: '',
			password: '',
			confirmPassword: '',
			...(isAdvancedUser && { email: '' }),
		},
	});

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

	const onSubmit = async (
		data: BaseRegisterSchemaType | ExtendedRegisterSchemaType
	) => {
		setIsLoading(true);
		setError('');
		setSuccess('');
		try {
			// Create FormData for multipart/form-data submission
			const formData = new FormData();

			// Append text fields
			formData.append('name', data.name);
			formData.append('phoneNumber', data.phoneNumber);
			formData.append('password', data.password);
			formData.append('role', role);

			// Only append email if it's an advanced user
			if (isAdvancedUser && 'email' in data) {
				formData.append('email', data.email);
			}

			// Only append image if it's an advanced user and image is selected
			if (isAdvancedUser && showImageUpload && imageFile) {
				formData.append('image', imageFile);
			}

			// Make API request
			const response = await api.post('/users', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			setSuccess('রেজিস্ট্রেশন সফল হয়েছে! আপনাকে লগইন পেজে নিয়ে যাওয়া হচ্ছে...');
			form.reset();

			setTimeout(() => {
				router.push('/auth/login');
			}, 1000);
		} catch (error: any) {
			console.error('Registration error:', error);

			// Extract error message from the API response
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.details?.message ||
				error.response?.data?.message ||
				'রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।';

			// Set formatted Bengali error message
			setError(formatRegisterErrorMessageInBengali(errorMessage));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen w-full flex flex-col lg:flex-row overflow-x-hidden'>
			{/* LEFT PANEL: Agricultural Hero Banner & Branding (Desktop Only) */}
			<div className='relative hidden lg:flex lg:w-1/2 bg-[#26331B] text-white flex-col justify-between p-8 xl:p-12 overflow-hidden min-h-screen'>
				{/* Background Image with Subtle Scale Animation & Overlay */}
				<div className='absolute inset-0 z-0 overflow-hidden'>
					<Image
						src='/images/hero_farmer_fresh_produce.jpg'
						alt='Amader Krishok Registration Banner'
						fill
						priority
						className='object-cover object-center scale-105 transition-transform duration-10000 hover:scale-110 opacity-40'
					/>
					{/* Dark green gradient overlay */}
					<div className='absolute inset-0 bg-gradient-to-t from-[#26331B] via-[#26331B]/85 to-[#26331B]/70 backdrop-blur-[1px]' />
				</div>

				{/* Top Branding Section */}
				<div className='relative z-10 flex items-center justify-between'>
					<Link href='/' className='inline-block group transition-transform duration-300 hover:scale-105'>
						<Image
							src='/images/logo-transparent.png'
							width={160}
							height={70}
							alt='Amader Krishok Logo'
							className='h-auto w-[140px] xl:w-[160px] drop-shadow-md'
						/>
					</Link>
				</div>

				{/* Middle Hero Content */}
				<div className='relative z-10 max-w-xl my-auto space-y-6 pt-8 pb-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='space-y-4'
					>
						<div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs xl:text-sm font-medium backdrop-blur-sm'>
							<Sprout className='w-4 h-4 text-[#FACC15]' />
							<span>ডিজিটাল কৃষি প্ল্যাটফর্ম</span>
						</div>
						<h1 className='text-3xl xl:text-5xl font-black tracking-tight text-white leading-tight'>
							কৃষির নতুন সম্ভাবনার সাথে যুক্ত হোন
						</h1>
						<p className='text-emerald-100/90 text-sm xl:text-base leading-relaxed font-normal'>
							আধুনিক প্রযুক্তি, কৃষি তথ্য ও প্রয়োজনীয় সেবার মাধ্যমে আপনার কৃষিকাজকে আরও সহজ ও স্মার্ট করুন।
						</p>
					</motion.div>

					{/* 3 Feature Highlight Cards */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2'
					>
						<div className='flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all'>
							<div className='p-2 rounded-xl bg-[#22C55E]/20 text-[#FACC15] shrink-0'>
								<Sprout className='w-5 h-5' />
							</div>
							<div className='text-xs xl:text-sm font-semibold text-white leading-snug'>
								কৃষি তথ্য ও পরামর্শ
							</div>
						</div>

						<div className='flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all'>
							<div className='p-2 rounded-xl bg-[#22C55E]/20 text-[#FACC15] shrink-0'>
								<CloudSun className='w-5 h-5' />
							</div>
							<div className='text-xs xl:text-sm font-semibold text-white leading-snug'>
								আবহাওয়া ও পূর্বাভাস
							</div>
						</div>

						<div className='flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all'>
							<div className='p-2 rounded-xl bg-[#22C55E]/20 text-[#FACC15] shrink-0'>
								<UserCheck className='w-5 h-5' />
							</div>
							<div className='text-xs xl:text-sm font-semibold text-white leading-snug'>
								কৃষকের প্রয়োজনীয় সেবা
							</div>
						</div>
					</motion.div>
				</div>

				{/* Bottom Motto */}
				<div className='relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs xl:text-sm text-emerald-200/80 font-medium'>
					<span>স্মার্ট কৃষি • উন্নত ভবিষ্যৎ</span>
					<span className='text-white/40'>•</span>
					<span className='text-emerald-300/90'>আমাদের কৃষক</span>
				</div>
			</div>

			{/* RIGHT PANEL: Registration Form Section */}
			<div className='w-full lg:w-1/2 flex flex-col justify-between min-h-screen bg-gradient-to-b from-[#F0FDF4]/70 via-white to-[#F0FDF4]/40 p-4 sm:p-6 lg:p-10 overflow-y-auto'>
				{/* Minimal Top Header Bar */}
				<header className='w-full max-w-xl mx-auto flex items-center justify-between py-2 px-1 shrink-0'>
					{/* Logo visible on Mobile/Tablet */}
					<Link
						href='/'
						className='lg:hidden inline-flex items-center gap-2 bg-[#26331B] px-3.5 py-1.5 rounded-2xl shadow-md border border-emerald-950/20 transition-transform duration-300 hover:scale-105'
					>
						<Image
							src='/images/logo-transparent.png'
							width={120}
							height={50}
							alt='Amader Krishok Logo'
							className='h-auto w-[100px] sm:w-[115px] drop-shadow-sm'
						/>
					</Link>

					{/* Return to Home Link */}
					<Link
						href='/'
						className='ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#26331B] hover:text-[#22C55E] bg-white/90 hover:bg-white border border-emerald-900/15 rounded-full shadow-xs transition-all duration-200'
					>
						<ArrowLeft className='w-3.5 h-3.5' />
						<span>হোমে ফিরে যান</span>
					</Link>
				</header>

				{/* Main Centered Registration Card Area */}
				<div className='w-full my-auto py-6 sm:py-8 flex justify-center items-center'>
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='w-full max-w-[500px] bg-white rounded-[20px] border border-[#E2E8F0] shadow-xl shadow-emerald-950/[0.04] p-6 sm:p-8 xl:p-9 space-y-6'
					>
						{/* Top Card Icon & Heading */}
						<div className='text-center space-y-2'>
							<div className='mx-auto w-12 h-12 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[#22C55E] shadow-xs border border-emerald-200/50'>
								<UserPlus className='w-6 h-6' />
							</div>
							<h2 className='text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight'>
								{role === 'admin'
									? 'এডমিন অ্যাকাউন্ট তৈরি করুন'
									: role === 'vendor'
									? 'বিক্রেতা অ্যাকাউন্ট তৈরি করুন'
									: role === 'modreator'
									? 'মডারেটর অ্যাকাউন্ট তৈরি করুন'
									: 'অ্যাকাউন্ট তৈরি করুন'}
							</h2>
							<p className='text-xs sm:text-sm text-[#64748B] font-normal leading-relaxed'>
								{role === 'admin'
									? 'এডমিন হিসেবে যুক্ত হতে নিচের তথ্যগুলো পূরণ করুন।'
									: role === 'vendor'
									? 'আমাদের কৃষক প্ল্যাটফর্মে পণ্য বিক্রি করতে তথ্য প্রদান করুন।'
									: role === 'modreator'
									? 'মডারেটর হিসেবে যুক্ত হতে নিচের তথ্যগুলো পূরণ করুন।'
									: 'Amader Krishok-এ যুক্ত হতে নিচের তথ্যগুলো পূরণ করুন।'}
							</p>
						</div>

						{/* Form */}
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 sm:space-y-5'>
							{/* Name Input */}
							<div className='space-y-1.5 text-left'>
								<Label htmlFor='name' className='text-xs sm:text-sm font-semibold text-[#172033]'>
									পুরো নাম
								</Label>
								<div className='relative'>
									<User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]' />
									<Input
										id='name'
										placeholder='আপনার নাম লিখুন'
										disabled={isLoading}
										{...form.register('name')}
										className='pl-10 h-11 text-sm rounded-xl bg-gray-50/80 border-gray-200 focus:bg-white focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-medium text-[#172033] placeholder:text-gray-400'
									/>
								</div>
								{form.formState.errors.name && (
									<p className='text-xs font-medium text-red-500 pt-0.5'>
										{form.formState.errors.name?.message?.toString()}
									</p>
								)}
							</div>

							{/* Only show email field for non-user roles */}
							{isAdvancedUser && (
								<div className='space-y-1.5 text-left'>
									<Label htmlFor='email' className='text-xs sm:text-sm font-semibold text-[#172033]'>
										ইমেইল
									</Label>
									<div className='relative'>
										<Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]' />
										<Input
											id='email'
											type='email'
											placeholder='example@email.com'
											disabled={isLoading}
											{...form.register('email')}
											className='pl-10 h-11 text-sm rounded-xl bg-gray-50/80 border-gray-200 focus:bg-white focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-medium text-[#172033] placeholder:text-gray-400'
										/>
									</div>
									{isAdvancedUser &&
										(form.formState.errors as FieldErrors<ExtendedRegisterSchemaType>).email && (
											<p className='text-xs font-medium text-red-500 pt-0.5'>
												{
													(form.formState.errors as FieldErrors<ExtendedRegisterSchemaType>)
														.email?.message?.toString()
												}
											</p>
										)}
								</div>
							)}

							{/* Phone Number Input */}
							<div className='space-y-1.5 text-left'>
								<Label htmlFor='phoneNumber' className='text-xs sm:text-sm font-semibold text-[#172033]'>
									ফোন নম্বর
								</Label>
								<div className='relative'>
									<Phone className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]' />
									<Input
										id='phoneNumber'
										type='tel'
										autoComplete='tel'
										placeholder='01XXXXXXXXX'
										disabled={isLoading}
										{...form.register('phoneNumber')}
										className='pl-10 h-11 text-sm rounded-xl bg-gray-50/80 border-gray-200 focus:bg-white focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-medium text-[#172033] placeholder:text-gray-400'
									/>
								</div>
								{form.formState.errors.phoneNumber && (
									<p className='text-xs font-medium text-red-500 pt-0.5'>
										{form.formState.errors.phoneNumber?.message?.toString()}
									</p>
								)}
							</div>

							{/* Only show image upload for non-user roles */}
							{isAdvancedUser && showImageUpload && (
								<div className='space-y-1.5 text-left'>
									<Label htmlFor='image' className='text-xs sm:text-sm font-semibold text-[#172033]'>
										প্রোফাইল ছবি (ঐচ্ছিক)
									</Label>
									<div className='flex items-center gap-3'>
										<div className='relative flex-grow'>
											<Upload className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]' />
											<Input
												id='image'
												type='file'
												accept='image/*'
												disabled={isLoading}
												onChange={handleImageChange}
												className='pl-10 h-11 text-sm rounded-xl bg-gray-50/80 border-gray-200 file:bg-[#DCFCE7] file:text-[#26331B] file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-xs file:font-semibold'
											/>
										</div>
										{imagePreview && (
											<div className='h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-gray-200 shadow-xs'>
												<img
													src={imagePreview}
													alt='Preview'
													className='h-full w-full object-cover'
												/>
											</div>
										)}
									</div>
								</div>
							)}

							{/* Password Input */}
							<div className='space-y-1.5 text-left'>
								<Label htmlFor='password' className='text-xs sm:text-sm font-semibold text-[#172033]'>
									পাসওয়ার্ড
								</Label>
								<div className='relative'>
									<Lock className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]' />
									<Input
										id='password'
										placeholder='******'
										type={showPassword ? 'text' : 'password'}
										disabled={isLoading}
										{...form.register('password')}
										className='pl-10 pr-10 h-11 text-sm rounded-xl bg-gray-50/80 border-gray-200 focus:bg-white focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-medium text-[#172033] placeholder:text-gray-400'
									/>
									<button
										type='button'
										onClick={() => setShowPassword((prev) => !prev)}
										tabIndex={-1}
										className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer transition-colors p-0.5'
										aria-label={showPassword ? 'Hide password' : 'Show password'}
									>
										{showPassword ? (
											<EyeOff className='w-4 h-4' />
										) : (
											<Eye className='w-4 h-4' />
										)}
									</button>
								</div>
								{form.formState.errors.password && (
									<p className='text-xs font-medium text-red-500 pt-0.5'>
										{form.formState.errors.password?.message?.toString()}
									</p>
								)}
							</div>

							{/* Confirm Password Input */}
							<div className='space-y-1.5 text-left'>
								<Label htmlFor='confirmPassword' className='text-xs sm:text-sm font-semibold text-[#172033]'>
									পাসওয়ার্ড নিশ্চিত করুন
								</Label>
								<div className='relative'>
									<ShieldCheck className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]' />
									<Input
										id='confirmPassword'
										placeholder='******'
										type={showConfirmPassword ? 'text' : 'password'}
										disabled={isLoading}
										{...form.register('confirmPassword')}
										className='pl-10 pr-10 h-11 text-sm rounded-xl bg-gray-50/80 border-gray-200 focus:bg-white focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-medium text-[#172033] placeholder:text-gray-400'
									/>
									<button
										type='button'
										onClick={() => setShowConfirmPassword((prev) => !prev)}
										tabIndex={-1}
										className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer transition-colors p-0.5'
										aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
									>
										{showConfirmPassword ? (
											<EyeOff className='w-4 h-4' />
										) : (
											<Eye className='w-4 h-4' />
										)}
									</button>
								</div>
								{form.formState.errors.confirmPassword && (
									<p className='text-xs font-medium text-red-500 pt-0.5'>
										{form.formState.errors.confirmPassword?.message?.toString()}
									</p>
								)}
							</div>

							{/* Error / Success Messages */}
							<FormError message={error} />
							<FormSuccess message={success} />

							{/* Submit Button */}
							<Button
								type='submit'
								disabled={isLoading}
								className='w-full h-11 sm:h-12 rounded-xl bg-[#26331B] hover:bg-[#1d2714] active:scale-[0.99] text-white font-semibold text-sm sm:text-base shadow-md shadow-emerald-950/10 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group'
							>
								{isLoading ? (
									<span className='flex items-center gap-2'>
										<span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
										রেজিস্টার হচ্ছে...
									</span>
								) : (
									<span className='flex items-center gap-2'>
										রেজিস্টার করুন
										<ArrowRight className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-1' />
									</span>
								)}
							</Button>

							{/* Login Link */}
							<div className='pt-2 text-center text-xs sm:text-sm text-[#64748B]'>
								<span>ইতিমধ্যে অ্যাকাউন্ট আছে?</span>{' '}
								<Link
									href='/auth/login'
									className='font-bold text-[#22C55E] hover:text-[#16A34A] hover:underline transition-colors ml-1'
								>
									লগইন করুন
								</Link>
							</div>

							{/* Security Note */}
							<div className='pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-[#64748B]'>
								<ShieldCheck className='w-4 h-4 text-[#22C55E] shrink-0' />
								<span>আপনার তথ্য নিরাপদ ও সুরক্ষিত থাকবে।</span>
							</div>
						</form>
					</motion.div>
				</div>

				{/* Minimal Footer */}
				<footer className='w-full text-center py-3 text-xs text-[#64748B] border-t border-emerald-900/5 mt-auto shrink-0'>
					<p>
						© 2026 Amader Krishok ·{' '}
						<Link href='/privacy' className='hover:text-[#26331B] hover:underline transition-colors'>
							গোপনীয়তা
						</Link>{' '}
						·{' '}
						<Link href='/terms' className='hover:text-[#26331B] hover:underline transition-colors'>
							শর্তাবলি
						</Link>
					</p>
				</footer>
			</div>
		</div>
	);
}
