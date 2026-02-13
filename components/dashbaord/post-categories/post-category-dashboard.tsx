'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

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
import { PostCategoryService } from '@/services/post-category-service';
import type { PostCategoryType, PaginationMeta } from '@/types/post';
import { PostCategoryList } from './post-category-list';
import { PostCategoryForm } from './post-category-form';
import { getAxiosErrorMessage } from '@/lib/utils';

export function PostCategoryDashboard() {
	const [categories, setCategories] = useState<PostCategoryType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] =
		useState<PostCategoryType | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('list');
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const [meta, setMeta] = useState<PaginationMeta>({
		totalItems: 0,
		itemsPerPage: 10,
		totalPages: 1,
		currentPage: 1,
	});

	// Debounce search term
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Fetch categories when search term changes
	useEffect(() => {
		fetchCategories(1);
	}, [debouncedSearchTerm]);

	const fetchCategories = async (page = 1) => {
		try {
			setIsLoading(true);
			const response = await PostCategoryService.getAllCategories({
				page,
				limit: 10,
				search: debouncedSearchTerm,
			});

            console.log('Fetched categories:', response.data);

			setCategories(response.data);
			setMeta(response.meta);
		} catch (error) {
			toast.error('Failed to load categories');
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddCategory = () => {
		setSelectedCategory(null);
		setIsFormOpen(true);
		setActiveTab('form');
	};

	const handleEditCategory = (category: PostCategoryType) => {
		setSelectedCategory(category);
		setIsFormOpen(true);
		setActiveTab('form');
	};

	const handleDeleteCategory = async (id: number) => {
		try {
			await PostCategoryService.deleteCategory(id);
			toast.success('Category deleted successfully');
			fetchCategories(meta.currentPage);
		} catch (error) {
			toast.error(getAxiosErrorMessage(error));
		}
	};

	const handleFormSubmit = async (category: PostCategoryType) => {
		try {
			if (category.id) {
				await PostCategoryService.updateCategory(category.id, {
					name: category.name,
					slug: category.slug,
					description: category.description,
					featuredImage: category.featuredImage,
				});
				toast.success('Category updated successfully');
			} else {
				await PostCategoryService.createCategory({
					name: category.name,
					slug: category.slug,
					description: category.description,
					featuredImage: category.featuredImage,
				});
				toast.success('Category created successfully');
			}
			setIsFormOpen(false);
			setActiveTab('list');
			fetchCategories(meta.currentPage);
		} catch (error) {
			toast.error('Failed to save category');
		}
	};

	const handleFormCancel = () => {
		setIsFormOpen(false);
		setActiveTab('list');
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handlePageChange = (page: number) => {
		fetchCategories(page);
	};

	return (
		<Card className='w-full'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<div>
					<CardTitle className='text-2xl font-bold tracking-tight'>
						Post Categories
					</CardTitle>
					<CardDescription>Manage your blog post categories</CardDescription>
				</div>
				<Button onClick={handleAddCategory}>
					<Plus className='mr-2 h-4 w-4' />
					Add Category
				</Button>
			</CardHeader>
			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className='mb-4'>
						<TabsTrigger value='list'>Categories List</TabsTrigger>
						<TabsTrigger value='form' disabled={!isFormOpen}>
							{selectedCategory ? 'Edit Category' : 'New Category'}
						</TabsTrigger>
					</TabsList>
					<TabsContent value='list'>
						<div className='flex items-center justify-between mb-4'>
							<div className='flex items-center gap-2'>
								<h2 className='text-lg font-medium'>All categories</h2>
								<Badge variant='secondary'>{meta.totalItems}</Badge>
							</div>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search categories...'
									className='pl-9 w-[300px]'
									value={searchTerm}
									onChange={handleSearch}
								/>
							</div>
						</div>
						<PostCategoryList
							categories={categories}
							isLoading={isLoading}
							meta={meta}
							onEdit={handleEditCategory}
							onDelete={handleDeleteCategory}
							onPageChange={handlePageChange}
						/>
					</TabsContent>
					<TabsContent value='form'>
						{isFormOpen && (
							<PostCategoryForm
								category={selectedCategory}
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
