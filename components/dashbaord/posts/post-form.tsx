'use client';

import { useEffect, useState } from 'react';
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
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { UploadService } from '@/services/upload-service';
import { PostType, PostCategory } from '@/types/post';
import { ImageUpload } from './image-upload';
import { generateSlug, extractTableOfContents } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

// Import Plate editor components
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plate, TPlateEditor } from '@udecode/plate-common/react';
import { useCreateEditor } from '@/components/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { debounce } from 'lodash';

// Define the form schema using Zod
const formSchema = z.object({
	title: z.string().min(2, {
		message: 'Title must be at least 2 characters.',
	}),
	slug: z.string().min(2, {
		message: 'Slug must be at least 2 characters.',
	}),
	content: z.any(), // This will store the rich text editor content
	excerpt: z.string().optional(),
	categoryIds: z.array(z.number()).min(1, {
		message: 'Please select at least one category.',
	}),
	published: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface PostFormProps {
	post: PostType | null;
	categories: PostCategory[];
	onSubmit: (post: any) => void;
	onCancel: () => void;
	currentUserId?: string;
}

export function PostForm({
	post,
	categories,
	onSubmit,
	onCancel,
	currentUserId,
}: PostFormProps) {
	const [featuredImage, setFeaturedImage] = useState<string | undefined>(
		post?.featuredImage
	);
	const [isSlugEdited, setIsSlugEdited] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<number[]>(
		post?.categories?.map((cat) => cat.id) || []
	);
	const [submitting, setSubmitting] = useState(false);
	const { theme } = useTheme();

	// Create editor instance for Plate
	const contentEditor = useCreateEditor({
		initialValue: getInitialEditorContent(),
	});

	// Initialize form with existing post data or defaults
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: post?.title || '',
			slug: post?.slug || '',
			content: getInitialEditorContent(),
			excerpt: post?.excerpt || '',
			categoryIds: post?.categories?.map((cat) => cat.id) || [],
			published: post?.published ?? false,
		},
	});

	// Auto-generate slug from title if slug hasn't been manually edited
	useEffect(() => {
		const title = form.watch('title');
		if (title && !isSlugEdited) {
			const generatedSlug = generateSlug(title);
			form.setValue('slug', generatedSlug);
		}
	}, [form.watch('title'), isSlugEdited, form]);

	// Get the initial editor content based on post data
	function getInitialEditorContent() {
		if (!post?.description) return [];

		// If description already contains value array
		if (post.description.value && Array.isArray(post.description.value)) {
			return post.description.value;
		}

		// Legacy handling
		try {
			if (typeof post.description === 'string') {
				const parsed = JSON.parse(post.description);
				return parsed.value || parsed || [];
			}
			return post.description || [];
		} catch (e) {
			console.log('Error parsing description', e);
			return [];
		}
	}

	const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsSlugEdited(true);
		form.setValue('slug', e.target.value);
	};

	const handleImageUpload = async (file: File) => {
		try {
			const result = await UploadService.uploadSingleFile(file, 'posts');
			setFeaturedImage(result.url);
			toast.success('Image uploaded successfully');
		} catch (error) {
			console.error('Upload error:', error);
			toast.error('Failed to upload image');
		}
	};

	const handleImageRemove = () => {
		setFeaturedImage(undefined);
	};

	const handleCategoryChange = (categoryId: number) => {
		// Update the selectedCategories state
		const updatedCategories = selectedCategories.includes(categoryId)
			? selectedCategories.filter((id) => id !== categoryId)
			: [...selectedCategories, categoryId];

		setSelectedCategories(updatedCategories);

		// Update the form value
		form.setValue('categoryIds', updatedCategories);
	};

	// Handle editor content changes with debounce
	const handleContentChange = debounce(
		(options: { editor: TPlateEditor; value: any }) => {
			const editorValue = options.value;
			form.setValue('content', editorValue);
		},
		300
	);

	const onFormSubmit = async (values: FormValues) => {
		setSubmitting(true);
		try {
			// Extract table of contents from the content
			const tableOfContent = extractTableOfContents(values.content);

			// Prepare post data for submission
			const postData = {
				id: post?.id,
				title: values.title,
				slug: values.slug,
				// Direct assignment of editor content to description.value
				description: {
					value: values.content,
				},
				tableOfContent,
				published: values.published,
				featuredImage,
				excerpt: values.excerpt,
				categoryIds: values.categoryIds,
				updatedById: currentUserId,
			};

			// Pass the data to the parent component
			await onSubmit(postData);
		} catch (error) {
			console.error('Form submission error:', error);
			toast.error(`Failed to ${post ? 'update' : 'create'} post`);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onFormSubmit)} className='space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>{post ? 'Edit' : 'Create'} Post</CardTitle>
							<CardDescription>
								{post ? 'Update your existing post' : 'Create a new blog post'}
							</CardDescription>
						</CardHeader>

						<CardContent className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<FormField
									control={form.control}
									name='title'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl>
												<Input placeholder='Enter post title' {...field} />
											</FormControl>
											<FormDescription>
												The title of your blog post.
											</FormDescription>
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
													placeholder='Enter post slug'
													value={field.value}
													onChange={handleSlugChange}
													onBlur={field.onBlur}
													name={field.name}
												/>
											</FormControl>
											<FormDescription>
												The URL-friendly version of the title.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name='excerpt'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Excerpt</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Enter a short excerpt'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											A short summary of your post (optional).
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='content'
								render={() => (
									<FormItem>
										<FormLabel>Content</FormLabel>
										<FormControl>
											<div
												data-registry='plate'
												className={`min-h-[400px] border rounded-md ${
													theme === 'dark' ? 'dark' : ''
												}`}
											>
												<Plate
													editor={contentEditor}
													onChange={handleContentChange}
												>
													<EditorContainer>
														<Editor variant='fullWidth' />
													</EditorContainer>
												</Plate>
											</div>
										</FormControl>
										<FormDescription>
											The main content of your post.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='categoryIds'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Categories</FormLabel>
										<div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
											{categories.map((category) => (
												<div
													key={category.id}
													className='flex items-center space-x-2'
												>
													<input
														type='checkbox'
														id={`category-${category.id}`}
														checked={selectedCategories.includes(category.id)}
														onChange={() => handleCategoryChange(category.id)}
														className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
													/>
													<label
														htmlFor={`category-${category.id}`}
														className='text-sm'
													>
														{category.name}
													</label>
												</div>
											))}
										</div>
										<FormDescription>
											Select one or more categories for your post.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='published'
								render={({ field }) => (
									<FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
										<div className='space-y-0.5'>
											<FormLabel className='text-base'>
												Published Status
											</FormLabel>
											<FormDescription>
												Set to published if you want the post to be visible to
												readers immediately.
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

							<Card>
								<CardContent className='p-6'>
									<FormLabel>Featured Image</FormLabel>
									<ImageUpload
										value={featuredImage}
										onChange={handleImageUpload}
										onRemove={handleImageRemove}
										disabled={submitting}
									/>
									<FormDescription className='mt-2'>
										Upload a featured image for your post. Recommended size:
										1200x630px.
									</FormDescription>
								</CardContent>
							</Card>
						</CardContent>

						<CardFooter className='flex justify-between'>
							<Button
								variant='outline'
								type='button'
								onClick={onCancel}
								disabled={submitting}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={submitting}>
								{submitting ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										{post ? 'Updating...' : 'Creating...'}
									</>
								) : post ? (
									'Update Post'
								) : (
									'Create Post'
								)}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</DndProvider>
	);
}
