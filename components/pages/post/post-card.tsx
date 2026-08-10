'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, User } from 'lucide-react';
import { PostType } from '@/types/post';

interface PostCardProps {
	post: PostType;
	formatTimeAgo: (dateString: string) => string;
}

export function PostCard({ post, formatTimeAgo }: PostCardProps) {
	return (
		<div className='group bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full'>
			{/* Image container 16:9 */}
			<Link href={`/post/${post.slug}`} className='block relative aspect-video w-full overflow-hidden bg-gray-100'>
				{post.featuredImage ? (
					<Image
						src={post.featuredImage}
						alt={post.title}
						fill
						className='object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out'
					/>
				) : (
					<div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
						<span className='text-gray-400 font-medium text-sm'>আমাদের কৃষক</span>
					</div>
				)}

				{/* Category Badge over image */}
				{post.categories && post.categories[0] && (
					<div className='absolute left-3.5 top-3.5 z-10'>
						<span className='text-xs font-semibold px-3 py-1 bg-[#1E2817]/90 text-[#FBBF24] backdrop-blur-md rounded-full shadow-md border border-white/10 inline-block'>
							{post.categories[0].name}
						</span>
					</div>
				)}
			</Link>

			{/* Card Body */}
			<div className='p-5 flex flex-col flex-1 justify-between space-y-4'>
				<div className='space-y-2.5'>
					<Link href={`/post/${post.slug}`} className='block'>
						<h3 className='text-lg md:text-xl font-bold text-[#172018] line-clamp-2 leading-snug group-hover:text-[#2E7D32] transition-colors'>
							{post.title}
						</h3>
					</Link>

					{post.excerpt && (
						<p className='text-[#6B7280] text-sm leading-relaxed line-clamp-2 font-normal'>
							{post.excerpt}
						</p>
					)}
				</div>

				{/* Footer Metadata & CTA */}
				<div className='pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#6B7280] font-medium'>
					<div className='flex items-center gap-2'>
						<span className='inline-flex items-center gap-1 text-gray-500'>
							<User className='w-3.5 h-3.5 text-gray-400' />
							<span>আমাদের কৃষক</span>
						</span>
						<span>•</span>
						<span className='inline-flex items-center gap-1 text-gray-500'>
							<Clock className='w-3.5 h-3.5 text-gray-400' />
							<span>৫ মিনিট পড়ুন</span>
						</span>
					</div>

					<Link
						href={`/post/${post.slug}`}
						className='inline-flex items-center gap-1 font-bold text-[#1E2817] group-hover:text-[#2E7D32] transition-colors'
					>
						<span>পড়ুন</span>
						<ArrowRight className='w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300' />
					</Link>
				</div>
			</div>
		</div>
	);
}

