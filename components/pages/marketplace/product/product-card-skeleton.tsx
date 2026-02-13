import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function ProductCardSkeleton() {
	return (
		<Card className='overflow-hidden h-full flex flex-col'>
			<Skeleton className='aspect-square w-full' />
			<CardContent className='flex-grow p-4'>
				<Skeleton className='h-6 w-3/4 mb-2' />
				<Skeleton className='h-4 w-full mb-1' />
				<Skeleton className='h-4 w-2/3 mb-2' />
				<Skeleton className='h-4 w-1/2' />
			</CardContent>
			<CardFooter className='p-4 pt-0 flex items-center justify-between'>
				<Skeleton className='h-6 w-16' />
				<Skeleton className='h-9 w-24' />
			</CardFooter>
		</Card>
	);
}
