import { useState, useEffect, useCallback, useRef } from 'react';
import { socketService } from '@/services/chat/socket-service';
import { userChatService } from '@/services/chat/user-chat-service';
import { useChatContext } from '@/hooks/useChatContext';
import type {
	MessageEvent,
	TypingEvent,
	MessageReadEvent,
	ConnectionStatus,
	MessageType,
	UserPresenceDto,
	RoomDetailsDto,
	PaginatedMessages,
	ChatError,
	ChatHookReturn,
} from '@/types/chat';

export const useChat = (roomId?: string): ChatHookReturn => {
	// Access chat context for block status and global methods
	const { isUserBlocked, markRoomAsRead } = useChatContext();

	// 🔄 REAL-TIME STATE
	const [messages, setMessages] = useState<MessageEvent[]>([]);
	const [typingUsers, setTypingUsers] = useState<TypingEvent[]>([]);
	const [connectionStatus, setConnectionStatus] =
		useState<ConnectionStatus>('disconnected');
	const [currentRoomUsers, setCurrentRoomUsers] = useState<UserPresenceDto[]>(
		[]
	);

	// 📊 REST API STATE
	const [roomDetails, setRoomDetails] = useState<RoomDetailsDto | null>(null);
	const [messageHistory, setMessageHistory] = useState<PaginatedMessages>({
		messages: [],
		pagination: { page: 1, limit: 20, total: 0, hasMore: false },
	});
	const [isLoadingMessages, setIsLoadingMessages] = useState(false);
	const [isLoadingHistory, setIsLoadingHistory] = useState(false);
	const [hasMoreMessages, setHasMoreMessages] = useState(false);
	const [error, setError] = useState<ChatError | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	// 🎯 REFS for cleanup and debouncing
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const unsubscribersRef = useRef<(() => void)[]>([]);

	// 🔧 ERROR HANDLER
	const handleError = useCallback((err: unknown, context?: string) => {
		const errorObj = err as { code?: string; message?: string };
		const chatError: ChatError = {
			code: errorObj?.code || 'UNKNOWN_ERROR',
			message: errorObj?.message || 'An unknown error occurred',
			timestamp: new Date(),
			context,
		};
		setError(chatError);
		console.error(`Chat Error [${context}]:`, err);
	}, []);

	// 🔄 REAL-TIME EVENT HANDLERS
	const handleNewMessage = useCallback(
		(message: MessageEvent) => {
			if (!roomId || message.roomId !== roomId) return;

			setMessages((prev) => {
				// Avoid duplicates
				if (prev.some((msg) => msg.id === message.id)) return prev;
				return [...prev, message].sort(
					(a, b) =>
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			});

			// Auto-mark as read if message is from another user
			// Note: We'll let the component handle marking messages as read
			// to avoid the "cannot mark your own messages as read" error
		},
		[roomId]
	);

	const handleTypingEvent = useCallback(
		(typing: TypingEvent) => {
			if (!roomId || typing.roomId !== roomId) return;

			setTypingUsers((prev) => {
				const filtered = prev.filter((t) => t.userId !== typing.userId);
				return typing.isTyping ? [...filtered, typing] : filtered;
			});

			// Auto-remove typing after 3 seconds
			if (typing.isTyping) {
				setTimeout(() => {
					setTypingUsers((prev) =>
						prev.filter((t) => t.userId !== typing.userId)
					);
				}, 3000);
			}
		},
		[roomId]
	);

	const handleMessageRead = useCallback(
		(readEvent: MessageReadEvent) => {
			if (!roomId || readEvent.roomId !== roomId) return;

			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === readEvent.messageId
						? { ...msg, isRead: readEvent.isRead }
						: msg
				)
			);
		},
		[roomId]
	);

	// 🔧 REAL-TIME METHODS
	const sendMessage = useCallback(
		async (
			content: string,
			type: MessageType = 'text'
		): Promise<MessageEvent> => {
			if (!roomId) throw new Error('No active room');
			if (!content.trim()) throw new Error('Message content cannot be empty');

			try {
				const message = await socketService.sendMessage({
					content: content.trim(),
					roomId,
					type,
				});

				// Message will be added via handleNewMessage when received from server
				return message;
			} catch (err) {
				handleError(err, 'sendMessage');
				throw err;
			}
		},
		[roomId, handleError]
	);

	const markMessageAsRead = useCallback(
		async (messageId: string): Promise<void> => {
			if (!roomId) throw new Error('No active room');

			try {
				await socketService.markMessageAsRead(messageId, roomId);
			} catch (err) {
				handleError(err, 'markMessageAsRead');
				throw err;
			}
		},
		[roomId, handleError]
	);

	const sendTyping = useCallback(() => {
		if (!roomId) return;

		socketService.sendTyping(roomId);

		// Clear existing timeout
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// Auto-stop typing after 3 seconds
		typingTimeoutRef.current = setTimeout(() => {
			socketService.sendStopTyping(roomId);
		}, 3000);
	}, [roomId]);

	const sendStopTyping = useCallback(() => {
		if (!roomId) return;

		socketService.sendStopTyping(roomId);

		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
			typingTimeoutRef.current = null;
		}
	}, [roomId]);

	const joinRoom = useCallback(async (): Promise<void> => {
		if (!roomId) throw new Error('No room ID provided');

		try {
			await socketService.joinRoom(roomId);
			console.log(`🏠 Joined room: ${roomId}`);
		} catch (err) {
			handleError(err, 'joinRoom');
			throw err;
		}
	}, [roomId, handleError]);

	const leaveRoom = useCallback(async (): Promise<void> => {
		if (!roomId) throw new Error('No room ID provided');

		try {
			await socketService.leaveRoom(roomId);
			console.log(`🚪 Left room: ${roomId}`);
		} catch (err) {
			handleError(err, 'leaveRoom');
			throw err;
		}
	}, [roomId, handleError]);

	// 🌐 REST API METHODS
	const fetchMessages = useCallback(
		async (page: number = 1): Promise<void> => {
			if (!roomId) return;

			setIsLoadingMessages(page === 1);
			setIsLoadingHistory(page > 1);

			try {
				const response = await userChatService.getMessages(roomId, {
					page,
					limit: 20,
				});

				const formattedMessages: MessageEvent[] = response.messages.map(
					(msg) => ({
						id: msg.id,
						content: msg.content,
						type: msg.type,
						imageUrl: msg.imageUrl,
						senderId: msg.senderId,
						roomId: msg.roomId,
						isRead: msg.isRead,
						createdAt: msg.createdAt,
					})
				);

				if (page === 1) {
					// First page - replace all messages
					setMessages(formattedMessages);
					setCurrentPage(1);
				} else {
					// Subsequent pages - prepend to existing messages
					setMessages((prev) => [...formattedMessages, ...prev]);
					setCurrentPage(page);
				}

				setMessageHistory({
					messages: formattedMessages,
					pagination: response.pagination,
				});

				setHasMoreMessages(response.pagination.hasMore);
			} catch (err) {
				handleError(err, 'fetchMessages');
			} finally {
				setIsLoadingMessages(false);
				setIsLoadingHistory(false);
			}
		},
		[roomId, handleError]
	);

	const loadMoreMessages = useCallback(async (): Promise<void> => {
		if (!hasMoreMessages || isLoadingHistory) return;

		const nextPage = currentPage + 1;
		await fetchMessages(nextPage);
	}, [hasMoreMessages, isLoadingHistory, currentPage, fetchMessages]);

	const markAllAsRead = useCallback(async (): Promise<void> => {
		if (!roomId) return;

		try {
			// Use the global mark room as read method to ensure unread counts are updated
			await markRoomAsRead(roomId);

			// Update local messages
			setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })));
		} catch (err) {
			handleError(err, 'markAllAsRead');
		}
	}, [roomId, markRoomAsRead, handleError]);

	const refreshRoomDetails = useCallback(async (): Promise<void> => {
		if (!roomId) return;

		try {
			const response = await userChatService.getRoomDetails(roomId);
			const participantId = response.room.otherParticipant.id;

			// Check if user is blocked using the chat context
			const participantIsBlocked = isUserBlocked(participantId);

			let presence: UserPresenceDto | null = null;

			// Only try to get presence if user is not blocked
			if (!participantIsBlocked) {
				try {
					presence = await userChatService.getUserPresence(participantId);
				} catch (presenceError: unknown) {
					// Handle 403 error when communication is blocked
					const errorObj = presenceError as { response?: { status?: number } };
					if (errorObj?.response?.status === 403) {
						console.log('Cannot get presence - communication is blocked');
						// Set default presence for blocked user
						presence = {
							userId: participantId,
							isOnline: false,
							lastSeen: null,
						};
					} else {
						throw presenceError;
					}
				}
			} else {
				// Create default presence for blocked user
				presence = {
					userId: participantId,
					isOnline: false,
					lastSeen: null,
				};
			}

			const roomDetailsDto: RoomDetailsDto = {
				room: {
					...response.room,
					participant: {
						id: participantId,
						name: response.participant.id, // This should come from user service
						image: undefined, // This should come from user service
						role: response.room.otherParticipant.role,
					},
				},
				participant: {
					...presence,
					userName: response.participant.id, // This should come from user service
				},
				isBlocked: participantIsBlocked,
				canMessage: response.room.isActive && !participantIsBlocked,
			};

			setRoomDetails(roomDetailsDto);
		} catch (err) {
			handleError(err, 'refreshRoomDetails');
		}
	}, [roomId, handleError, isUserBlocked]);

	// 🎮 UTILITY METHODS
	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const retryConnection = useCallback(async (): Promise<void> => {
		setConnectionStatus('connecting');
		try {
			await socketService.connect();
			setConnectionStatus('connected');
			if (roomId) {
				await joinRoom();
			}
		} catch (err) {
			setConnectionStatus('error');
			handleError(err, 'retryConnection');
		}
	}, [roomId, joinRoom, handleError]);

	// 🎯 INITIALIZATION EFFECT
	useEffect(() => {
		if (!roomId) {
			// Clear room-specific state when no roomId
			setMessages([]);
			setTypingUsers([]);
			setRoomDetails(null);
			setCurrentRoomUsers([]);
			setCurrentPage(1); // Reset page counter
			setHasMoreMessages(false);
			return;
		}

		// Reset state for new room
		setMessages([]);
		setTypingUsers([]);
		setCurrentPage(1);
		setHasMoreMessages(false);

		// Auto-join room and fetch initial data
		const initializeRoom = async () => {
			try {
				setConnectionStatus('connecting');

				// Ensure socket connection
				if (!socketService.isConnected()) {
					await socketService.connect();
				}

				setConnectionStatus('connected');

				// Join room and fetch data
				await Promise.all([joinRoom(), fetchMessages(1), refreshRoomDetails()]);
			} catch (err) {
				setConnectionStatus('error');
				handleError(err, 'initializeRoom');
			}
		};

		initializeRoom();

		// Subscribe to real-time events
		const unsubscribers = [
			socketService.onMessage(handleNewMessage),
			socketService.onTyping(handleTypingEvent),
			socketService.onMessageRead(handleMessageRead),
		];

		unsubscribersRef.current = unsubscribers;

		// Cleanup on unmount or roomId change
		return () => {
			if (roomId) {
				leaveRoom().catch(console.error);
			}

			unsubscribersRef.current.forEach((unsub) => unsub());

			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, [
		roomId,
		joinRoom,
		fetchMessages,
		refreshRoomDetails,
		handleError,
		handleNewMessage,
		handleTypingEvent,
		handleMessageRead,
		leaveRoom,
	]);

	return {
		// State
		messages,
		typingUsers,
		connectionStatus,
		currentRoomUsers,
		roomDetails,
		messageHistory,
		isLoadingMessages,
		isLoadingHistory,
		hasMoreMessages,
		error,

		// Real-time methods
		sendMessage,
		markMessageAsRead,
		sendTyping,
		sendStopTyping,
		joinRoom,
		leaveRoom,

		// REST API methods
		fetchMessages,
		loadMoreMessages,
		markAllAsRead,
		refreshRoomDetails,

		// Utility methods
		clearError,
		retryConnection,
	};
};
