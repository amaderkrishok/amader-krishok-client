import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function ProductCardSkeleton() {
	return (
		<Card className='overflow-hidden h-full flex flex-col rounded-[18px] border border-[#E5E7EB] shadow-xs bg-white'>
			<Skeleton className='aspect-square w-full rounded-none bg-gray-200/70' />
			<CardContent className='flex-grow p-3 xl:p-2.5 2xl:p-3 flex flex-col justify-between space-y-1.5 xl:space-y-1 2xl:space-y-2'>
				<div>
					<Skeleton className='h-4 w-3/4 mb-2 bg-gray-200/70 rounded' />
					<div className='flex gap-1.5 mb-2'>
						<Skeleton className='h-3 w-16 bg-gray-200/70 rounded' />
						<Skeleton className='h-3 w-12 bg-gray-200/70 rounded' />
					</div>
					<div className='flex gap-1.5 mb-2'>
						<Skeleton className='h-4 w-16 bg-gray-200/70 rounded' />
						<Skeleton className='h-4 w-14 bg-gray-200/70 rounded' />
					</div>
				</div>
				<div className='pt-1 border-t border-gray-100'>
					<Skeleton className='h-5 w-20 bg-gray-200/70 rounded' />
				</div>
			</CardContent>
			<CardFooter className='p-3 xl:p-2.5 2xl:p-3 pt-0 mt-auto bg-transparent'>
				<Skeleton className='h-8 sm:h-9 xl:h-8 2xl:h-9 w-full rounded-xl bg-gray-200/70' />
			</CardFooter>
		</Card>
	);
}
