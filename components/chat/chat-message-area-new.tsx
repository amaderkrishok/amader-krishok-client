'use client';

import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { ChatMessageInput } from './chat-message-input';
import { ChatHeader } from './chat-header';
import { ChatMessageItem } from './chat-message-item';
import { useChat } from '@/hooks/use-chat';

/**
 * Props for the ChatMessageArea component
 */
interface ChatMessageAreaProps {
	/** Room ID to display messages for */
	roomId: string;
	/** Whether this is a mobile view */
	isMobile?: boolean;
	/** Whether the chat is read-only */
	isReadOnly?: boolean;
	/** Current user ID */
	currentUserId: string;
	/** Callback for mobile back navigation */
	onBack?: () => void;
}

/**
 * ChatMessageArea component that displays the main chat conversation
 *
 * @description This component:
 * - Shows chat header with participant info
 * - Displays all messages in the conversation
 * - Handles message loading and pagination
 * - Provides message input for sending new messages
 * - Shows typing indicators and connection status
 * - Handles real-time message updates via WebSocket
 */
export function ChatMessageArea({
	roomId,
	isMobile = false,
	isReadOnly = false,
	currentUserId,
	onBack,
}: ChatMessageAreaProps) {
	const {
		messages,
		typingUsers,
		connectionStatus,
		roomDetails,
		isLoadingMessages,
		hasMoreMessages,
		error,
		sendMessage,
		loadMoreMessages,
		markAllAsRead,
		clearError,
	} = useChat(roomId);

	/**
	 * Mark messages as read when component mounts or messages change
	 */
	useEffect(() => {
		if (messages.length > 0 && !isReadOnly) {
			// Debounce mark as read to avoid excessive API calls
			const timer = setTimeout(() => {
				markAllAsRead().catch(console.error);
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [messages.length, markAllAsRead, isReadOnly]);

	/**
	 * Handle sending a new message
	 */
	const handleSendMessage = async (content: string) => {
		try {
			await sendMessage(content);
		} catch (error) {
			console.error('Failed to send message:', error);
			// Error handling is managed by the useChat hook
		}
	};

	/**
	 * Handle loading more messages when scrolling to top
	 */
	const handleLoadMore = async () => {
		if (hasMoreMessages && !isLoadingMessages) {
			try {
				await loadMoreMessages();
			} catch (error) {
				console.error('Failed to load more messages:', error);
			}
		}
	};

	// Show loading state while room details are loading
	if (!roomDetails && isLoadingMessages) {
		return (
			<Card className='flex flex-col h-[calc(100vh-240px)] overflow-hidden'>
				<div className='flex items-center justify-center h-full'>
					<div className='text-center'>
						<Loader2 className='h-8 w-8 animate-spin mx-auto mb-4' />
						<p className='font-medium'>Loading conversation...</p>
					</div>
				</div>
			</Card>
		);
	}

	// Show error state
	if (error) {
		return (
			<Card className='flex flex-col h-[calc(100vh-240px)] overflow-hidden'>
				<div className='flex items-center justify-center h-full'>
					<div className='text-center max-w-md'>
						<AlertCircle className='h-8 w-8 text-destructive mx-auto mb-4' />
						<h3 className='font-medium mb-2'>Connection Error</h3>
						<p className='text-sm text-muted-foreground mb-4'>
							{error.message}
						</p>
						<Button onClick={clearError} variant='outline'>
							Try Again
						</Button>
					</div>
				</div>
			</Card>
		);
	}

	// Show connection error state
	if (connectionStatus === 'error') {
		return (
			<Card className='flex flex-col h-[calc(100vh-240px)] overflow-hidden'>
				<div className='flex items-center justify-center h-full'>
					<div className='text-center'>
						<AlertCircle className='h-8 w-8 text-destructive mx-auto mb-4' />
						<p className='font-medium mb-2'>Connection Lost</p>
						<p className='text-sm text-muted-foreground'>
							Attempting to reconnect...
						</p>
					</div>
				</div>
			</Card>
		);
	}

	// Filter typing users for current room
	const currentTypingUsers = typingUsers.filter(
		(t) => t.roomId === roomId && t.isTyping
	);

	return (
		<Card className='flex flex-col h-[calc(100vh-240px)] overflow-hidden'>
			{/* Chat Header */}
			<ChatHeader roomId={roomId} isMobile={isMobile} onBack={onBack} />

			{/* Messages Area */}
			<ScrollArea className='flex-1 overflow-y-auto'>
				<div className='p-4'>
					{/* Load More Button */}
					{hasMoreMessages && (
						<div className='text-center mb-4'>
							<Button
								variant='outline'
								size='sm'
								onClick={handleLoadMore}
								disabled={isLoadingMessages}
							>
								{isLoadingMessages ? (
									<>
										<Loader2 className='h-3 w-3 animate-spin mr-2' />
										Loading...
									</>
								) : (
									'Load older messages'
								)}
							</Button>
						</div>
					)}

					{/* Messages */}
					{messages.length > 0 ? (
						<div className='space-y-3'>
							{messages.map((message) => (
								<ChatMessageItem
									key={message.id}
									message={message}
									isOwnMessage={message.senderId === currentUserId}
									currentUserId={currentUserId}
								/>
							))}
						</div>
					) : (
						<div className='text-center py-8'>
							<p className='text-sm text-muted-foreground'>
								No messages yet. Start the conversation!
							</p>
						</div>
					)}

					{/* Typing Indicator */}
					{currentTypingUsers.length > 0 && roomDetails && (
						<div className='mt-4 flex justify-start'>
							<div className='bg-muted rounded-lg px-3 py-2 max-w-[70%]'>
								<p className='text-sm text-muted-foreground'>
									Someone is typing...
								</p>
							</div>
						</div>
					)}
				</div>
			</ScrollArea>

			{/* Message Input */}
			{!isReadOnly && (
				<ChatMessageInput
					roomId={roomId}
					isBlocked={roomDetails?.isBlocked || false}
				/>
			)}
		</Card>
	);
}
