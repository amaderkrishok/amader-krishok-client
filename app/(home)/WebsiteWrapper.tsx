'use client';

import { Footer } from '@/components/global/footer';
import { NavBar } from '@/components/global/nav-bar';

export function WebsiteWrapper({
	children,
	navClassName = 'bg-gray-800', // Default background color for navbar
}: Readonly<{
	children: React.ReactNode;
	navClassName?: string;
}>) {
	return (
		<div className='flex flex-col min-h-screen'>
			{/* Navigation Bar */}
			<div className={`fixed top-0 w-full z-50 ${navClassName}`}>
				<NavBar />
			</div>

			{/* Content */}
			<div className='pt-[88px] flex-grow'>{children}</div>

			{/* Footer */}
			<Footer />
		</div>
	);
}
