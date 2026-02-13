'use client';

import { useSession } from '@/components/providers/session-provider';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCcw, RotateCw, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DebugSessionPage() {
	const {
		data: session,
		status,
		update: updateSession,
		refreshSession,
		logout,
	} = useSession();
	const [refreshKey, setRefreshKey] = useState(0);
	const [loading, setLoading] = useState(false);
	const [tokenLoading, setTokenLoading] = useState(false); // Add state for token refresh
	const [manualNameValue, setManualNameValue] = useState('');
	const [logoutLoading, setLogoutLoading] = useState(false);

	const router = useRouter();

	// Only allow admin users, otherwise redirect to not-found
	useEffect(() => {
		if (status === 'authenticated' && session?.user?.role !== 'admin') {
			router.replace('/not-found');
		}
	}, [status, session, router]);

	
	const refreshSessionFromServer = async () => {
		setLoading(true);
		try {
			// Force a session refresh from server
			await updateSession();
			// Update the refresh key to force re-render
			setRefreshKey((prev) => prev + 1);
			console.log('Session refreshed from server');
		} catch (error) {
			console.error('Error refreshing session:', error);
		} finally {
			setLoading(false);
		}
	};

	// New handler for token refresh button
	const handleTokenRefresh = async () => {
		setTokenLoading(true);
		try {
			const result = await refreshSession();
			if (result) {
				console.log('Token refreshed successfully');
				// Update the refresh key to force re-render the UI
				setRefreshKey((prev) => prev + 1);
			} else {
				console.error('Token refresh failed');
			}
		} catch (error) {
			console.error('Error refreshing token:', error);
		} finally {
			setTokenLoading(false);
		}
	};

	const handleLogout = async () => {
		setLogoutLoading(true);
		try {
			await logout();
			console.log('Logged out successfully');

			setRefreshKey((prev) => prev + 1);
		} catch (error) {
			console.error('Error logging out:', error);
		} finally {
			setLogoutLoading(false);
		}
	};

	const testSessionUpdate = async () => {
		if (!session) return;

		setLoading(true);
		try {
			// Create a test update
			const updatedSession = {
				...session,
				user: {
					...session.user,
					name: manualNameValue || session.user.name + ' (Updated)',
				},
			};

			// Update in memory
			await updateSession(updatedSession);

			// Also update on server
			await fetch('/api/auth/session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedSession),
			});

			console.log('Session updated manually');
			setManualNameValue('');
		} catch (error) {
			console.error('Error updating session:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='container py-10'>
			<Card className='mb-8'>
				<CardHeader>
					<CardTitle className='flex items-center justify-between'>
						Session Debug Page
						<div className='flex gap-2'>
							{status === 'authenticated' && (
								<Button
									variant='outline'
									className='border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2'
									onClick={handleLogout}
									disabled={logoutLoading}
								>
									<LogOut
										size={16}
										className={logoutLoading ? 'animate-spin' : ''}
									/>
									Logout
								</Button>
							)}

							{/* Add token refresh button */}
							<Button
								variant='destructive' // Red button
								onClick={handleTokenRefresh}
								disabled={tokenLoading || status !== 'authenticated'}
								className='flex items-center gap-2'
							>
								<RotateCw
									size={16}
									className={tokenLoading ? 'animate-spin' : ''}
								/>
								Refresh Token
							</Button>

							{/* Existing session refresh button */}
							<Button
								variant='outline'
								onClick={refreshSessionFromServer}
								disabled={loading}
								className='flex items-center gap-2'
							>
								<RefreshCcw
									size={16}
									className={loading ? 'animate-spin' : ''}
								/>
								Refresh Session
							</Button>
						</div>
					</CardTitle>
					<CardDescription>
						Current Session Status: <span className='font-bold'>{status}</span>
						<br />
						This page shows your current session data for debugging purposes.
					</CardDescription>
				</CardHeader>

				{/* Add token expiry info card */}
				{session?.expires && (
					<div className='px-6 mb-4'>
						<div
							className={`p-3 rounded-md border ${
								session.expires - Date.now() < 5 * 60 * 1000
									? 'bg-red-50 border-red-200 text-red-700'
									: 'bg-green-50 border-green-200 text-green-700'
							}`}
						>
							<div className='flex items-center justify-between'>
								<div>
									<strong>Token expires:</strong>{' '}
									{new Date(session.expires).toLocaleTimeString()}
									<span className='ml-2'>
										({Math.floor((session.expires - Date.now()) / 1000 / 60)}{' '}
										minutes remaining)
									</span>
								</div>
								{session.expires - Date.now() < 5 * 60 * 1000 && (
									<Button
										variant='destructive'
										size='sm'
										onClick={handleTokenRefresh}
										disabled={tokenLoading}
									>
										Refresh Now
									</Button>
								)}
							</div>
						</div>
					</div>
				)}

				<CardContent>
					<Tabs defaultValue='formatted' className='w-full'>
						<TabsList className='grid w-full grid-cols-2'>
							<TabsTrigger value='formatted'>Formatted</TabsTrigger>
							<TabsTrigger value='raw'>Raw JSON</TabsTrigger>
						</TabsList>
						<TabsContent value='formatted' className='space-y-4'>
							{status === 'authenticated' && session ? (
								<div className='space-y-6' key={refreshKey}>
									<div>
										<h3 className='text-lg font-medium'>User Information</h3>
										<div className='grid gap-2 mt-2'>
											<div className='grid grid-cols-3 gap-4'>
												<div className='font-medium'>ID</div>
												<div className='col-span-2'>{session.user?.id}</div>
											</div>
											<div className='grid grid-cols-3 gap-4'>
												<div className='font-medium'>Name</div>
												<div className='col-span-2'>{session.user?.name}</div>
											</div>
											<div className='grid grid-cols-3 gap-4'>
												<div className='font-medium'>Phone</div>
												<div className='col-span-2'>
													{session.user?.phoneNumber}
												</div>
											</div>
											<div className='grid grid-cols-3 gap-4'>
												<div className='font-medium'>Role</div>
												<div className='col-span-2'>{session.user?.role}</div>
											</div>
											<div className='grid grid-cols-3 gap-4'>
												<div className='font-medium'>Store Id</div>
												<div className='col-span-2'>
													{session.user?.storeId}
												</div>
											</div>
											<div className='grid grid-cols-3 gap-4'>
												<div className='font-medium'>Image</div>
												<div className='col-span-2 break-all'>
													{session.user?.image}
												</div>
											</div>
										</div>
									</div>

									<div>
										<h3 className='text-lg font-medium'>Session Information</h3>
										<div className='grid gap-2 mt-2'>
											<div className='grid grid-cols-3 gap-4'>
												<div className='font-medium'>
													Access Token (Preview)
												</div>
												<div className='col-span-2'>
													{session.accessToken
														? `${session.accessToken.substring(0, 20)}...`
														: 'None'}
												</div>
											</div>
											<div className='grid grid-cols-3 gap-4'>
												<div className='font-medium'>Expires</div>
												<div className='col-span-2'>
													{session.expires
														? new Date(session.expires).toLocaleString()
														: 'None'}
												</div>
											</div>
											<div className='grid grid-cols-3 gap-4'>
												<div className='font-medium'>Time Until Expiry</div>
												<div className='col-span-2'>
													{session.expires
														? `${Math.floor(
																(new Date(session.expires).getTime() -
																	Date.now()) /
																	1000 /
																	60
														  )} minutes`
														: 'None'}
												</div>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className='text-center py-8 text-muted-foreground'>
									No authenticated session found
								</div>
							)}
						</TabsContent>
						<TabsContent value='raw'>
							<div className='relative'>
								<pre className='p-4 rounded bg-muted overflow-auto max-h-[500px]'>
									{JSON.stringify(session, null, 2)}
								</pre>
								{status === 'loading' && (
									<div className='absolute inset-0 bg-background/80 flex items-center justify-center'>
										Loading...
									</div>
								)}
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
				<CardFooter className='flex flex-col items-stretch gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='manual-name'>Test Name Update</Label>
						<div className='flex gap-2'>
							<Input
								id='manual-name'
								placeholder='Enter a new name'
								value={manualNameValue}
								onChange={(e) => setManualNameValue(e.target.value)}
								disabled={loading || status !== 'authenticated'}
							/>
							<Button
								onClick={testSessionUpdate}
								disabled={loading || status !== 'authenticated'}
							>
								Test Update
							</Button>
						</div>
					</div>

					<div className='text-xs text-muted-foreground'>
						Note: This page is for development purposes only and should be
						removed in production.
						<br />
						Last Refreshed: {new Date().toLocaleTimeString()}
					</div>
				</CardFooter>
			</Card>

			{session?.user?.image && (
				<div className='bg-card p-4 rounded-md shadow'>
					<h3 className='text-lg font-medium mb-2'>User Image Preview</h3>
					<div className='border rounded overflow-hidden max-w-md'>
						<img
							src={session.user.image}
							alt={session.user.name || 'User'}
							className='w-full h-auto'
						/>
					</div>
				</div>
			)}
		</div>
	);
}
