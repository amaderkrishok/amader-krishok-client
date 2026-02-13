'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/providers/session-provider';
// Assuming you have a Button component (e.g., from shadcn/ui)
import { Button } from '@/components/ui/button';

export const LogoutButton = () => {
	const [isPending, startTransition] = useTransition();
	const { update } = useSession();
	const router = useRouter();

	const handleLogout = () => {
		startTransition(async () => {
		  try {
			console.log('LogoutButton: Initiating logout...');
			await fetch('/api/auth/logout', {
			  method: 'POST',
			});
		  } catch (error) {
			console.error('LogoutButton: Error calling logout API:', error);
		  } finally {
			console.log('LogoutButton: Updating client session and redirecting.');
			await update(null); // Clear client session
			
			// Use direct browser navigation instead of Next.js router
			window.location.href = '/';
		  }
		});
	  };

	return (
		<Button
			size='sm'
			onClick={handleLogout}
			disabled={isPending}
			variant='link'
		>
			{isPending ? 'Logging out...' : 'Logout'}
		</Button>
	);
};
