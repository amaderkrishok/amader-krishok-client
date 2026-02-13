import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Store } from '@/types/store';
import { StoreService } from '@/services/store-service';
import { SendMessageButton } from '@/components/chat/send-message-button';

interface StoreHeaderProps {
	store: Store;
}

export function StoreHeader({ store }: StoreHeaderProps) {
	const coverImageUrl = StoreService.getStoreCoverUrl(store);
	const storeImageUrl = StoreService.getStoreImageUrl(store);

	return (
		<Card className='overflow-hidden'>
			<div className='relative h-48 md:h-64 w-full'>
				<Image
					src={coverImageUrl}
					alt={`${store.name} cover`}
					fill
					className='object-cover'
					priority
				/>
			</div>

			<CardContent className='p-6'>
				<div className='flex flex-col md:flex-row gap-6'>
					<div className='relative h-24 w-24 rounded-lg overflow-hidden border-4 border-white -mt-16'>
						<Image
							src={storeImageUrl}
							alt={store.name}
							fill
							className='object-cover'
							priority
						/>
					</div>

					<div className='flex-1'>
						<h1 className='text-2xl md:text-3xl font-bold'>{store.name}</h1>
						<p className='text-gray-500 mt-1'>
							{store.address || 'ঠিকানা নেই'} • {store.district || ''},{' '}
							{store.division || ''}
						</p>

						<SendMessageButton
							participantId={store.ownerId ?? ''}
							participantName={store.name}
							variant='outline'
							size='sm'
							className='ml-auto'
						/>

						<div className='mt-4'>
							<h2 className='font-medium text-lg mb-2'>দোকান সম্পর্কে</h2>
							<p className='text-gray-700 whitespace-pre-line'>
								{store.description || 'কোন বিবরণ প্রদান করা হয়নি।'}
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
