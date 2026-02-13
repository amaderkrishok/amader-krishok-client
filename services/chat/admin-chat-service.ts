import api from '@/lib/axios';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// Types based on your ResponseInterceptor format
interface ApiResponse<T> {
	statusCode: number;
	message: string;
	data: T;
}

// Admin Chat Types (matching your AdminChatController DTOs)
interface AdminChatStats {
	totalRooms: number;
	activeRooms: number;
	inactiveRooms: number;
	totalMessages: number;
	totalBlocks: number;
	adminBlocks: number;
	onlineUsers: number;
	totalConnections: number;
	serverUptime: number;
}

interface AdminRoomDetails {
	id: string;
	initiatorId: string;
	participantId: string;
	initiator: {
		id: string;
		role: string;
	};
	participant: {
		id: string;
		role: string;
	};
	isActive: boolean;
	totalMessages: number;
	unreadCountInitiator: number;
	unreadCountParticipant: number;
	createdAt: Date;
	updatedAt: Date;
	lastActivityAt: Date;
}

interface UserChatOverview {
	userId: string;
	totalRooms: number;
	totalMessages: number;
	unreadMessages: number;
	isOnline: boolean;
	lastSeen?: Date | null;
	isBlocked: boolean;
	hasAdminBlock: boolean;
}

interface AdminBlockRequest {
	targetUserId: string;
}

interface AdminUnblockRequest {
	targetUserId: string;
}

interface AdminBlockResponse {
	blockId: string;
	adminId: string;
	targetUserId: string;
	isAdminBlock: boolean;
	createdAt: Date;
}

interface AdminUnblockResponse {
	adminId: string;
	targetUserId: string;
	unblockedAt: Date;
}

interface AdminBlockEntry {
	id: string;
	blockerId: string;
	blockedId: string;
	blocker: {
		id: string;
		role: string;
	};
	blocked: {
		id: string;
		role: string;
	};
	isAdminBlock: boolean;
	createdAt: Date;
}

interface WebSocketStats {
	connectionStats: Record<string, unknown>;
	serverHealth: Record<string, unknown>;
	presenceStats: Record<string, unknown>;
	onlineUsers: {
		count: number;
		userIds: string[];
	};
}

interface SystemHealth {
	server: Record<string, unknown>;
	presence: Record<string, unknown>;
	timestamp: Date;
	status: string;
}

interface ExportChatDataRequest {
	format: 'xlsx' | 'csv' | 'json';
	type: 'messages' | 'rooms' | 'users' | 'blocks';
	dateFrom?: Date;
	dateTo?: Date;
	includeDeleted?: boolean;
}

interface ForceDisconnectResponse {
	adminId: string;
	targetUserId: string;
	disconnectedAt: Date;
	connectionsRemoved: number;
}

interface PaginationParams {
	page?: number;
	limit?: number;
}

interface PaginationResponse {
	page: number;
	limit: number;
	total: number;
	hasMore: boolean;
}

// Response Types (matching your controller responses)
interface GetAllRoomsResponse {
	rooms: AdminRoomDetails[];
	pagination: PaginationResponse;
}

interface GetRoomDetailsResponse {
	room: AdminRoomDetails;
	messages: Record<string, unknown>[];
}

interface GetAdminBlocksResponse {
	blocks: AdminBlockEntry[];
}

/**
 * Admin Chat Service - Administrative Operations
 *
 * Handles all HTTP requests for admin chat functionality corresponding to AdminChatController:
 * - System statistics and monitoring
 * - Room management and oversight
 * - User chat overview and management
 * - Administrative blocking operations
 * - WebSocket connection monitoring
 * - System health monitoring
 * - Force user disconnection
 *
 * Requires ADMIN or MOD role authentication
 * Uses authenticated API client for secure operations
 */
export class AdminChatService {
	/**
	 * Get comprehensive chat system statistics
	 *
	 * GET /admin/chat/stats
	 * Authentication: Required (ADMIN/MOD only)
	 */
	async getChatStats(): Promise<AdminChatStats> {
		const response = await api.get<ApiResponse<AdminChatStats>>(
			`${API_URL}/admin/chat/stats`
		);

		return response.data.data;
	}

	/**
	 * Get all chat rooms with admin details and pagination
	 *
	 * GET /admin/chat/rooms
	 * Authentication: Required (ADMIN/MOD only)
	 */
	async getAllRooms(
		params: PaginationParams = {}
	): Promise<GetAllRoomsResponse> {
		const { page = 1, limit = 20 } = params;

		const response = await api.get<ApiResponse<GetAllRoomsResponse>>(
			`${API_URL}/admin/chat/rooms`,
			{
				params: { page, limit },
			}
		);

		return response.data.data;
	}

	/**
	 * Get detailed information about a specific chat room
	 *
	 * GET /admin/chat/rooms/:roomId
	 * Authentication: Required (ADMIN/MOD only)
	 */
	async getRoomDetails(roomId: string): Promise<GetRoomDetailsResponse> {
		const response = await api.get<ApiResponse<GetRoomDetailsResponse>>(
			`${API_URL}/admin/chat/rooms/${roomId}`
		);

		return response.data.data;
	}

	/**
	 * Get user chat overview for administrative purposes
	 *
	 * GET /admin/chat/users/:userId/overview
	 * Authentication: Required (ADMIN/MOD only)
	 */
	async getUserChatOverview(userId: string): Promise<UserChatOverview> {
		const response = await api.get<ApiResponse<UserChatOverview>>(
			`${API_URL}/admin/chat/users/${userId}/overview`
		);

		return response.data.data;
	}

	/**
	 * Admin-level block user operation
	 *
	 * POST /admin/chat/block
	 * Authentication: Required (ADMIN/MOD only)
	 */
	async adminBlockUser(targetUserId: string): Promise<AdminBlockResponse> {
		const payload: AdminBlockRequest = { targetUserId };

		const response = await api.post<ApiResponse<AdminBlockResponse>>(
			`${API_URL}/admin/chat/block`,
			payload
		);

		return response.data.data;
	}

	/**
	 * Admin-level unblock user operation
	 *
	 * DELETE /admin/chat/block
	 * Authentication: Required (ADMIN/MOD only)
	 */
	async adminUnblockUser(targetUserId: string): Promise<AdminUnblockResponse> {
		const payload: AdminUnblockRequest = { targetUserId };

		const response = await api.delete<ApiResponse<AdminUnblockResponse>>(
			`${API_URL}/admin/chat/block`,
			{
				data: payload,
			}
		);

		return response.data.data;
	}

	/**
	 * Get all admin-issued blocks
	 *
	 * GET /admin/chat/blocks/admin
	 * Authentication: Required (ADMIN/MOD only)
	 */
	async getAdminBlocks(): Promise<GetAdminBlocksResponse> {
		const response = await api.get<ApiResponse<GetAdminBlocksResponse>>(
			`${API_URL}/admin/chat/blocks/admin`
		);

		return response.data.data;
	}

	/**
	 * Get WebSocket connection statistics
	 *
	 * GET /admin/chat/websocket/stats
	 * Authentication: Required (ADMIN/MOD only)
	 */
	async getWebSocketStats(): Promise<WebSocketStats> {
		const response = await api.get<ApiResponse<WebSocketStats>>(
			`${API_URL}/admin/chat/websocket/stats`
		);

		return response.data.data;
	}

	/**
	 * Get system health information
	 *
	 * GET /admin/chat/system/health
	 * Authentication: Required (ADMIN/MOD only)
	 */
	async getSystemHealth(): Promise<SystemHealth> {
		const response = await api.get<ApiResponse<SystemHealth>>(
			`${API_URL}/admin/chat/system/health`
		);

		return response.data.data;
	}

	/**
	 * Force disconnect a user from WebSocket connections
	 *
	 * POST /admin/chat/users/:userId/disconnect
	 * Authentication: Required (ADMIN/MOD only)
	 */
	async forceDisconnectUser(userId: string): Promise<ForceDisconnectResponse> {
		const response = await api.post<ApiResponse<ForceDisconnectResponse>>(
			`${API_URL}/admin/chat/users/${userId}/disconnect`
		);

		return response.data.data;
	}

	/**
	 * Helper method to check if a user has admin block
	 *
	 * Fetches admin blocks and checks if specific user is blocked
	 */
	async isUserAdminBlocked(userId: string): Promise<boolean> {
		try {
			const adminBlocks = await this.getAdminBlocks();
			return adminBlocks.blocks.some((block) => block.blockedId === userId);
		} catch (error) {
			console.error('Error checking admin block status:', error);
			return false;
		}
	}

	/**
	 * Helper method to get total system overview
	 *
	 * Combines stats and health for dashboard overview
	 */
	async getSystemOverview(): Promise<{
		stats: AdminChatStats;
		health: SystemHealth;
		wsStats: WebSocketStats;
	}> {
		try {
			const [stats, health, wsStats] = await Promise.all([
				this.getChatStats(),
				this.getSystemHealth(),
				this.getWebSocketStats(),
			]);

			return { stats, health, wsStats };
		} catch (error) {
			console.error('Error getting system overview:', error);
			throw error;
		}
	}

	/**
	 * Helper method to search rooms by participant
	 *
	 * Gets all rooms and filters by participant ID
	 */
	async findRoomsByParticipant(
		participantId: string,
		params: PaginationParams = {}
	): Promise<AdminRoomDetails[]> {
		try {
			const roomsData = await this.getAllRooms(params);
			return roomsData.rooms.filter(
				(room) =>
					room.initiatorId === participantId ||
					room.participantId === participantId
			);
		} catch (error) {
			console.error('Error finding rooms by participant:', error);
			return [];
		}
	}

	/**
	 * Helper method to get active rooms count
	 *
	 * Filters all rooms to get only active ones
	 */
	async getActiveRoomsCount(): Promise<number> {
		try {
			const roomsData = await this.getAllRooms({ page: 1, limit: 1000 });
			return roomsData.rooms.filter((room) => room.isActive).length;
		} catch (error) {
			console.error('Error getting active rooms count:', error);
			return 0;
		}
	}

	/**
	 * Helper method to get rooms by activity period
	 *
	 * Filters rooms by last activity date
	 */
	async getRoomsByActivityPeriod(
		hoursAgo: number,
		params: PaginationParams = {}
	): Promise<AdminRoomDetails[]> {
		try {
			const roomsData = await this.getAllRooms(params);
			const cutoffDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

			return roomsData.rooms.filter(
				(room) => new Date(room.lastActivityAt) >= cutoffDate
			);
		} catch (error) {
			console.error('Error getting rooms by activity period:', error);
			return [];
		}
	}

	/**
	 * Helper method to bulk force disconnect multiple users
	 *
	 * Disconnects multiple users sequentially
	 */
	async bulkForceDisconnectUsers(userIds: string[]): Promise<{
		successful: ForceDisconnectResponse[];
		failed: { userId: string; error: string }[];
	}> {
		const successful: ForceDisconnectResponse[] = [];
		const failed: { userId: string; error: string }[] = [];

		for (const userId of userIds) {
			try {
				const result = await this.forceDisconnectUser(userId);
				successful.push(result);
			} catch (error) {
				failed.push({
					userId,
					error: error instanceof Error ? error.message : 'Unknown error',
				});
			}
		}

		return { successful, failed };
	}

	/**
	 * Export chat data in various formats
	 *
	 * @param {ExportChatDataRequest} options - Export configuration options
	 * @returns {Promise<Blob>} Exported data as blob for download
	 */
	async exportChatData(options: ExportChatDataRequest): Promise<Blob> {
		const response = await api.post<Blob>(
			`${API_URL}/admin/chat/export`,
			options,
			{
				responseType: 'blob',
				headers: {
					Accept:
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				},
			}
		);

		return response.data;
	}
}

// Export singleton instance
export const adminChatService = new AdminChatService();

// Export types for use in components
export type {
	AdminChatStats,
	AdminRoomDetails,
	UserChatOverview,
	AdminBlockRequest,
	AdminUnblockRequest,
	AdminBlockResponse,
	AdminUnblockResponse,
	AdminBlockEntry,
	WebSocketStats,
	SystemHealth,
	ExportChatDataRequest,
	ForceDisconnectResponse,
	PaginationParams,
	PaginationResponse,
	GetAllRoomsResponse,
	GetRoomDetailsResponse,
	GetAdminBlocksResponse,
};
