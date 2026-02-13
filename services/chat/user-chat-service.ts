import api from '@/lib/axios';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// Types based on your ResponseInterceptor format
interface ApiResponse<T> {
	statusCode: number;
	message: string;
	data: T;
}

// Chat Types (matching your backend DTOs)
interface Room {
	id: string;
	initiatorId: string;
	participantId: string;
	otherParticipant: {
		id: string;
		role: string;
	};
	unreadCount: number;
	isActive: boolean;
	lastActivityAt: Date;
	createdAt: Date;
}

interface Message {
	id: string;
	content: string;
	type: string;
	imageUrl?: string;
	senderId: string;
	roomId: string;
	isRead: boolean;
	createdAt: Date;
}

interface CreateRoomRequest {
	participantId: string;
}

interface BlockUserRequest {
	userId: string;
}

interface UnblockUserRequest {
	userId: string;
}

interface BlockEntry {
	id: string;
	blockedUserId: string;
	blockedUser: {
		id: string;
		role: string;
	};
	isAdminBlock: boolean;
	createdAt: Date;
}

interface UserPresence {
	userId: string;
	isOnline: boolean;
	lastSeen?: Date | null;
}

interface ChatStats {
	totalRooms: number;
	activeRooms: number;
	totalMessages: number;
	unreadMessages: number;
	blockedUsers: number;
	isOnline: boolean;
}

interface PaginationParams {
	page?: number;
	limit?: number;
}

// Response Types (matching your controller responses)
interface CreateRoomResponse {
	id: string;
	initiatorId: string;
	participantId: string;
	isActive: boolean;
	createdAt: Date;
}

interface GetRoomsResponse {
	rooms: Room[];
	totalUnreadCount: number;
	pagination: {
		page: number;
		limit: number;
		total: number;
		hasMore: boolean;
	};
}

interface GetRoomDetailsResponse {
	room: Room;
	participant: {
		id: string;
		role: string;
		isOnline: boolean;
		lastSeen?: Date | null;
	};
}

interface GetMessagesResponse {
	messages: Message[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		hasMore: boolean;
	};
}

interface MarkAsReadResponse {
	roomId: string;
	readCount: number;
	markedAt: Date;
}

interface BlockUserResponse {
	blockId: string;
	blockedUserId: string;
	isAdminBlock: boolean;
	createdAt: Date;
}

interface UnblockUserResponse {
	unblockedUserId: string;
	unblockedAt: Date;
}

interface GetBlockListResponse {
	blocks: BlockEntry[];
	totalBlocks: number;
}

/**
 * User Chat Service - REST API Operations
 *
 * Handles all HTTP requests for chat functionality corresponding to ChatController:
 * - Room management (create, list, details)
 * - Message operations (fetch with pagination, mark as read)
 * - Block/unblock operations (user-level)
 * - User presence information
 * - Chat statistics
 *
 * Uses authenticated API client for secure operations
 * Follows your ResponseInterceptor format for consistent responses
 */
export class UserChatService {
	/**
	 * Create a new chat room
	 *
	 * POST /chat/rooms
	 * Authentication: Required (JWT Bearer token)
	 */
	async createRoom(participantId: string): Promise<CreateRoomResponse> {
		const payload: CreateRoomRequest = { participantId };

		const response = await api.post<ApiResponse<CreateRoomResponse>>(
			`${API_URL}/chat/rooms`,
			payload
		);

		return response.data.data;
	}

	/**
	 * Get user's chat rooms with pagination
	 *
	 * GET /chat/rooms
	 * Authentication: Required (JWT Bearer token)
	 */
	async getRooms(params: PaginationParams = {}): Promise<GetRoomsResponse> {
		const { page = 1, limit = 20 } = params;

		const response = await api.get<ApiResponse<GetRoomsResponse>>(
			`${API_URL}/chat/rooms`,
			{
				params: { page, limit },
			}
		);

		return response.data.data;
	}

	/**
	 * Get specific room details
	 *
	 * GET /chat/rooms/:roomId
	 * Authentication: Required (JWT Bearer token)
	 */
	async getRoomDetails(roomId: string): Promise<GetRoomDetailsResponse> {
		const response = await api.get<ApiResponse<GetRoomDetailsResponse>>(
			`${API_URL}/chat/rooms/${roomId}`
		);

		return response.data.data;
	}

	/**
	 * Get messages from a room with pagination
	 *
	 * GET /chat/rooms/:roomId/messages
	 * Authentication: Required (JWT Bearer token)
	 */
	async getMessages(
		roomId: string,
		params: PaginationParams = {}
	): Promise<GetMessagesResponse> {
		const { page = 1, limit = 20 } = params;

		const response = await api.get<ApiResponse<GetMessagesResponse>>(
			`${API_URL}/chat/rooms/${roomId}/messages`,
			{
				params: { page, limit },
			}
		);

		return response.data.data;
	}

	/**
	 * Mark messages as read in a room
	 *
	 * POST /chat/rooms/:roomId/read
	 * Authentication: Required (JWT Bearer token)
	 */
	async markAsRead(roomId: string): Promise<MarkAsReadResponse> {
		const response = await api.post<ApiResponse<MarkAsReadResponse>>(
			`${API_URL}/chat/rooms/${roomId}/read`
		);

		return response.data.data;
	}

	/**
	 * Block a user
	 *
	 * POST /chat/block
	 * Authentication: Required (JWT Bearer token)
	 */
	async blockUser(userId: string): Promise<BlockUserResponse> {
		const payload: BlockUserRequest = { userId };

		const response = await api.post<ApiResponse<BlockUserResponse>>(
			`${API_URL}/chat/block`,
			payload
		);

		return response.data.data;
	}

	/**
	 * Unblock a user
	 *
	 * POST /chat/unblock
	 * Authentication: Required (JWT Bearer token)
	 */
	async unblockUser(userId: string): Promise<UnblockUserResponse> {
		const payload: UnblockUserRequest = { userId };

		const response = await api.post<ApiResponse<UnblockUserResponse>>(
			`${API_URL}/chat/unblock`,
			payload
		);

		return response.data.data;
	}

	/**
	 * Get user's block list
	 *
	 * GET /chat/blocks
	 * Authentication: Required (JWT Bearer token)
	 */
	async getBlockList(): Promise<GetBlockListResponse> {
		const response = await api.get<ApiResponse<GetBlockListResponse>>(
			`${API_URL}/chat/blocks`
		);

		return response.data.data;
	}

	/**
	 * Get user presence information
	 *
	 * GET /chat/presence/:userId
	 * Authentication: Required (JWT Bearer token)
	 */
	async getUserPresence(userId: string): Promise<UserPresence> {
		const response = await api.get<ApiResponse<UserPresence>>(
			`${API_URL}/chat/presence/${userId}`
		);

		return response.data.data;
	}

	/**
	 * Get presence information for multiple users
	 *
	 * Fetches presence for all provided user IDs in parallel
	 */
	async getMultipleUserPresence(
		userIds: string[]
	): Promise<Map<string, UserPresence>> {
		try {
			const presencePromises = userIds.map(async (userId) => {
				try {
					const presence = await this.getUserPresence(userId);
					return { userId, presence };
				} catch (error) {
					console.warn(`Failed to fetch presence for user ${userId}:`, error);
					return {
						userId,
						presence: {
							userId,
							isOnline: false,
							lastSeen: null,
						} as UserPresence,
					};
				}
			});

			const results = await Promise.all(presencePromises);
			const presenceMap = new Map<string, UserPresence>();

			results.forEach(({ userId, presence }) => {
				presenceMap.set(userId, presence);
			});

			return presenceMap;
		} catch (error) {
			console.error('Error fetching multiple user presence:', error);
			return new Map();
		}
	}

	/**
	 * Get user's chat statistics
	 *
	 * GET /chat/stats
	 * Authentication: Required (JWT Bearer token)
	 */
	async getChatStats(): Promise<ChatStats> {
		const response = await api.get<ApiResponse<ChatStats>>(
			`${API_URL}/chat/stats`
		);

		return response.data.data;
	}

	/**
	 * Helper method to check if a user is blocked (client-side utility)
	 *
	 * This method fetches the block list and checks if a specific user is blocked
	 */
	async isUserBlocked(userId: string): Promise<boolean> {
		try {
			const blockList = await this.getBlockList();
			return blockList.blocks.some((block) => block.blockedUserId === userId);
		} catch (error) {
			console.error('Error checking block status:', error);
			return false;
		}
	}

	/**
	 * Helper method to get total unread count across all rooms
	 *
	 * This method fetches rooms and calculates total unread messages
	 */
	async getTotalUnreadCount(): Promise<number> {
		try {
			const roomsData = await this.getRooms({ page: 1, limit: 100 }); // Get all rooms
			return roomsData.totalUnreadCount;
		} catch (error) {
			console.error('Error getting total unread count:', error);
			return 0;
		}
	}

	/**
	 * Helper method to get room by participant ID
	 *
	 * Finds existing room with a specific participant
	 */
	async findRoomByParticipant(participantId: string): Promise<Room | null> {
		try {
			const roomsData = await this.getRooms({ page: 1, limit: 100 });
			const room = roomsData.rooms.find(
				(room) => room.otherParticipant.id === participantId
			);
			return room || null;
		} catch (error) {
			console.error('Error finding room by participant:', error);
			return null;
		}
	}
}

// Export singleton instance
export const userChatService = new UserChatService();

// Export types for use in components
export type {
	Room,
	Message,
	CreateRoomRequest,
	BlockEntry,
	UserPresence,
	ChatStats,
	PaginationParams,
	CreateRoomResponse,
	GetRoomsResponse,
	GetRoomDetailsResponse,
	GetMessagesResponse,
	MarkAsReadResponse,
	BlockUserResponse,
	UnblockUserResponse,
	GetBlockListResponse,
};
