import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Store } from '@/types/store';
import { StoreService } from '@/services/store-service';

interface StoreCardProps {
	store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
	const storeImageUrl = StoreService.getStoreImageUrl(store);

	return (
		<Link href={`/marketplace/stores/${store.id}`} className='block h-full'>
			<Card className='overflow-hidden h-full hover:shadow-md transition-shadow'>
				<div className='relative aspect-video overflow-hidden'>
					<Image
						src={storeImageUrl || '/placeholder.svg'}
						alt={store.name}
						fill
						className='object-cover transition-transform hover:scale-105'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					/>
				</div>
				<CardContent className='p-4'>
					<h3 className='font-semibold text-lg mb-1'>{store.name}</h3>
					<p className='text-sm text-gray-500 mb-2'>
						{store.district || 'অজানা জেলা'}, {store.division || 'অজানা বিভাগ'}
					</p>
					<p className='text-sm text-gray-600 line-clamp-2'>
						{store.description || 'কোন বিবরণ নেই।'}
					</p>
				</CardContent>
			</Card>
		</Link>
	);
}
