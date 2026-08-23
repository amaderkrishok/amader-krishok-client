'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Loader2, MessageSquare } from 'lucide-react';
import { ChatConversationItem } from './chat-conversation-item';
import { useChatContext } from '@/hooks/useChatContext';
import { useChatSearch } from '@/hooks/use-chat-search';

interface ChatListProps {
	activeRoomId?: string;
	isLoading?: boolean;
	onRoomSelect?: (roomId: string) => void;
}

export function ChatList({
	activeRoomId,
	isLoading = false,
	onRoomSelect,
}: ChatListProps) {
	const { allRooms, refreshAllPresence } = useChatContext();
	const [searchQuery, setSearchQuery] = useState('');

	const { filteredRooms, isResolving } = useChatSearch(allRooms, searchQuery);

	useEffect(() => {
		refreshAllPresence();
		const interval = setInterval(() => {
			refreshAllPresence();
		}, 30000);
		return () => clearInterval(interval);
	}, [refreshAllPresence]);

	const handleRoomSelect = (roomId: string) => {
		onRoomSelect?.(roomId);
	};

	return (
		<Card className='h-full flex flex-col bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden'>
			{/* 3. Sidebar Header with search */}
			<div className='p-4 border-b border-[#E5E7EB] bg-white space-y-3'>
				<h3 className='font-extrabold text-[#172033] text-base sm:text-lg tracking-tight flex items-center gap-2'>
					<MessageSquare className='w-4.5 h-4.5 text-[#28321A]' />
					Messages
				</h3>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-[#667085] h-4 w-4' />
					<Input
						placeholder='Search conversations...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='pl-9 rounded-xl border-[#E5E7EB] focus:border-[#28321A] text-xs sm:text-sm font-medium bg-[#F7F6F0]/50 h-9.5'
					/>
				</div>
			</div>

			{/* Conversation list */}
			<div className='flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-hide'>
				{isLoading || isResolving ? (
					<div className='flex flex-col items-center justify-center h-32 space-y-2'>
						<Loader2 className='h-6 w-6 animate-spin text-[#28321A]' />
						<span className='text-xs text-[#667085] font-medium'>কথোপকথন লোড হচ্ছে...</span>
					</div>
				) : filteredRooms.length > 0 ? (
					filteredRooms.map((room) => (
						<ChatConversationItem
							key={room.id}
							room={room}
							isActive={room.id === activeRoomId}
							onClick={() => handleRoomSelect(room.id)}
						/>
					))
				) : (
					<div className='flex flex-col items-center justify-center h-40 text-center p-4 space-y-2'>
						{searchQuery ? (
							<>
								<p className='text-xs text-[#667085] font-medium'>
									&ldquo;{searchQuery}&rdquo; দিয়ে কোনো কথোপকথন পাওয়া যায়নি
								</p>
								<button
									onClick={() => setSearchQuery('')}
									className='text-xs font-bold text-[#28321A] hover:underline'
								>
									সার্চ রিসেট করুন
								</button>
							</>
						) : (
							<>
								<p className='text-xs text-[#667085] font-medium'>
									কোনো সাম্প্রতিক বার্তা নেই
								</p>
							</>
						)}
					</div>
				)}
			</div>
		</Card>
	);
}
