'use client';

import { useState, useTransition, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoginSchema } from '@/schemas';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { FormError } from './form-message/form-error';
import { FormSuccess } from './form-message/form-success';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { useSearchParams } from 'next/navigation';

// Inner component that uses useSearchParams
function LoginFormContent({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) {
    const searchParams = useSearchParams();
    // Get the callbackUrl from the query parameters
    const callbackUrl = searchParams.get('callbackUrl');

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Helper function to validate callback URL (security measure)
    const isValidCallbackUrl = (url: string | null): boolean => {
        if (!url) return false;
        // Basic check: must start with '/' (relative path) and not contain '..' (path traversal)
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
                // Include callbackUrl in the request body
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
                    // Use manual redirect mode to prevent browser auto-following redirects
                    redirect: 'manual',
                });

                // For successful responses

                // Handle non-success codes (4xx, 5xx)
                if (response.status >= 400) {
                    let errorMessage = 'Login failed. Please check your credentials.';
                    try {
                        const errorData = await response.json();
                        // Use the message field from the response as it appears to be the main field in your API
                        errorMessage =
                            errorData?.message ||
                            errorData?.error ||
                            errorData?.details?.message ||
                            errorMessage;
                    } catch {
                        /* Ignore JSON parsing errors */
                    }
                    setError(errorMessage);
                    console.error('Login failed:', response.status, errorMessage);
                    return;
                }
                if (response.ok) {
                    const responseData = await response.json();
                    setSuccess(
                        responseData.message || 'Login successful! Redirecting...'
                    );

                    // Determine redirect based on role
                    let redirectTargetRole = '/dashboard'; // default redirect

                    if (responseData.role) {
                        // Role-based redirects
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
                            // Add other roles as needed
                        }
                    }

                    // If we got here, login was successful (status 2xx or 3xx)
                    setSuccess('Login successful! Redirecting...');
                    setIsRedirecting(true);

                    // Determine redirect target with fallback
                    const redirectTarget = isValidCallbackUrl(callbackUrl)
                        ? callbackUrl
                        : DEFAULT_LOGIN_REDIRECT;

                    // Short delay to ensure cookies are set before navigation
                    setTimeout(() => {
                        // Force a full page refresh by using window.location instead of router.push
                        window.location.href = redirectTargetRole || redirectTarget || '/';

                        // No need for router.refresh() as we're doing a full page reload
                    }, 500);
                }
            } catch (err) {
                console.error('Login form submission error:', err);
                setError('An unexpected network error occurred. Please try again.');
            }
        });
    };

    return (
			<div className={`flex flex-col gap-6 ${className}`} {...props}>
				<Card>
					<CardHeader>
						<CardTitle className='text-2xl'>লগইন করুন</CardTitle>
						<CardDescription>
							আপনার অ্যাকাউন্টে লগইন করতে নিচে আপনার ফোন নম্বরটি লিখুন
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className='flex flex-col gap-6'>
								{/* Phone Number Input */}
								<div className='grid gap-2'>
									<Label htmlFor='phoneNumber'>ফোন নম্বর</Label>
									<Input
										id='phoneNumber'
										type='tel'
										autoComplete='tel'
										placeholder='01XXXXXXXXX'
										{...form.register('phoneNumber')}
										disabled={isPending || isRedirecting}
										required
									/>
									{form.formState.errors.phoneNumber && (
										<p className='text-sm text-red-500'>
											{form.formState.errors.phoneNumber.message}
										</p>
									)}
								</div>
								{/* Password Input */}
								<div className='grid gap-2'>
									<div className='flex items-center'>
										<Label htmlFor='password'>পাসওয়ার্ড</Label>
										<a
											href='/auth/forget-password'
											className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
										>
											আপনার পাসওয়ার্ড ভুলে গেছেন?
										</a>
									</div>
									<Input
										id='password'
										type='password'
										placeholder='******'
										{...form.register('password')}
										disabled={isPending || isRedirecting}
										required
									/>
									{form.formState.errors.password && (
										<p className='text-sm text-red-500'>
											{form.formState.errors.password.message}
										</p>
									)}
								</div>

								<FormError message={error} />
								<FormSuccess message={success} />

								<Button
									type='submit'
									className='w-full'
									disabled={isPending || isRedirecting}
								>
									{isRedirecting
										? 'Redirecting...'
										: isPending
										? 'Logging in...'
										: 'Login'}
								</Button>
							</div>
							{/* Sign Up Link */}
							<div className='mt-4 text-center text-sm'>
								আপনার কি কোন অ্যাকাউন্ট নেই?
								<a
									href='/auth/register'
									className='underline underline-offset-4'
								>
									একাউন্ট খুলুন
								</a>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		);
}

// Main component with Suspense boundary
export default function LoginForm(props: React.ComponentPropsWithoutRef<'div'>) {
    return (
			<Suspense
				fallback={
					<div className='flex flex-col gap-6'>
						<Card>
							<CardHeader>
								<CardTitle className='text-2xl'>লগইন করুন</CardTitle>
								<CardDescription>
									আপনার অ্যাকাউন্টে লগইন করতে নিচে আপনার ফোন নম্বরটি লিখুন
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='animate-pulse space-y-6'>
									<div className='h-10 bg-gray-200 rounded'></div>
									<div className='h-10 bg-gray-200 rounded'></div>
									<div className='h-10 bg-primary/30 rounded'></div>
								</div>
								<div className='mt-4 text-center text-sm text-gray-200'>
									Don&apos;t have an account?{' '}
									<span className='underline underline-offset-4'>Sign up</span>
								</div>
							</CardContent>
						</Card>
					</div>
				}
			>
				<LoginFormContent {...props} />
			</Suspense>
		);
}