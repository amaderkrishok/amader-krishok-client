'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { ChatConversationItem } from './chat-conversation-item';
import { useChatContext } from '@/hooks/useChatContext';
import { useChatSearch } from '@/hooks/use-chat-search';

/**
 * Props for the ChatList component
 */
interface ChatListProps {
	/** Currently active room ID */
	activeRoomId?: string;
	/** Loading state */
	isLoading?: boolean;
	/** Callback when a room is selected */
	onRoomSelect?: (roomId: string) => void;
}

/**
 * ChatList component that displays all chat conversations
 *
 * @description This component:
 * - Shows all user's chat rooms
 * - Provides search functionality
 * - Handles room selection
 * - Shows loading and empty states
 * - Real-time updates from global chat context
 */
export function ChatList({
	activeRoomId,
	isLoading = false,
	onRoomSelect,
}: ChatListProps) {
	const { allRooms, refreshAllPresence } = useChatContext();
	const [searchQuery, setSearchQuery] = useState('');

	// Use the new chat search hook that handles resolved participant names
	const { filteredRooms, isResolving } = useChatSearch(allRooms, searchQuery);

	// Periodically refresh presence data
	useEffect(() => {
		// Initial refresh when component mounts
		refreshAllPresence();

		// Set up periodic refresh every 30 seconds
		const interval = setInterval(() => {
			refreshAllPresence();
		}, 30000);

		return () => clearInterval(interval);
	}, [refreshAllPresence]);

	/**
	 * Handle room selection
	 */
	const handleRoomSelect = (roomId: string) => {
		onRoomSelect?.(roomId);
	};

	return (
		<Card className='h-full flex flex-col'>
			{/* Header with search */}
			<div className='p-4 border-b'>
				<h3 className='font-semibold mb-3'>Messages</h3>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
					<Input
						placeholder='Search conversations...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='pl-10'
					/>
				</div>
			</div>

			{/* Conversation list */}
			<div className='flex-1 overflow-y-auto'>
				{isLoading || isResolving ? (
					<div className='flex items-center justify-center h-32'>
						<Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
					</div>
				) : filteredRooms.length > 0 ? (
					<div className='space-y-1 p-2'>
						{filteredRooms.map((room) => (
							<ChatConversationItem
								key={room.id}
								room={room}
								isActive={room.id === activeRoomId}
								onClick={() => handleRoomSelect(room.id)}
							/>
						))}
					</div>
				) : (
					<div className='flex flex-col items-center justify-center h-32 text-center p-4'>
						{searchQuery ? (
							<>
								<p className='text-sm text-muted-foreground mb-2'>
									No conversations found for &ldquo;{searchQuery}&rdquo;
								</p>
								<button
									onClick={() => setSearchQuery('')}
									className='text-sm text-primary hover:underline'
								>
									Clear search
								</button>
							</>
						) : (
							<>
								<p className='text-sm text-muted-foreground mb-2'>
									No conversations yet
								</p>
								<p className='text-xs text-muted-foreground'>
									Start messaging vendors to see your chats here
								</p>
							</>
						)}
					</div>
				)}
			</div>
		</Card>
	);
}
