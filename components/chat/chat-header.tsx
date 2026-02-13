import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MoreVertical, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useChatContext } from '@/hooks/useChatContext';
import { useChatParticipant } from '@/hooks/use-chat-participant';
import { isUserOnline } from '@/types/chat';
import { ChatInfoPanel } from './chat-info-panel';

interface ChatHeaderProps {
	roomId: string;
	isMobile?: boolean;
	onBack?: () => void;
	isBlocked?: boolean;
}

/**
 * ChatHeader component displays room participant info and controls
 * Supports both user and vendor interactions with real-time status
 */
export function ChatHeader({
	roomId,
	isMobile = false,
	onBack,
	isBlocked = false,
}: ChatHeaderProps) {
	const { getRoomById, blockUser, unblockUser, getUserPresence } =
		useChatContext();
	const room = getRoomById(roomId);
	const participantInfo = useChatParticipant(room || undefined);

	if (!room) return null;

	const participant = room.participant;
	const userPresence = getUserPresence(participant.id);
	const isOnline = isUserOnline(userPresence);

	// Debug logging for presence in header
	console.log(`🔍 Header Debug - User ${participant.id}:`, {
		userPresence,
		isOnline,
		participantName: participantInfo.name,
	});

	/**
	 * Handle block/unblock user action
	 */
	const handleToggleBlock = async () => {
		try {
			if (isBlocked) {
				await unblockUser(participant.id);
			} else {
				await blockUser(participant.id);
			}
		} catch (error) {
			console.error('Failed to toggle block status:', error);
		}
	};

	return (
		<div className='border-b p-3 flex justify-between items-center'>
			<div className='flex items-center gap-2'>
				{isMobile && onBack && (
					<Button
						variant='ghost'
						size='icon'
						className='h-8 w-8 mr-1'
						onClick={onBack}
					>
						<ArrowLeft className='h-4 w-4' />
						<span className='sr-only'>Back to chat list</span>
					</Button>
				)}

				<Avatar className='h-9 w-9'>
					<AvatarImage
						src={participantInfo.image || '/placeholder.svg'}
						alt={participantInfo.name}
					/>
					<AvatarFallback>
						{participantInfo.name.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>

				<div>
					<p className='text-sm font-medium'>{participantInfo.name}</p>
					<div className='flex items-center'>
						<span
							className={`h-2 w-2 rounded-full mr-1 ${
								isOnline ? 'bg-green-500' : 'bg-gray-500'
							}`}
						/>
						<span className='text-xs text-muted-foreground'>
							{participantInfo.isLoading
								? 'Loading...'
								: isOnline
								? 'Online'
								: 'Offline'}
						</span>
					</div>
				</div>
			</div>

			<div className='flex items-center gap-1'>
				{isMobile && (
					<Sheet>
						<SheetTrigger asChild>
							<Button variant='ghost' size='icon' className='h-8 w-8'>
								<Menu className='h-4 w-4' />
								<span className='sr-only'>Contact Info</span>
							</Button>
						</SheetTrigger>
						<SheetContent side='right' className='w-full sm:max-w-md p-0'>
							<ChatInfoPanel roomId={roomId} />
						</SheetContent>
					</Sheet>
				)}

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon' className='h-8 w-8'>
							<MoreVertical className='h-4 w-4' />
							<span className='sr-only'>More options</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Options</DropdownMenuLabel>
						<DropdownMenuItem>View profile</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleToggleBlock}
							className='text-destructive focus:text-destructive'
						>
							{isBlocked ? 'Unblock user' : 'Block user'}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
