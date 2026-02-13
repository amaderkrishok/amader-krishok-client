'use client';

import { useState, useEffect } from 'react';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ProductCategoryType } from '@/types/product-category';


interface CategoryFormProps {
	category: ProductCategoryType | null;
	categories: ProductCategoryType[];
	onSubmit: (category: ProductCategoryType) => void;
	onCancel: () => void;
}

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	parentId: z.string().nullable(),
});

export function CategoryForm({
	category,
	categories,
	onSubmit,
	onCancel,
}: CategoryFormProps) {
	const [availableParents, setAvailableParents] = useState<ProductCategoryType[]>([]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: category?.name || '',
			parentId: category?.parentId ? String(category.parentId) : null,
		},
	});

	// Filter out the current category and its children from available parents
	useEffect(() => {
		if (!categories) return;

		const filterOutChildrenOf = (categoryId: number): number[] => {
			const category = categories.find((c) => c.id === categoryId);
			if (!category) return [categoryId];

			const childIds = category.children?.map((c) => c.id) || [];
			const descendantIds = childIds.flatMap((id) => filterOutChildrenOf(id));

			return [categoryId, ...descendantIds];
		};

		let filtered = [...categories];

		// If editing, remove self and all descendants from parent options
		if (category?.id) {
			const excludeIds = filterOutChildrenOf(category.id);
			filtered = filtered.filter((c) => !excludeIds.includes(c.id));
		}

		setAvailableParents(filtered);
	}, [categories, category]);

	function onFormSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		
		onSubmit({
			id: category?.id,
			name: values.name,
			parentId: values.parentId ? Number.parseInt(values.parentId) : null,
			children: category?.children || [],
		});
	}

	// Flatten categories for select dropdown
	const flattenCategories = (
		categories: ProductCategoryType[],
		level = 0
	): { id: number; name: string; level: number }[] => {
		return categories.flatMap((category) => [
			{ id: category.id, name: category.name, level },
			...(category.children
				? flattenCategories(category.children, level + 1)
				: []),
		]);
	};

	const flatCategories = flattenCategories(availableParents);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onFormSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category Name</FormLabel>
							<FormControl>
								<Input placeholder='Enter category name' {...field} />
							</FormControl>
							<FormDescription>
								The name of the product category as it will appear to customers.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='parentId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Parent Category</FormLabel>
							<Select
								onValueChange={field.onChange}
								value={field.value || undefined}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a parent category (optional)' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='none'>None (Top Level)</SelectItem>
									{flatCategories.map((cat) => (
										<SelectItem key={cat.id} value={cat.id.toString()}>
											{Array(cat.level).fill('—').join('')}{' '}
											{cat.level > 0 ? ' ' : ''}
											{cat.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>
								Categories can be nested to create a hierarchy.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex justify-end space-x-2'>
					<Button variant='outline' type='button' onClick={onCancel}>
						Cancel
					</Button>
					<Button type='submit'>
						{category ? 'Update' : 'Create'} Category
					</Button>
				</div>
			</form>
		</Form>
	);
}
