import { Skeleton } from '@/components/ui/skeleton';

// Skeleton loader while data is being fetched
export function PostSkeleton() {
	// Skeleton component unchanged
	return (
		<div className='container mx-auto px-4 py-10'>
			<div className='mb-8'>
				<Skeleton className='h-4 w-1/3 mb-8' />
			</div>

			<div className='flex flex-col lg:flex-row gap-10'>
				<aside className='lg:w-1/4 order-2 lg:order-1'>
					<div className='sticky top-8 p-6 bg-gray-50 rounded-xl'>
						<Skeleton className='h-6 w-1/2 mb-6' />
						<div className='space-y-3'>
							{[1, 2, 3, 4, 5].map((i) => (
								<Skeleton key={i} className='h-4 w-full' />
							))}
						</div>
					</div>
				</aside>

				<div className='lg:w-3/4 order-1 lg:order-2'>
					<div className='mb-10'>
						<div className='flex gap-2 mb-6'>
							<Skeleton className='h-6 w-20 rounded-full' />
							<Skeleton className='h-6 w-20 rounded-full' />
						</div>

						<Skeleton className='h-12 w-full mb-3' />
						<Skeleton className='h-12 w-3/4 mb-6' />

						<div className='flex gap-4 mb-8'>
							<Skeleton className='h-4 w-32' />
							<Skeleton className='h-4 w-32' />
						</div>

						<Skeleton className='h-[400px] w-full mb-10 rounded-xl' />
					</div>

					<div className='space-y-6'>
						{[1, 2, 3, 4, 5, 6, 7].map((i) => (
							<Skeleton key={i} className='h-6 w-full' />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
