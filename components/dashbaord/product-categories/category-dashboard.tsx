'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

import { ProductCategoryType } from '@/types/product-category';
import { ProductCategoryService } from '@/services/product-category-service';
import { CategoryTree } from './category-tree';
import { CategoryForm } from './category-form';

export function ProductCategoryDashboard() {
	const [categories, setCategories] = useState<ProductCategoryType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] =
		useState<ProductCategoryType | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('tree');

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		try {
			setIsLoading(true);
			const response = await ProductCategoryService.getProductAllCategories();
			setCategories(response.data);
		} catch {
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

	const handleEditCategory = (category: ProductCategoryType) => {
		setSelectedCategory(category);
		setIsFormOpen(true);
		setActiveTab('form');
	};

	const handleDeleteCategory = async (id: number) => {
		try {
			await ProductCategoryService.deleteProductCategory(id);
			toast.warning('Category deleted successfully');
			fetchCategories();
		} catch {
			toast.error('Failed to delete category');
		}
	};

	const handleFormSubmit = async (category: ProductCategoryType) => {
		try {
			if (category.id) {
				await ProductCategoryService.updateProductCategory(
					category.id,
					category
				);
				toast.success('Category updated successfully');
			} else {
				await ProductCategoryService.createProductCategory(category);
				toast.success('Category created successfully');
			}
			setIsFormOpen(false);
			setActiveTab('tree');
			fetchCategories();
		} catch {
			toast.error('Failed to save category');
		}
	};

	const handleFormCancel = () => {
		setIsFormOpen(false);
		setActiveTab('tree');
	};

	const handleMoveCategory = async (
		categoryId: number,
		newParentId: number | null
	) => {
		try {
			console.log(`Moving category ${categoryId} to parent ${newParentId}`);

			// Create a clean update payload with only the parentId
			const updatePayload: Partial<ProductCategoryType> = {
				parentId: newParentId,
			};

			await ProductCategoryService.updateProductCategory(
				categoryId,
				updatePayload
			);

			toast.success('Category moved successfully');
			fetchCategories();
		} catch (error) {
			console.error('Move error:', error);
			toast.error('Failed to move category');
		}
	};

	return (
		<Card className='w-full'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<div>
					<CardTitle className='text-2xl font-bold tracking-tight'>
						Product Categories
					</CardTitle>
					<CardDescription>
						Manage your product categories hierarchy
					</CardDescription>
				</div>
				<Button onClick={handleAddCategory}>
					<Plus className='mr-2 h-4 w-4' />
					Add Category
				</Button>
			</CardHeader>
			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className='mb-4'>
						<TabsTrigger value='tree'>Category Tree</TabsTrigger>
						<TabsTrigger value='form' disabled={!isFormOpen}>
							{selectedCategory ? 'Edit Category' : 'New Category'}
						</TabsTrigger>
					</TabsList>
					<TabsContent value='tree'>
						<CategoryTree
							categories={categories}
							isLoading={isLoading}
							onEdit={handleEditCategory}
							onDelete={handleDeleteCategory}
							onMove={handleMoveCategory}
						/>
					</TabsContent>
					<TabsContent value='form'>
						{isFormOpen && (
							<CategoryForm
								category={selectedCategory}
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
