'use client';

import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
			console.log(
				'About to make request to:',
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`
			);
			console.log(response.data);

			setSuccess('Registration successful! You can now log in.');

			form.reset();
			router.push('/auth/login');
		} catch (error: any) {
			console.error('Registration error:', error);

			// Extract error message from the API response
			const errorMessage =
				error.response?.data?.error ||
				error.response?.data?.details?.message ||
				'Registration failed. Please try again.';

			// Set the error message for the form
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

  return (
	<div className='flex flex-col gap-6'>
	  <Card>
		<CardHeader>
		  <CardTitle className='text-2xl'>রেজিস্ট্রেশন</CardTitle>
		  <CardDescription>
			একটি নতুন একাউন্ট তৈরি করতে নিচের তথ্যগুলো দিন।
		  </CardDescription>
		</CardHeader>
		<CardContent>
		  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
			<div>
			  <Label htmlFor='name'>পুরো নাম</Label>
			  <Input
				className='mt-2'
				id='name'
				placeholder='আপনার নাম লিখুন'
				disabled={isLoading}
				{...form.register('name')}
			  />
			  {form.formState.errors.name && (
				<p className='text-red-500 text-sm'>
				  {form.formState.errors.name?.message?.toString()}
				</p>
			  )}
			</div>

			{/* Only show email field for non-user roles */}
			{isAdvancedUser && (
			  <div>
				<Label htmlFor='email'>ইমেইল</Label>
				<Input
				  className='mt-2'
				  id='email'
				  placeholder='example@email.com'
				  type='email'
				  disabled={isLoading}
				  {...form.register('email')}
				/>
				{isAdvancedUser && (form.formState.errors as FieldErrors<ExtendedRegisterSchemaType>).email && (
				  <p className='text-red-500 text-sm'>
					{(form.formState.errors as FieldErrors<ExtendedRegisterSchemaType>).email?.message?.toString()}
				  </p>
				)}
			  </div>
			)}

			<div>
			  <Label htmlFor='phoneNumber'>ফোন নম্বর</Label>
			  <Input
				className='mt-2'
				id='phoneNumber'
				placeholder='01XXXXXXXXX'
				disabled={isLoading}
				{...form.register('phoneNumber')}
			  />
			  {form.formState.errors.phoneNumber && (
				<p className='text-red-500 text-sm'>
				  {form.formState.errors.phoneNumber?.message?.toString()}
				</p>
			  )}
			</div>

			{/* Only show image upload for non-user roles */}
			{isAdvancedUser && showImageUpload && (
			  <div>
				<Label htmlFor='image'>প্রোফাইল ছবি (ঐচ্ছিক)</Label>
				<div className='flex items-start gap-4'>
				  <Input
					className='mt-2'
					id='image'
					type='file'
					accept='image/*'
					disabled={isLoading}
					onChange={handleImageChange}
				  />
				  {imagePreview && (
					<div className='h-16 w-16 overflow-hidden rounded-full border'>
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

			<div>
			  <Label htmlFor='password'>পাসওয়ার্ড</Label>
			  <div className='relative'>
				<Input
				  className='mt-2'
				  id='password'
				  placeholder='*******'
				  type={showPassword ? 'text' : 'password'}
				  disabled={isLoading}
				  {...form.register('password')}
				/>
				<Button
				  type='button'
				  variant='ghost'
				  size='icon'
				  className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8'
				  onClick={() => setShowPassword((prev) => !prev)}
				  disabled={isLoading}
				>
				  {showPassword ? (
					<EyeOff className='h-4 w-4' />
				  ) : (
					<Eye className='h-4 w-4' />
				  )}
				</Button>
			  </div>
			  {form.formState.errors.password && (
				<p className='text-red-500 text-sm'>
				  {form.formState.errors.password?.message?.toString()}
				</p>
			  )}
			</div>

			<div>
			  <Label htmlFor='confirmPassword'>পাসওয়ার্ড নিশ্চিত করুন</Label>
			  <div className='relative'>
				<Input
				  className='mt-2'
				  id='confirmPassword'
				  placeholder='*******'
				  type={showConfirmPassword ? 'text' : 'password'}
				  disabled={isLoading}
				  {...form.register('confirmPassword')}
				/>
				<Button
				  type='button'
				  variant='ghost'
				  size='icon'
				  className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8'
				  onClick={() => setShowConfirmPassword((prev) => !prev)}
				  disabled={isLoading}
				>
				  {showConfirmPassword ? (
					<EyeOff className='h-4 w-4' />
				  ) : (
					<Eye className='h-4 w-4' />
				  )}
				</Button>
			  </div>
			  {form.formState.errors.confirmPassword && (
				<p className='text-red-500 text-sm'>
				  {form.formState.errors.confirmPassword?.message?.toString()}
				</p>
			  )}
			</div>

			<FormError message={error} />
			<FormSuccess message={success} />

			<Button type='submit' className='w-full' disabled={isLoading}>
			  {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
			  রেজিস্টার করুন
			</Button>

			<div className='mt-4 text-center text-sm'>
			  ইতিমধ্যে একাউন্ট আছে?{' '}
			  <a href='/auth/login' className='underline underline-offset-4'>
				লগইন করুন
			  </a>
			</div>
		  </form>
		</CardContent>
	  </Card>
	</div>
  )
}
