import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatContext } from '@/hooks/useChatContext';
import { useChatParticipant } from '@/hooks/use-chat-participant';
import { isUserOnline } from '@/types/chat';
import { User, Phone, MapPin, Package, Info, ShoppingBag } from 'lucide-react';

interface ChatInfoPanelProps {
	roomId: string;
	className?: string;
}

export function ChatInfoPanel({ roomId, className }: ChatInfoPanelProps) {
	const { getRoomById, getUserPresence } = useChatContext();

	const room = getRoomById(roomId);
	const participantInfo = useChatParticipant(room || undefined);

	if (!room) {
		return (
			<Card className={`h-full flex items-center justify-center p-4 bg-white rounded-2xl border border-[#E5E7EB] ${className}`}>
				<p className='text-xs font-medium text-[#667085]'>রুম পাওয়া যায়নি</p>
			</Card>
		);
	}

	const participant = room.participant;
	const userPresence = getUserPresence(participant.id);
	const isOnline = isUserOnline(userPresence);

	return (
		<Card className={`h-full bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden ${className}`}>
			<Tabs defaultValue='info' className='h-full flex flex-col'>
				{/* 7 & 8. Header Tabs [Info] [Orders] */}
				<TabsList className='w-full grid grid-cols-2 p-1 bg-[#F7F6F0] rounded-none border-b border-[#E5E7EB]'>
					<TabsTrigger
						value='info'
						className='text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#28321A] data-[state=active]:shadow-xs rounded-xl transition-all'
					>
						Info
					</TabsTrigger>
					<TabsTrigger
						value='orders'
						className='text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#28321A] data-[state=active]:shadow-xs rounded-xl transition-all'
					>
						Orders
					</TabsTrigger>
				</TabsList>

				<ScrollArea className='flex-1 p-4'>
					{/* INFO TAB */}
					<TabsContent value='info' className='space-y-5 mt-0'>
						<div className='flex flex-col items-center text-center pt-2 space-y-2'>
							<Avatar className='h-20 w-20 border-2 border-[#F4B400] shadow-xs'>
								<AvatarImage
									src={participantInfo.image || '/placeholder.svg'}
									alt={participantInfo.name}
								/>
								<AvatarFallback className='bg-[#F4B400] text-[#172033] font-black text-2xl'>
									{participantInfo.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<div className='space-y-1'>
								<h3 className='font-extrabold text-[#172033] text-base'>
									{participantInfo.name}
								</h3>
								<div className='flex items-center justify-center gap-1.5'>
									<span
										className={`h-2 w-2 rounded-full ${
											isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
										}`}
									/>
									<span
										className={`text-xs font-bold ${
											isOnline ? 'text-emerald-700' : 'text-[#667085]'
										}`}
									>
										{isOnline ? '● Online' : '● Offline'}
									</span>
								</div>
							</div>

							<span className='inline-block bg-[#FFF9E8] text-[#28321A] border border-[#F4B400]/30 text-[11px] font-extrabold px-3 py-0.5 rounded-full'>
								{participantInfo.role === 'VENDOR' ? 'Vendor / বিক্রেতা' : 'Customer'}
							</span>
						</div>

						{/* Contact Information */}
						<div className='space-y-3 pt-2 border-t border-[#E5E7EB]'>
							<h4 className='text-xs font-extrabold text-[#172033] uppercase tracking-wider flex items-center gap-1.5'>
								<Info className='w-3.5 h-3.5 text-[#F4B400]' />
								Contact Information
							</h4>

							<div className='space-y-2 text-xs font-medium text-[#667085] bg-[#F7F6F0]/50 p-3 rounded-xl border border-[#E5E7EB]'>
								<div className='flex justify-between items-center py-0.5'>
									<span>Role:</span>
									<span className='font-bold text-[#172033]'>
										{participantInfo.role.charAt(0) +
											participantInfo.role.slice(1).toLowerCase()}
									</span>
								</div>

								{participantInfo.phoneNumber && (
									<div className='flex justify-between items-center py-0.5'>
										<span>Phone:</span>
										<span className='font-bold text-[#172033]'>
											{participantInfo.phoneNumber}
										</span>
									</div>
								)}

								{participantInfo.address && (
									<div className='flex justify-between items-start py-0.5'>
										<span>Address:</span>
										<span className='font-bold text-[#172033] text-right max-w-[140px] truncate'>
											{participantInfo.address}
										</span>
									</div>
								)}

								<div className='flex justify-between items-center py-0.5'>
									<span>Status:</span>
									<span className='font-bold text-emerald-700'>Active</span>
								</div>
							</div>
						</div>
					</TabsContent>

					{/* ORDERS TAB */}
					<TabsContent value='orders' className='mt-0 pt-2 space-y-3'>
						<h4 className='text-xs font-extrabold text-[#172033] uppercase tracking-wider flex items-center gap-1.5'>
							<ShoppingBag className='w-3.5 h-3.5 text-[#F4B400]' />
							Your Orders
						</h4>

						<div className='text-center py-10 bg-[#FFF9E8]/40 rounded-xl border border-[#F4B400]/20 p-4 space-y-2'>
							<Package className='w-8 h-8 text-[#28321A]/40 mx-auto' />
							<p className='text-xs font-bold text-[#172033]'>No orders found</p>
							<p className='text-[11px] text-[#667085] font-medium leading-relaxed'>
								আপনার ও বিক্রেতার মধ্যের সমস্ত লেনদেন ও অর্ডার এখানে প্রদর্শিত হবে।
							</p>
						</div>
					</TabsContent>
				</ScrollArea>
			</Tabs>
		</Card>
	);
}
