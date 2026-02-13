'use client';

import React, { useState, useTransition } from 'react';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui

export const RefreshButton = () => {
	const [isPending, startTransition] = useTransition();
	const [message, setMessage] = useState<string | null>(null);
	const [isError, setIsError] = useState<boolean>(false);
	const { update } = useSession(); // Get update function to refresh client state

	const handleRefresh = () => {
		setMessage(null); // Clear previous message
		setIsError(false);

		startTransition(async () => {
			try {
				console.log('RefreshButton: Initiating manual refresh...');
				const response = await fetch('/api/auth/refresh', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					// No body needed, relies on cookies
				});

				const responseData = await response.json(); // Try to parse JSON regardless of status

				if (!response.ok) {
					console.error(
						'RefreshButton: Refresh API call failed.',
						response.status,
						responseData
					);
					setMessage(
						responseData?.message ||
							`Refresh failed (Status: ${response.status})`
					);
					setIsError(true);
				} else {
					console.log(
						'RefreshButton: Refresh API call successful.',
						responseData
					);
					setMessage(responseData?.message || 'Tokens refreshed successfully!');
					setIsError(false);
					// Trigger session update on the client to fetch new data
					await update(responseData?.session || null);
					console.log('RefreshButton: Client session updated.');
				}
			} catch (error) {
				console.error('RefreshButton: Error calling refresh API:', error);
				setMessage('An unexpected error occurred during refresh.');
				setIsError(true);
			}
		});
	};

	return (
		<div className='flex flex-col items-start space-y-2'>
			<Button onClick={handleRefresh} disabled={isPending} variant='secondary'>
				{isPending ? 'Refreshing...' : 'Manual Refresh Tokens'}
			</Button>
			{message && (
				<p className={`text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
					{message}
				</p>
			)}
		</div>
	);
};
