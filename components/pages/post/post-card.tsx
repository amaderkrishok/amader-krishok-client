'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { PostType } from '@/types/post';

interface PostCardProps {
	post: PostType;
	formatTimeAgo: (dateString: string) => string;
}

export function PostCard({ post, formatTimeAgo }: PostCardProps) {
	return (
		<div className='group border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow'>
			<Link href={`/post/${post.slug}`}>
				<div className='relative h-48'>
					{post.featuredImage ? (
						<Image
							src={post.featuredImage}
							alt={post.title}
							fill
							className='object-cover group-hover:scale-105 transition-transform duration-300'
						/>
					) : (
						<div className='w-full h-full bg-gray-100 flex items-center justify-center'>
							<span className='text-gray-400'>No image</span>
						</div>
					)}

					{/* Category Badge */}
					{post.categories && post.categories[0] && (
						<div className='absolute left-3 top-3'>
							<div className='text-xs px-2 py-1 bg-white/90 rounded text-black font-medium'>
								{post.categories[0].name}
							</div>
						</div>
					)}
				</div>
			</Link>

			<div className='p-4'>
				<Link href={`/post/${post.slug}`}>
					<h3 className='text-lg font-bold mb-2 line-clamp-2 group-hover:text-black transition-colors'>
						{post.title}
					</h3>
				</Link>

				{post.excerpt && (
					<p className='text-gray-600 text-sm mb-3 line-clamp-2'>
						{post.excerpt}
					</p>
				)}

				<div className='flex items-center text-sm text-gray-500'>
					<span>{formatTimeAgo(post.createdAt)}</span>
					<span className='mx-2'>•</span>
					<Clock className='h-3 w-3 mr-1' />
					<span>5 min read</span>
				</div>
			</div>
		</div>
	);
}
