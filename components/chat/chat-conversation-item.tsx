import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useChatParticipant } from '@/hooks/use-chat-participant';
import { useChatContext } from '@/hooks/useChatContext';
import { isUserOnline } from '@/types/chat';
import type { RoomResponseDto } from '@/types/chat';

/**
 * Props for the ChatConversationItem component
 */
interface ChatConversationItemProps {
	/** Room data to display */
	room?: RoomResponseDto;
	/** Whether this conversation is currently active */
	isActive?: boolean;
	/** Click handler for selecting this conversation */
	onClick?: () => void;
}

/**
 * ChatConversationItem component that displays a single conversation in the chat list
 *
 * @description This component shows:
 * - Participant avatar and name
 * - Last message preview
 * - Timestamp of last activity
 * - Unread message count
 * - Online status indicator
 */
export function ChatConversationItem({
	room,
	isActive = false,
	onClick,
}: ChatConversationItemProps) {
	// Get enhanced participant information
	const participantInfo = useChatParticipant(room);
	const { getUserPresence } = useChatContext();

	const lastMessage = room?.lastMessage?.content || 'No messages yet';
	const lastActivityTime = room?.lastActivityAt
		? new Date(room.lastActivityAt).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
		  })
		: '';
	const unreadCount = room?.unreadCount || 0;

	// Get online status from global presence context
	const userPresence = room ? getUserPresence(room.participant.id) : null;
	const isOnline = isUserOnline(userPresence);
	const isTyping = false; // This should come from typing indicators

	// Debug logging for presence
	if (room) {
		console.log(`🔍 Conversation Item Debug - User ${room.participant.id}:`, {
			userPresence,
			isOnline,
			participantName: participantInfo.name,
		});
	}

	return (
		<button
			onClick={onClick}
			className={`w-full text-left rounded-lg p-2.5 transition-colors ${
				isActive ? 'bg-primary/10 hover:bg-primary/20' : 'hover:bg-muted'
			}`}
		>
			<div className='flex items-start gap-3'>
				<div className='relative'>
					<Avatar className='h-10 w-10'>
						<AvatarImage
							src={participantInfo.image}
							alt={participantInfo.name}
						/>
						<AvatarFallback>
							{participantInfo.name?.charAt(0) || '?'}
						</AvatarFallback>
					</Avatar>
					<span
						className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
							isOnline ? 'bg-green-500' : 'bg-gray-500'
						}`}
					/>
				</div>

				<div className='flex-1 min-w-0'>
					<div className='flex justify-between items-start'>
						<p className='font-medium text-sm truncate'>
							{participantInfo.name}
						</p>
						{lastActivityTime && (
							<span className='text-xs text-muted-foreground'>
								{lastActivityTime}
							</span>
						)}
					</div>

					{isTyping ? (
						<p className='text-xs text-primary font-medium'>Typing...</p>
					) : (
						<p className='text-xs text-muted-foreground truncate mt-1'>
							{lastMessage}
						</p>
					)}
				</div>

				{unreadCount > 0 && (
					<Badge className='ml-auto shrink-0 bg-primary text-primary-foreground'>
						{unreadCount}
					</Badge>
				)}
			</div>
		</button>
	);
}
