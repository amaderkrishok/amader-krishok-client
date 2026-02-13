'use client';

import React from 'react';
import { StoreCategory } from '@/types/store-category';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { useStoreCategories } from './store-category-context';
import { toast } from 'sonner';

interface StoreCategoryItemProps {
	category: StoreCategory;
}

export const StoreCategoryItem: React.FC<StoreCategoryItemProps> = ({
	category,
}) => {
	const { openEditDialog, deleteCategory, deleteInProgress } =
		useStoreCategories();

	const handleDelete = () => {
		toast.warning('Are you sure?', {
			description: 'This action cannot be undone.',
			action: {
				label: 'Delete',
				onClick: () => deleteCategory(category.id),
			},
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{category.name}</CardTitle>
				<CardDescription>Slug: {category.slug}</CardDescription>
			</CardHeader>
			<CardContent className='flex justify-end space-x-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => openEditDialog(category)}
				>
					<Pencil className='h-4 w-4 mr-2' />
					Edit
				</Button>
				<Button
					variant='destructive'
					size='sm'
					onClick={handleDelete}
					disabled={deleteInProgress === category.id}
				>
					{deleteInProgress === category.id ? (
						<Loader2 className='h-4 w-4 mr-2 animate-spin' />
					) : (
						<Trash2 className='h-4 w-4 mr-2' />
					)}
					Delete
				</Button>
			</CardContent>
		</Card>
	);
};
