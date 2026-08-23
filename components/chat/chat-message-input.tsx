'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
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
			textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
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
		<div className='border-t border-[#E5E7EB] p-3 bg-white space-y-2 sticky bottom-0'>
			<div className='flex items-center gap-2'>
				<div className='flex-1'>
					<Textarea
						ref={textareaRef}
						placeholder='আপনার বার্তা লিখুন... (নতুন লাইনের জন্য Shift + Enter)'
						value={content}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						className='min-h-[42px] max-h-28 resize-none rounded-xl border-[#E5E7EB] focus:border-[#28321A] text-xs sm:text-sm font-medium py-2.5 px-3 bg-[#F7F6F0]/40'
						disabled={isSending}
						rows={1}
					/>
				</div>

				<Button
					onClick={handleSend}
					disabled={!content.trim() || isSending}
					size='icon'
					className='h-10 w-10 bg-[#F4B400] hover:bg-[#E5A700] text-[#28321A] rounded-xl flex-shrink-0 shadow-xs transition-all hover:-translate-y-0.5 border-0 cursor-pointer disabled:opacity-50'
				>
					{isSending ? (
						<Loader2 className='h-4 w-4 animate-spin text-[#28321A]' />
					) : (
						<Send className='h-4.5 w-4.5 text-[#28321A]' />
					)}
					<span className='sr-only'>বার্তা পাঠান</span>
				</Button>
			</div>
		</div>
	);
}
