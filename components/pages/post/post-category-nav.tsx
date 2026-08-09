'use client';

import Link from 'next/link';
import { PostCategoryType } from '@/types/post';
import { Sparkles, Sprout } from 'lucide-react';

interface CategoryNavProps {
	categories: PostCategoryType[];
	selectedCategories?: number[];
	onSelectCategory?: (id: number | null) => void;
	onAllClick: () => void;
}

export function CategoryNav({
	categories,
	selectedCategories = [],
	onSelectCategory,
	onAllClick,
}: CategoryNavProps) {
	const isAllActive = selectedCategories.length === 0;

	return (
		<div className='mb-8 sm:mb-10'>
			<div className='flex items-center overflow-x-auto gap-2.5 sm:gap-3 pb-3 -mx-2 px-2 scrollbar-none'>
				{/* All Posts Pill */}
				<button
					type='button'
					onClick={() => {
						if (onSelectCategory) onSelectCategory(null);
						onAllClick();
					}}
					className={`flex-shrink-0 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm border ${
						isAllActive
							? 'bg-[#1E2817] text-white border-[#1E2817] shadow-md scale-105'
							: 'bg-white text-[#172018] border-[#E5E7EB] hover:bg-gray-50 hover:border-gray-300'
					}`}
				>
					<Sparkles
						className={`w-4 h-4 ${
							isAllActive ? 'text-[#FBBF24]' : 'text-gray-400'
						}`}
					/>
					<span>সব পোস্ট</span>
				</button>

				{/* Dynamic API Categories */}
				{categories.map((category) => {
					const isActive = selectedCategories.includes(category.id);
					return (
						<button
							key={category.id}
							type='button'
							onClick={() => {
								if (onSelectCategory) {
									onSelectCategory(category.id);
								}
							}}
							className={`flex-shrink-0 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm border ${
								isActive
									? 'bg-[#1E2817] text-white border-[#1E2817] shadow-md scale-105'
									: 'bg-white text-[#172018] border-[#E5E7EB] hover:bg-gray-50 hover:border-gray-300'
							}`}
						>
							<Sprout
								className={`w-4 h-4 ${
									isActive ? 'text-[#FBBF24]' : 'text-[#2E7D32]'
								}`}
							/>
							<span>{category.name}</span>
							{category.postsCount !== undefined && category.postsCount > 0 && (
								<span
									className={`text-xs px-2 py-0.5 rounded-full font-bold ${
										isActive
											? 'bg-[#FBBF24] text-[#1E2817]'
											: 'bg-gray-100 text-gray-600'
									}`}
								>
									{category.postsCount}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}

