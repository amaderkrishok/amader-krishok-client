'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
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
		<Card className='h-full flex flex-col bg-white rounded-3xl border border-[#E5E7EB] shadow-xs overflow-hidden'>
			{/* Sidebar Header */}
			<div className='p-4 border-b border-[#E5E7EB] bg-white space-y-3'>
				<div>
					<h3 className='font-extrabold text-[#172033] text-lg tracking-tight leading-tight'>
						Messages
					</h3>
					<p className='text-xs text-[#64748B] font-medium mt-0.5'>
						আপনার কথোপকথন
					</p>
				</div>

				{/* 🔍 Search Input */}
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] h-4 w-4' />
					<Input
						placeholder='🔍  কথোপকথন খুঁজুন...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='pl-9 rounded-2xl border-[#E5E7EB] focus:border-[#26351B] text-xs font-medium bg-[#FAFAF6] h-10'
					/>
				</div>
			</div>

			{/* Section Header */}
			<div className='px-4 pt-3 pb-1 flex items-center justify-between'>
				<span className='text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]'>
					Recent
				</span>
			</div>

			{/* Conversation list */}
			<div className='flex-1 overflow-y-auto px-2 pb-2 space-y-1 scrollbar-hide'>
				{isLoading || isResolving ? (
					<div className='flex flex-col items-center justify-center h-32 space-y-2'>
						<Loader2 className='h-6 w-6 animate-spin text-[#26351B]' />
						<span className='text-xs text-[#64748B] font-medium'>কথোপকথন লোড হচ্ছে...</span>
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
								<p className='text-xs text-[#64748B] font-medium'>
									&ldquo;{searchQuery}&rdquo; দিয়ে কোনো কথোপকথন পাওয়া যায়নি
								</p>
								<button
									onClick={() => setSearchQuery('')}
									className='text-xs font-bold text-[#26351B] hover:underline'
								>
									সার্চ রিসেট করুন
								</button>
							</>
						) : (
							<p className='text-xs text-[#64748B] font-medium'>
								কোনো সাম্প্রতিক বার্তা নেই
							</p>
						)}
					</div>
				)}
			</div>
		</Card>
	);
}
