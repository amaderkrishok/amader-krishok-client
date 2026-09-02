'use client';

import { useState } from 'react';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Loader2, RotateCw, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ChatList } from './chat-list';
import { ChatMessageArea } from './chat-message-area';
import { ChatInfoPanel } from './chat-info-panel';
import { useChatContext } from '@/hooks/useChatContext';

function isMobileDevice() {
	return (
		typeof navigator !== 'undefined' &&
		/Mobi|Android/i.test(navigator.userAgent)
	);
}

export function ChatInterface() {
	const { user, hasRole } = useSession();
	const {
		allRooms,
		activeRoomId,
		globalConnectionStatus,
		setActiveRoom,
		refreshRooms,
	} = useChatContext();

	const [showChatList, setShowChatList] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const isMobile = isMobileDevice();
	const isReadOnly = hasRole('ADMIN') || hasRole('MOD');

	// Handle room selection
	async function handleSelectRoom(roomId: string) {
		try {
			setActiveRoom(roomId);
			if (isMobile) {
				setShowChatList(false);
			}
		} catch (err) {
			console.error('Failed to select room:', err);
			toast.error('কথোপকথনে যুক্ত হতে সমস্যা হয়েছে');
		}
	}

	// Handle retry connection
	async function handleRetry() {
		try {
			setIsLoading(true);
			await refreshRooms();
		} catch (err) {
			console.error('Failed to retry:', err);
		} finally {
			setIsLoading(false);
		}
	}

	// Check authentication
	if (!user) {
		return (
			<Card className='p-8 text-center bg-white rounded-3xl border border-[#E5E7EB] shadow-xs max-w-md mx-auto my-12'>
				<Alert>
					<AlertTitle className='font-extrabold text-[#172033] text-lg'>লগইন আবশ্যক</AlertTitle>
					<p className='text-sm text-[#64748B] mt-2 font-medium'>
						মেসেজিং সার্ভিস অ্যাক্সেস করতে অনুগ্রহ করে লগইন করুন।
					</p>
				</Alert>
			</Card>
		);
	}

	// Connection Error State
	if (
		globalConnectionStatus === 'error' ||
		globalConnectionStatus === 'disconnected'
	) {
		return (
			<Card className='p-8 text-center bg-white rounded-3xl border border-[#E5E7EB] shadow-xs max-w-md mx-auto my-12'>
				<Alert variant='destructive'>
					<AlertTitle className='font-bold text-red-700 text-lg'>কানেকশন সমস্যা</AlertTitle>
					<p className='text-xs text-red-600 mt-2 font-medium'>
						চ্যাট সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।
					</p>
					<Button
						onClick={handleRetry}
						disabled={isLoading}
						className='mt-4 bg-[#26351B] hover:bg-[#344626] text-white font-bold rounded-xl'
					>
						{isLoading ? (
							<Loader2 className='w-4 h-4 mr-2 animate-spin' />
						) : (
							<RotateCw className='w-4 h-4 mr-2' />
						)}
						পুনরায় চেষ্টা করুন
					</Button>
				</Alert>
			</Card>
		);
	}

	// Loading State
	if (isLoading || globalConnectionStatus === 'connecting') {
		return (
			<div className='flex flex-col items-center justify-center h-full bg-white rounded-3xl border border-[#E5E7EB] p-12 shadow-xs'>
				<Loader2 className='w-10 h-10 animate-spin text-[#26351B] mb-3' />
				<p className='text-xs text-[#64748B] font-bold'>কথোপকথন লোড হচ্ছে...</p>
			</div>
		);
	}

	// Empty State if no conversations exist (Requirement #14)
	if (!allRooms || allRooms.length === 0) {
		return (
			<div className='bg-white h-full rounded-3xl border border-[#E5E7EB] shadow-xs p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto space-y-4 my-auto'>
				<div className='w-20 h-20 bg-[#FFF9E8] rounded-full flex items-center justify-center mx-auto border border-[#F5B800]/30 shadow-inner'>
					<MessageCircle className='h-10 w-10 text-[#26351B]' />
				</div>
				<div className='space-y-1.5'>
					<h3 className='text-xl font-extrabold text-[#172033]'>
						কোনো কথোপকথন নেই
					</h3>
					<p className='text-sm text-[#64748B] font-medium leading-relaxed'>
						কোনো বিক্রেতার সাথে যোগাযোগ করলে আপনার কথোপকথন এখানে দেখা যাবে।
					</p>
				</div>
			</div>
		);
	}

	// 280px minmax(550px, 1fr) 300px Desktop Workspace Layout
	return (
		<div className='grid grid-cols-1 lg:grid-cols-12 gap-4 h-full w-full'>
			{/* LEFT COLUMN: CONVERSATION SIDEBAR (280px / 3 cols) */}
			<div
				className={`${
					isMobile ? (showChatList ? 'block' : 'hidden') : 'block'
				} lg:col-span-3 h-full`}
			>
				<ChatList
					activeRoomId={activeRoomId || undefined}
					onRoomSelect={handleSelectRoom}
					isLoading={isLoading}
				/>
			</div>

			{/* CENTER COLUMN: ACTIVE CHAT WORKSPACE (6 cols - flexible & dominating) */}
			<div
				className={`${
					isMobile ? (showChatList ? 'hidden' : 'block') : 'block'
				} lg:col-span-6 h-full`}
			>
				{activeRoomId ? (
					<ChatMessageArea
						roomId={activeRoomId}
						currentUserId={user?.id || ''}
						isMobile={isMobile}
						isReadOnly={isReadOnly}
						onBack={() => setShowChatList(true)}
					/>
				) : (
					<div className='bg-[#FAFAF6] h-full rounded-3xl border border-[#E5E7EB] shadow-xs flex flex-col items-center justify-center p-8 text-center space-y-3'>
						<div className='w-16 h-16 bg-[#FFF9E8] rounded-full flex items-center justify-center border border-[#F5B800]/30 shadow-inner'>
							<MessageCircle className='w-8 h-8 text-[#26351B]' />
						</div>
						<h3 className='text-lg font-extrabold text-[#172033]'>
							কোনো কথোপকথন নির্বাচন করা হয়নি
						</h3>
						<p className='text-xs text-[#64748B] font-medium max-w-xs leading-relaxed'>
							ম্যাসেজ শুরু করতে বামপাশের তালিকা থেকে যেকোনো বিক্রেতার কথোপকথন নির্বাচন করুন।
						</p>
					</div>
				)}
			</div>

			{/* RIGHT COLUMN: VENDOR DETAILS PANEL (300px / 3 cols) */}
			<div className='hidden lg:block lg:col-span-3 h-full'>
				{activeRoomId ? (
					<ChatInfoPanel roomId={activeRoomId} />
				) : (
					<div className='bg-white h-full rounded-3xl border border-[#E5E7EB] shadow-xs p-6 flex flex-col items-center justify-center text-center'>
						<p className='text-xs text-[#64748B] font-medium'>
							বিক্রেতার বিস্তারিত তথ্য দেখতে কথোপকথন নির্বাচন করুন
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
