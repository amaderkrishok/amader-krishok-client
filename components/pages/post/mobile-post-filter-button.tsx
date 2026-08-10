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
					<Button
						variant='outline'
						className='w-full h-12 flex items-center justify-between bg-white border-[#E5E7EB] rounded-2xl shadow-sm text-[#172018] font-bold px-4'
					>
						<div className='flex items-center gap-2'>
							<SlidersHorizontal className='h-4 w-4 text-[#2E7D32]' />
							<span>ফিল্টার পোস্ট</span>
						</div>
						<div className='flex items-center gap-2'>
							{activeFiltersCount > 0 && (
								<Badge className='bg-[#1E2817] text-[#FBBF24] font-bold px-2 py-0.5 rounded-full'>
									{activeFiltersCount}
								</Badge>
							)}
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</Button>
				</SheetTrigger>
				<SheetContent
					side='left'
					className='w-[320px] sm:w-[400px] overflow-y-auto bg-[#F8FAF7] p-4'
				>
					<div className='py-4'>
						<h2 className='text-xl font-extrabold text-[#172018] mb-4 pb-2 border-b border-gray-200'>
							ফিল্টার ও অন্বেষণ
						</h2>
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

