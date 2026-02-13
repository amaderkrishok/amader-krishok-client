'use client';

import React, {
	createContext,
	useState,
	useEffect,
	useCallback,
	ReactNode,
} from 'react';
import { socketService } from '@/services/chat/socket-service';
import { userChatService } from '@/services/chat/user-chat-service';
import type {
	MessageEvent,
	UserOnlineStatusEvent,
	BlockEvent,
	ConnectionEvent,
	MessageReadEvent,
} from '@/services/chat/socket-service';
import type {
	User,
	ConnectionStatus,
	UserPresenceDto,
	RoomResponseDto,
	GlobalMessageHandler,
	GlobalPresenceHandler,
	GlobalBlockHandler,
	ChatContextValue,
} from '@/types/chat';

/**
 * Props for the ChatProvider component
 */
interface ChatProviderProps {
	children: ReactNode;
}

/**
 * Chat context for global chat state management
 */
const ChatContext = createContext<ChatContextValue | null>(null);

/**
 * ChatProvider component that provides global chat state and functionality
 *
 * @description This component manages:
 * - Global chat connection status
 * - All chat rooms and their state
 * - Online user presence tracking
 * - Blocked users management
 * - Real-time event handling and distribution
 *
 * @param props - The provider props
 * @param props.children - Child components that will have access to chat context
 * @returns JSX element wrapping children with chat context
 */
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
	// 🌍 GLOBAL STATE
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [allRooms, setAllRooms] = useState<RoomResponseDto[]>([]);
	const [totalUnreadCount, setTotalUnreadCount] = useState(0);
	const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
	const [onlineUsersGlobal, setOnlineUsersGlobal] = useState<
		Map<string, UserPresenceDto>
	>(new Map());
	const [blockedUsersGlobal, setBlockedUsersGlobal] = useState<Set<string>>(
		new Set()
	);
	const [globalConnectionStatus, setGlobalConnectionStatus] =
		useState<ConnectionStatus>('disconnected');

	// 🔄 EVENT HANDLER STORAGE
	const [globalMessageHandlers, setGlobalMessageHandlers] = useState<
		GlobalMessageHandler[]
	>([]);
	const [globalPresenceHandlers, setGlobalPresenceHandlers] = useState<
		GlobalPresenceHandler[]
	>([]);
	const [globalBlockHandlers, setGlobalBlockHandlers] = useState<
		GlobalBlockHandler[]
	>([]);

	// 🔧 GLOBAL EVENT HANDLERS
	const handleGlobalConnection = useCallback((connection: ConnectionEvent) => {
		setGlobalConnectionStatus(connection.success ? 'connected' : 'error');
		console.log('🔗 Global connection status:', connection);
	}, []);

	const handleGlobalDisconnection = useCallback(() => {
		setGlobalConnectionStatus('disconnected');
		console.log('🔌 Global disconnection');
	}, []);

	/**
	 * Handle global message events and update room state
	 */
	const handleGlobalMessage = useCallback(
		(message: MessageEvent) => {
			// Don't increase unread count for messages sent by current user
			const isOwnMessage = currentUser && message.senderId === currentUser.id;

			// Update unread count for the room (only for messages from other users)
			setAllRooms((prev) =>
				prev.map((room) => {
					if (room.id === message.roomId) {
						return {
							...room,
							unreadCount: isOwnMessage
								? room.unreadCount
								: room.unreadCount + 1,
							lastMessage: {
								content: message.content,
								createdAt: message.createdAt.toString(),
								senderId: message.senderId,
							},
							lastActivityAt: message.createdAt,
						};
					}
					return room;
				})
			);

			// Update total unread count (only for messages from other users)
			if (!isOwnMessage) {
				setTotalUnreadCount((prev) => prev + 1);
			}

			// Notify global message handlers
			globalMessageHandlers.forEach((handler) => {
				try {
					handler(message, message.roomId);
				} catch (error) {
					console.error('Global message handler error:', error);
				}
			});
		},
		[globalMessageHandlers, currentUser]
	);

	/**
	 * Handle global user presence changes
	 */
	const handleGlobalPresence = useCallback(
		(presence: UserOnlineStatusEvent) => {
			console.log('🟢 Chat Provider: Received presence update:', presence);

			setOnlineUsersGlobal((prev) => {
				const newMap = new Map(prev);
				if (presence.isOnline) {
					newMap.set(presence.userId, {
						userId: presence.userId,
						isOnline: presence.isOnline,
						lastSeen: presence.lastSeen,
					});
					console.log(`🟢 User ${presence.userId} is now online`);
				} else {
					newMap.delete(presence.userId);
					console.log(`🔴 User ${presence.userId} is now offline`);
				}
				console.log(`📊 Total online users: ${newMap.size}`);
				return newMap;
			});

			// Notify global presence handlers
			globalPresenceHandlers.forEach((handler) => {
				try {
					handler(presence);
				} catch (error) {
					console.error('Global presence handler error:', error);
				}
			});
		},
		[globalPresenceHandlers]
	);

	/**
	 * Handle global block/unblock events
	 */
	const handleGlobalBlock = useCallback(
		(block: BlockEvent) => {
			if (block.isBlocked) {
				setBlockedUsersGlobal((prev) => new Set([...prev, block.blockedId]));
			} else {
				setBlockedUsersGlobal((prev) => {
					const newSet = new Set(prev);
					newSet.delete(block.blockedId);
					return newSet;
				});
			}

			// Remove blocked user's rooms
			if (block.isBlocked) {
				setAllRooms((prev) =>
					prev.filter((room) => room.participant.id !== block.blockedId)
				);
			}

			// Notify global block handlers
			globalBlockHandlers.forEach((handler) => {
				try {
					handler(block);
				} catch (error) {
					console.error('Global block handler error:', error);
				}
			});
		},
		[globalBlockHandlers]
	);

	/**
	 * Handle message read events and update unread counts
	 */
	const handleMessageRead = useCallback((readEvent: MessageReadEvent) => {
		console.log('📖 Received message read event:', readEvent);

		// Update the room's unread count when messages are marked as read
		setAllRooms((prev) =>
			prev.map((room) => {
				if (room.id === readEvent.roomId) {
					// Fetch updated room details to get accurate unread count
					userChatService
						.getRooms({ page: 1, limit: 100 })
						.then((response) => {
							const updatedRoom = response.rooms.find(
								(r) => r.id === readEvent.roomId
							);
							if (updatedRoom) {
								setAllRooms((prevRooms) =>
									prevRooms.map((prevRoom) => {
										if (prevRoom.id === readEvent.roomId) {
											return {
												...prevRoom,
												unreadCount: updatedRoom.unreadCount,
											};
										}
										return prevRoom;
									})
								);

								// Update total unread count
								setTotalUnreadCount(response.totalUnreadCount);
							}
						})
						.catch(console.error);
				}
				return room;
			})
		);
	}, []);

	/**
	 * Initialize the chat system by connecting to socket and loading initial data
	 */
	const initializeChat = useCallback(async (): Promise<void> => {
		try {
			setGlobalConnectionStatus('connecting');

			// 1. Connect to socket
			await socketService.connect();

			// 2. Fetch initial data in parallel
			const fetchInitialData = async () => {
				// First, fetch rooms to get participant IDs
				const roomsResponse = await userChatService.getRooms({
					page: 1,
					limit: 100,
				});
				const transformedRooms: RoomResponseDto[] = roomsResponse.rooms.map(
					(room) => ({
						...room,
						participant: {
							id: room.otherParticipant.id,
							name: 'Unknown User',
							role: room.otherParticipant.role,
						},
					})
				);
				setAllRooms(transformedRooms);
				setTotalUnreadCount(roomsResponse.totalUnreadCount);

				// Get participant IDs for presence lookup
				const participantIds = transformedRooms.map(
					(room) => room.participant.id
				);

				// Fetch remaining data in parallel
				await Promise.all([
					userChatService.getTotalUnreadCount().then(setTotalUnreadCount),
					userChatService.getBlockList().then((response) => {
						const blockedIds = response.blocks.map(
							(block) => block.blockedUserId
						);
						setBlockedUsersGlobal(new Set(blockedIds));
					}),
					// Fetch initial presence data for all participants
					participantIds.length > 0
						? userChatService
								.getMultipleUserPresence(participantIds)
								.then((presenceMap) => {
									const onlineMap = new Map();
									presenceMap.forEach((presence, userId) => {
										if (presence.isOnline) {
											onlineMap.set(userId, {
												userId: presence.userId,
												isOnline: presence.isOnline,
												lastSeen: presence.lastSeen,
											});
										}
									});
									setOnlineUsersGlobal(onlineMap);
									console.log(
										`📊 Loaded initial presence for ${presenceMap.size} users, ${onlineMap.size} online`
									);
								})
						: Promise.resolve(),
					// Fetch current user from session
					fetch('/api/auth/session')
						.then((response) => response.json())
						.then((session) => {
							if (session && session.user) {
								setCurrentUser({
									id: session.user.id,
									name: session.user.name || 'User',
									role: session.user.role || 'USER',
								});
								console.log('✅ Current user loaded:', session.user);
							} else {
								// Fallback to dummy user if no session
								setCurrentUser({
									id: 'current-user-id',
									name: 'Current User',
									role: 'USER',
								});
								console.warn('⚠️ No session found, using dummy user');
							}
						})
						.catch((error) => {
							console.error('❌ Failed to fetch session:', error);
							// Fallback to dummy user
							setCurrentUser({
								id: 'current-user-id',
								name: 'Current User',
								role: 'USER',
							});
						}),
				]);
			};

			await fetchInitialData();

			setGlobalConnectionStatus('connected');
			console.log('✅ Chat system initialized successfully');
		} catch (error) {
			setGlobalConnectionStatus('error');
			console.error('❌ Chat initialization failed:', error);
			throw error;
		}
	}, []);

	/**
	 * Create a new chat room with the specified participant
	 */
	const createRoom = useCallback(
		async (participantId: string): Promise<RoomResponseDto> => {
			try {
				const response = await userChatService.createRoom(participantId);

				// Refresh rooms to get the new room with full details
				const roomsResponse = await userChatService.getRooms({
					page: 1,
					limit: 100,
				});
				const transformedRooms: RoomResponseDto[] = roomsResponse.rooms.map(
					(room) => ({
						...room,
						participant: {
							id: room.otherParticipant.id,
							name: 'Unknown User',
							role: room.otherParticipant.role,
						},
					})
				);
				setAllRooms(transformedRooms);

				// Find and return the created room
				const createdRoom = transformedRooms.find(
					(room) => room.id === response.id
				);
				if (createdRoom) {
					return createdRoom;
				}

				// If not found in allRooms, create a basic room response
				return {
					...response,
					participant: {
						id: participantId,
						name: 'Unknown User', // This should be fetched from user service
						role: 'USER',
					},
					unreadCount: 0,
					lastActivityAt: response.createdAt,
				} as RoomResponseDto;
			} catch (error) {
				console.error('❌ Failed to create room:', error);
				throw error;
			}
		},
		[]
	);

	/**
	 * Refresh the list of chat rooms
	 */
	const refreshRooms = useCallback(async (): Promise<void> => {
		try {
			const response = await userChatService.getRooms({ page: 1, limit: 100 });

			// Transform rooms to include participant details
			const transformedRooms: RoomResponseDto[] = response.rooms.map(
				(room) => ({
					...room,
					participant: {
						id: room.otherParticipant.id,
						name: 'Unknown User', // This should come from user service
						role: room.otherParticipant.role,
					},
				})
			);

			setAllRooms(transformedRooms);
			setTotalUnreadCount(response.totalUnreadCount);
		} catch (error) {
			console.error('❌ Failed to refresh rooms:', error);
			throw error;
		}
	}, []);

	/**
	 * Refresh the total unread message count
	 */
	const refreshUnreadCounts = useCallback(async (): Promise<void> => {
		try {
			const totalUnread = await userChatService.getTotalUnreadCount();
			setTotalUnreadCount(totalUnread);
		} catch (error) {
			console.error('❌ Failed to refresh unread counts:', error);
		}
	}, []);

	/**
	 * Block a user but keep their rooms visible
	 */
	const blockUser = useCallback(async (userId: string): Promise<void> => {
		try {
			await userChatService.blockUser(userId);
			setBlockedUsersGlobal((prev) => new Set([...prev, userId]));

			// Keep rooms visible even when user is blocked
			// Users should still be able to see chat history and unblock if needed

			console.log(`🚫 User ${userId} blocked successfully`);
		} catch (error) {
			console.error('❌ Failed to block user:', error);
			throw error;
		}
	}, []);

	/**
	 * Unblock a user
	 */
	const unblockUser = useCallback(async (userId: string): Promise<void> => {
		try {
			await userChatService.unblockUser(userId);
			setBlockedUsersGlobal((prev) => {
				const newSet = new Set(prev);
				newSet.delete(userId);
				return newSet;
			});

			console.log(`✅ User ${userId} unblocked successfully`);
		} catch (error) {
			console.error('❌ Failed to unblock user:', error);
			throw error;
		}
	}, []);

	/**
	 * Manually request presence update for a user
	 */
	const requestPresenceUpdate = useCallback(
		async (userId: string): Promise<void> => {
			try {
				console.log(`📋 Requesting presence update for user: ${userId}`);
				const presence = await userChatService.getUserPresence(userId);
				console.log(`📋 Manual presence fetch result:`, presence);

				// Update the presence manually if the real-time event isn't working
				setOnlineUsersGlobal((prev) => {
					const newMap = new Map(prev);
					if (presence.isOnline) {
						newMap.set(presence.userId, {
							userId: presence.userId,
							isOnline: presence.isOnline,
							lastSeen: presence.lastSeen,
						});
					} else {
						newMap.delete(presence.userId);
					}
					return newMap;
				});
			} catch (error) {
				console.error(
					`❌ Failed to request presence for user ${userId}:`,
					error
				);
			}
		},
		[]
	);

	/**
	 * Refresh presence data for all chat participants
	 */
	const refreshAllPresence = useCallback(async (): Promise<void> => {
		try {
			console.log('🔄 Refreshing presence for all participants...');
			const participantIds = allRooms.map((room) => room.participant.id);

			if (participantIds.length > 0) {
				const presenceMap = await userChatService.getMultipleUserPresence(
					participantIds
				);
				const onlineMap = new Map();

				presenceMap.forEach((presence, userId) => {
					if (presence.isOnline) {
						onlineMap.set(userId, {
							userId: presence.userId,
							isOnline: presence.isOnline,
							lastSeen: presence.lastSeen,
						});
					}
				});

				setOnlineUsersGlobal(onlineMap);
				console.log(
					`✅ Refreshed presence: ${presenceMap.size} users checked, ${onlineMap.size} online`
				);
			}
		} catch (error) {
			console.error('❌ Failed to refresh presence data:', error);
		}
	}, [allRooms]);

	/**
	 * Mark messages as read for a specific room and update unread counts
	 */
	const markRoomAsRead = useCallback(async (roomId: string): Promise<void> => {
		try {
			console.log(`📖 Marking room ${roomId} as read...`);

			// Call the API to mark messages as read
			await userChatService.markAsRead(roomId);

			// Update the room's unread count to 0
			setAllRooms((prev) =>
				prev.map((room) => {
					if (room.id === roomId) {
						const previousUnreadCount = room.unreadCount;
						console.log(
							`📖 Room ${roomId} unread count: ${previousUnreadCount} -> 0`
						);

						// Update total unread count by subtracting this room's unread count
						if (previousUnreadCount > 0) {
							setTotalUnreadCount((prevTotal) =>
								Math.max(0, prevTotal - previousUnreadCount)
							);
						}

						return {
							...room,
							unreadCount: 0,
						};
					}
					return room;
				})
			);

			console.log(`✅ Successfully marked room ${roomId} as read`);
		} catch (error) {
			console.error(`❌ Failed to mark room ${roomId} as read:`, error);
			// Don't throw the error to prevent breaking the UI
		}
	}, []);

	/**
	 * Set active room and mark it as read
	 */
	const setActiveRoom = useCallback(
		async (roomId: string | null) => {
			setActiveRoomId(roomId);

			// Mark the room as read when it becomes active
			if (roomId) {
				try {
					// Small delay to allow messages to load first
					setTimeout(async () => {
						await markRoomAsRead(roomId);
					}, 500);
				} catch (error) {
					console.error('Failed to mark active room as read:', error);
				}
			}
		},
		[markRoomAsRead]
	);

	// 🎪 UTILITY METHODS
	const isUserBlocked = useCallback(
		(userId: string): boolean => {
			return blockedUsersGlobal.has(userId);
		},
		[blockedUsersGlobal]
	);

	const getUserPresence = useCallback(
		(userId: string): UserPresenceDto | null => {
			return onlineUsersGlobal.get(userId) || null;
		},
		[onlineUsersGlobal]
	);

	const getRoomById = useCallback(
		(roomId: string): RoomResponseDto | null => {
			return allRooms.find((room) => room.id === roomId) || null;
		},
		[allRooms]
	);

	// 🔄 GLOBAL EVENT HANDLER SUBSCRIPTIONS
	const onGlobalMessage = useCallback(
		(handler: GlobalMessageHandler): (() => void) => {
			setGlobalMessageHandlers((prev) => [...prev, handler]);
			return () => {
				setGlobalMessageHandlers((prev) => prev.filter((h) => h !== handler));
			};
		},
		[]
	);

	const onGlobalPresence = useCallback(
		(handler: GlobalPresenceHandler): (() => void) => {
			setGlobalPresenceHandlers((prev) => [...prev, handler]);
			return () => {
				setGlobalPresenceHandlers((prev) => prev.filter((h) => h !== handler));
			};
		},
		[]
	);

	const onGlobalBlock = useCallback(
		(handler: GlobalBlockHandler): (() => void) => {
			setGlobalBlockHandlers((prev) => [...prev, handler]);
			return () => {
				setGlobalBlockHandlers((prev) => prev.filter((h) => h !== handler));
			};
		},
		[]
	);

	// 🔄 SOCKET INITIALIZATION
	useEffect(() => {
		initializeChat().catch(console.error);

		return () => {
			socketService.disconnect();
		};
	}, [initializeChat]);

	// 🎪 GLOBAL EVENT SUBSCRIPTIONS
	useEffect(() => {
		const unsubscribers = [
			socketService.onConnection(handleGlobalConnection),
			socketService.onDisconnect(handleGlobalDisconnection),
			socketService.onMessage(handleGlobalMessage),
			socketService.onMessageRead(handleMessageRead),
			socketService.onOnlineStatus(handleGlobalPresence),
			socketService.onBlock(handleGlobalBlock),
		];

		return () => {
			unsubscribers.forEach((unsub) => unsub());
		};
	}, [
		handleGlobalConnection,
		handleGlobalDisconnection,
		handleGlobalMessage,
		handleMessageRead,
		handleGlobalPresence,
		handleGlobalBlock,
	]);

	const value: ChatContextValue = {
		// State
		currentUser,
		allRooms,
		totalUnreadCount,
		globalConnectionStatus,
		activeRoomId,
		onlineUsersGlobal,
		blockedUsersGlobal,

		// Methods
		setActiveRoom,
		initializeChat,
		createRoom,
		refreshRooms,
		refreshUnreadCounts,
		blockUser,
		unblockUser,
		markRoomAsRead,
		isUserBlocked,
		getUserPresence,
		getRoomById,
		onGlobalMessage,
		onGlobalPresence,
		onGlobalBlock,
		requestPresenceUpdate,
		refreshAllPresence,
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
