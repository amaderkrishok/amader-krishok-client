'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { forgetPasswordService } from '@/services/forget-password-service';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
	AlertCircle,
	ArrowLeft,
	CheckCircle,
	Loader2,
	Eye,
	EyeOff,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgetPasswordPage() {
	const router = useRouter();
	const [step, setStep] = useState<'request' | 'verify' | 'reset' | 'success'>(
		'request'
	);
	const [phoneNumber, setPhoneNumber] = useState('');
	const [otp, setOtp] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	// New state variables for the timer functionality
	const [otpTimer, setOtpTimer] = useState(300); // 5 minutes in seconds
	const [resendCooldown, setResendCooldown] = useState(0);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// Format seconds to MM:SS display
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs
			.toString()
			.padStart(2, '0')}`;
	};

	// Handle the OTP timer countdown
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (step === 'verify' && otpTimer > 0) {
			interval = setInterval(() => {
				setOtpTimer((prevTimer) => prevTimer - 1);
			}, 1000);
		} else if (otpTimer === 0 && step === 'verify') {
			// OTP expired
			setMessage('');
			setError(
				'OTP এর মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে নতুন একটি অনুরোধ করুন।'
			);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [otpTimer, step]);

	// Handle the resend cooldown timer
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (resendCooldown > 0) {
			interval = setInterval(() => {
				setResendCooldown((prevTimer) => prevTimer - 1);
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [resendCooldown]);

	// Reset timer when OTP is sent or resent
	const resetOtpTimer = useCallback(() => {
		setOtpTimer(300); // Reset to 5 minutes
		setResendCooldown(60); // Set 1 minute cooldown for resend
	}, []);

	const handleRequestOtp = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await forgetPasswordService.requestPasswordReset(
				phoneNumber
			);
			setMessage(
				response.message ||
					'OTP সফলভাবে পাঠানো হয়েছে। অনুগ্রহ করে আপনার ফোনটি চেক করুন।'
			);
			resetOtpTimer();
			setStep('verify');
		} catch (err: any) {
			setError(err.message || 'OTP পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			await forgetPasswordService.verifyOtp(phoneNumber, otp);
			setStep('reset');
		} catch (err: any) {
			setError(err.message || 'Invalid OTP. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		setLoading(true);
		setError('');

		try {
			await forgetPasswordService.resetPassword(phoneNumber, otp, newPassword);
			setStep('success');
			setTimeout(() => router.push('/auth/login'), 3000);
		} catch (err: any) {
			setError(err.message || 'Password reset failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const goBack = () => {
		if (step === 'verify') {
			setStep('request');
		} else if (step === 'reset') {
			setStep('verify');
		} else if (step === 'success') {
			router.push('/auth/login');
		}
	};

	const resendOtp = async () => {
		if (resendCooldown > 0) return;

		setLoading(true);
		setError('');

		try {
			const response = await forgetPasswordService.requestPasswordReset(
				phoneNumber
			);
			setMessage(response.message || 'OTP resent successfully.');
			resetOtpTimer(); // Reset the OTP timer and set resend cooldown
		} catch (err: any) {
			setError(err.message || 'Failed to resend OTP.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col justify-center min-h-[50vh] w-full bg-muted/40 px-4 py-8 md:pt-[5%] md:pb-8'>
			<Card className='w-full max-w-md mx-auto'>
				<CardHeader>
					<CardTitle>
						{step === 'request' && 'পাসওয়ার্ড ভুলে গেছেন?'}
						{step === 'verify' && 'OTP যাচাই করুন'}
						{step === 'reset' && 'পাসওয়ার্ড রিসেট করুন'}
						{step === 'success' && 'সফল'}
					</CardTitle>
					<CardDescription>
						{step === 'request' && 'OTP পেতে আপনার ফোন নম্বরটি লিখুন'}
						{step === 'verify' && 'আপনার ফোনে পাঠানো ৬-সংখ্যার কোডটি লিখুন'}
						{step === 'reset' &&
							'আপনার অ্যাকাউন্টের জন্য একটি নতুন পাসওয়ার্ড তৈরি করুন'}
						{step === 'success' && 'আপনার পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে!'}
					</CardDescription>
				</CardHeader>

				<CardContent>
					{error && (
						<Alert variant='destructive' className='mb-4'>
							<AlertCircle className='h-4 w-4' />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{message && step === 'verify' && (
						<Alert className='mb-4'>
							<CheckCircle className='h-4 w-4' />
							<AlertDescription>{message}</AlertDescription>
						</Alert>
					)}

					{step === 'request' && (
						<form onSubmit={handleRequestOtp} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='phoneNumber'>ফোন নম্বর</Label>
								<Input
									id='phoneNumber'
									type='text'
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									placeholder='01XXXXXXXXX'
									pattern='01\d{9}'
									required
								/>
								<p className='text-xs text-muted-foreground'>
									আপনার ১১-সংখ্যার বাংলাদেশি ফোন নম্বরটি লিখুন। (01XXXXXXXXX)
								</p>
							</div>

							<Button type='submit' className='w-full' disabled={loading}>
								{loading ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										OTP পাঠানো হচ্ছে...
									</>
								) : (
									'OTP পাঠান'
								)}
							</Button>
						</form>
					)}

					{step === 'verify' && (
						<form onSubmit={handleVerifyOtp} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='phoneNumber'>ফোন নম্বর</Label>
								<Input
									id='phoneNumber'
									type='text'
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									readOnly
									className='bg-muted'
								/>
							</div>

							<div className='space-y-2'>
								<div className='flex justify-between items-center'>
									<Label htmlFor='otp'>OTP Code</Label>
									<span className='text-sm font-medium text-primary'>
										Time remaining: {formatTime(otpTimer)}
									</span>
								</div>
								<Input
									id='otp'
									type='text'
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
									placeholder='6-digit OTP'
									pattern='\d{6}'
									maxLength={6}
									required
								/>
								<p className='text-xs text-muted-foreground'>
									আপনার ফোনে পাঠানো ৬-সংখ্যার কোডটি লিখুন।
								</p>
							</div>

							<div className='space-y-4'>
								<Button
									type='submit'
									className='w-full'
									disabled={loading || otpTimer === 0}
								>
									{loading ? (
										<>
											<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											যাচাই করা হচ্ছে...
										</>
									) : (
										'OTP যাচাই করুন'
									)}
								</Button>

								<div className='text-center'>
									<Button
										variant='link'
										type='button'
										onClick={resendOtp}
										disabled={loading || resendCooldown > 0}
										className='text-sm'
									>
										{resendCooldown > 0
											? `OTP আবার পাঠান in ${resendCooldown}s`
											: 'OTP আবার পাঠান'}
									</Button>
								</div>
							</div>
						</form>
					)}

					{step === 'reset' && (
						<form onSubmit={handleResetPassword} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='newPassword'>New Password</Label>
								<div className='relative'>
									<Input
										id='newPassword'
										type={showNewPassword ? 'text' : 'password'}
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										placeholder='Enter new password'
										minLength={6}
										required
									/>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										className='absolute right-0 top-0 h-full px-3 py-2'
										onClick={() => setShowNewPassword(!showNewPassword)}
									>
										{showNewPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
										<span className='sr-only'>
											{showNewPassword ? 'Hide password' : 'Show password'}
										</span>
									</Button>
								</div>
								<p className='text-xs text-muted-foreground'>
									পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে
								</p>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='confirmPassword'>Confirm Password</Label>
								<div className='relative'>
									<Input
										id='confirmPassword'
										type={showConfirmPassword ? 'text' : 'password'}
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										placeholder='Confirm new password'
										minLength={6}
										required
									/>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										className='absolute right-0 top-0 h-full px-3 py-2'
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									>
										{showConfirmPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
										<span className='sr-only'>
											{showConfirmPassword ? 'Hide password' : 'Show password'}
										</span>
									</Button>
								</div>
							</div>

							<Button type='submit' className='w-full' disabled={loading}>
								{loading ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										রিসেট করা হচ্ছে...
									</>
								) : (
									'পাসওয়ার্ড রিসেট করুন'
								)}
							</Button>
						</form>
					)}

					{step === 'success' && (
						<div className='text-center py-6 space-y-4'>
							<div className='flex justify-center'>
								<CheckCircle className='h-16 w-16 text-primary' />
							</div>
							<h3 className='text-xl font-semibold'>পাসওয়ার্ড রিসেট সফল</h3>
							<p className='text-muted-foreground'>
								আপনাকে শীঘ্রই লগইন পৃষ্ঠায় পাঠানো করা হবে...
							</p>
						</div>
					)}
				</CardContent>

				<CardFooter
					className={step === 'success' ? 'justify-center' : 'justify-between'}
				>
					{step !== 'request' && step !== 'success' && (
						<Button variant='outline' type='button' onClick={goBack}>
							<ArrowLeft className='mr-2 h-4 w-4' />
							Back
						</Button>
					)}

					{step === 'success' && (
						<Button
							variant='outline'
							type='button'
							onClick={() => router.push('/auth/login')}
						>
							Go to Login
						</Button>
					)}

					{step === 'request' && (
						<Button
							variant='link'
							type='button'
							onClick={() => router.push('/auth/login')}
							className='w-full'
						>
							পাসওয়ার্ড মনে আছে? লগইন করুন
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
