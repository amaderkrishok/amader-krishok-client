import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function ProductCardSkeleton() {
	return (
		<Card className='overflow-hidden h-full flex flex-col rounded-xl border border-gray-100 shadow-sm'>
			<Skeleton className='aspect-[4/3] w-full rounded-none' />
			<CardContent className='flex-grow p-3 pb-1'>
				<Skeleton className='h-4 w-3/4 mb-1.5' />
				<Skeleton className='h-3 w-full mb-2' />
				<div className='flex gap-1 mt-auto'>
					<Skeleton className='h-4 w-12 rounded' />
					<Skeleton className='h-4 w-10 rounded' />
				</div>
			</CardContent>
			<CardFooter className='p-3 pt-2 flex items-center justify-between gap-2 border-t border-gray-100/80 mt-auto bg-gray-50/30'>
				<Skeleton className='h-5 w-16' />
				<Skeleton className='h-8 w-20 rounded-lg' />
			</CardFooter>
		</Card>
	);
}
