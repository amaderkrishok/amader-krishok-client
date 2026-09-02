'use client';

import { useState, useEffect } from 'react';
import { Plus, FolderTree, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
		<div className='space-y-6 w-full mx-auto pb-6'>
			{/* HERO HEADER */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#FFF9E8] via-white to-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
				<div className='space-y-1.5 z-10'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 rounded-xl bg-[#26351B] flex items-center justify-center text-[#F5B800] shadow-2xs'>
							<FolderTree className='w-4 h-4 text-[#F5B800]' />
						</div>
						<h1 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
							পণ্য ক্যাটাগরি (Product Categories)
						</h1>
					</div>
					<p className='text-xs sm:text-sm text-[#64748B] font-medium'>
						পণ্যের বিভাগ, সাব-ক্যাটাগরি ও হায়ারার্কি ম্যানেজমেন্ট
					</p>
				</div>

				<Button
					onClick={handleAddCategory}
					className='bg-[#F5B800] hover:bg-[#E0A800] text-[#172033] font-extrabold rounded-xl h-10 px-5 text-xs shadow-xs border-0 transition-all hover:-translate-y-0.5 z-10'
				>
					<Plus className='mr-2 h-4 w-4 text-[#172033]' />
					নতুন ক্যাটাগরি যোগ করুন
				</Button>
			</div>

			{/* MAIN CARD CONTAINER */}
			<Card className='p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6'>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className='mb-6 bg-[#FAFAF6] p-1.5 rounded-2xl border border-[#E5E7EB] w-full sm:w-auto inline-flex'>
						<TabsTrigger
							value='tree'
							className='rounded-xl text-xs font-extrabold py-2 px-4 transition-all data-[state=active]:bg-white data-[state=active]:text-[#172033] data-[state=active]:shadow-xs'
						>
							<Layers className='w-3.5 h-3.5 mr-2 text-[#26351B]' />
							ক্যাটাগরি ট্রি (Category Tree)
						</TabsTrigger>
						<TabsTrigger
							value='form'
							disabled={!isFormOpen}
							className='rounded-xl text-xs font-extrabold py-2 px-4 transition-all data-[state=active]:bg-white data-[state=active]:text-[#172033] data-[state=active]:shadow-xs'
						>
							{selectedCategory ? '✏️ সম্পাদনা করুন' : '➕ নতুন ক্যাটাগরি'}
						</TabsTrigger>
					</TabsList>

					<TabsContent value='tree' className='focus-visible:outline-none'>
						<CategoryTree
							categories={categories}
							isLoading={isLoading}
							onEdit={handleEditCategory}
							onDelete={handleDeleteCategory}
							onMove={handleMoveCategory}
						/>
					</TabsContent>

					<TabsContent value='form' className='focus-visible:outline-none'>
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
			</Card>
		</div>
	);
}
