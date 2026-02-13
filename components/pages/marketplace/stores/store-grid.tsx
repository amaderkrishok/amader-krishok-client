import type { Store } from '@/types/store';
import { StoreCard } from './store-card';

interface StoreGridProps {
	stores: Store[];
	isLoading?: boolean;
}

export function StoreGrid({ stores, isLoading = false }: StoreGridProps) {
	if (isLoading) {
		return (
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{Array.from({ length: 6 }).map((_, index) => (
					<div
						key={index}
						className='h-64 bg-gray-200 animate-pulse rounded-lg'
					></div>
				))}
			</div>
		);
	}

	if (stores.length === 0) {
		return (
			<div className='text-center py-12'>
				<h3 className='text-lg font-medium text-gray-900'>No stores found</h3>
				<p className='mt-2 text-sm text-gray-500'>
					Please check back later for new stores.
				</p>
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{stores.map((store) => (
				<StoreCard key={store.id} store={store} />
			))}
		</div>
	);
}
