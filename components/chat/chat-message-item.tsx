'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import type { MessageEvent } from '@/services/chat/socket-service';
import { CheckCheck, Check } from 'lucide-react';

interface ChatMessageItemProps {
	message: MessageEvent;
	currentUserId: string;
	isOwnMessage?: boolean;
	showAvatar?: boolean;
	senderName?: string;
	senderImage?: string;
}

export function ChatMessageItem({
	message,
	currentUserId,
	isOwnMessage,
	showAvatar = true,
	senderName = 'User',
	senderImage = '/placeholder.svg',
}: ChatMessageItemProps) {
	const isOwn = isOwnMessage ?? message.senderId === currentUserId;
	const isRead = message.isRead;

	const messageTime = message.createdAt
		? new Date(message.createdAt).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
		  })
		: '';

	return (
		<div className={`flex w-full mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
			<div className={`flex items-end gap-2.5 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
				{!isOwn && showAvatar && (
					<Avatar className='h-7 w-7 flex-shrink-0 border border-[#E5E7EB] shadow-xs mb-1'>
						<AvatarImage src={senderImage} alt={senderName} />
						<AvatarFallback className='text-[10px] font-bold bg-[#FFF9E8] text-[#26351B]'>
							{senderName.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				)}

				<div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
					{!isOwn && showAvatar && (
						<span className='text-[10px] font-extrabold text-[#64748B] ml-1 mb-1'>
							{senderName}
						</span>
					)}

					{/* Modern Message Bubble (65-70% max-width, rounded 16px) */}
					<div
						className={`px-4 py-2.5 rounded-2xl break-words text-sm font-medium shadow-xs leading-relaxed ${
							isOwn
								? 'bg-[#26351B] text-white rounded-br-xs'
								: 'bg-white text-[#172033] border border-[#E5E7EB] rounded-bl-xs'
						}`}
					>
						{message.type === 'text' && (
							<p className='whitespace-pre-wrap'>{message.content}</p>
						)}
						{message.type === 'image' && (
							<div className='space-y-2'>
								{message.content && (
									<p className='whitespace-pre-wrap'>{message.content}</p>
								)}
								{message.imageUrl && (
									<div className='relative w-52 h-36 rounded-xl overflow-hidden border border-black/10'>
										<Image
											src={message.imageUrl}
											alt='Shared image'
											fill
											className='object-cover'
										/>
									</div>
								)}
							</div>
						)}
						{message.type === 'file' && (
							<div className='space-y-2'>
								{message.content && (
									<p className='whitespace-pre-wrap'>{message.content}</p>
								)}
								<div className='bg-black/5 p-2 rounded-xl flex items-center gap-2 text-xs'>
									<span>📎</span>
									<span className='truncate max-w-[180px]'>
										{message.content || 'সংযুক্ত ফাইল'}
									</span>
								</div>
							</div>
						)}
					</div>

					{/* Muted Timestamp & Read/Sent Status */}
					<div
						className={`flex items-center gap-1.5 text-[10px] font-semibold text-[#64748B] mt-1 px-1 ${
							isOwn ? 'justify-end' : 'justify-start'
						}`}
					>
						<span>{messageTime}</span>
						{isOwn && (
							<span className='flex items-center gap-0.5'>
								{isRead ? (
									<CheckCheck className='w-3.5 h-3.5 text-[#F5B800]' />
								) : (
									<Check className='w-3.5 h-3.5 text-gray-400' />
								)}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
