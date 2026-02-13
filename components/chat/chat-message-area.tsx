'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { ChatMessageInput } from './chat-message-input';
import { ChatHeader } from './chat-header';
import { ChatMessageItem } from './chat-message-item';
import { useChat } from '@/hooks/use-chat';
import { useChatContext } from '@/hooks/useChatContext';
import type { MessageEvent } from '@/types/chat';

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
	const { unblockUser, isUserBlocked } = useChatContext();
	const {
		messages,
		typingUsers,
		connectionStatus,
		roomDetails,
		isLoadingMessages,
		hasMoreMessages,
		error,
		loadMoreMessages,
		markAllAsRead,
		clearError,
		isLoadingHistory,
	} = useChat(roomId);

	// Scroll reference for auto-scrolling
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const previousMessageCount = useRef(messages.length);
	const lastMessageTimestamp = useRef<number | null>(null);

	/**
	 * Handle unblocking a user
	 */
	const handleUnblockUser = async () => {
		if (!roomDetails?.room.participant.id) return;

		try {
			await unblockUser(roomDetails.room.participant.id);
		} catch (error) {
			console.error('Failed to unblock user:', error);
		}
	};

	/**
	 * Group messages by date for date separators
	 */
	const groupedMessages = useMemo(() => {
		const groups: { date: string; label: string; messages: MessageEvent[] }[] =
			[];
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		// Format date helper
		const formatDateLabel = (date: Date): string => {
			const messageDate = new Date(date);

			// Check if it's today
			if (messageDate.toDateString() === today.toDateString()) {
				return 'Today';
			}

			// Check if it's yesterday
			if (messageDate.toDateString() === yesterday.toDateString()) {
				return 'Yesterday';
			}

			// For other dates, show formatted date
			return messageDate.toLocaleDateString('en-US', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
			});
		};

		// Group messages by date
		messages.forEach((message) => {
			const messageDate = new Date(message.createdAt).toDateString();
			const label = formatDateLabel(new Date(message.createdAt));

			let group = groups.find((g) => g.date === messageDate);
			if (!group) {
				group = { date: messageDate, label, messages: [] };
				groups.push(group);
			}
			group.messages.push(message);
		});

		return groups;
	}, [messages]);

	/**
	 * Auto-scroll to bottom when NEW messages arrive (only if user sent the message)
	 * This should NOT trigger when loading older messages
	 */
	useEffect(() => {
		// Don't auto-scroll if we're currently loading history
		if (isLoadingHistory) {
			previousMessageCount.current = messages.length;
			return;
		}

		if (messages.length > previousMessageCount.current) {
			const latestMessage = messages[messages.length - 1];
			const currentMessageTime = new Date(latestMessage.createdAt).getTime();

			// Check if this is truly a NEW message (not loaded from history)
			const isNewMessage =
				!lastMessageTimestamp.current ||
				currentMessageTime > lastMessageTimestamp.current;

			// Auto-scroll only if:
			// 1. It's a new message (not from history)
			// 2. The latest message is from current user
			if (
				isNewMessage &&
				latestMessage &&
				latestMessage.senderId === currentUserId
			) {
				// Small delay to ensure DOM has updated
				const timeoutId = setTimeout(() => {
					messagesEndRef.current?.scrollIntoView({
						behavior: 'smooth',
						block: 'end',
					});
				}, 150);

				return () => clearTimeout(timeoutId);
			}
		}

		// Update tracking variables
		previousMessageCount.current = messages.length;
		if (messages.length > 0) {
			lastMessageTimestamp.current = new Date(
				messages[messages.length - 1].createdAt
			).getTime();
		}
	}, [messages, currentUserId, isLoadingHistory]);

	/**
	 * Mark messages as read when component mounts or messages change
	 */
	useEffect(() => {
		if (messages.length > 0 && !isReadOnly && roomId) {
			// Only mark messages from other users as read (not our own)
			const unreadOtherMessages = messages.filter(
				(msg) => msg.senderId !== currentUserId && !msg.isRead
			);

			if (unreadOtherMessages.length > 0) {
				// Debounce mark as read to avoid excessive API calls
				const timer = setTimeout(async () => {
					try {
						// Mark messages as read locally in the hook
						markAllAsRead().catch(console.error);
					} catch (error) {
						console.error('Failed to mark messages as read:', error);
					}
				}, 1000);

				return () => clearTimeout(timer);
			}
		}
	}, [messages, markAllAsRead, isReadOnly, currentUserId, roomId]);

	/**
	 * Reset tracking when room changes
	 */
	useEffect(() => {
		previousMessageCount.current = 0;
		lastMessageTimestamp.current = null;
	}, [roomId]);

	/**
	 * Initialize timestamp tracking when messages first load
	 */
	useEffect(() => {
		if (messages.length > 0 && lastMessageTimestamp.current === null) {
			lastMessageTimestamp.current = new Date(
				messages[messages.length - 1].createdAt
			).getTime();
			previousMessageCount.current = messages.length;
		}
	}, [messages]);

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
			<ChatHeader
				roomId={roomId}
				isMobile={isMobile}
				onBack={onBack}
				isBlocked={
					roomDetails ? isUserBlocked(roomDetails.room.participant.id) : false
				}
			/>

			{/* Messages Area */}
			<ScrollArea className='flex-1 overflow-y-auto' ref={scrollAreaRef}>
				<div className='p-4'>
					{/* Load More Button or Conversation Started Indicator */}
					{hasMoreMessages ? (
						<div className='text-center mb-4'>
							<Button
								variant='outline'
								size='sm'
								onClick={handleLoadMore}
								disabled={isLoadingHistory}
								className='transition-all duration-200 hover:scale-105'
							>
								{isLoadingHistory ? (
									<>
										<Loader2 className='h-3 w-3 animate-spin mr-2' />
										<span className='animate-pulse'>
											Loading older messages...
										</span>
									</>
								) : (
									'Load older messages'
								)}
							</Button>
						</div>
					) : messages.length > 0 ? (
						<div className='text-center mb-4'>
							<div className='inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs'>
								🎉 Conversation started
							</div>
						</div>
					) : null}

					{/* Loading animation for history */}
					{isLoadingHistory && (
						<div className='text-center mb-6 animate-in fade-in-0 duration-300'>
							<div className='flex flex-col items-center space-y-3'>
								<div className='flex items-center space-x-1'>
									<div className='w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
									<div className='w-2 h-2 bg-primary/80 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
									<div className='w-2 h-2 bg-primary rounded-full animate-bounce'></div>
								</div>
								<div className='text-xs text-muted-foreground animate-pulse'>
									Loading older messages...
								</div>
							</div>
						</div>
					)}

					{/* Messages with Date Separators */}
					{messages.length > 0 ? (
						<div className='space-y-1'>
							{groupedMessages.map((group) => (
								<div
									key={group.date}
									className='animate-in fade-in-0 duration-300'
								>
									{/* Date Separator */}
									<div className='flex items-center justify-center my-6'>
										<div className='flex-1 border-t border-border/50'></div>
										<div className='px-4 py-1 bg-muted/50 text-xs text-muted-foreground font-medium rounded-full border border-border/30 shadow-sm'>
											{group.label}
										</div>
										<div className='flex-1 border-t border-border/50'></div>
									</div>

									{/* Messages for this date */}
									<div className='space-y-3'>
										{group.messages.map((message, messageIndex) => (
											<div
												key={message.id}
												className='animate-in slide-in-from-bottom-2 duration-300'
												style={{
													animationDelay: `${messageIndex * 50}ms`,
													animationFillMode: 'both',
												}}
											>
												<ChatMessageItem
													message={message}
													isOwnMessage={message.senderId === currentUserId}
													currentUserId={currentUserId}
												/>
											</div>
										))}
									</div>
								</div>
							))}

							{/* Invisible element for auto-scrolling */}
							<div ref={messagesEndRef} />
						</div>
					) : (
						<div className='text-center py-8 animate-in fade-in-0 duration-500'>
							<div className='inline-flex flex-col items-center space-y-2'>
								<div className='w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-2'>
									<span className='text-2xl'>💬</span>
								</div>
								<p className='text-sm text-muted-foreground'>
									No messages yet. Start the conversation!
								</p>
							</div>
						</div>
					)}

					{/* Typing Indicator */}
					{currentTypingUsers.length > 0 &&
						roomDetails &&
						!roomDetails.isBlocked && (
							<div className='mt-4 flex justify-start'>
								<div className='bg-muted rounded-lg px-3 py-2 max-w-[70%]'>
									<p className='text-sm text-muted-foreground'>
										Someone is typing...
									</p>
								</div>
							</div>
						)}

					{/* Blocked State Indicator */}
					{roomDetails?.isBlocked && (
						<div className='text-center py-8 animate-in fade-in-0 duration-500'>
							<div className='inline-flex flex-col items-center space-y-4 p-6 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20'>
								<div className='w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center'>
									<span className='text-2xl'>🚫</span>
								</div>
								<div className='text-center'>
									<p className='text-sm font-medium text-muted-foreground mb-1'>
										Communication Blocked
									</p>
									<p className='text-xs text-muted-foreground mb-3'>
										{isUserBlocked(roomDetails.room.participant.id)
											? 'You have blocked this user. You can view previous messages but cannot send new ones.'
											: 'This user has blocked you. You can view previous messages but cannot send new ones.'}
									</p>
									{isUserBlocked(roomDetails.room.participant.id) && (
										<Button
											onClick={handleUnblockUser}
											variant='outline'
											size='sm'
											className='text-xs'
										>
											Unblock User
										</Button>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</ScrollArea>

			{/* Message Input */}
			{!isReadOnly && (
				<ChatMessageInput
					roomId={roomId}
					isBlocked={
						roomDetails ? isUserBlocked(roomDetails.room.participant.id) : false
					}
				/>
			)}
		</Card>
	);
}
