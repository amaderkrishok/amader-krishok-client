'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/components/providers/session-provider';
import { PostList } from './post-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PostService } from '@/services/post-service';
import { PostCategoryService } from '@/services/post-category-service';
import type { PostType, PostCategory, PaginatedMeta } from '@/types/post';
import { PostForm } from './post-form';
import { getAxiosErrorMessage } from '@/lib/utils';

interface PostFilters {
	categoryId?: number;
	published?: boolean;
}

export function PostDashboard() {
	const { data: session } = useSession();
	const [posts, setPosts] = useState<PostType[]>([]);
	const [categories, setCategories] = useState<PostCategory[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('list');
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const [filters, setFilters] = useState<PostFilters>({
		categoryId: undefined,
		published: undefined,
	});
	const [meta, setMeta] = useState<PaginatedMeta>({
		totalItems: 0,
		itemsPerPage: 10,
		totalPages: 1,
		currentPage: 1,
	});
	const [viewMode, setViewMode] = useState<'all' | 'my-posts'>('all');

	// Debounce search term
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Fetch posts when filters or search term changes
	useEffect(() => {
		fetchPosts(1);
	}, [filters, debouncedSearchTerm, viewMode]);

	// Fetch categories on mount
	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchPosts = async (page = 1) => {
		try {
			setIsLoading(true);
			const params: any = {
				page,
				limit: 10,
				search: debouncedSearchTerm,
				categoryId: filters.categoryId,
				published: filters.published,
			};

			// If in "my-posts" view mode, filter by the current user's ID
			if (viewMode === 'my-posts' && session?.user?.id) {
				params.updatedById = session.user.id;
			}

			// Now we can use the regular getPosts endpoint with the appropriate filter
			const response = await PostService.getPosts(params);
			setPosts(response.data);
			setMeta(response.meta);
		} catch (error) {
			toast.error('Failed to load posts');
		} finally {
			setIsLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await PostCategoryService.getAllCategories();
			setCategories(response.data);
		} catch (error) {
			toast.error(getAxiosErrorMessage(error));
		}
	};

	const handleUpdatePostStatus = async (id: number, published: boolean) => {
		try {
			await PostService.updatePostStatus(id, published);
			toast.success(
				`Post ${published ? 'published' : 'unpublished'} successfully`
			);
			fetchPosts(meta.currentPage);
		} catch (error) {
			toast.error(getAxiosErrorMessage(error));
		}
	};

	const handleAddPost = () => {
		setSelectedPost(null);
		setIsFormOpen(true);
		setActiveTab('form');
	};

	const handleEditPost = (post: PostType) => {
		setSelectedPost(post);
		setIsFormOpen(true);
		setActiveTab('form');
	};

	const handleDeletePost = async (id: number) => {
		try {
			await PostService.deletePost(id);
			toast.success('Post deleted successfully');
			fetchPosts(meta.currentPage);
		} catch (error) {
			toast.error(getAxiosErrorMessage(error));
		}
	};

	const handleFormSubmit = async (formData: any) => {
		try {
			// No need to parse the content - it comes directly from the editor
			// in the correct format already
			if (selectedPost) {
				// Update existing post
				const updateData = {
					title: formData.title,
					slug: formData.slug,
					// Direct assignment of description with value property
					description: formData.description,
					excerpt: formData.excerpt,
					featuredImage: formData.featuredImage,
					tableOfContent: formData.tableOfContent || [],
					categoryIds: formData.categoryIds,
					published: formData.published,
				};

				await PostService.updatePost(selectedPost.id, updateData);
				toast.success('Post updated successfully');
			} else {
				// Create new post
				const createData = {
					title: formData.title,
					slug: formData.slug,
					// Direct assignment of description with value property
					description: formData.description,
					excerpt: formData.excerpt,
					featuredImage: formData.featuredImage,
					tableOfContent: formData.tableOfContent || [],
					categoryIds: formData.categoryIds,
					published: formData.published || false,
				};

				await PostService.createPost(createData);
				toast.success('Post created successfully');
			}

			setIsFormOpen(false);
			setActiveTab('list');
			fetchPosts(meta.currentPage);
		} catch (error) {
			console.error('Error submitting post:', error);
			toast.error('Failed to save post');
		}
	};

	const handleFormCancel = () => {
		setIsFormOpen(false);
		setActiveTab('list');
	};

	const handleFilterChange = (key: keyof PostFilters, value: any) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handlePageChange = (page: number) => {
		fetchPosts(page);
	};

	const handleViewModeChange = (mode: 'all' | 'my-posts') => {
		setViewMode(mode);
	};

	const handleFilter = (filters: {
		categoryId?: number;
		published?: boolean | null;
	}) => {
		setFilters({
			categoryId: filters.categoryId,
			published: filters.published === null ? undefined : filters.published,
		});
	};

	const handleSearchSubmit = (query: string) => {
		setSearchTerm(query);
	};

	return (
		<Card className='w-full'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<div>
					<CardTitle className='text-2xl font-bold tracking-tight'>
						Post Management
					</CardTitle>
					<CardDescription>Create and manage your blog posts</CardDescription>
				</div>
				<Button onClick={handleAddPost}>
					<Plus className='mr-2 h-4 w-4' />
					Add Post
				</Button>
			</CardHeader>

			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
						<TabsList>
							<TabsTrigger value='list'>Posts List</TabsTrigger>
							<TabsTrigger value='form' disabled={!isFormOpen}>
								{selectedPost ? 'Edit Post' : 'New Post'}
							</TabsTrigger>
						</TabsList>

						{activeTab === 'list' && (
							<div className='flex gap-2 mt-4 sm:mt-0'>
								<div className='flex items-center gap-2'>
									<Button
										variant={viewMode === 'all' ? 'default' : 'outline'}
										size='sm'
										onClick={() => handleViewModeChange('all')}
									>
										All Posts
									</Button>
									<Button
										variant={viewMode === 'my-posts' ? 'default' : 'outline'}
										size='sm'
										onClick={() => handleViewModeChange('my-posts')}
									>
										My Posts
									</Button>
								</div>
							</div>
						)}
					</div>

					<TabsContent value='list' className='space-y-4'>
						<div className='flex items-center gap-2'>
							<div className='relative flex-1'>
								<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='পোস্ট অনুসন্ধান করুন...'
									className='pl-8'
									value={searchTerm}
									onChange={handleSearch}
								/>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='outline' size='sm'>
										<Filter className='mr-2 h-4 w-4' />
										Filter
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end' className='w-56'>
									<DropdownMenuCheckboxItem
										checked={filters.published === true}
										onCheckedChange={() =>
											handleFilterChange(
												'published',
												filters.published === true ? undefined : true
											)
										}
									>
										Published
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={filters.published === false}
										onCheckedChange={() =>
											handleFilterChange(
												'published',
												filters.published === false ? undefined : false
											)
										}
									>
										Draft
									</DropdownMenuCheckboxItem>
									<DropdownMenuSeparator />
									{categories.map((category) => (
										<DropdownMenuCheckboxItem
											key={category.id}
											checked={filters.categoryId === category.id}
											onCheckedChange={() =>
												handleFilterChange(
													'categoryId',
													filters.categoryId === category.id
														? undefined
														: category.id
												)
											}
										>
											{category.name}
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Display active filters */}
						{(filters.categoryId !== undefined ||
							filters.published !== undefined ||
							searchTerm) && (
							<div className='flex flex-wrap gap-2 mt-2'>
								{filters.categoryId !== undefined && (
									<Badge
										variant='secondary'
										className='flex items-center gap-1'
									>
										{categories.find((c) => c.id === filters.categoryId)
											?.name || 'Category'}
										<button
											className='ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1'
											onClick={() =>
												handleFilterChange('categoryId', undefined)
											}
										>
											×
										</button>
									</Badge>
								)}
								{filters.published !== undefined && (
									<Badge
										variant='secondary'
										className='flex items-center gap-1'
									>
										{filters.published ? 'Published' : 'Draft'}
										<button
											className='ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1'
											onClick={() => handleFilterChange('published', undefined)}
										>
											×
										</button>
									</Badge>
								)}
								{searchTerm && (
									<Badge
										variant='secondary'
										className='flex items-center gap-1'
									>
										Search: {searchTerm}
										<button
											className='ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1'
											onClick={() => setSearchTerm('')}
										>
											×
										</button>
									</Badge>
								)}
								<Button
									variant='ghost'
									size='sm'
									className='h-7 text-xs'
									onClick={() => {
										setFilters({ categoryId: undefined, published: undefined });
										setSearchTerm('');
									}}
								>
									Clear all
								</Button>
							</div>
						)}

						<PostList
							posts={posts}
							categories={categories}
							isLoading={isLoading}
							meta={meta}
							onEdit={handleEditPost}
							onDelete={handleDeletePost}
							onUpdateStatus={handleUpdatePostStatus}
							onPageChange={handlePageChange}
							onSearch={handleSearchSubmit}
							onFilter={handleFilter}
							currentUserId={session?.user?.id}
							userRole={session?.user?.role}
						/>
					</TabsContent>

					<TabsContent value='form'>
						{isFormOpen && (
							<PostForm
								post={selectedPost}
								categories={categories}
								onSubmit={handleFormSubmit}
								onCancel={handleFormCancel}
							/>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
