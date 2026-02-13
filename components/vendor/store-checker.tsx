'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/providers/session-provider';
import { Spinner } from '../ui/spinner';

export const StoreChecker = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Skip if still loading session
    if (status === 'loading') return;

    // Check if user has a store
    if (status === 'authenticated' && 
        session?.user?.role === 'vendor' && 
        !session.user.storeId) {
      // Redirect immediately to prevent flash of content
      router.replace('/register/shop');
    } else {
      // Only mark as checked if session loading is complete
      setIsChecked(true);
    }
  }, [session, status, router]);

  // Always show loading screen until explicitly checked
  // This prevents the flash of content before redirect
  if (!isChecked || status === 'loading') {
    return (
			<div className='h-screen w-screen flex items-center justify-center'>
				<Spinner>Checking vendor status...</Spinner>
			</div>
		);
  }

  // If we get here, we know the vendor has a store
  return <>{children}</>;
};