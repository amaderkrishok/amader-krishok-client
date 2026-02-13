'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
	StoreCategory,
	CreateStoreCategoryDto,
	UpdateStoreCategoryDto,
} from '@/types/store-category';
import { useStoreCategories } from './store-category-context';
import { StoreCategoryService } from '@/services/store-category-service';

interface StoreCategoryFormProps {
	initialData?: StoreCategory | null;
	isCreating: boolean;
	onCancel: () => void;
}

export const StoreCategoryForm: React.FC<StoreCategoryFormProps> = ({
	initialData,
	isCreating,
	onCancel,
}) => {
	const { createCategory, updateCategory } = useStoreCategories();

	// Form state
	const [formData, setFormData] = useState<
		CreateStoreCategoryDto | UpdateStoreCategoryDto
	>({
		name: '',
		slug: '',
	});

	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Initialize form data from props
	useEffect(() => {
		if (initialData) {
			setFormData({
				name: initialData.name,
				slug: initialData.slug,
			});
		} else {
			setFormData({
				name: '',
				slug: '',
			});
		}
	}, [initialData]);

	// Handle input change
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === 'name') {
			setFormData((prev) => ({
				...prev,
				name: value,
				slug: StoreCategoryService.generateSlug(value),
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}

		// Clear error when field is edited
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	// Validate form
	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name) {
			newErrors.name = 'Category name is required';
		}

		if (!formData.slug) {
			newErrors.slug = 'Slug is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setSubmitting(true);

		try {
			if (isCreating) {
				await createCategory(formData as CreateStoreCategoryDto);
			} else if (initialData) {
				await updateCategory(initialData.id, formData);
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<div className='space-y-2'>
				<Label htmlFor='name'>Category Name</Label>
				<Input
					id='name'
					name='name'
					value={formData.name || ''}
					onChange={handleInputChange}
					placeholder='Enter category name'
					disabled={submitting}
					required
				/>
				{errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
			</div>

			<div className='space-y-2'>
				<Label htmlFor='slug'>Slug</Label>
				<Input
					id='slug'
					name='slug'
					value={formData.slug || ''}
					onChange={handleInputChange}
					placeholder='url-friendly-slug'
					disabled={submitting}
					required
				/>
				<p className='text-xs text-muted-foreground'>
					URL-friendly identifier. Auto-generated from name but can be edited.
				</p>
				{errors.slug && <p className='text-sm text-red-500'>{errors.slug}</p>}
			</div>

			<div className='flex justify-end space-x-2 pt-4'>
				<Button
					type='button'
					variant='outline'
					onClick={onCancel}
					disabled={submitting}
				>
					Cancel
				</Button>
				<Button type='submit' disabled={submitting}>
					{submitting ? 'Saving...' : isCreating ? 'Create' : 'Update'}
				</Button>
			</div>
		</form>
	);
};
