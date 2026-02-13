'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function PostSkeleton() {
	return (
		<div className='border border-gray-100 rounded-lg overflow-hidden'>
			<Skeleton className='h-48 w-full' />
			<div className='p-4'>
				<Skeleton className='h-5 w-20 mb-2' />
				<Skeleton className='h-7 w-full mb-2' />
				<div className='flex items-center mt-3'>
					<Skeleton className='h-4 w-24 mr-4' />
				</div>
			</div>
		</div>
	);
}
