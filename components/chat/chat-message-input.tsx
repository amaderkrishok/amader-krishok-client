import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useChat } from '@/hooks/use-chat';

interface ChatMessageInputProps {
	roomId: string;
	isBlocked?: boolean;
}

/**
 * ChatMessageInput component handles message composition and sending
 * Includes typing indicators, file attachments, and real-time socket integration
 */
export function ChatMessageInput({
	roomId,
	isBlocked = false,
}: ChatMessageInputProps) {
	const [content, setContent] = useState('');
	const [isSending, setIsSending] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const { sendMessage, sendTyping, sendStopTyping } = useChat(roomId);

	/**
	 * Auto-resize textarea as content grows
	 */
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [content]);

	/**
	 * Handle message sending
	 */
	const handleSend = async () => {
		if (!content.trim() || isSending || isBlocked) return;

		setIsSending(true);
		try {
			await sendMessage(content.trim(), 'text');
			setContent('');

			// Reset textarea height
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto';
			}
		} catch (error) {
			console.error('Failed to send message:', error);
		} finally {
			setIsSending(false);
		}
	};

	/**
	 * Handle input changes with typing indicator
	 */
	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newContent = e.target.value;
		setContent(newContent);

		// Emit typing indicator
		if (newContent.trim() && !isBlocked) {
			sendTyping();

			// Clear previous timeout
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}

			// Stop typing after 3 seconds of no input
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

	/**
	 * Handle key down events
	 */
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	/**
	 * Clean up typing timeout on unmount
	 */
	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
			// Stop typing when component unmounts
			sendStopTyping();
		};
	}, [sendStopTyping]);

	if (isBlocked) {
		return (
			<div className='border-t p-4 text-center'>
				<p className='text-sm text-muted-foreground'>
					This conversation has been blocked. You cannot send messages.
				</p>
			</div>
		);
	}

	return (
		<div className='border-t p-3 space-y-2'>
			<div className='flex items-end gap-2'>
				<div className='flex-1 space-y-2'>
					<Textarea
						ref={textareaRef}
						placeholder='Type your message... (Shift + Enter for new line)'
						value={content}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						className='min-h-[40px] max-h-32 resize-none'
						disabled={isSending}
					/>
				</div>

				<div className='flex items-center gap-1'>
					<Button
						onClick={handleSend}
						disabled={!content.trim() || isSending}
						size='icon'
						className='h-8 w-8'
					>
						<Send className='h-4 w-4' />
						<span className='sr-only'>Send message</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
