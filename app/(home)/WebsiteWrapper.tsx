'use client';

import { Footer } from '@/components/global/footer';
import { NavBar } from '@/components/global/nav-bar';
import { OvijogModal } from '@/components/global/ovijog-modal';
import { WhatsAppSupport } from '@/components/global/whatsapp-support';

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

			{/* Floating Ovijog Box */}
			<OvijogModal />

			{/* Floating WhatsApp Support Widget */}
			<WhatsAppSupport />

			{/* Footer */}
			<Footer />
		</div>
	);
}
