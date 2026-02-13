'use client';

import Link from 'next/link';
import { PostCategoryType } from '@/types/post';

interface CategoryNavProps {
	categories: PostCategoryType[];
	onAllClick: () => void;
}

export function CategoryNav({ categories, onAllClick }: CategoryNavProps) {
	return (
		<div className='mb-10'>
			<div className='flex overflow-x-auto gap-2 pb-2 -mx-1 px-1'>
				<div
					className='flex-shrink-0 rounded-md bg-black text-white px-5 py-2 text-sm font-medium cursor-pointer'
					onClick={onAllClick}
				>
					All
				</div>

				{categories.map((category) => (
					<Link
						key={category.id}
						href={`/post/categories/${category.slug}`}
						className='flex-shrink-0 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors px-5 py-2 text-sm font-medium'
					>
						{category.name}
					</Link>
				))}
			</div>
		</div>
	);
}
