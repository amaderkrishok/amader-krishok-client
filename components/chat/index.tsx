'use client';

import { useState } from 'react';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Loader2, RotateCw, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ChatList } from './chat-list';
import { ChatMessageArea } from './chat-message-area';
import { ChatInfoPanel } from './chat-info-panel';
import { useChatContext } from '@/hooks/useChatContext';

// Simple mobile check
function isMobileDevice() {
	return (
		typeof navigator !== 'undefined' &&
		/Mobi|Android/i.test(navigator.userAgent)
	);
}

export function ChatInterface() {
	const { user, hasRole } = useSession();
	const {
		allRooms,
		activeRoomId,
		globalConnectionStatus,
		setActiveRoom,
		refreshRooms,
	} = useChatContext();

	const [showChatList, setShowChatList] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const isMobile = isMobileDevice();
	const isReadOnly = hasRole('ADMIN') || hasRole('MOD');

	// Handle room selection
	async function handleSelectRoom(roomId: string) {
		try {
			setActiveRoom(roomId);

			if (isMobile) {
				setShowChatList(false); // Hide list on mobile when room selected
			}
		} catch (err) {
			console.error('Failed to select room:', err);
			toast.error('Failed to join conversation', {
				description: 'Please try again',
			});
		}
	}

	// Handle retry connection
	async function handleRetry() {
		try {
			setIsLoading(true);
			await refreshRooms();
		} catch (err) {
			console.error('Failed to retry:', err);
		} finally {
			setIsLoading(false);
		}
	}

	// Check authentication
	if (!user) {
		return (
			<Card className='p-6 text-center'>
				<Alert>
					<AlertTitle>Authentication Required</AlertTitle>
					<p className='text-muted-foreground mt-2'>
						Please log in to access the messaging system.
					</p>
				</Alert>
			</Card>
		);
	}

	// Show connection error if failed
	if (
		globalConnectionStatus === 'error' ||
		globalConnectionStatus === 'disconnected'
	) {
		return (
			<Card className='p-6 text-center'>
				<Alert variant='destructive'>
					<AlertTitle>Connection Error</AlertTitle>
					<p className='text-muted-foreground mt-2'>
						Failed to connect to chat system
					</p>
					<Button
						onClick={handleRetry}
						disabled={isLoading}
						className='mt-4'
						variant='outline'
					>
						{isLoading ? (
							<Loader2 className='w-4 h-4 mr-2 animate-spin' />
						) : (
							<RotateCw className='w-4 h-4 mr-2' />
						)}
						Retry Connection
					</Button>
				</Alert>
			</Card>
		);
	}

	// Show loading state
	if (isLoading || globalConnectionStatus === 'connecting') {
		return (
			<Card className='p-6 text-center'>
				<Loader2 className='w-8 h-8 animate-spin mx-auto mb-4' />
				<p className='text-muted-foreground'>Loading conversations...</p>
			</Card>
		);
	}

	// Show empty state if no rooms
	if (!allRooms || allRooms.length === 0) {
		return (
			<Card className='p-6 text-center'>
				<MessageCircle className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
				<h3 className='text-lg font-medium mb-2'>No conversations yet</h3>
				<p className='text-muted-foreground'>
					Start a conversation by messaging someone from their profile or store
					page.
				</p>
			</Card>
		);
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-240px)]'>
			{/* Chat list sidebar */}
			<div
				className={`${
					isMobile ? (showChatList ? 'block' : 'hidden') : 'block'
				} md:col-span-1`}
			>
				<ChatList
					activeRoomId={activeRoomId || undefined}
					onRoomSelect={handleSelectRoom}
					isLoading={isLoading}
				/>
			</div>

			{/* Main chat area */}
			<div
				className={`${
					isMobile ? (showChatList ? 'hidden' : 'block') : 'block'
				} md:col-span-2`}
			>
				{activeRoomId ? (
					<ChatMessageArea
						roomId={activeRoomId}
						currentUserId={user?.id || ''}
						isMobile={isMobile}
						isReadOnly={isReadOnly}
						onBack={() => setShowChatList(true)}
					/>
				) : (
					<Card className='h-full flex items-center justify-center p-4'>
						<div className='text-center'>
							<MessageCircle className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
							<h3 className='text-lg font-medium mb-2'>
								Select a conversation
							</h3>
							<p className='text-muted-foreground'>
								Choose a conversation from the list to start messaging.
							</p>
						</div>
					</Card>
				)}
			</div>

			{/* Info panel sidebar */}
			<div className='hidden md:block md:col-span-1'>
				{activeRoomId ? (
					<ChatInfoPanel roomId={activeRoomId} />
				) : (
					<Card className='h-full' />
				)}
			</div>
		</div>
	);
}
