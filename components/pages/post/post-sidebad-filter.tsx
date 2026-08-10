'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, FilterX, Flame, Clock, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PostType, PostCategoryType } from '@/types/post';

interface FilterSidebarProps {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
	selectedCategories: number[];
	toggleCategorySelection: (id: number) => void;
	categories: PostCategoryType[];
	handleFilterSubmit: (e: React.FormEvent) => void;
	clearAllFilters: () => void;
	formatDate: (dateString: string) => string;
	recentPosts: PostType[];
	className?: string;
}

export function FilterSidebar({
	searchTerm,
	setSearchTerm,
	selectedCategories,
	toggleCategorySelection,
	categories,
	handleFilterSubmit,
	clearAllFilters,
	formatDate,
	recentPosts,
	className,
}: FilterSidebarProps) {
	return (
		<div className={cn('space-y-6', className)}>
			{/* Filter Card */}
			<form onSubmit={handleFilterSubmit} className='space-y-6'>
				<div className='rounded-3xl border border-[#E5E7EB] p-5 shadow-sm bg-white space-y-5'>
					<h2 className='text-lg font-bold text-[#172018] flex items-center gap-2 border-b border-gray-100 pb-3'>
						<span>🔍 পোস্ট খুঁজুন</span>
					</h2>

					{/* 52px Height Search Input */}
					<div className='relative'>
						<Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
						<Input
							placeholder='পোস্ট খুঁজুন...'
							className='h-[52px] pl-11 pr-4 rounded-2xl border-[#E5E7EB] bg-gray-50 focus:bg-white text-sm text-[#172018] placeholder:text-gray-400 transition-colors shadow-inner'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					{/* Categories Section */}
					<div className='space-y-3'>
						<h3 className='text-sm font-bold text-[#172018] uppercase tracking-wider text-xs text-gray-500'>
							পোস্টের বিষয়
						</h3>
						<div className='space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin'>
							{categories.map((category) => {
								const isSelected = selectedCategories.includes(category.id);
								return (
									<div
										key={category.id}
										onClick={(e) => {
											e.preventDefault();
											toggleCategorySelection(category.id);
										}}
										className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
											isSelected
												? 'bg-[#1E2817]/5 border-[#1E2817]/20 font-semibold text-[#1E2817]'
												: 'border-transparent hover:bg-gray-50 text-gray-700'
										}`}
									>
										<div className='flex items-center space-x-3'>
											<div
												className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${
													isSelected
														? 'bg-[#1E2817] border-[#1E2817] text-white'
														: 'border-gray-300 bg-white'
												}`}
											>
												{isSelected && <Check className='w-3 h-3 stroke-[3]' />}
											</div>
											<span className='text-sm select-none'>
												{category.name}
											</span>
										</div>
										{category.postsCount !== undefined && category.postsCount > 0 && (
											<Badge
												variant='secondary'
												className={`text-xs px-2 py-0.5 rounded-full ${
													isSelected
														? 'bg-[#1E2817] text-white'
														: 'bg-gray-100 text-gray-500'
												}`}
											>
												{category.postsCount}
											</Badge>
										)}
									</div>
								);
							})}
						</div>
					</div>

					{/* Action Buttons */}
					<div className='flex gap-2 pt-2'>
						<Button
							type='submit'
							className='flex-1 h-11 bg-[#1E2817] hover:bg-[#2A351F] text-white rounded-xl font-bold shadow-md transition-all'
						>
							প্রয়োগ করুন
						</Button>
						<Button
							type='button'
							variant='outline'
							onClick={clearAllFilters}
							className='h-11 px-3 border-[#E5E7EB] hover:bg-gray-100 text-gray-600 rounded-xl flex-shrink-0'
							title='ফিল্টার মুছুন'
						>
							<FilterX className='w-4 h-4' />
						</Button>
					</div>
				</div>
			</form>

			{/* Popular/Recent Posts Section */}
			<div className='rounded-3xl border border-[#E5E7EB] p-5 shadow-sm bg-white space-y-4'>
				<h3 className='text-base font-bold text-[#172018] flex items-center gap-2 border-b border-gray-100 pb-3'>
					<Flame className='w-4 h-4 text-[#FF9800]' />
					<span>জনপ্রিয় পোস্ট</span>
				</h3>
				<div className='space-y-4'>
					{recentPosts.slice(0, 4).map((post, idx) => (
						<div
							key={post.id}
							className='flex gap-3 items-center group pb-3 border-b border-gray-100 last:border-0 last:pb-0'
						>
							<div className='relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100'>
								{post.featuredImage ? (
									<Image
										src={post.featuredImage}
										alt={post.title}
										fill
										className='object-cover group-hover:scale-105 transition-transform duration-300'
									/>
								) : (
									<div className='w-full h-full flex items-center justify-center text-gray-400 text-xs'>
										কৃষি
									</div>
								)}
							</div>
							<div className='space-y-1 flex-1 min-w-0'>
								<Link
									href={`/post/${post.slug}`}
									className='text-sm font-semibold text-[#172018] line-clamp-2 leading-snug group-hover:text-[#2E7D32] transition-colors'
								>
									{post.title}
								</Link>
								<div className='flex items-center gap-2 text-xs text-[#6B7280]'>
									<Clock className='w-3 h-3 text-gray-400' />
									<span>৫ মিনিট</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

