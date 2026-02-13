'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SearchIcon, FilterX } from 'lucide-react';
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
			<form onSubmit={handleFilterSubmit} className='space-y-6'>
				<div className='rounded-2xl border p-4 shadow-sm bg-white space-y-4'>
					{/* Search Input */}
					<div className='relative'>
						<SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
						<Input
							placeholder='পোস্ট অনুসন্ধান করুন...'
							className='pl-10'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					{/* Categories Section */}
					<div className='space-y-2 max-h-48 overflow-auto'>
						<h3 className='text-sm font-semibold underline mb-2'>
							পোস্ট ক্যাটাগরি
						</h3>
						{categories.map((category) => (
							<div key={category.id} className='flex items-center space-x-2'>
								<Checkbox
									id={`category-${category.id}`}
									checked={selectedCategories.includes(category.id)}
									onCheckedChange={() => toggleCategorySelection(category.id)}
								/>
								<label
									htmlFor={`category-${category.id}`}
									className='text-sm flex items-center'
								>
									{category.name}
									{category.postsCount && (
										<Badge variant='secondary' className='ml-2'>
											{category.postsCount}
										</Badge>
									)}
								</label>
							</div>
						))}
					</div>

					{/* Action Buttons */}
					<div className='flex gap-2 pt-2'>
						<Button type='submit' className='flex-1'>
							Apply
						</Button>
						<Button
							type='button'
							variant='outline'
							onClick={clearAllFilters}
							className='flex-shrink-0'
						>
							<FilterX className='w-4 h-4' />
						</Button>
					</div>
				</div>
			</form>

			{/* Recent Posts Section */}
			<div className='rounded-2xl border p-4 shadow-sm bg-white'>
				<h3 className='text-sm font-semibold underline mb-3'>
					সাম্প্রতিক পোস্ট
				</h3>
				<div className='space-y-4'>
					{recentPosts.slice(0, 3).map((post) => (
						<div key={post.id} className='flex gap-3'>
							<div className='relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-200'>
								{post.featuredImage ? (
									<Image
										src={post.featuredImage}
										alt={post.title}
										fill
										className='object-cover'
									/>
								) : null}
							</div>
							<div className='space-y-1'>
								<Link
									href={`/post/${post.slug}`}
									className='text-sm font-medium line-clamp-2 hover:underline'
								>
									{post.title}
								</Link>
								<p className='text-xs text-muted-foreground'>
									{formatDate(post.createdAt)}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
