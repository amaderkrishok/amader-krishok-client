'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, User, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { PostType } from '@/types/post';
import { PostSkeleton } from './post-skeleton';
import { PostCard } from './post-card';
import { NoPostsFound } from './no-post-found';
import { Badge } from '@/components/ui/badge';

interface PostsGridProps {
	loading: boolean;
	posts: PostType[];
	formatTimeAgo: (dateString: string) => string;
	clearAllFilters: () => void;
	meta?: {
		totalItems: number;
		itemsPerPage: number;
		currentPage: number;
		totalPages: number;
	};
	onPageChange?: (page: number) => void;
}

export function PostsGrid({
	loading,
	posts,
	formatTimeAgo,
	clearAllFilters,
	meta,
	onPageChange,
}: PostsGridProps) {
	if (loading) {
		return (
			<div className='space-y-8'>
				{/* Skeleton for Featured Post */}
				<div className='w-full h-80 bg-gray-200/80 animate-pulse rounded-3xl' />
				{/* Skeleton for Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{Array(4)
						.fill(null)
						.map((_, index) => (
							<PostSkeleton key={index} />
						))}
				</div>
			</div>
		);
	}

	if (!posts || posts.length === 0) {
		return <NoPostsFound clearAllFilters={clearAllFilters} />;
	}

	// Featured post is the first post in the list
	const featuredPost = posts[0];
	const regularPosts = posts.length > 1 ? posts.slice(1) : [];

	return (
		<div className='space-y-8'>
			{/* FEATURED POST CARD at the top */}
			{featuredPost && (
				<div className='group bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300'>
					<div className='flex flex-col lg:flex-row'>
						{/* Featured Image (16:9 or full height on desktop) */}
						<Link
							href={`/post/${featuredPost.slug}`}
							className='block relative lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden bg-gray-100 min-h-[240px]'
						>
							{featuredPost.featuredImage ? (
								<Image
									src={featuredPost.featuredImage}
									alt={featuredPost.title}
									fill
									className='object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out'
									priority
								/>
							) : (
								<div className='w-full h-full bg-gradient-to-br from-[#1E2817]/10 to-[#2E7D32]/10 flex items-center justify-center'>
									<span className='text-[#1E2817] font-semibold'>আমাদের কৃষক</span>
								</div>
							)}

							{/* Badge */}
							<div className='absolute left-4 top-4 z-10'>
								<span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-[#1E2817] text-[#FBBF24] rounded-full shadow-lg border border-white/20'>
									
									<span>🌾 Featured</span>
								</span>
							</div>
						</Link>

						{/* Content */}
						<div className='p-6 lg:p-8 lg:w-1/2 flex flex-col justify-between space-y-4'>
							<div className='space-y-3'>
								{featuredPost.categories && featuredPost.categories[0] && (
									<Badge className='bg-[#4CAF50]/15 text-[#2E7D32] hover:bg-[#4CAF50]/25 font-semibold text-xs px-3 py-1 rounded-full border border-[#4CAF50]/30 w-fit'>
										{featuredPost.categories[0].name}
									</Badge>
								)}

								<Link href={`/post/${featuredPost.slug}`} className='block'>
									<h2 className='text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#172018] leading-snug group-hover:text-[#2E7D32] transition-colors line-clamp-2'>
										{featuredPost.title}
									</h2>
								</Link>

								<p className='text-[#6B7280] text-sm sm:text-base leading-relaxed line-clamp-3 font-normal'>
									{featuredPost.excerpt ||
										'কৃষি এবং কৃষি উদ্ভাবনের উপর বিস্তারিত তথ্য, টিপস ও পরমর্শ পড়তে থাকুন।'}
								</p>
							</div>

							<div className='pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-[#6B7280] font-medium'>
								<div className='flex items-center gap-3'>
									<span className='inline-flex items-center gap-1.5 text-[#172018] font-semibold'>
										<User className='w-4 h-4 text-[#2E7D32]' />
										<span>Amader Krishok</span>
									</span>
									<span>•</span>
									<span className='inline-flex items-center gap-1 text-gray-500'>
										<Clock className='w-3.5 h-3.5 text-gray-400' />
										<span>৫ মিনিট পড়ুন</span>
									</span>
								</div>

								<Link
									href={`/post/${featuredPost.slug}`}
									className='inline-flex items-center gap-1.5 font-bold text-[#1E2817] group-hover:text-[#2E7D32] transition-colors text-sm'
								>
									<span>বিস্তারিত পড়ুন</span>
									<ArrowRight className='w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300' />
								</Link>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* REGULAR POST GRID (2 columns desktop/tablet, 1 column mobile) */}
			{regularPosts.length > 0 && (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{regularPosts.map((post) => (
						<PostCard key={post.id} post={post} formatTimeAgo={formatTimeAgo} />
					))}
				</div>
			)}

			{/* MODERN PAGINATION */}
			{meta && meta.totalPages > 1 && onPageChange && (
				<div className='pt-8 flex items-center justify-center gap-2'>
					<button
						type='button'
						disabled={meta.currentPage === 1}
						onClick={() => onPageChange(meta.currentPage - 1)}
						className='flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-white border border-[#E5E7EB] text-sm font-semibold text-[#172018] hover:bg-[#2E7D32] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#172018] shadow-sm transition-all'
					>
						<ChevronLeft className='w-4 h-4' />
						<span>আগের</span>
					</button>

					{Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNum) => {
						const isActive = pageNum === meta.currentPage;
						return (
							<button
								key={pageNum}
								type='button'
								onClick={() => onPageChange(pageNum)}
								className={`w-10 h-10 rounded-2xl text-sm font-bold flex items-center justify-center transition-all shadow-sm ${
									isActive
										? 'bg-[#1E2817] text-white shadow-md scale-105'
										: 'bg-white text-[#172018] border border-[#E5E7EB] hover:bg-[#2E7D32] hover:text-white'
								}`}
							>
								{pageNum}
							</button>
						);
					})}

					<button
						type='button'
						disabled={meta.currentPage === meta.totalPages}
						onClick={() => onPageChange(meta.currentPage + 1)}
						className='flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-white border border-[#E5E7EB] text-sm font-semibold text-[#172018] hover:bg-[#2E7D32] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#172018] shadow-sm transition-all'
					>
						<span>পরের</span>
						<ChevronRight className='w-4 h-4' />
					</button>
				</div>
			)}
		</div>
	);
}

