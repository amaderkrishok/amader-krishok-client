'use client';

import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { PostType, PostCategoryType } from '@/types/post';
import { FilterSidebar } from './post-sidebad-filter';

interface MobileFilterButtonProps {
	activeFiltersCount: number;
	searchTerm: string;
	setSearchTerm: (value: string) => void;
	selectedCategories: number[];
	toggleCategorySelection: (id: number) => void;
	categories: PostCategoryType[];
	handleFilterSubmit: (e: React.FormEvent) => void;
	clearAllFilters: () => void;
	formatDate: (dateString: string) => string;
	recentPosts: PostType[];
}

export function MobileFilterButton({
	activeFiltersCount,
	searchTerm,
	setSearchTerm,
	selectedCategories,
	toggleCategorySelection,
	categories,
	handleFilterSubmit,
	clearAllFilters,
	formatDate,
	recentPosts,
}: MobileFilterButtonProps) {
	return (
		<div className='md:hidden mb-6'>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant='outline' className='w-full flex justify-between'>
						<div className='flex items-center'>
							<SlidersHorizontal className='mr-2 h-4 w-4' />
							Filters
						</div>
						<div className='flex items-center gap-2'>
							{activeFiltersCount > 0 && (
								<Badge variant='secondary'>{activeFiltersCount}</Badge>
							)}
							<ChevronDown className='h-4 w-4' />
						</div>
					</Button>
				</SheetTrigger>
				<SheetContent
					side='left'
					className='w-[300px] sm:w-[400px] overflow-y-auto'
				>
					<div className='py-6 pr-6'>
						<h2 className='text-2xl font-bold mb-6'>Filters</h2>
						<FilterSidebar
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							selectedCategories={selectedCategories}
							toggleCategorySelection={toggleCategorySelection}
							categories={categories}
							handleFilterSubmit={handleFilterSubmit}
							clearAllFilters={clearAllFilters}
							formatDate={formatDate}
							recentPosts={recentPosts}
						/>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
