'use client';

import React, { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import {
	StoreCategoryProvider,
	useStoreCategories,
} from './store-category-context';
import { StoreCategoryList } from './store-category-list';
import { StoreCategoryDialog } from './store-category-dialog';

// Header component for the store categories page
const StoreCategoriesHeader: React.FC = () => {
	const { openCreateDialog } = useStoreCategories();

	return (
		<div className='flex justify-between items-center mb-6'>
			<h1 className='text-3xl font-bold'>Store Categories</h1>
			<Button onClick={openCreateDialog}>
				<Plus className='mr-2 h-4 w-4' />
				Add New Category
			</Button>
		</div>
	);
};

// Main component content
const StoreCategoriesContent: React.FC = () => {
	return (
		<>
			<StoreCategoriesHeader />
			<StoreCategoryList />
			<StoreCategoryDialog />
		</>
	);
};

// Main export with context provider
export default function StoreCategoriesManager() {
	return (
		<Suspense
			fallback={
				<div className='flex justify-center items-center h-64'>
					<Loader2 className='h-8 w-8 animate-spin' />
				</div>
			}
		>
			<StoreCategoryProvider>
				<div className='container mx-auto p-6'>
					<StoreCategoriesContent />
				</div>
			</StoreCategoryProvider>
		</Suspense>
	);
}
