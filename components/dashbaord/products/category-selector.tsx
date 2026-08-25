'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCategoryService } from '@/services/product-category-service';

interface Category {
	id: number;
	name: string;
	children?: Category[];
	description?: string;
}

interface FlattenedCategory {
	id: number;
	name: string;
	description?: string;
	path: string;
}

interface CategorySelectorProps {
	selectedCategories: number[];
	onChange: (value: number[]) => void;
}

export function CategorySelector({
	selectedCategories,
	onChange,
}: CategorySelectorProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState<FlattenedCategory[]>([]);

	useEffect(() => {
		const fetchCategories = async () => {
			setLoading(true);
			try {
				const response = await ProductCategoryService.getProductAllCategories();
				if (response && response.data && response.data.length > 0) {
					const flattenedCategories = flattenCategories(response.data);
					setCategories(flattenedCategories);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	const flattenCategories = (
		categories: Category[],
		parentPath = ''
	): FlattenedCategory[] => {
		let result: FlattenedCategory[] = [];

		categories.forEach((category) => {
			if (category.name === 'All Products' && !parentPath) {
				if (category.children && category.children.length > 0) {
					result = result.concat(
						flattenCategories(category.children, '')
					);
				}
			} else {
				const currentPath = parentPath
					? `${parentPath} > ${category.name}`
					: category.name;

				result.push({
					id: category.id,
					name: category.name,
					description: category.description,
					path: currentPath,
				});

				if (category.children && category.children.length > 0) {
					result = result.concat(
						flattenCategories(category.children, currentPath)
					);
				}
			}
		});

		return result;
	};

	const toggleCategory = (categoryId: number) => {
		if (selectedCategories.includes(categoryId)) {
			onChange(selectedCategories.filter((id) => id !== categoryId));
		} else {
			onChange([...selectedCategories, categoryId]);
		}
	};

	const removeCategory = (categoryId: number, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onChange(selectedCategories.filter((id) => id !== categoryId));
	};

	const getSelectedCategory = (id: number) => {
		return categories.find((category) => category.id === id);
	};

	return (
		<div className='space-y-2'>
			{loading ? (
				<Skeleton className='w-full h-11 rounded-xl' />
			) : (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant='outline'
							role='combobox'
							aria-expanded={open}
							className='w-full justify-between h-auto min-h-[44px] rounded-xl border-[#E5E7EB] bg-white text-xs font-semibold px-3.5 py-2 hover:bg-[#FFF9E8]/30 transition-colors'
						>
							{selectedCategories.length > 0 ? (
								<div className='flex flex-wrap gap-1.5 py-0.5'>
									{selectedCategories.map((categoryId) => {
										const category = getSelectedCategory(categoryId);
										return category ? (
											<Badge
												key={categoryId}
												className='bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/40 text-xs font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-xs'
											>
												<span>{category.name}</span>
												<button
													className='ml-0.5 hover:text-red-600 rounded-full'
													onMouseDown={(e) => {
														e.preventDefault();
														e.stopPropagation();
													}}
													onClick={(e) => removeCategory(categoryId, e)}
												>
													<X className='w-3 h-3' />
												</button>
											</Badge>
										) : null;
									})}
								</div>
							) : (
								<span className='text-[#64748B] font-medium'>
									বিভাগ নির্বাচন করুন...
								</span>
							)}
							<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 text-[#64748B]' />
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0 rounded-xl border-[#E5E7EB] shadow-md bg-white' align='start'>
						<Command className='bg-white rounded-xl overflow-hidden'>
							<CommandInput placeholder='বিভাগ অনুসন্ধান করুন...' className='text-xs font-semibold h-10' />
							<CommandList>
								<CommandEmpty className='text-xs font-medium text-[#64748B] p-3 text-center'>
									কোন বিভাগ পাওয়া যায়নি।
								</CommandEmpty>
								<CommandGroup className='max-h-64 overflow-auto p-1'>
									{categories.map((category) => (
										<CommandItem
											key={category.id}
											value={category.name}
											onSelect={() => {
												toggleCategory(category.id);
											}}
											className='text-xs font-bold py-2 px-3 rounded-lg cursor-pointer aria-selected:bg-[#FFF9E8] aria-selected:text-[#26351B]'
										>
											<Check
												className={cn(
													'mr-2 h-4 w-4 text-[#F5B800]',
													selectedCategories.includes(category.id)
														? 'opacity-100'
														: 'opacity-0'
												)}
											/>
											<div>
												<div className='text-[#172033]'>{category.name}</div>
												{category.path !== category.name && (
													<div className='text-[10px] text-[#64748B] font-medium'>
														{category.path}
													</div>
												)}
											</div>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}