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
	const [minPriceInput, setMinPriceInput] = useState<string>(String(priceRange.min));
	const [maxPriceInput, setMaxPriceInput] = useState<string>(String(priceRange.max));

	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

	// Update local price range when props change
	useEffect(() => {
		setLocalPriceRange([priceRange.min, priceRange.max]);
		setMinPriceInput(String(priceRange.min));
		setMaxPriceInput(String(priceRange.max));
	}, [priceRange.min, priceRange.max]);

	// Update local search term when prop changes
	useEffect(() => {
		setLocalSearchTerm(searchTerm);
	}, [searchTerm]);

	const handleSliderChange = (value: number[]) => {
		const min = value[0];
		const max = value[1];
		setLocalPriceRange([min, max]);
		setMinPriceInput(String(min));
		setMaxPriceInput(String(max));
		// The actual API call is debounced in the parent component
		onPriceRangeChange(min, max);
	};

	const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setMinPriceInput(val);
		if (val === '') return;
		const num = Number(val);
		if (!isNaN(num) && num >= 0) {
			const clamped = Math.min(Math.max(0, num), 100000);
			const currentMax = localPriceRange[1];
			const newMin = Math.min(clamped, currentMax);
			setLocalPriceRange([newMin, currentMax]);
			onPriceRangeChange(newMin, currentMax);
		}
	};

	const handleMinInputBlur = () => {
		let num = Number(minPriceInput);
		if (isNaN(num) || minPriceInput.trim() === '' || num < 0) {
			num = 0;
		}
		num = Math.max(0, Math.min(100000, num));
		if (num > localPriceRange[1]) {
			num = localPriceRange[1];
		}
		setMinPriceInput(String(num));
		setLocalPriceRange([num, localPriceRange[1]]);
		onPriceRangeChange(num, localPriceRange[1]);
	};

	const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setMaxPriceInput(val);
		if (val === '') return;
		const num = Number(val);
		if (!isNaN(num) && num >= 0) {
			const clamped = Math.min(Math.max(0, num), 100000);
			const currentMin = localPriceRange[0];
			const newMax = Math.max(clamped, currentMin);
			setLocalPriceRange([currentMin, newMax]);
			onPriceRangeChange(currentMin, newMax);
		}
	};

	const handleMaxInputBlur = () => {
		let num = Number(maxPriceInput);
		if (isNaN(num) || maxPriceInput.trim() === '' || num < 0) {
			num = 100000;
		}
		num = Math.max(0, Math.min(100000, num));
		if (num < localPriceRange[0]) {
			num = localPriceRange[0];
		}
		setMaxPriceInput(String(num));
		setLocalPriceRange([localPriceRange[0], num]);
		onPriceRangeChange(localPriceRange[0], num);
	};

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			(e.target as HTMLInputElement).blur();
		}
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
		<div className='bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/80 h-full flex flex-col gap-5 relative overflow-hidden group/sidebar'>
			<div className="absolute top-0 right-0 w-32 h-32 bg-[#2D331F]/5 rounded-full blur-3xl -z-10 group-hover/sidebar:bg-emerald-500/5 transition-colors duration-700"></div>
			{onClose && (
				<div className='flex justify-between items-center mb-2'>
					<h2 className='text-xl font-bold text-gray-900'>ফিল্টার</h2>
					<Button variant='ghost' size='icon' onClick={onClose} className='rounded-full hover:bg-gray-100/80'>
						<X className='h-5 w-5 text-gray-500' />
					</Button>
				</div>
			)}

			<div className='space-y-4 sm:space-y-5'>
				{/* Search */}
				<div className='bg-white p-4 rounded-xl shadow-xs border border-gray-200/80 hover:border-gray-300 transition-all duration-300 relative overflow-hidden'>
					<h3 className='text-md font-bold text-gray-800 mb-3 flex items-center gap-2'>
						<span className='w-1.5 h-4 bg-[#26351B] rounded-full inline-block'></span>
						অনুসন্ধান
					</h3>
					<div className='relative group'>
						<Input
							placeholder='পণ্য খুঁজুন...'
							value={localSearchTerm}
							onChange={handleSearchChange}
							className='w-full pr-9 bg-gray-50/50 border border-gray-200/90 focus:bg-white focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all rounded-xl shadow-inner'
						/>
						{localSearchTerm && (
							<button
								onClick={clearSearch}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors'
							>
								<X className='h-4 w-4' />
							</button>
						)}
					</div>

					{/* Reset Filters Button */}
					<Button
						variant='outline'
						size='sm'
						className='w-full flex gap-2 mt-4 rounded-xl border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all duration-300'
						onClick={onResetFilters}
					>
						<RefreshCw className='h-3.5 w-3.5' />
						ফিল্টার রিসেট করুন
					</Button>
				</div>

				{/* Categories */}
				<div className='bg-white p-4 rounded-xl shadow-xs border border-gray-200/80 hover:border-gray-300 transition-all duration-300 relative overflow-hidden'>
					<h3 className='text-md font-bold text-gray-800 mb-3 flex items-center gap-2'>
						<span className='w-1.5 h-4 bg-[#26351B] rounded-full inline-block'></span>
						বিভাগসমূহ
					</h3>
					{isLoading ? (
						<div className='animate-pulse space-y-3 mt-2'>
							<div className='h-3 bg-gray-200/80 rounded w-3/4'></div>
							<div className='h-3 bg-gray-200/80 rounded w-1/2'></div>
							<div className='h-3 bg-gray-200/80 rounded w-2/3'></div>
						</div>
					) : (
						<div className='space-y-1 mt-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar'>
							<CategoryTree
								categories={categories}
								selectedCategoryId={selectedCategoryId}
								onCategoryClick={onCategoryClick}
							/>
						</div>
					)}
				</div>

				{/* Price Range */}
				<div className='bg-white p-4 rounded-xl shadow-xs border border-gray-200/80 hover:border-gray-300 transition-all duration-300 relative overflow-hidden'>
					<h3 className='text-md font-bold text-gray-800 mb-4 flex items-center gap-2'>
						<span className='w-1.5 h-4 bg-[#26351B] rounded-full inline-block'></span>
						মূল্য সীমা
					</h3>
					<div className='flex items-center justify-between gap-2 mb-4 bg-gray-50/80 p-2 rounded-lg border border-gray-200/80'>
						<div className='flex items-center bg-white border border-gray-200/90 rounded-md shadow-2xs px-2.5 py-1 flex-1 min-w-0 focus-within:ring-2 focus-within:ring-gray-300 focus-within:border-gray-400 transition-all'>
							<input
								type='number'
								min={0}
								max={100000}
								value={minPriceInput}
								onChange={handleMinInputChange}
								onBlur={handleMinInputBlur}
								onKeyDown={handleInputKeyDown}
								aria-label='সর্বনিম্ন মূল্য'
								className='w-full text-sm font-bold text-[#172033] bg-transparent outline-none border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
								placeholder='0'
							/>
							<span className='text-xs font-semibold text-gray-500 ml-1 select-none pointer-events-none'>
								৳
							</span>
						</div>
						<span className='text-gray-400 select-none font-medium'>-</span>
						<div className='flex items-center bg-white border border-gray-200/90 rounded-md shadow-2xs px-2.5 py-1 flex-1 min-w-0 focus-within:ring-2 focus-within:ring-gray-300 focus-within:border-gray-400 transition-all'>
							<input
								type='number'
								min={0}
								max={100000}
								value={maxPriceInput}
								onChange={handleMaxInputChange}
								onBlur={handleMaxInputBlur}
								onKeyDown={handleInputKeyDown}
								aria-label='সর্বোচ্চ মূল্য'
								className='w-full text-sm font-bold text-[#172033] bg-transparent outline-none border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-right'
								placeholder='100000'
							/>
							<span className='text-xs font-semibold text-gray-500 ml-1 select-none pointer-events-none'>
								৳
							</span>
						</div>
					</div>
					<Slider
						value={[localPriceRange[0], localPriceRange[1]]}
						min={0}
						max={100000}
						step={100}
						onValueChange={handleSliderChange}
						className="py-2"
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
										'w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all duration-300 flex items-center justify-between group/cat',
										selectedCategoryId === category.id
											? 'font-bold text-[#172033] bg-[#EAB308]/20 border border-[#EAB308]/40 shadow-xs'
											: 'text-gray-600 border border-transparent hover:bg-[#EAB308]/10 hover:text-[#172033] hover:border-[#EAB308]/20'
									)}
								>
									<span>{category.name}</span>
									{!hasChildren && (
										<span className='w-1 h-1 rounded-full bg-[#EAB308] opacity-0 group-hover/cat:opacity-100 transition-opacity duration-300'></span>
									)}
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
