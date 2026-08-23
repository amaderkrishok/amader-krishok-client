import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatContext } from '@/hooks/useChatContext';
import { useChatParticipant } from '@/hooks/use-chat-participant';
import { isUserOnline } from '@/types/chat';
import { Info, ShoppingBag, Package } from 'lucide-react';
import Link from 'next/link';

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
			<Card className={`h-full flex items-center justify-center p-4 bg-white rounded-3xl border border-[#E5E7EB] ${className}`}>
				<p className='text-xs font-medium text-[#64748B]'>রুম পাওয়া যায়নি</p>
			</Card>
		);
	}

	const participant = room.participant;
	const userPresence = getUserPresence(participant.id);
	const isOnline = isUserOnline(userPresence);

	return (
		<Card className={`h-full bg-white rounded-3xl border border-[#E5E7EB] shadow-xs overflow-hidden ${className}`}>
			<Tabs defaultValue='info' className='h-full flex flex-col'>
				{/* Modern Underline Active Indicator Tabs */}
				<TabsList className='w-full grid grid-cols-2 p-0 bg-white border-b border-[#E5E7EB] rounded-none h-12'>
					<TabsTrigger
						value='info'
						className='text-xs font-extrabold h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#F5B800] data-[state=active]:text-[#26351B] data-[state=active]:bg-transparent transition-all'
					>
						Info
					</TabsTrigger>
					<TabsTrigger
						value='orders'
						className='text-xs font-extrabold h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#F5B800] data-[state=active]:text-[#26351B] data-[state=active]:bg-transparent transition-all'
					>
						Orders
					</TabsTrigger>
				</TabsList>

				<ScrollArea className='flex-1 p-4'>
					{/* INFO TAB */}
					<TabsContent value='info' className='space-y-5 mt-0'>
						{/* Profile Overview */}
						<div className='flex flex-col items-center text-center pt-2 space-y-2'>
							<Avatar className='h-20 w-20 border-2 border-[#F5B800] shadow-xs'>
								<AvatarImage
									src={participantInfo.image || '/placeholder.svg'}
									alt={participantInfo.name}
								/>
								<AvatarFallback className='bg-[#F5B800] text-[#172033] font-black text-2xl'>
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
											isOnline ? 'text-emerald-700' : 'text-[#64748B]'
										}`}
									>
										{isOnline ? '● Online' : '● Offline'}
									</span>
								</div>
							</div>

							<span className='inline-block bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/30 text-[11px] font-extrabold px-3 py-0.5 rounded-full'>
								{participantInfo.role === 'VENDOR' ? 'Vendor' : 'Customer'}
							</span>
						</div>

						{/* Contact Information Cards Stack */}
						<div className='space-y-3 pt-2 border-t border-[#E5E7EB]'>
							<h4 className='text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5'>
								<Info className='w-3.5 h-3.5 text-[#F5B800]' />
								CONTACT
							</h4>

							<div className='bg-white rounded-2xl border border-[#E5E7EB] divide-y divide-[#E5E7EB] shadow-xs overflow-hidden text-xs font-semibold'>
								<div className='p-3 flex justify-between items-center bg-[#FAFAF6]/60'>
									<span className='text-[#64748B] font-medium'>Role</span>
									<span className='text-[#172033] font-extrabold capitalize'>
										{participantInfo.role.toLowerCase()}
									</span>
								</div>

								{participantInfo.phoneNumber && (
									<div className='p-3 flex justify-between items-center bg-white'>
										<span className='text-[#64748B] font-medium'>Phone</span>
										<span className='text-[#172033] font-extrabold'>
											{participantInfo.phoneNumber}
										</span>
									</div>
								)}

								{participantInfo.address && (
									<div className='p-3 flex justify-between items-start bg-[#FAFAF6]/60'>
										<span className='text-[#64748B] font-medium'>Address</span>
										<span className='text-[#172033] font-extrabold text-right max-w-[140px] truncate'>
											{participantInfo.address}
										</span>
									</div>
								)}

								<div className='p-3 flex justify-between items-center bg-white'>
									<span className='text-[#64748B] font-medium'>Status</span>
									<span className='text-emerald-700 font-extrabold flex items-center gap-1'>
										<span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
										● Active
									</span>
								</div>
							</div>
						</div>
					</TabsContent>

					{/* ORDERS TAB */}
					<TabsContent value='orders' className='mt-0 pt-2 space-y-3'>
						<h4 className='text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5'>
							<ShoppingBag className='w-3.5 h-3.5 text-[#F5B800]' />
							RECENT ORDERS
						</h4>

						<div className='text-center py-10 bg-[#FFF9E8]/40 rounded-2xl border border-[#F5B800]/20 p-4 space-y-2'>
							<Package className='w-8 h-8 text-[#26351B]/40 mx-auto' />
							<p className='text-xs font-bold text-[#172033]'>No orders found</p>
							<p className='text-[11px] text-[#64748B] font-medium leading-relaxed'>
								আপনার ও বিক্রেতার মধ্যের সমস্ত লেনদেন ও অর্ডার এখানে প্রদর্শিত হবে।
							</p>
						</div>
					</TabsContent>
				</ScrollArea>
			</Tabs>
		</Card>
	);
}
