'use client';

import { useState, useTransition, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
	User,
	Phone,
	Lock,
	Eye,
	EyeOff,
	ArrowRight,
	ArrowLeft,
	ShieldCheck,
	Sprout,
	CloudSun,
	UserCheck,
} from 'lucide-react';

import { LoginSchema } from '@/schemas';
import { clearSessionCache } from '@/lib/axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from './form-message/form-error';
import { FormSuccess } from './form-message/form-success';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { useSearchParams } from 'next/navigation';

// Helper function to convert raw English error messages into clean Bengali
const formatErrorMessageInBengali = (rawMessage?: string): string => {
	if (!rawMessage) return 'লগইন করতে সমস্যা হয়েছে। তথ্য যাচাই করে পুনরায় চেষ্টা করুন।';
	const lower = rawMessage.toLowerCase();
	if (
		lower.includes('invalid credentials') ||
		lower.includes('invalid credential') ||
		lower.includes('unauthorized')
	) {
		return 'ফোন নম্বর অথবা পাসওয়ার্ড সঠিক নয়।';
	}
	if (
		lower.includes('user not found') ||
		lower.includes('account not found') ||
		lower.includes('no user')
	) {
		return 'এই ফোন নম্বরে কোনো অ্যাকাউন্ট পাওয়া যায়নি।';
	}
	if (
		lower.includes('incorrect password') ||
		lower.includes('wrong password') ||
		lower.includes('invalid password')
	) {
		return 'পাসওয়ার্ড সঠিক নয়।';
	}
	if (
		lower.includes('too many attempts') ||
		lower.includes('rate limit') ||
		lower.includes('blocked')
	) {
		return 'অনেক বেশি ভুল চেষ্টা করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।';
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
	return 'ফোন নম্বর অথবা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে তথ্য পুনরায় পরীক্ষা করুন।';
};

// Inner component that uses useSearchParams
function LoginFormContent({
	className = '',
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	const searchParams = useSearchParams();
	// Get the callbackUrl from the query parameters
	const callbackUrl = searchParams.get('callbackUrl');

	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	// Helper function to validate callback URL (security measure)
	const isValidCallbackUrl = (url: string | null): boolean => {
		if (!url) return false;
		return url.startsWith('/') && !url.includes('..') && !url.includes('//');
	};

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			phoneNumber: '',
			password: '',
		},
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError('');
		setSuccess('');
		setIsRedirecting(false);

		startTransition(async () => {
			try {
				const requestBody = {
					...values,
					callbackUrl: callbackUrl || undefined,
				};

				const response = await fetch(`/api/auth/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify(requestBody),
					redirect: 'manual',
				});

				// Handle non-success codes (4xx, 5xx)
				if (response.status >= 400) {
					let errorMessage = 'লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করে পুনরায় চেষ্টা করুন।';
					try {
						const errorData = await response.json();
						errorMessage =
							errorData?.message ||
							errorData?.error ||
							errorData?.details?.message ||
							errorMessage;
					} catch {
						/* Ignore JSON parsing errors */
					}
					// Always translate backend error to clear Bengali
					setError(formatErrorMessageInBengali(errorMessage));
					console.error('Login failed:', response.status, errorMessage);
					return;
				}

				if (response.ok) {
					const responseData = await response.json();
					clearSessionCache();

					// Determine redirect based on role
					let redirectTargetRole = '/dashboard';

					if (responseData.role) {
						switch (responseData.role) {
							case 'admin':
								redirectTargetRole = '/admin/dashboard';
								break;
							case 'vendor':
								redirectTargetRole = '/vendor/dashboard';
								break;
							case 'modreator':
								redirectTargetRole = '/moderator/dashboard';
								break;
							case 'user':
								redirectTargetRole = '/user';
								break;
						}
					}

					setSuccess(responseData.message || 'লগইন সফল হয়েছে! রিডাইরেক্ট করা হচ্ছে...');
					setIsRedirecting(true);

					const redirectTarget = isValidCallbackUrl(callbackUrl)
						? callbackUrl
						: DEFAULT_LOGIN_REDIRECT;

					setTimeout(() => {
						window.location.href = redirectTargetRole || redirectTarget || '/';
					}, 500);
				}
			} catch (err) {
				console.error('Login form submission error:', err);
				setError('একটি অপ্রত্যাশিত নেটওয়ার্ক ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
			}
		});
	};

	return (
		<div className={`min-h-screen w-full flex flex-col lg:flex-row overflow-x-hidden ${className}`} {...props}>
			{/* LEFT PANEL: Hero Banner & Branding (Desktop Only / Stacked on Large Devices) */}
			<div className='relative hidden lg:flex lg:w-1/2 bg-[#26331B] text-white flex-col justify-between p-8 xl:p-12 overflow-hidden min-h-screen'>
				{/* Background Image with Subtle Scale Animation & Enhanced Contrast Overlay */}
				<div className='absolute inset-0 z-0 overflow-hidden'>
					<Image
						src='https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1400&auto=format&fit=crop'
						alt='Amader Krishok Smart Farming'
						fill
						priority
						className='object-cover object-center scale-105 transition-transform duration-10000 hover:scale-110 opacity-75'
					/>
					{/* Rich green gradient overlay for high contrast and readability */}
					<div className='absolute inset-0 bg-gradient-to-t from-[#152010] via-[#1B2813]/80 to-[#1B2813]/40' />
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

					<div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-200 backdrop-blur-md'>
						<span className='w-2 h-2 rounded-full bg-[#F5B800] animate-pulse' />
						<span>যাচাইকৃত নিরাপদ প্ল্যাটফর্ম</span>
					</div>
				</div>

				{/* Middle Hero Content */}
				<div className='relative z-10 max-w-xl my-auto space-y-6 pt-8 pb-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='space-y-4'
					>
						<div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5B800]/20 border border-[#F5B800]/40 text-[#F5B800] text-xs xl:text-sm font-bold backdrop-blur-md shadow-xs'>
							<Sprout className='w-4 h-4 text-[#F5B800]' />
							<span>বাংলাদেশের ১ম স্মার্ট ডিজিটাল কৃষকের বাজার</span>
						</div>
						<h1 className='text-3xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm'>
							কৃষকের ডিজিটাল সঙ্গী
						</h1>
						<p className='text-emerald-100/90 text-sm xl:text-base leading-relaxed font-normal'>
							আধুনিক প্রযুক্তি ও সঠিক তথ্যের মাধ্যমে কৃষিকে আরও সহজ, স্মার্ট ও লাভজনক করে তুলুন।
						</p>
					</motion.div>

					{/* 3 Feature Highlight Badges */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2'
					>
						<div className='flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all'>
							<div className='p-2 rounded-xl bg-[#F5B800]/20 text-[#F5B800] shrink-0'>
								<Sprout className='w-5 h-5' />
							</div>
							<div className='text-xs xl:text-sm font-bold text-white leading-snug'>
								কৃষি তথ্য ও পরামর্শ
							</div>
						</div>

						<div className='flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all'>
							<div className='p-2 rounded-xl bg-[#F5B800]/20 text-[#F5B800] shrink-0'>
								<CloudSun className='w-5 h-5' />
							</div>
							<div className='text-xs xl:text-sm font-bold text-white leading-snug'>
								আবহাওয়া আপডেট
							</div>
						</div>

						<div className='flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all'>
							<div className='p-2 rounded-xl bg-[#F5B800]/20 text-[#F5B800] shrink-0'>
								<UserCheck className='w-5 h-5' />
							</div>
							<div className='text-xs xl:text-sm font-bold text-white leading-snug'>
								কৃষক সেবা
							</div>
						</div>
					</motion.div>
				</div>

				{/* Bottom Motto */}
				<div className='relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs xl:text-sm text-emerald-200/90 font-medium'>
					<span>স্মার্ট কৃষি • উন্নত ভবিষ্যৎ</span>
					<span className='text-white/40'>•</span>
					<span className='text-[#F5B800] font-semibold'>আমাদের কৃষক</span>
				</div>
			</div>

			{/* RIGHT PANEL: Dedicated Login Section */}
			<div className='w-full lg:w-1/2 flex flex-col justify-between min-h-screen bg-gradient-to-b from-[#F0FDF4]/70 via-white to-[#F0FDF4]/40 p-4 sm:p-6 lg:p-10'>
				{/* Minimal Top Header Bar */}
				<header className='w-full max-w-xl mx-auto flex items-center justify-between py-2 px-1'>
					{/* Logo visible on Mobile/Tablet - Wrapped in a dark green brand badge for 100% contrast & clarity */}
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

				{/* Main Centered Login Card Area */}
				<div className='w-full my-auto py-6 sm:py-8 flex justify-center items-center'>
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='w-full max-w-[440px] bg-white rounded-[20px] border border-[#E2E8F0] shadow-xl shadow-emerald-950/[0.04] p-6 sm:p-8 xl:p-9 space-y-6'
					>
						{/* Top Card Icon & Heading */}
						<div className='text-center space-y-2'>
							<div className='mx-auto w-12 h-12 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[#22C55E] shadow-xs border border-emerald-200/50'>
								<User className='w-6 h-6' />
							</div>
							<h2 className='text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight'>
								স্বাগতম!
							</h2>
							<p className='text-xs sm:text-sm text-[#64748B] font-normal leading-relaxed'>
								আপনার অ্যাকাউন্টে লগইন করতে নিচের তথ্য দিন।
							</p>
						</div>

						{/* Form */}
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 sm:space-y-5'>
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
										{...form.register('phoneNumber')}
										disabled={isPending || isRedirecting}
										required
										className='pl-10 h-11 text-sm rounded-xl bg-gray-50/80 border-gray-200 focus:bg-white focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-medium text-[#172033] placeholder:text-gray-400'
									/>
								</div>
								{form.formState.errors.phoneNumber && (
									<p className='text-xs font-medium text-red-500 pt-0.5'>
										{form.formState.errors.phoneNumber.message}
									</p>
								)}
							</div>

							{/* Password Input */}
							<div className='space-y-1.5 text-left'>
								<div className='flex items-center justify-between'>
									<Label htmlFor='password' className='text-xs sm:text-sm font-semibold text-[#172033]'>
										পাসওয়ার্ড
									</Label>
									<Link
										href='/auth/forget-password'
										className='text-xs font-semibold text-[#22C55E] hover:text-[#16A34A] hover:underline transition-colors'
									>
										পাসওয়ার্ড ভুলে গেছেন?
									</Link>
								</div>
								<div className='relative'>
									<Lock className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]' />
									<Input
										id='password'
										type={showPassword ? 'text' : 'password'}
										placeholder='******'
										{...form.register('password')}
										disabled={isPending || isRedirecting}
										required
										className='pl-10 pr-10 h-11 text-sm rounded-xl bg-gray-50/80 border-gray-200 focus:bg-white focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all font-medium text-[#172033] placeholder:text-gray-400'
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
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
										{form.formState.errors.password.message}
									</p>
								)}
							</div>

							{/* Error / Success Messages */}
							<FormError message={error} />
							<FormSuccess message={success} />

							{/* Submit Button */}
							<Button
								type='submit'
								disabled={isPending || isRedirecting}
								className='w-full h-11 rounded-xl bg-[#26331B] hover:bg-[#1d2714] active:scale-[0.99] text-white font-semibold text-sm sm:text-base shadow-md shadow-emerald-950/10 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group'
							>
								{isRedirecting ? (
									<span className='flex items-center gap-2'>
										<span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
										পুনর্নির্দেশ করা হচ্ছে...
									</span>
								) : isPending ? (
									<span className='flex items-center gap-2'>
										<span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
										লগইন হচ্ছে...
									</span>
								) : (
									<span className='flex items-center gap-2'>
										লগইন করুন
										<ArrowRight className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-1' />
									</span>
								)}
							</Button>

							{/* Sign Up Link */}
							<div className='pt-2 text-center text-xs sm:text-sm text-[#64748B]'>
								<span>অ্যাকাউন্ট নেই?</span>{' '}
								<Link
									href='/auth/register'
									className='font-bold text-[#22C55E] hover:text-[#16A34A] hover:underline transition-colors'
								>
									নতুন অ্যাকাউন্ট খুলুন
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
				<footer className='w-full text-center py-3 text-xs text-[#64748B] border-t border-emerald-900/5 mt-auto'>
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

// Main component with Suspense boundary
export default function LoginForm(props: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<Suspense
			fallback={
				<div className='min-h-screen w-full flex items-center justify-center bg-[#F0FDF4]/50 p-4'>
					<div className='w-full max-w-[440px] bg-white rounded-[20px] border border-[#E2E8F0] p-8 space-y-6 shadow-xl'>
						<div className='animate-pulse space-y-4'>
							<div className='w-12 h-12 bg-emerald-100 rounded-2xl mx-auto' />
							<div className='h-6 bg-gray-200 rounded-md w-1/2 mx-auto' />
							<div className='h-4 bg-gray-100 rounded-md w-3/4 mx-auto' />
							<div className='h-11 bg-gray-100 rounded-xl w-full pt-4' />
							<div className='h-11 bg-gray-100 rounded-xl w-full' />
							<div className='h-11 bg-emerald-600/30 rounded-xl w-full' />
						</div>
					</div>
				</div>
			}
		>
			<LoginFormContent {...props} />
		</Suspense>
	);
}