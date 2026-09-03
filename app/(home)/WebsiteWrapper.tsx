'use client';

import { Footer } from '@/components/global/footer';
import { NavBar } from '@/components/global/nav-bar';
import { OvijogModal } from '@/components/global/ovijog-modal';
import { WhatsAppSupport } from '@/components/global/whatsapp-support';

export function WebsiteWrapper({
	children,
	navClassName = 'bg-gray-800', // Default background color for navbar
}: Readonly<{
	children: React.ReactNode;
	navClassName?: string;
}>) {
	return (
		<div className='flex flex-col min-h-screen relative'>
			{/* Navigation Bar */}
			<div className={`fixed top-0 w-full z-50 ${navClassName}`}>
				<NavBar />
			</div>

			{/* Content */}
			<div className='pt-[88px] flex-grow'>{children}</div>

			{/* Floating Ovijog Box */}
			<OvijogModal />

			{/* Floating WhatsApp Support Widget */}
			<WhatsAppSupport />

			{/* Footer */}
			<Footer />
		</div>
	);
}
