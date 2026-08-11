import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const OrderPageSkeleton = () => {
	return (
		<div className='min-h-screen bg-[#F7F6F0] py-8 sm:py-12'>
			<div className='container mx-auto px-4 max-w-6xl'>
				<div className='mb-8 border-b border-[#E5E7EB] pb-6 flex flex-col sm:flex-row justify-between gap-4'>
					<div>
						<Skeleton className='h-6 w-36 rounded-full mb-3' />
						<Skeleton className='h-9 w-64 mb-2' />
						<Skeleton className='h-4 w-80' />
					</div>
					<Skeleton className='h-10 w-64 rounded-2xl' />
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
					{/* Checkout form skeleton */}
					<div className='lg:col-span-7'>
						<div className='bg-white p-6 sm:p-8 rounded-[20px] border border-[#E5E7EB] shadow-xs space-y-6'>
							<Skeleton className='h-7 w-40 border-b pb-4 mb-6' />
							<div className='space-y-2'>
								<Skeleton className='h-4 w-28' />
								<Skeleton className='h-12 w-full rounded-[14px]' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-12 w-full rounded-[14px]' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-36' />
								<Skeleton className='h-24 w-full rounded-[14px]' />
							</div>
							<Skeleton className='h-13 w-full rounded-[14px] mt-6' />
						</div>
					</div>

					{/* Order summary skeleton */}
					<div className='lg:col-span-5 space-y-6'>
						<div className='bg-white p-6 rounded-[20px] border border-[#E5E7EB] shadow-xs'>
							<Skeleton className='h-6 w-40 mb-4' />
							<div className='space-y-4'>
								{[1, 2].map((i) => (
									<div key={i} className='flex justify-between gap-4 items-center'>
										<Skeleton className='h-[72px] w-[72px] rounded-[14px]' />
										<div className='flex-1 space-y-2'>
											<Skeleton className='h-4 w-3/4' />
											<Skeleton className='h-3 w-1/2' />
											<Skeleton className='h-4 w-1/3' />
										</div>
									</div>
								))}
							</div>
						</div>

						<div className='bg-[#FFF9E8] p-6 rounded-[20px] border border-[#F4B400]/30 space-y-4'>
							<Skeleton className='h-6 w-36 mb-4' />
							<Skeleton className='h-12 w-full rounded-xl' />
							<div className='space-y-3 pt-2'>
								<div className='flex justify-between'>
									<Skeleton className='h-4 w-20' />
									<Skeleton className='h-4 w-16' />
								</div>
								<div className='flex justify-between'>
									<Skeleton className='h-4 w-24' />
									<Skeleton className='h-4 w-16' />
								</div>
								<div className='flex justify-between pt-2 border-t'>
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
