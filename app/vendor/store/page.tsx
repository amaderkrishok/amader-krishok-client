'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/components/providers/session-provider';
import { StoreManagementProvider } from '@/components/dashbaord/store/store-management-context';
import { StoreManagementDashboard } from '@/components/dashbaord/store/store-management-dashboard';
import { VendorNoStoreView } from '@/components/dashbaord/store/vendor-no-store-view';


export default function VendorStorePage() {
	const { user, isLoading } = useSession();
	const [hasStore, setHasStore] = useState<boolean | null>(null);
	const [initializing, setInitializing] = useState(true);

	useEffect(() => {
		// Only check if vendor has a store when user data is available
		if (user && !isLoading) {
			// Check if vendor has a store
			setHasStore(!!user.storeId);
			setInitializing(false);
		}
	}, [user, isLoading]);

	// Show loading state while checking store status
	if (isLoading || initializing) {
		return ;
	}

	// Vendor without a store sees a special view
	if (hasStore === false) {
		return (
			<>
				
				<VendorNoStoreView />
			</>
		);
	}

	// Vendor with a store sees the store management dashboard
	return (
		<>
			

			<StoreManagementProvider
				storeId={user?.storeId ?? undefined}
				userRole='vendor'
				viewMode='vendor'
			>
				<StoreManagementDashboard />
			</StoreManagementProvider>
		</>
	);
}
