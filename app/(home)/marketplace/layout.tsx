import type React from 'react';

export default function MarketplaceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className='min-h-screen'>{children}</div>
		</div>
	);
}
