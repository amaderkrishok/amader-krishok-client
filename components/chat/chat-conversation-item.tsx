import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatParticipant } from '@/hooks/use-chat-participant';
import { useChatContext } from '@/hooks/useChatContext';
import { isUserOnline } from '@/types/chat';
import type { RoomResponseDto } from '@/types/chat';

interface ChatConversationItemProps {
	room?: RoomResponseDto;
	isActive?: boolean;
	onClick?: () => void;
}

export function ChatConversationItem({
	room,
	isActive = false,
	onClick,
}: ChatConversationItemProps) {
	const participantInfo = useChatParticipant(room);
	const { getUserPresence } = useChatContext();

	const lastMessage = room?.lastMessage?.content || 'কোনো বার্তা নেই';
	const lastActivityTime = room?.lastActivityAt
		? new Date(room.lastActivityAt).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
		  })
		: '';
	const unreadCount = room?.unreadCount || 0;

	const userPresence = room ? getUserPresence(room.participant.id) : null;
	const isOnline = isUserOnline(userPresence);

	return (
		<button
			onClick={onClick}
			className={`w-full text-left p-3 transition-all duration-200 cursor-pointer ${
				isActive
					? 'bg-[#FFF9E8] border-l-4 border-[#F5B800] rounded-r-xl shadow-xs'
					: 'bg-white hover:bg-gray-50/80 rounded-xl border border-transparent'
			}`}
		>
			<div className='flex items-center gap-3'>
				<div className='relative flex-shrink-0'>
					<Avatar className='h-10 w-10 border border-[#E5E7EB] shadow-xs'>
						<AvatarImage
							src={participantInfo.image}
							alt={participantInfo.name}
						/>
						<AvatarFallback className='bg-[#F5B800] text-[#172033] font-bold text-xs'>
							{participantInfo.name?.charAt(0).toUpperCase() || '?'}
						</AvatarFallback>
					</Avatar>
					<span
						className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
							isOnline ? 'bg-emerald-500' : 'bg-gray-400'
						}`}
					/>
				</div>

				<div className='flex-1 min-w-0 space-y-0.5'>
					<div className='flex justify-between items-baseline gap-1'>
						<p className={`text-xs sm:text-sm truncate ${isActive ? 'font-extrabold text-[#172033]' : 'font-bold text-[#172033]'}`}>
							{participantInfo.name}
						</p>
						{lastActivityTime && (
							<span className='text-[10px] text-[#64748B] font-medium flex-shrink-0'>
								{lastActivityTime}
							</span>
						)}
					</div>

					<p className='text-xs text-[#64748B] truncate font-medium'>
						{lastMessage}
					</p>
				</div>

				{unreadCount > 0 && (
					<span className='flex-shrink-0 bg-[#F5B800] text-[#26351B] font-black text-[10px] rounded-full h-5 w-5 flex items-center justify-center border border-white shadow-xs'>
						{unreadCount}
					</span>
				)}
			</div>
		</button>
	);
}
