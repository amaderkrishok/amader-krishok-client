'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Plus, Loader2, Smile } from 'lucide-react';
import { useChat } from '@/hooks/use-chat';

interface ChatMessageInputProps {
	roomId: string;
	isBlocked?: boolean;
}

export function ChatMessageInput({
	roomId,
	isBlocked = false,
}: ChatMessageInputProps) {
	const [content, setContent] = useState('');
	const [isSending, setIsSending] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const { sendMessage, sendTyping, sendStopTyping } = useChat(roomId);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
		}
	}, [content]);

	const handleSend = async () => {
		if (!content.trim() || isSending || isBlocked) return;

		setIsSending(true);
		try {
			await sendMessage(content.trim(), 'text');
			setContent('');

			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto';
			}
		} catch (error) {
			console.error('Failed to send message:', error);
		} finally {
			setIsSending(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newContent = e.target.value;
		setContent(newContent);

		if (newContent.trim() && !isBlocked) {
			sendTyping();

			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}

			typingTimeoutRef.current = setTimeout(() => {
				sendStopTyping();
			}, 3000);
		} else {
			sendStopTyping();
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
			sendStopTyping();
		};
	}, [sendStopTyping]);

	if (isBlocked) {
		return (
			<div className='border-t border-[#E5E7EB] p-4 text-center bg-[#FFF9E8]/50'>
				<p className='text-xs font-bold text-red-600'>
					এই কথোপকথনটি ব্লক করা হয়েছে। নতুন মেসেজ পাঠানো যাবে না।
				</p>
			</div>
		);
	}

	return (
		<div className='border-t border-[#E5E7EB] p-3 bg-white sticky bottom-0 rounded-b-3xl'>
			{/* Compact Single Row Composer (height 52-58px, 16px radius) */}
			<div className='flex items-center gap-2 bg-[#FAFAF6] p-1.5 rounded-[16px] border border-[#E5E7EB] shadow-xs hover:border-[#F5B800]/50 transition-colors'>
				{/* Attachment Icon */}
				{/* <button
					type='button'
					className='p-2 text-[#64748B] hover:text-[#26351B] hover:bg-black/5 rounded-full transition-colors'
					title='সংযুক্ত করুন'
				>
					<Plus className='w-5 h-5' />
				</button> */}

				{/* Input Textarea */}
				<Textarea
					ref={textareaRef}
					placeholder='আপনার বার্তা লিখুন...'
					value={content}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					className='min-h-[38px] max-h-24 resize-none border-0 shadow-none focus-visible:ring-0 text-xs sm:text-sm font-medium py-2 px-1 bg-transparent placeholder:text-[#64748B]'
					disabled={isSending}
					rows={1}
				/>

				{/* Circular Warm Gold Send Button */}
				<Button
					onClick={handleSend}
					disabled={!content.trim() || isSending}
					size='icon'
					className='h-9 w-9 rounded-full bg-[#F5B800] hover:bg-[#E0A800] text-[#26351B] flex-shrink-0 shadow-xs transition-transform hover:scale-105 active:scale-95 border-0 cursor-pointer disabled:opacity-50'
				>
					{isSending ? (
						<Loader2 className='h-4 w-4 animate-spin text-[#26351B]' />
					) : (
						<Send className='h-4 w-4 text-[#26351B] ml-0.5' />
					)}
					<span className='sr-only'>Send ➤</span>
				</Button>
			</div>
		</div>
	);
}
