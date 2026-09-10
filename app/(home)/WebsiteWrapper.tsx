'use client';

import { Footer } from '@/components/global/footer';
import { NavBar } from '@/components/global/nav-bar';

export function WebsiteWrapper({
	children,
	navClassName = '',
}: Readonly<{
	children: React.ReactNode;
	navClassName?: string;
}>) {
	return (
		<div className='flex flex-col min-h-screen relative bg-[#FAF9F3] text-[#172033] selection:bg-[#F5B800] selection:text-[#172033]'>
			{/* Navigation Bar */}
			<NavBar navClassName={navClassName} />

			{/* Main Content */}
			<div className='flex-grow'>{children}</div>

			{/* Footer */}
			<Footer />
		</div>
	);
}
