'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/components/providers/session-provider';
import { useChatContext } from '@/hooks/useChatContext';
import { useRouter } from 'next/navigation';

/**
 * Props for the SendMessageButton component
 */
interface SendMessageButtonProps {
	/** ID of the vendor/user to message */
	participantId: string;
	/** Display name of the vendor/user */
	participantName?: string;
	/** Custom CSS classes */
	className?: string;
	/** Button variant */
	variant?:
		| 'default'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link'
		| 'destructive';
	/** Button size */
	size?: 'default' | 'sm' | 'lg' | 'icon';
	/** Whether the participant is online */
	isOnline?: boolean;
	/** Callback fired when room is created/opened successfully */
	onRoomCreated?: (roomId: string) => void;
	/** Custom redirect path after room creation */
	redirectTo?: string;
}

/**
 * SendMessageButton component that handles room creation and navigation
 *
 * @description This component:
 * - Creates a new chat room with the specified participant
 * - Handles authentication checks
 * - Shows online/offline status
 * - Navigates to the chat interface after room creation
 * - Works for both USER → VENDOR and VENDOR → USER messaging
 *
 * @example
 * ```tsx
 * // For messaging a vendor
 * <SendMessageButton
 *   participantId="vendor-123"
 *   participantName="John's Farm Store"
 *   isOnline={true}
 *   redirectTo="/user/chat"
 * />
 *
 * // For vendor messaging a user
 * <SendMessageButton
 *   participantId="user-456"
 *   participantName="Sarah Johnson"
 *   redirectTo="/vendor/chat"
 * />
 * ```
 */
export function SendMessageButton({
	participantId,
	participantName = 'User',
	className,
	variant = 'default',
	size = 'default',
	isOnline = false,
	onRoomCreated,
	redirectTo,
}: SendMessageButtonProps) {
	const { isAuthenticated, user } = useSession();
	const { createRoom, setActiveRoom } = useChatContext();
	const router = useRouter();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isCreatingRoom, setIsCreatingRoom] = useState(false);

	// Determine default redirect path based on user role
	const getDefaultRedirectPath = () => {
		if (redirectTo) return redirectTo;

		if (user?.role === 'VENDOR') {
			return '/vendor/chat';
		} else {
			return '/user/chat';
		}
	};

	/**
	 * Handle starting a chat conversation
	 */
	async function handleStartChat() {
		// Check authentication first
		if (!isAuthenticated) {
			setIsModalOpen(true);
			return;
		}

		// Prevent double-clicks during room creation
		if (isCreatingRoom) return;

		// Validate participantId
		if (!participantId || participantId.trim() === '') {
			console.error('❌ Invalid participantId:', participantId);
			return;
		}

		try {
			setIsCreatingRoom(true);

			console.log('🔄 Creating room with participant:', participantId);

			// Create or get existing room
			const room = await createRoom(participantId);

			// Set as active room
			setActiveRoom(room.id);

			// Call callback if provided
			onRoomCreated?.(room.id);

			// Navigate to chat with appropriate path
			const chatPath = getDefaultRedirectPath();
			router.push(chatPath);

			console.log(`✅ Chat room created/opened with ${participantName}`, room);
		} catch (error) {
			console.error('❌ Failed to create chat room:', error);
			// TODO: Show error toast/notification
		} finally {
			setIsCreatingRoom(false);
		}
	}

	/**
	 * Handle login navigation
	 */
	function handleLogin() {
		setIsModalOpen(false);
		router.push('/auth/login');
	}

	/**
	 * Handle signup navigation
	 */
	function handleSignup() {
		setIsModalOpen(false);
		router.push('/auth/register');
	}

	return (
		<>
			<div className='flex flex-col items-start gap-2'>
				<Button
					onClick={handleStartChat}
					disabled={isCreatingRoom}
					className={cn('flex items-center gap-2', className)}
					variant={variant}
					size={size}
				>
					{isCreatingRoom ? (
						<Loader2 className='h-4 w-4 animate-spin' />
					) : (
						<MessageCircle className='h-4 w-4' />
					)}
					{isCreatingRoom ? 'Creating chat...' : 'Send Message'}
				</Button>

				<div className='flex items-center text-xs text-muted-foreground'>
					<Badge
						variant='outline'
						className={cn(
							'h-1.5 w-1.5 rounded-full mr-1',
							isOnline ? 'bg-green-500' : 'bg-gray-300'
						)}
					/>
					{isOnline ? 'Online' : 'Offline'}
				</div>
			</div>

			{/* Authentication Required Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Authentication Required</DialogTitle>
						<DialogDescription>
							You need to be logged in to message {participantName}. Create an
							account or log in to continue.
						</DialogDescription>
					</DialogHeader>
					<div className='py-4'>
						<p className='text-sm text-muted-foreground'>
							Creating an account allows you to message other users, track
							orders, and access all platform features.
						</p>
					</div>
					<DialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-0'>
						<Button
							type='button'
							variant='outline'
							onClick={() => setIsModalOpen(false)}
							className='sm:mr-2 sm:w-auto w-full'
						>
							Cancel
						</Button>
						<div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
							<Button
								type='button'
								variant='secondary'
								onClick={handleLogin}
								className='sm:mr-2 sm:w-auto w-full'
							>
								Log In
							</Button>
							<Button
								type='button'
								onClick={handleSignup}
								className='sm:w-auto w-full'
							>
								Sign Up
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
