'use client';

import { PostType } from '@/types/post';
import { PostSkeleton } from './post-skeleton';
import { PostCard } from './post-card';
import { NoPostsFound } from './no-post-found';


interface PostsGridProps {
	loading: boolean;
	posts: PostType[];
	formatTimeAgo: (dateString: string) => string;
	clearAllFilters: () => void;
}

export function PostsGrid({
	loading,
	posts,
	formatTimeAgo,
	clearAllFilters,
}: PostsGridProps) {
	if (loading) {
		return (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
				{Array(6)
					.fill(null)
					.map((_, index) => (
						<PostSkeleton key={index} />
					))}
			</div>
		);
	}

	if (posts.length > 0) {
		return (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
				{posts.map((post) => (
					<PostCard key={post.id} post={post} formatTimeAgo={formatTimeAgo} />
				))}
			</div>
		);
	}

	return <NoPostsFound clearAllFilters={clearAllFilters} />;
}
