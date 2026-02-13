'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useChatContext } from '@/hooks/useChatContext';
import { socketService } from '@/services/chat/socket-service';

/**
 * Debug component for testing presence functionality
 */
export function PresenceDebugPanel() {
	const {
		allRooms,
		onlineUsersGlobal,
		refreshAllPresence,
		requestPresenceUpdate,
		globalConnectionStatus,
		totalUnreadCount,
		refreshRooms,
		refreshUnreadCounts,
	} = useChatContext();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [diagnostics, setDiagnostics] = useState<string[]>([]);

	const addDiagnostic = (message: string) => {
		const timestamp = new Date().toLocaleTimeString();
		setDiagnostics((prev) => [
			`[${timestamp}] ${message}`,
			...prev.slice(0, 9),
		]);
	};

	const handleRefreshAll = async () => {
		setIsRefreshing(true);
		addDiagnostic('🔄 Starting presence refresh...');
		try {
			await refreshAllPresence();
			addDiagnostic('✅ Presence refresh completed');
		} catch (error) {
			addDiagnostic(`❌ Presence refresh failed: ${error}`);
		} finally {
			setIsRefreshing(false);
		}
	};

	const handleTestSpecific = async (userId: string) => {
		addDiagnostic(`🔍 Testing presence for user: ${userId}`);
		try {
			await requestPresenceUpdate(userId);
			addDiagnostic(`✅ Manual presence test completed for ${userId}`);
		} catch (error) {
			addDiagnostic(`❌ Failed to test user ${userId}: ${error}`);
		}
	};

	const testSocketConnection = () => {
		addDiagnostic(`🔗 Socket connected: ${socketService.isConnected()}`);
		addDiagnostic(`🔗 Global connection status: ${globalConnectionStatus}`);

		// Test a simple socket emission
		try {
			if (socketService.isConnected()) {
				addDiagnostic('📡 Testing socket emit...');
				// We could emit a ping or status check here if the backend supports it
			} else {
				addDiagnostic('❌ Socket not connected - cannot test');
			}
		} catch (error) {
			addDiagnostic(`❌ Socket test failed: ${error}`);
		}
	};

	const clearDiagnostics = () => {
		setDiagnostics([]);
	};

	return (
		<Card className='p-4 m-4'>
			<h3 className='font-bold mb-4'>🐛 Presence Debug Panel</h3>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
				<Button onClick={handleRefreshAll} disabled={isRefreshing}>
					{isRefreshing ? 'Refreshing...' : 'Refresh All Presence'}
				</Button>

				<Button onClick={testSocketConnection} variant='outline'>
					Test Socket Connection
				</Button>

				<Button onClick={clearDiagnostics} variant='secondary'>
					Clear Diagnostics
				</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
				<Button
					onClick={async () => {
						addDiagnostic('🔄 Refreshing rooms...');
						try {
							await refreshRooms();
							addDiagnostic('✅ Rooms refreshed');
						} catch (error) {
							addDiagnostic(`❌ Rooms refresh failed: ${error}`);
						}
					}}
					variant='outline'
				>
					Refresh Rooms
				</Button>

				<Button
					onClick={async () => {
						addDiagnostic('🔄 Refreshing unread counts...');
						try {
							await refreshUnreadCounts();
							addDiagnostic('✅ Unread counts refreshed');
						} catch (error) {
							addDiagnostic(`❌ Unread refresh failed: ${error}`);
						}
					}}
					variant='outline'
				>
					Refresh Unread Counts
				</Button>
			</div>

			{/* Diagnostics Log */}
			<div className='mb-4'>
				<h4 className='font-semibold mb-2'>📋 Diagnostics Log:</h4>
				<div className='bg-gray-900 text-green-400 p-3 rounded text-xs font-mono h-32 overflow-y-auto'>
					{diagnostics.length > 0 ? (
						diagnostics.map((log, index) => <div key={index}>{log}</div>)
					) : (
						<div className='text-gray-500'>No diagnostics yet...</div>
					)}
				</div>
			</div>

			<div className='mb-4'>
				<h4 className='font-semibold mb-2'>📊 Current Online Users:</h4>
				<p className='text-sm text-muted-foreground mb-2'>
					Total online: {onlineUsersGlobal.size} | Socket:{' '}
					{socketService.isConnected() ? '🟢' : '🔴'} | Status:{' '}
					{globalConnectionStatus} | Total Unread: {totalUnreadCount}
				</p>
				{onlineUsersGlobal.size > 0 ? (
					<div className='space-y-1 max-h-40 overflow-y-auto'>
						{Array.from(onlineUsersGlobal.entries()).map(
							([userId, presence]) => (
								<div
									key={userId}
									className='text-xs p-2 bg-green-50 rounded border-l-2 border-green-500'
								>
									<strong>User ID:</strong> {userId}
									<br />
									<strong>Online:</strong> {presence.isOnline ? '✅' : '❌'}
									<br />
									<strong>Last Seen:</strong>{' '}
									{presence.lastSeen?.toString() || 'N/A'}
								</div>
							)
						)}
					</div>
				) : (
					<p className='text-xs text-gray-500'>No users currently online</p>
				)}
			</div>

			<div className='mb-4'>
				<h4 className='font-semibold mb-2'>
					👥 All Chat Participants & Unread Counts:
				</h4>
				{allRooms.length > 0 ? (
					<div className='space-y-1 max-h-40 overflow-y-auto'>
						{allRooms.map((room) => {
							const isOnline = onlineUsersGlobal.has(room.participant.id);
							return (
								<div
									key={room.id}
									className={`text-xs p-2 rounded border-l-2 ${
										isOnline
											? 'bg-green-50 border-green-500'
											: 'bg-gray-50 border-gray-300'
									}`}
								>
									<div className='flex justify-between items-center'>
										<div>
											<strong>ID:</strong> {room.participant.id}
											<br />
											<strong>Role:</strong> {room.participant.role}
											<br />
											<strong>Status:</strong>{' '}
											{isOnline ? '🟢 Online' : '🔴 Offline'}
											<br />
											<strong>Unread:</strong>{' '}
											<span
												className={
													room.unreadCount > 0
														? 'text-red-600 font-bold'
														: 'text-gray-500'
												}
											>
												{room.unreadCount}
											</span>
										</div>
										<Button
											size='sm'
											variant='outline'
											onClick={() => handleTestSpecific(room.participant.id)}
										>
											Test
										</Button>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<p className='text-xs text-gray-500'>No chat rooms found</p>
				)}
			</div>

			<div className='text-xs text-muted-foreground'>
				<p>
					<strong>How to use:</strong>
				</p>
				<ul className='list-disc list-inside space-y-1'>
					<li>&ldquo;Refresh All&rdquo; fetches current presence from API</li>
					<li>&ldquo;Test&rdquo; buttons check individual user presence</li>
					<li>Green = online, Gray = offline</li>
					<li>Check browser console for detailed logs</li>
					<li>Watch diagnostics log for real-time events</li>
				</ul>
			</div>
		</Card>
	);
}
