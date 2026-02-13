'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { UploadService } from '@/services/upload-service';
import type { PostCategoryType } from '@/types/post';
import { ImageUpload } from '../posts/image-upload';
import { generateSlug } from '@/lib/utils';

interface PostCategoryFormProps {
	category: PostCategoryType | null;
	onSubmit: (category: PostCategoryType) => void;
	onCancel: () => void;
}

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	slug: z.string().min(2, {
		message: 'Slug must be at least 2 characters.',
	}),
	description: z.string().optional(),
});

export function PostCategoryForm({
	category,
	onSubmit,
	onCancel,
}: PostCategoryFormProps) {
	const [featuredImage, setFeaturedImage] = useState<string | undefined>(
		category?.featuredImage
	);
	const [isSlugEdited, setIsSlugEdited] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: category?.name || '',
			slug: category?.slug || '',
			description: category?.description || '',
		},
	});

	// Auto-generate slug from name if slug hasn't been manually edited
	useEffect(() => {
		const name = form.watch('name');
		if (name && !isSlugEdited) {
			const generatedSlug = generateSlug(name);
			form.setValue('slug', generatedSlug);
		}
	}, [form.watch('name'), isSlugEdited, form]);

	const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsSlugEdited(true);
		form.setValue('slug', e.target.value);
	};

	const handleImageUpload = async (file: File) => {
		try {
			const result = await UploadService.uploadSingleFile(file, 'categories');
			setFeaturedImage(result.url);
			toast.success('Image uploaded successfully');
		} catch (error) {
			toast.error('Failed to upload image');
		}
	};

	const handleImageRemove = () => {
		setFeaturedImage(undefined);
	};

	async function onFormSubmit(values: z.infer<typeof formSchema>) {
		const categoryData: PostCategoryType = {
			id: category?.id,
			name: values.name,
			slug: values.slug,
			description: values.description,
			featuredImage: featuredImage,
			postsCount: category?.postsCount || 0,
		};

		onSubmit(categoryData);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onFormSubmit)} className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder='Enter category name' {...field} />
								</FormControl>
								<FormDescription>The name of your category.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='slug'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Slug</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter category slug'
										value={field.value}
										onChange={handleSlugChange}
										onBlur={field.onBlur}
										name={field.name}
									/>
								</FormControl>
								<FormDescription>
									The URL-friendly version of the name.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea placeholder='Enter category description' {...field} />
							</FormControl>
							<FormDescription>
								A brief description of what this category is about.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Card>
					<CardContent className='p-6'>
						<FormLabel>Featured Image</FormLabel>
						<ImageUpload
							value={featuredImage}
							onChange={handleImageUpload}
							onRemove={handleImageRemove}
							disabled={false}
						/>
						<FormDescription className='mt-2'>
							Upload a featured image for your category. Recommended size:
							1200x630px.
						</FormDescription>
					</CardContent>
				</Card>

				<div className='flex justify-end space-x-2'>
					<Button variant='outline' type='button' onClick={onCancel}>
						Cancel
					</Button>
					<Button type='submit'>
						{category ? 'Update' : 'Create'} Category
					</Button>
				</div>
			</form>
		</Form>
	);
}
