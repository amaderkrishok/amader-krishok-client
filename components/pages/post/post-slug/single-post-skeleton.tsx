'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function PostSkeleton() {
	return (
		<div className='min-h-screen bg-[#F8FAF7] text-[#172018] py-8 sm:py-12'>
			{/* Breadcrumb Skeleton */}
			<div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mb-6'>
				<Skeleton className='h-4 w-64 bg-gray-200/80 rounded-full' />
			</div>

			{/* Centered Header Skeleton */}
			<div className='max-w-[900px] mx-auto px-4 text-center space-y-4 mb-8 flex flex-col items-center'>
				<Skeleton className='h-7 w-32 bg-gray-200/80 rounded-full' />
				<Skeleton className='h-12 w-full sm:w-4/5 bg-gray-200/80 rounded-2xl' />
				<Skeleton className='h-4 w-72 bg-gray-200/80 rounded-full' />
			</div>

			{/* Hero Image Skeleton */}
			<div className='max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 mb-10'>
				<Skeleton className='w-full aspect-[16/7] bg-gray-200/80 rounded-3xl' />
			</div>

			{/* Content Layout Skeleton */}
			<div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 items-start'>
					{/* Main Article Content (820px) */}
					<div className='w-full max-w-[820px] space-y-6'>
						<Skeleton className='h-24 w-full bg-gray-200/80 rounded-2xl' />
						<div className='bg-white p-8 rounded-[20px] border border-[#E5E7EB] space-y-4'>
							<Skeleton className='h-6 w-full bg-gray-200/80 rounded' />
							<Skeleton className='h-6 w-11/12 bg-gray-200/80 rounded' />
							<Skeleton className='h-6 w-4/5 bg-gray-200/80 rounded' />
							<Skeleton className='h-32 w-full bg-gray-200/80 rounded-2xl my-4' />
							<Skeleton className='h-6 w-full bg-gray-200/80 rounded' />
							<Skeleton className='h-6 w-3/4 bg-gray-200/80 rounded' />
						</div>
					</div>

					{/* Sidebar (320px) */}
					<aside className='w-full lg:w-[320px] space-y-5 shrink-0'>
						<div className='bg-white p-6 rounded-[20px] border border-[#E5E7EB] space-y-4'>
							<Skeleton className='h-6 w-40 bg-gray-200/80 rounded-lg' />
							{[1, 2, 3, 4, 5].map((i) => (
								<Skeleton key={i} className='h-8 w-full bg-gray-200/80 rounded-xl' />
							))}
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}

