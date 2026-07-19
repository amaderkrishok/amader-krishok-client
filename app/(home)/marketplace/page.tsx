import { MarketplaceContainer } from '@/components/pages/marketplace/marketplace-container';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Marketplace | Find Fresh Farm Products',
	description:'Browse and purchase fresh farm products from verified local vendors'};

export default function MarketplacePage() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>}>
			<MarketplaceContainer />
		</Suspense>
	);
}
