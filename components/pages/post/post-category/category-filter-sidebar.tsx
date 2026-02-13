import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { PostType, PostCategoryType } from '@/types/post';

interface CategoryFilterSidebarProps {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	handleSearch: (e: React.FormEvent) => void;
	categories: PostCategoryType[];
	currentCategory: PostCategoryType | null;
	recentPosts: PostType[];
	formatTimeAgo: (dateString: string) => string;
	className?: string;
}

export function CategoryFilterSidebar({
	searchTerm,
	setSearchTerm,
	handleSearch,
	categories,
	currentCategory,
	recentPosts,
	formatTimeAgo,
	className,
}: CategoryFilterSidebarProps) {
	return (
		<div className={cn('space-y-6', className)}>
			<div>
				<h3 className='font-semibold text-lg mb-3'>Search</h3>
				<form onSubmit={handleSearch} className='relative'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4' />
					<Input
						type='search'
						placeholder='Search in this category...'
						className='pl-10'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</form>
			</div>

			<Separator />

			<div>
				<h3 className='font-semibold text-lg mb-3'>Categories</h3>
				<div className='space-y-2'>
					{categories.map((cat) => (
						<div key={cat.id} className='flex items-center space-x-2'>
							<Link
								href={`/post/categories/${cat.slug}`}
								className={`flex items-center ${
									cat.id === currentCategory?.id
										? 'font-bold text-black'
										: 'hover:text-black'
								}`}
							>
								{cat.name}
								{cat.postsCount && (
									<Badge variant='secondary' className='ml-2'>
										{cat.postsCount}
									</Badge>
								)}
							</Link>
						</div>
					))}
				</div>
			</div>

			<Separator />

			<div>
				<h3 className='font-semibold text-lg mb-1'>Recent Posts</h3>
				<div className='space-y-4 mt-4'>
					{recentPosts.map((post) => (
						<div key={post.id} className='flex gap-3'>
							<div className='relative w-16 h-16 flex-shrink-0 rounded overflow-hidden'>
								{post.featuredImage ? (
									<Image
										src={post.featuredImage}
										alt={post.title}
										fill
										className='object-cover'
									/>
								) : (
									<div className='w-full h-full bg-gray-200' />
								)}
							</div>
							<div className='space-y-1'>
								<Link
									href={`/post/${post.slug}`}
									className='text-sm font-medium line-clamp-2 hover:text-black'
								>
									{post.title}
								</Link>
								<p className='text-xs text-gray-500'>
									{formatTimeAgo(post.createdAt)}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
