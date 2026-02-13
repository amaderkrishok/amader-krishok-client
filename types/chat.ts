// ============================================================================
// 🎯 CHAT TYPE DEFINITIONS
// ============================================================================
// This file contains all TypeScript interfaces and types for the chat system
// Organized by: Core Types → DTOs → Events → Handlers → Utilities
// ============================================================================

// ============================================================================
// 📦 EXTERNAL TYPE IMPORTS
// ============================================================================

// Socket service types
import type {
	MessageEvent,
	TypingEvent,
	ConnectionEvent,
	UserOnlineStatusEvent,
	BlockEvent,
} from '@/services/chat/socket-service';

// User chat service types
import type { Room, UserPresence } from '@/services/chat/user-chat-service';

// ============================================================================
// 🔄 CORE ENUMS & UNION TYPES
// ============================================================================

/**
 * WebSocket connection status states
 * Used for UI indicators and connection handling
 */
export type ConnectionStatus =
	| 'disconnected' // No connection established
	| 'connecting' // Attempting to connect
	| 'connected' // Successfully connected
	| 'reconnecting' // Attempting to reconnect after disconnect
	| 'error'; // Connection failed

/**
 * Message content types
 * Determines how messages are displayed and processed
 */
export type MessageType =
	| 'text' // Plain text message
	| 'image' // Image/media message
	| 'file'; // File attachment message

/**
 * User roles in the system
 * Affects permissions and UI behavior
 */
export type UserRole =
	| 'USER' // Regular customer
	| 'VENDOR' // Product seller
	| 'ADMIN' // System administrator
	| 'MOD'; // Moderator

// ============================================================================
// 🚨 ERROR & EVENT TYPES
// ============================================================================

/**
 * Socket error event
 * Represents various socket connection errors
 */
export interface SocketError {
	code: string;
	message: string;
	type: 'connection' | 'authentication' | 'network' | 'server';
}

/**
 * Socket exception event
 * Represents server-side exceptions
 */
export interface SocketException {
	error: string;
	message: string;
	statusCode?: number;
}

// ============================================================================
// 👤 USER & PARTICIPANT INTERFACES
// ============================================================================

/**
 * Base user interface
 * Represents authenticated user data
 */
export interface User {
	id: string;
	name: string;
	email?: string;
	image?: string;
	role: UserRole;
}

/**
 * Extended user presence information
 * Combines presence data with user details
 */
export interface UserPresenceDto extends UserPresence {
	userName?: string; // Display name
	userImage?: string; // Profile picture URL
	userRole?: UserRole; // User role for UI customization
}

/**
 * Chat participant information
 * Simplified user data for chat contexts
 */
export interface ChatParticipant {
	id: string;
	name: string;
	image?: string;
	role: string;
}

// ============================================================================
// 🏠 ROOM & CONVERSATION INTERFACES
// ============================================================================

/**
 * Enhanced room response with participant details
 * Extends base Room with UI-friendly participant data
 */
export interface RoomResponseDto extends Room {
	participant: ChatParticipant;
	lastMessage?: {
		content: string;
		createdAt: string;
		senderId: string;
	};
}

/**
 * Detailed room information
 * Used for room-specific views and operations
 */
export interface RoomDetailsDto {
	room: RoomResponseDto; // Room basic information
	participant: UserPresenceDto; // Other participant details
	isBlocked: boolean; // Block status
	canMessage: boolean; // Messaging permissions
}

// ============================================================================
// 💬 MESSAGE INTERFACES
// ============================================================================

/**
 * Paginated message collection
 * Used for message history with pagination support
 */
export interface PaginatedMessages {
	messages: MessageEvent[];
	pagination: {
		page: number; // Current page number
		limit: number; // Items per page
		total: number; // Total message count
		hasMore: boolean; // More pages available
	};
}

/**
 * Message read receipt event
 * Tracks when messages are read by recipients
 */
export interface MessageReadEvent {
	messageId: string;
	roomId: string;
	isRead: boolean;
	readAt: Date;
	readBy: string; // User ID who read the message
}

// ============================================================================
// 🌐 WEBSOCKET EVENT INTERFACES
// ============================================================================

/**
 * Complete WebSocket event mapping
 * Defines all client-server communication events
 */
export interface SocketEvents {
	// ================================
	// 📤 OUTGOING EVENTS (Client → Server)
	// ================================

	/** Send a new message */
	message_send: {
		content: string;
		roomId: string;
		type?: string;
		imageUrl?: string;
	};

	/** Join a chat room */
	join_room: {
		roomId: string;
	};

	/** Leave a chat room */
	leave_room: {
		roomId: string;
	};

	/** Start typing indicator */
	typing_start: {
		roomId: string;
	};

	/** Stop typing indicator */
	typing_stop: {
		roomId: string;
	};

	/** Mark message as read */
	mark_message_read: {
		messageId: string;
		roomId: string;
	};

	// ================================
	// 📥 INCOMING EVENTS (Server → Client)
	// ================================

	/** Receive a new message */
	message_receive: MessageEvent;

	/** User started typing */
	user_typing: TypingEvent;

	/** User stopped typing */
	user_stop_typing: TypingEvent;

	/** Message read confirmation */
	message_read: MessageReadEvent;

	/** User online status change */
	user_online_status: UserOnlineStatusEvent;

	/** User blocked event */
	block_user: BlockEvent;

	/** User unblocked event */
	unblock_user: BlockEvent;

	/** Connection established */
	connect: ConnectionEvent;

	/** Connection lost */
	disconnect: void;

	/** Connection error */
	error: SocketError;

	/** Server exception */
	exception: SocketException;

	/** Connection attempt failed */
	connect_error: SocketError;
}

// ============================================================================
// 🎯 EVENT HANDLER TYPES
// ============================================================================

/**
 * Global message event handler
 * Called when any message is received (for unread counts, notifications)
 */
export type GlobalMessageHandler = (
	message: MessageEvent,
	roomId: string
) => void;

/**
 * Global user presence event handler
 * Called when any user's online status changes
 */
export type GlobalPresenceHandler = (presence: UserOnlineStatusEvent) => void;

/**
 * Global block/unblock event handler
 * Called when any user is blocked or unblocked
 */
export type GlobalBlockHandler = (block: BlockEvent) => void;

// ============================================================================
// 🚨 ERROR & UTILITY INTERFACES
// ============================================================================

/**
 * Standardized chat error interface
 * Used for consistent error handling across chat features
 */
export interface ChatError {
	code: string; // Error code (e.g., 'NETWORK_ERROR', 'UNAUTHORIZED')
	message: string; // Human-readable error message
	timestamp: Date; // When the error occurred
	context?: string; // Additional context (e.g., function name)
}

/**
 * Chat system statistics
 * Used for admin dashboards and monitoring
 */
export interface ChatStats {
	totalRooms: number;
	totalMessages: number;
	activeUsers: number;
	onlineUsers: number;
}

/**
 * Pagination parameters
 * Standard pagination interface for API calls
 */
export interface PaginationParams {
	page: number;
	limit: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

/**
 * API response wrapper
 * Standardized response format from backend
 */
export interface ApiResponse<T> {
	statusCode: number;
	message: string;
	data: T;
	pagination?: {
		page: number;
		limit: number;
		total: number;
		hasMore: boolean;
	};
}

// ============================================================================
// 🎪 HOOK & CONTEXT INTERFACES
// ============================================================================

/**
 * Chat hook return interface
 * Defines all methods and state returned by useChat hook
 */
export interface ChatHookReturn {
	// 🔄 REAL-TIME STATE (WebSocket managed)
	messages: MessageEvent[];
	typingUsers: TypingEvent[];
	connectionStatus: ConnectionStatus;
	currentRoomUsers: UserPresenceDto[];

	// 📊 REST API STATE (HTTP managed)
	roomDetails: RoomDetailsDto | null;
	messageHistory: PaginatedMessages;
	isLoadingMessages: boolean;
	isLoadingHistory: boolean;
	hasMoreMessages: boolean;
	error: ChatError | null;

	// 🔧 REAL-TIME METHODS (WebSocket operations)
	sendMessage: (content: string, type?: MessageType) => Promise<MessageEvent>;
	markMessageAsRead: (messageId: string) => Promise<void>;
	sendTyping: () => void;
	sendStopTyping: () => void;
	joinRoom: () => Promise<void>;
	leaveRoom: () => Promise<void>;

	// 🌐 REST API METHODS (HTTP operations)
	fetchMessages: (page?: number) => Promise<void>;
	loadMoreMessages: () => Promise<void>;
	markAllAsRead: () => Promise<void>;
	refreshRoomDetails: () => Promise<void>;

	// 🎮 UTILITY METHODS
	clearError: () => void;
	retryConnection: () => Promise<void>;
}

/**
 * Chat context value interface
 * Defines global chat state and operations
 */
export interface ChatContextValue {
	// 🌍 GLOBAL STATE
	currentUser: User | null;
	allRooms: RoomResponseDto[];
	totalUnreadCount: number;
	globalConnectionStatus: ConnectionStatus;

	// 🎯 ACTIVE ROOM MANAGEMENT
	activeRoomId: string | null;
	setActiveRoom: (roomId: string | null) => void;

	// 📊 GLOBAL PRESENCE & BLOCKING
	onlineUsersGlobal: Map<string, UserPresenceDto>;
	blockedUsersGlobal: Set<string>;

	// 🔧 GLOBAL OPERATIONS
	initializeChat: () => Promise<void>;
	createRoom: (participantId: string) => Promise<RoomResponseDto>;
	refreshRooms: () => Promise<void>;
	refreshUnreadCounts: () => Promise<void>;
	blockUser: (userId: string) => Promise<void>;
	unblockUser: (userId: string) => Promise<void>;
	markRoomAsRead: (roomId: string) => Promise<void>;

	// 🎪 UTILITY METHODS
	isUserBlocked: (userId: string) => boolean;
	getUserPresence: (userId: string) => UserPresenceDto | null;
	getRoomById: (roomId: string) => RoomResponseDto | null;
	requestPresenceUpdate: (userId: string) => Promise<void>;
	refreshAllPresence: () => Promise<void>;

	// 🔄 GLOBAL EVENT HANDLERS
	onGlobalMessage: (handler: GlobalMessageHandler) => () => void;
	onGlobalPresence: (handler: GlobalPresenceHandler) => () => void;
	onGlobalBlock: (handler: GlobalBlockHandler) => () => void;
}

// ============================================================================
// 📤 RE-EXPORTS
// ============================================================================
// Re-export socket service types for convenience

export type {
	MessageEvent,
	TypingEvent,
	ConnectionEvent,
	UserOnlineStatusEvent,
	BlockEvent,
} from '@/services/chat/socket-service';

export type { Room, UserPresence } from '@/services/chat/user-chat-service';

// ============================================================================
// 🎯 TYPE GUARDS & UTILITIES
// ============================================================================

/**
 * Type guard to check if a user is online
 */
export const isUserOnline = (presence: UserPresenceDto | null): boolean => {
	return presence?.isOnline === true;
};

/**
 * Type guard to check if a message is from current user
 */
export const isOwnMessage = (
	message: MessageEvent,
	currentUserId: string
): boolean => {
	return message.senderId === currentUserId;
};

/**
 * Type guard to check if a room has unread messages
 */
export const hasUnreadMessages = (room: RoomResponseDto): boolean => {
	return room.unreadCount > 0;
};

/**
 * Utility to format message timestamp
 */
export const formatMessageTime = (timestamp: string | Date): string => {
	const date = new Date(timestamp);
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Utility to get participant name safely
 */
export const getParticipantName = (room: RoomResponseDto): string => {
	return room.participant?.name || 'Unknown User';
};

/**
 * Type guard to check if error is a socket error
 */
export const isSocketError = (error: unknown): error is SocketError => {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		'message' in error &&
		'type' in error
	);
};

/**
 * Type guard to check if error is a socket exception
 */
export const isSocketException = (error: unknown): error is SocketException => {
	return (
		typeof error === 'object' &&
		error !== null &&
		'error' in error &&
		'message' in error
	);
};

// ============================================================================
// 🏷️ TYPE EXPORT SUMMARY
// ============================================================================
/*
EXPORTED TYPES SUMMARY:

🔄 Core Types:
- ConnectionStatus, MessageType, UserRole

👤 User Types:
- User, UserPresenceDto, ChatParticipant

🏠 Room Types:
- RoomResponseDto, RoomDetailsDto

💬 Message Types:
- PaginatedMessages, MessageReadEvent

🌐 Socket Types:
- SocketEvents, SocketError, SocketException

🎯 Handler Types:
- GlobalMessageHandler, GlobalPresenceHandler, GlobalBlockHandler

🚨 Utility Types:
- ChatError, ChatStats, PaginationParams, ApiResponse

🎪 Hook Types:
- ChatHookReturn, ChatContextValue

📤 Re-exports:
- All socket service types
- All user chat service types

🛡️ Type Guards:
- isUserOnline, isOwnMessage, hasUnreadMessages
- formatMessageTime, getParticipantName
- isSocketError, isSocketException
*/
