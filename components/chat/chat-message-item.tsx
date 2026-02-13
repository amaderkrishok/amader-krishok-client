'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import type { MessageEvent } from '@/services/chat/socket-service';

interface ChatMessageItemProps {
	message: MessageEvent;
	currentUserId: string;
	isOwnMessage?: boolean;
	showAvatar?: boolean;
	senderName?: string;
	senderImage?: string;
}

/**
 * ChatMessageItem component displays individual chat messages
 * Supports different message types, read status, and responsive layout
 */
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

	// Format timestamp
	const timestamp = formatDistanceToNow(new Date(message.createdAt), {
		addSuffix: true,
	});

	const containerClasses = isOwn
		? 'flex justify-end mb-3'
		: 'flex justify-start mb-3';

	const bubbleClasses = isOwn
		? 'bg-primary text-primary-foreground ml-12'
		: 'bg-muted text-muted-foreground mr-12';

	return (
		<div className={containerClasses}>
			<div className='flex items-end space-x-2 max-w-[70%]'>
				{!isOwn && showAvatar && (
					<Avatar className='h-6 w-6 flex-shrink-0'>
						<AvatarImage src={senderImage} alt={senderName} />
						<AvatarFallback className='text-xs'>
							{senderName.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				)}

				<div className='flex flex-col space-y-1'>
					{!isOwn && showAvatar && (
						<span className='text-xs text-muted-foreground ml-1'>
							{senderName}
						</span>
					)}

					<div className={`p-3 rounded-lg break-words ${bubbleClasses}`}>
						{message.type === 'text' && (
							<p className='whitespace-pre-wrap'>{message.content}</p>
						)}
						{message.type === 'image' && (
							<div className='space-y-2'>
								{message.content && (
									<p className='whitespace-pre-wrap'>{message.content}</p>
								)}
								{message.imageUrl && (
									<div className='relative w-48 h-32'>
										<Image
											src={message.imageUrl}
											alt='Shared image'
											fill
											className='object-cover rounded'
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
								<div className='bg-background/10 p-2 rounded flex items-center space-x-2'>
									<span className='text-sm'>📎</span>
									<span className='text-sm'>
										File: {message.content || 'Unknown file'}
									</span>
								</div>
							</div>
						)}
					</div>

					<div
						className={`flex items-center space-x-2 text-xs text-muted-foreground ${
							isOwn ? 'justify-end' : 'justify-start'
						} px-1`}
					>
						<span>{timestamp}</span>
						{isOwn && (
							<Badge
								variant={isRead ? 'default' : 'secondary'}
								className='h-4 px-1 text-xs'
							>
								{isRead ? 'Read' : 'Sent'}
							</Badge>
						)}
					</div>
				</div>

				{isOwn && showAvatar && (
					<Avatar className='h-6 w-6 flex-shrink-0'>
						<AvatarImage src={senderImage} alt={senderName} />
						<AvatarFallback className='text-xs'>
							{senderName.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				)}
			</div>
		</div>
	);
}
