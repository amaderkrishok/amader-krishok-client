import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatContext } from '@/hooks/useChatContext';
import { useChatParticipant } from '@/hooks/use-chat-participant';

interface ChatInfoPanelProps {
	roomId: string;
	className?: string;
}

/**
 * ChatInfoPanel component displays detailed information about the chat participant
 * Supports blocking/unblocking, viewing orders, and contact actions
 */
export function ChatInfoPanel({ roomId, className }: ChatInfoPanelProps) {
	const { getRoomById } = useChatContext();

	const room = getRoomById(roomId);
	const participantInfo = useChatParticipant(room || undefined);

	if (!room) {
		return (
			<Card className={`h-full flex items-center justify-center ${className}`}>
				<p className='text-muted-foreground'>Room not found</p>
			</Card>
		);
	}

	const participant = room.participant;

	return (
		<Card className={`h-full ${className}`}>
			<Tabs defaultValue='info' className='h-full flex flex-col'>
				<TabsList className='w-full grid grid-cols-2'>
					<TabsTrigger value='info'>Info</TabsTrigger>
					<TabsTrigger value='orders'>Orders</TabsTrigger>
				</TabsList>
				<ScrollArea className='flex-1'>
					<TabsContent value='info' className='p-4 space-y-4 mt-0'>
						<div className='flex flex-col items-center'>
							<Avatar className='h-20 w-20 mb-2'>
								<AvatarImage
									src={participantInfo.image || '/placeholder.svg'}
									alt={participantInfo.name}
								/>
								<AvatarFallback>
									{participantInfo.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<h3 className='font-medium text-lg'>{participantInfo.name}</h3>
							<Badge
								variant='outline'
								className='text-muted-foreground border-gray-200'
							>
								<span className='h-2 w-2 rounded-full mr-1.5 bg-gray-500' />
								{participantInfo.isLoading
									? 'Loading...'
									: participantInfo.role}
							</Badge>
							{participant.role === 'VENDOR' && (
								<Badge className='mt-2 bg-blue-500'>Vendor</Badge>
							)}
						</div>

						<div className='space-y-2 mt-4'>
							<h4 className='text-sm font-medium'>Contact Information</h4>
							<div className='text-sm'>
								<p className='flex justify-between py-1'>
									<span className='text-muted-foreground'>Role:</span>
									<span>
										{participantInfo.role.charAt(0) +
											participantInfo.role.slice(1).toLowerCase()}
									</span>
								</p>
								{participantInfo.phoneNumber && (
									<p className='flex justify-between py-1'>
										<span className='text-muted-foreground'>Phone:</span>
										<span>{participantInfo.phoneNumber}</span>
									</p>
								)}
								{participantInfo.address && (
									<p className='flex justify-between py-1'>
										<span className='text-muted-foreground'>Address:</span>
										<span className='text-right'>
											{participantInfo.address}
										</span>
									</p>
								)}
								<p className='flex justify-between py-1'>
									<span className='text-muted-foreground'>Status:</span>
									<span>Active</span>
								</p>
							</div>
						</div>
					</TabsContent>

					<TabsContent value='orders' className='p-4 mt-0'>
						<h4 className='text-sm font-medium mb-2'>
							Your Orders with this Contact
						</h4>
						<div className='text-center py-8 text-muted-foreground'>
							<p>No orders found</p>
							<p className='text-xs mt-1'>
								Orders and transactions will appear here
							</p>
						</div>
					</TabsContent>
				</ScrollArea>
			</Tabs>
		</Card>
	);
}
