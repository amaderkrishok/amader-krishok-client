import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const OrderPageSkeleton = () => {
	return (
		<div className='container mx-auto px-4 py-10 max-w-6xl'>
			<Skeleton className='h-10 w-64 mb-8' />

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Checkout form skeleton */}
				<div className='lg:col-span-2'>
					<div className='space-y-6'>
						<div className='space-y-3'>
							<Skeleton className='h-5 w-32' />
							<Skeleton className='h-12 w-full' />
						</div>
						<div className='space-y-3'>
							<Skeleton className='h-5 w-40' />
							<Skeleton className='h-12 w-full' />
						</div>
						<div className='space-y-3'>
							<Skeleton className='h-5 w-36' />
							<Skeleton className='h-24 w-full' />
						</div>
						<Skeleton className='h-12 w-40 mt-8' />
					</div>
				</div>

				{/* Order summary skeleton */}
				<div>
					<div className='sticky top-6'>
						<div className='bg-white/20 p-6 rounded-lg border mb-6'>
							<Skeleton className='h-6 w-40 mb-4' />
							<div className='space-y-4'>
								{[1, 2].map((i) => (
									<div key={i} className='flex justify-between gap-4'>
										<Skeleton className='h-16 w-16 rounded' />
										<div className='flex-1'>
											<Skeleton className='h-4 w-3/4 mb-2' />
											<Skeleton className='h-4 w-1/2 mb-2' />
											<Skeleton className='h-4 w-1/4' />
										</div>
									</div>
								))}
							</div>
						</div>

						<div className='bg-white/20 p-6 rounded-lg border'>
							<Skeleton className='h-6 w-40 mb-4' />
							<div className='space-y-3'>
								<div className='flex justify-between'>
									<Skeleton className='h-5 w-20' />
									<Skeleton className='h-5 w-16' />
								</div>
								<div className='flex justify-between'>
									<Skeleton className='h-5 w-24' />
									<Skeleton className='h-5 w-16' />
								</div>
								<div className='flex justify-between'>
									<Skeleton className='h-6 w-28' />
									<Skeleton className='h-6 w-20' />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderPageSkeleton;
