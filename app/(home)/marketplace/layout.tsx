import { CartDrawer } from '@/components/pages/marketplace/cart/cart-drawer';
import { FloatingCartButton } from '@/components/pages/marketplace/cart/floating-cart-button';
import type React from 'react';


export default function MarketplaceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div>
				<div className='min-h-screen'>{children}</div>
			</div>
			<FloatingCartButton />
			<CartDrawer />
		</>
	);
}
