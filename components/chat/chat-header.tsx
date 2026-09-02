import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MoreVertical, Menu, PhoneCall, Info } from 'lucide-react';
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
		<div className='border-b border-[#E5E7EB] p-3.5 flex justify-between items-center bg-white sticky top-0 z-10'>
			<div className='flex items-center gap-3 min-w-0'>
				{isMobile && onBack && (
					<Button
						variant='ghost'
						size='icon'
						className='h-8 w-8 text-[#28321A]'
						onClick={onBack}
					>
						<ArrowLeft className='h-4 w-4' />
						<span className='sr-only'>পিছনে যান</span>
					</Button>
				)}

				<div className='relative flex-shrink-0'>
					<Avatar className='h-10 w-10 border border-[#E5E7EB] shadow-xs'>
						<AvatarImage
							src={participantInfo.image || '/placeholder.svg'}
							alt={participantInfo.name}
						/>
						<AvatarFallback className='bg-[#F4B400] text-[#172033] font-bold text-xs'>
							{participantInfo.name.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<span
						className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
							isOnline ? 'bg-emerald-500' : 'bg-gray-400'
						}`}
					/>
				</div>

				<div className='min-w-0 space-y-0.5'>
					<p className='text-xs sm:text-sm font-extrabold text-[#172033] truncate'>
						{participantInfo.name}
					</p>
					<div className='flex items-center gap-1.5'>
						<span
							className={`h-1.5 w-1.5 rounded-full ${
								isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
							}`}
						/>
						<span className={`text-[11px] font-bold ${isOnline ? 'text-emerald-700' : 'text-[#667085]'}`}>
							{participantInfo.isLoading
								? 'লোড হচ্ছে...'
								: isOnline
								? 'Online'
								: 'Offline'}
						</span>
					</div>
				</div>
			</div>

			<div className='flex items-center gap-1.5'>
				{/* Mobile Info Sheet */}
				<Sheet>
					<SheetTrigger asChild>
						<Button variant='ghost' size='icon' className='h-8 w-8 lg:hidden text-[#28321A]'>
							<Info className='h-4 w-4' />
							<span className='sr-only'>বিক্রেতার তথ্য</span>
						</Button>
					</SheetTrigger>
					<SheetContent side='right' className='w-full sm:max-w-md p-0'>
						<ChatInfoPanel roomId={roomId} />
					</SheetContent>
				</Sheet>

				{/* 4. Three-dot dropdown menu */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon' className='h-8 w-8 text-[#172033] hover:bg-gray-100 rounded-xl'>
							<MoreVertical className='h-4.5 w-4.5' />
							<span className='sr-only'>অপশনসমূহ</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='rounded-xl border-[#E5E7EB] shadow-md'>
						<DropdownMenuLabel className='text-xs font-bold text-[#172033]'>অপশনসমূহ</DropdownMenuLabel>
						<DropdownMenuItem className='text-xs font-medium cursor-pointer'>প্রোফাইল দেখুন</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleToggleBlock}
							className='text-xs font-bold text-red-600 focus:text-red-700 cursor-pointer'
						>
							{isBlocked ? 'ব্লক আনলক করুন' : 'ইউজার ব্লক করুন'}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
