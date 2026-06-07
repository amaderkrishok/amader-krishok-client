'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import type { ProductCategoryType } from '@/types/product-category';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
	categories: ProductCategoryType[];
	selectedCategoryId?: number;
	onCategoryClick: (categoryId: number | undefined) => void;
	priceRange: { min: number; max: number };
	onPriceRangeChange: (min: number, max: number) => void;
	onClose?: () => void;
	alwaysOpenParent?: boolean;
	isLoading?: boolean;
	onSearchChange: (term: string) => void;
	searchTerm: string;
	onResetFilters: () => void;
}

export function FilterSidebar({
	categories,
	selectedCategoryId,
	onCategoryClick,
	priceRange,
	onPriceRangeChange,
	onClose,
	isLoading = false,
	onSearchChange,
	searchTerm,
	onResetFilters,
}: FilterSidebarProps) {
	const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
		priceRange.min,
		priceRange.max,
	]);

	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

	// Update local price range when props change
	useEffect(() => {
		setLocalPriceRange([priceRange.min, priceRange.max]);
	}, [priceRange.min, priceRange.max]);

	// Update local search term when prop changes
	useEffect(() => {
		setLocalSearchTerm(searchTerm);
	}, [searchTerm]);

	const handleSliderChange = (value: number[]) => {
		setLocalPriceRange([value[0], value[1]]);
		// The actual API call is debounced in the parent component
		onPriceRangeChange(value[0], value[1]);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setLocalSearchTerm(newValue);
		// The parent component handles debouncing
		onSearchChange(newValue);
	};

	const clearSearch = () => {
		setLocalSearchTerm('');
		onSearchChange('');
	};

	return (
		<div className='bg-white p-4 rounded-lg shadow-sm border h-full'>
			{onClose && (
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-lg font-semibold'>ফিল্টার</h2>
					<Button variant='ghost' size='icon' onClick={onClose}>
						<X className='h-4 w-4' />
					</Button>
				</div>
			)}

			<div className='space-y-6'>
				{/* Search */}
				<div>
					<h3 className='text-lg font-semibold mb-3'>অনুসন্ধান</h3>
					<div className='relative'>
						<Input
							placeholder='পণ্য খুঁজুন...'
							value={localSearchTerm}
							onChange={handleSearchChange}
							className='w-full pr-9'
						/>
						{localSearchTerm && (
							<button
								onClick={clearSearch}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
							>
								<X className='h-4 w-4' />
							</button>
						)}
					</div>

					{/* Reset Filters Button - Moved under the search box */}
					<Button
						variant='outline'
						size='sm'
						className='w-full flex gap-2 mt-2'
						onClick={onResetFilters}
					>
						<RefreshCw className='h-3.5 w-3.5' />
						ফিল্টার রিসেট করুন
					</Button>
				</div>

				{/* Categories */}
				<div>
					<h3 className='text-lg font-semibold mb-3'>বিভাগসমূহ</h3>
					{isLoading ? (
						<div className='animate-pulse space-y-2'>
							<div className='h-4 bg-gray-200 rounded w-3/4'></div>
							<div className='h-4 bg-gray-200 rounded w-1/2'></div>
							<div className='h-4 bg-gray-200 rounded w-2/3'></div>
						</div>
					) : (
						/* Categories section in FilterSidebar */
						<div className='space-y-1'>
							{/* Render the category tree for all categories */}
							<CategoryTree
								categories={categories}
								selectedCategoryId={selectedCategoryId}
								onCategoryClick={onCategoryClick}
							/>
						</div>
					)}
				</div>

				{/* Price Range */}
				<div>
					<h3 className='text-lg font-semibold mb-3'>মূল্য সীমা</h3>
					<div className='flex items-center justify-between mb-2'>
						<span className='text-sm text-gray-600'>
							{localPriceRange[0]} টাকা
						</span>
						<span className='text-sm text-gray-600'>
							{localPriceRange[1]} টাকা
						</span>
					</div>
					<Slider
  value={[localPriceRange[0], localPriceRange[1]]}
  min={0}
  max={100000}
  step={1000}
  onValueChange={handleSliderChange}
  className="my-4"
/>
				</div>
			</div>
		</div>
	);
}

interface CategoryTreeProps {
	categories: ProductCategoryType[];
	selectedCategoryId?: number;
	onCategoryClick: (categoryId: number | undefined) => void;
	level?: number;
}

function CategoryTree({
	categories,
	selectedCategoryId,
	onCategoryClick,
	level = 0,
}: CategoryTreeProps) {
	// Helper to check if a category or its children contains the selected ID
	const hasSelectedCategory = (
		category: ProductCategoryType,
		selectedId: number
	): boolean => {
		if (category.id === selectedId) return true;

		if (category.children && category.children.length > 0) {
			return category.children.some((child) =>
				hasSelectedCategory(child, selectedId)
			);
		}

		return false;
	};

	// Initialize with top-level categories expanded for better visibility
	const [expandedCategories, setExpandedCategories] = useState<
		Record<number, boolean>
	>(() => {
		// By default, expand top-level categories
		const expanded: Record<number, boolean> = {};

		// Auto-expand first level by default for better UX
		if (level === 0) {
			categories.forEach((cat) => {
				if (cat.id) {
					expanded[cat.id] = true;
				}
			});
		}

		// Also expand categories that are in the path to the selected category
		if (selectedCategoryId) {
			// This is a simple approach - a more thorough one would find the actual path
			categories.forEach((cat) => {
				if (hasSelectedCategory(cat, selectedCategoryId)) {
					expanded[cat.id] = true;
				}
			});
		}

		return expanded;
	});

	const toggleCategory = (categoryId: number, event: React.MouseEvent) => {
		// Stop propagation to prevent category selection when clicking the toggle
		event.stopPropagation();

		setExpandedCategories((prev) => ({
			...prev,
			[categoryId]: !prev[categoryId],
		}));
	};

	return (
		<ul
			className={`${
				level > 0 ? 'border-l border-gray-200 ml-1.5 pl-2' : 'space-y-0.5'
			}`}
		>
			{categories.map((category) => {
				const hasChildren = category.children && category.children.length > 0;
				const isExpanded = expandedCategories[category.id] || false;

				return (
					<li key={category.id} className='relative py-0.5'>
						<div className={`flex items-center ${level > 0 ? 'ml-0.5' : ''}`}>
							{/* Connector line for child items */}
							{level > 0 && (
								<span className='absolute -left-2 top-3 w-2 h-px bg-gray-200'></span>
							)}

							<div className='flex items-center w-full'>
								{/* Category toggle button */}
								{hasChildren && (
									<button
										type='button'
										onClick={(e) => toggleCategory(category.id, e)}
										className='flex-shrink-0 p-0.5 text-gray-500 hover:text-gray-700 mr-0.5'
										aria-expanded={isExpanded}
										aria-label={
											isExpanded ? 'Collapse category' : 'Expand category'
										}
									>
										<ChevronDown
											className={`h-3 w-3 transition-transform ${
												isExpanded ? 'rotate-180' : ''
											}`}
										/>
									</button>
								)}

								{/* Category button */}
								<button
									type='button'
									onClick={() => onCategoryClick(category.id)}
									className={cn(
										'w-full text-left px-2 py-0.5 rounded text-sm hover:bg-gray-100 transition-colors',
										selectedCategoryId === category.id &&
											'font-medium text-green-600 bg-green-50'
									)}
								>
									{category.name}
								</button>
							</div>
						</div>

						{/* Children */}
						{hasChildren && isExpanded && (
							<CategoryTree
								categories={category.children ?? []}
								selectedCategoryId={selectedCategoryId}
								onCategoryClick={onCategoryClick}
								level={level + 1}
							/>
						)}
					</li>
				);
			})}
		</ul>
	);
}
