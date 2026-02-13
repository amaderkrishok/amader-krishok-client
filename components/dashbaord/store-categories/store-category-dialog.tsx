'use client';

import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { StoreCategoryForm } from './store-category-form';
import { useStoreCategories } from './store-category-context';

export const StoreCategoryDialog: React.FC = () => {
	const { dialogOpen, closeDialog, currentCategory, isCreating } =
		useStoreCategories();

	return (
		<Dialog
			open={dialogOpen}
			onOpenChange={(open) => {
				if (!open) closeDialog();
			}}
		>
			<DialogContent className='sm:max-w-[500px]'>
				<DialogHeader>
					<DialogTitle>
						{isCreating ? 'Create New Category' : 'Edit Category'}
					</DialogTitle>
					<DialogDescription>
						{isCreating
							? 'Add a new store category to your platform.'
							: 'Make changes to the existing store category.'}
					</DialogDescription>
				</DialogHeader>

				<StoreCategoryForm
					initialData={currentCategory}
					isCreating={isCreating}
					onCancel={closeDialog}
				/>
			</DialogContent>
		</Dialog>
	);
};
