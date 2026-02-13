import { MarketplaceContainer } from '@/components/pages/marketplace/marketplace-container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Marketplace | Find Fresh Farm Products',
	description:
		'Browse and purchase fresh farm products from verified local vendors',
};

export default function MarketplacePage() {
	return <MarketplaceContainer />;
}
