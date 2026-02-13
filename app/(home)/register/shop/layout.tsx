'use client';

import { VendorOnly } from '@/components/auth/protected/protected-page';
import { useSession } from '@/components/providers/session-provider';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ShopRegistrationLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [shouldRender, setShouldRender] = useState<boolean | null>(null);

	useEffect(() => {
		// Wait for session to be loaded
		if (status === 'loading') return;

		// Check if user is logged in as vendor and has a storeId
		if (
			status === 'authenticated' &&
			session?.user?.role === 'vendor' &&
			session.user.storeId !== null
		) {
			// Use router.replace instead of redirect for client-side
			// This prevents the page from being added to history
			router.replace('/vendor/dashboard');
		} else if (status === 'authenticated' && session?.user?.role === 'vendor') {
			// Only render children if the vendor doesn't have a store
			setShouldRender(true);
		} else {
			// Still loading or not authenticated as vendor
			setShouldRender(false);
		}
	}, [session, status, router]);

	// Show loading until we've made a decision about rendering
	if (shouldRender === null || status === 'loading') {
		return (
			<div className='h-screen w-screen flex items-center justify-center'>
				<Spinner>Checking vendor status...</Spinner>
			</div>
		);
	}

	// If not authorized, VendorOnly will handle the redirect
	return (
		<VendorOnly>
			<div className='container mx-auto py-8'>
				<div className='max-w-5xl mx-auto'>
					{shouldRender ? (
						children
					) : (
						<div className='h-screen w-screen flex items-center justify-center'>
							<Spinner>Loading registration form...</Spinner>
						</div>
					)}
				</div>
			</div>
		</VendorOnly>
	);
}
