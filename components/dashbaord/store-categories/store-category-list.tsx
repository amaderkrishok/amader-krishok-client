'use client';

import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { StoreCategoryItem } from './store-category-item';
import { useStoreCategories } from './store-category-context';

export const StoreCategoryList: React.FC = () => {
	const { categories, loading, fetchCategories, openCreateDialog } =
		useStoreCategories();

	// Fetch categories on mount
	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	if (categories.length === 0) {
		return (
			<Card>
				<CardContent className='flex flex-col items-center justify-center h-64'>
					<p className='text-muted-foreground mb-4'>
						No store categories found
					</p>
					<Button onClick={openCreateDialog}>
						<Plus className='mr-2 h-4 w-4' />
						Create Your First Category
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{categories.map((category) => (
				<StoreCategoryItem key={category.id} category={category} />
			))}
		</div>
	);
};
