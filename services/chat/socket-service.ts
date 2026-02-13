import { io, Socket } from 'socket.io-client';

// Get authentication token
const getToken = async (): Promise<string | null> => {
	try {
		const response = await fetch('/api/auth/session');
		if (!response.ok) {
			console.error(
				'Session fetch failed:',
				response.status,
				response.statusText
			);
			return null;
		}
		const data = await response.json();
		return data?.accessToken || null;
	} catch (error) {
		console.error('Session fetch error:', error);
		return null;
	}
};

// Types based on your backend implementation
interface SocketMessage {
	content: string;
	roomId: string;
	type?: string;
	imageUrl?: string;
}

interface SocketResponse<T = any> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	timestamp: Date;
}

interface JoinRoomData {
	roomId: string;
}

interface TypingData {
	roomId: string;
}

interface MarkMessageReadData {
	messageId: string;
	roomId: string;
}

// Event Data Types (matching your backend DTOs and entities)
interface MessageEvent {
	id: string;
	content: string;
	type: string;
	imageUrl?: string;
	senderId: string;
	roomId: string;
	isRead: boolean;
	createdAt: Date;
}

interface TypingEvent {
	userId: string;
	userName?: string;
	roomId: string;
	isTyping: boolean;
	timestamp: Date;
}

interface MessageReadEvent {
	messageId: string;
	roomId: string;
	isRead: boolean;
	readAt: Date;
	readBy: string;
}

interface ConnectionEvent {
	success: boolean;
	userId?: string;
	socketId: string;
	message: string;
	timestamp: Date;
}

interface UserOnlineStatusEvent {
	userId: string;
	isOnline: boolean;
	lastSeen?: Date | null;
}

interface BlockEvent {
	blockerId: string;
	blockedId: string;
	isBlocked: boolean;
	timestamp: Date;
}

// Event handler types
type MessageHandler = (message: MessageEvent) => void;
type TypingHandler = (typing: TypingEvent) => void;
type MessageReadHandler = (readEvent: MessageReadEvent) => void;
type ConnectionHandler = (connection: ConnectionEvent) => void;
type DisconnectHandler = () => void;
type ErrorHandler = (error: any) => void;
type OnlineStatusHandler = (status: UserOnlineStatusEvent) => void;
type BlockHandler = (block: BlockEvent) => void;

/**
 * Socket Service - WebSocket Management
 *
 * Handles real-time communication with your ChatGateway:
 * - Automatic connection management with token refresh
 * - Message sending and receiving
 * - Individual message read receipts
 * - Typing indicators
 * - Room management (join/leave)
 * - User online status and blocking
 * - Event subscription management
 * - Auto-reconnection handled by socket.io
 *
 * Maps directly to your ChatEvents enum and SocketResponseDto format
 */
export class SocketService {
	private socket: Socket | null = null;
	private isConnecting = false;
	private shouldReconnect = true;

	// Event handlers storage
	private messageHandlers: MessageHandler[] = [];
	private typingHandlers: TypingHandler[] = [];
	private messageReadHandlers: MessageReadHandler[] = [];
	private connectionHandlers: ConnectionHandler[] = [];
	private disconnectHandlers: DisconnectHandler[] = [];
	private errorHandlers: ErrorHandler[] = [];
	private onlineStatusHandlers: OnlineStatusHandler[] = [];
	private blockHandlers: BlockHandler[] = [];

	/**
	 * Connect to WebSocket server
	 *
	 * Establishes connection with authentication token
	 * Handles connection events and error recovery
	 */
	async connect(): Promise<boolean> {
		if (this.isConnecting || this.isConnected()) {
			return true;
		}

		this.isConnecting = true;
		this.shouldReconnect = true;

		try {
			// Get fresh token
			const token = await getToken();
			if (!token) {
				throw new Error('No authentication token available');
			}

			// Get WebSocket URL
			const url =
				process.env.NEXT_PUBLIC_SOCKET_URL ||
				process.env.NEXT_PUBLIC_BACKEND_URL ||
				'http://localhost:3000';

			console.log('🔌 Connecting to WebSocket:', url);

			// Create socket connection
			this.socket = io(url, {
				transports: ['websocket', 'polling'],
				auth: { token },
				withCredentials: true,
				reconnection: true, // Let socket.io handle reconnection
				timeout: 10000,
			});

			this.setupEventListeners();
			this.setupDiagnosticListeners();

			return new Promise((resolve, reject) => {
				const timeout = setTimeout(() => {
					reject(new Error('Connection timeout'));
				}, 15000);

				this.socket!.on('connect', () => {
					clearTimeout(timeout);
					this.isConnecting = false;
					console.log('✅ WebSocket connected successfully');
					resolve(true);
				});

				this.socket!.on('connect_error', (error) => {
					clearTimeout(timeout);
					this.isConnecting = false;
					console.error('❌ WebSocket connection failed:', error);
					this.notifyErrorHandlers(error);
					reject(error);
				});
			});
		} catch (error) {
			this.isConnecting = false;
			console.error('❌ WebSocket connection error:', error);
			throw error;
		}
	}

	/**
	 * Disconnect from WebSocket server
	 */
	disconnect(): void {
		this.shouldReconnect = false;
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
		this.isConnecting = false;
		console.log('🔌 WebSocket disconnected');
	}

	/**
	 * Check if socket is connected
	 */
	isConnected(): boolean {
		return this.socket?.connected || false;
	}

	/**
	 * Send a message
	 *
	 * Corresponds to ChatEvents.MESSAGE_SEND
	 */
	async sendMessage(message: SocketMessage): Promise<MessageEvent> {
		if (!this.ensureConnection()) {
			throw new Error('Not connected to socket server');
		}

		return new Promise((resolve, reject) => {
			this.socket!.emit(
				'message_send',
				message,
				(response: SocketResponse<MessageEvent>) => {
					if (response.success && response.data) {
						resolve(response.data);
					} else {
						reject(
							new Error(
								response.error || response.message || 'Failed to send message'
							)
						);
					}
				}
			);
		});
	}

	/**
	 * Join a room
	 *
	 * Corresponds to ChatEvents.JOIN_ROOM
	 */
	async joinRoom(roomId: string): Promise<void> {
		if (!this.ensureConnection()) {
			throw new Error('Not connected to socket server');
		}

		return new Promise((resolve, reject) => {
			const data: JoinRoomData = { roomId };
			this.socket!.emit('join_room', data, (response: SocketResponse) => {
				if (response.success) {
					console.log(`🏠 Joined room: ${roomId}`);
					resolve();
				} else {
					reject(
						new Error(
							response.error || response.message || 'Failed to join room'
						)
					);
				}
			});
		});
	}

	/**
	 * Leave a room
	 *
	 * Corresponds to ChatEvents.LEAVE_ROOM
	 */
	async leaveRoom(roomId: string): Promise<void> {
		if (!this.ensureConnection()) {
			throw new Error('Not connected to socket server');
		}

		return new Promise((resolve, reject) => {
			const data: JoinRoomData = { roomId };
			this.socket!.emit('leave_room', data, (response: SocketResponse) => {
				if (response.success) {
					console.log(`🚪 Left room: ${roomId}`);
					resolve();
				} else {
					reject(
						new Error(
							response.error || response.message || 'Failed to leave room'
						)
					);
				}
			});
		});
	}

	/**
	 * Mark individual message as read
	 *
	 * Corresponds to ChatEvents.MESSAGE_READ
	 */
	async markMessageAsRead(
		messageId: string,
		roomId: string
	): Promise<MessageReadEvent> {
		if (!this.ensureConnection()) {
			throw new Error('Not connected to socket server');
		}

		return new Promise((resolve, reject) => {
			const data: MarkMessageReadData = { messageId, roomId };
			this.socket!.emit(
				'message_read',
				data,
				(response: SocketResponse<MessageReadEvent>) => {
					if (response.success && response.data) {
						resolve(response.data);
					} else {
						reject(
							new Error(
								response.error ||
									response.message ||
									'Failed to mark message as read'
							)
						);
					}
				}
			);
		});
	}

	/**
	 * Send typing indicator
	 *
	 * Corresponds to ChatEvents.USER_TYPING
	 */
	sendTyping(roomId: string): void {
		if (this.ensureConnection()) {
			const data: TypingData = { roomId };
			this.socket!.emit('user_typing', data);
		}
	}

	/**
	 * Send stop typing indicator
	 *
	 * Corresponds to ChatEvents.USER_STOP_TYPING
	 */
	sendStopTyping(roomId: string): void {
		if (this.ensureConnection()) {
			const data: TypingData = { roomId };
			this.socket!.emit('user_stop_typing', data);
		}
	}

	/**
	 * Event subscription methods
	 *
	 * All return unsubscribe functions for cleanup
	 */

	/**
	 * Listen for incoming messages
	 *
	 * Corresponds to ChatEvents.MESSAGE_RECEIVE
	 */
	onMessage(handler: MessageHandler): () => void {
		this.messageHandlers.push(handler);
		return () => {
			this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
		};
	}

	/**
	 * Listen for typing indicators
	 *
	 * Corresponds to ChatEvents.USER_TYPING and ChatEvents.USER_STOP_TYPING
	 */
	onTyping(handler: TypingHandler): () => void {
		this.typingHandlers.push(handler);
		return () => {
			this.typingHandlers = this.typingHandlers.filter((h) => h !== handler);
		};
	}

	/**
	 * Listen for message read events
	 *
	 * Corresponds to ChatEvents.MESSAGE_READ
	 */
	onMessageRead(handler: MessageReadHandler): () => void {
		this.messageReadHandlers.push(handler);
		return () => {
			this.messageReadHandlers = this.messageReadHandlers.filter(
				(h) => h !== handler
			);
		};
	}

	/**
	 * Listen for connection events
	 */
	onConnection(handler: ConnectionHandler): () => void {
		this.connectionHandlers.push(handler);
		return () => {
			this.connectionHandlers = this.connectionHandlers.filter(
				(h) => h !== handler
			);
		};
	}

	/**
	 * Listen for disconnection events
	 */
	onDisconnect(handler: DisconnectHandler): () => void {
		this.disconnectHandlers.push(handler);
		return () => {
			this.disconnectHandlers = this.disconnectHandlers.filter(
				(h) => h !== handler
			);
		};
	}

	/**
	 * Listen for error events
	 */
	onError(handler: ErrorHandler): () => void {
		this.errorHandlers.push(handler);
		return () => {
			this.errorHandlers = this.errorHandlers.filter((h) => h !== handler);
		};
	}

	/**
	 * Listen for user online status updates
	 *
	 * Corresponds to ChatEvents.USER_ONLINE_STATUS
	 */
	onOnlineStatus(handler: OnlineStatusHandler): () => void {
		this.onlineStatusHandlers.push(handler);
		return () => {
			this.onlineStatusHandlers = this.onlineStatusHandlers.filter(
				(h) => h !== handler
			);
		};
	}

	/**
	 * Listen for block/unblock events
	 *
	 * Corresponds to ChatEvents.BLOCK_USER and ChatEvents.UNBLOCK_USER
	 */
	onBlock(handler: BlockHandler): () => void {
		this.blockHandlers.push(handler);
		return () => {
			this.blockHandlers = this.blockHandlers.filter((h) => h !== handler);
		};
	}

	/**
	 * Private methods
	 */

	/**
	 * Setup all socket event listeners
	 */
	private setupEventListeners(): void {
		if (!this.socket) return;

		// Connection events
		this.socket.on('connect', () => {
			console.log('🔗 WebSocket connected');
			this.notifyConnectionHandlers({
				success: true,
				socketId: this.socket!.id || 'unknown',
				message: 'Connected successfully',
				timestamp: new Date(),
			});
		});

		this.socket.on('disconnect', (reason: string) => {
			console.log('🔌 WebSocket disconnected:', reason);
			this.notifyDisconnectHandlers();
		});

		// Message events
		this.socket.on(
			'message_receive',
			(response: SocketResponse<MessageEvent>) => {
				if (response.success && response.data) {
					this.notifyMessageHandlers(response.data);
				}
			}
		);

		// Message read events
		this.socket.on(
			'message_read',
			(response: SocketResponse<MessageReadEvent>) => {
				if (response.success && response.data) {
					this.notifyMessageReadHandlers(response.data);
				}
			}
		);

		// Typing events
		this.socket.on('user_typing', (response: SocketResponse<TypingEvent>) => {
			if (response.success && response.data) {
				this.notifyTypingHandlers(response.data);
			}
		});

		this.socket.on(
			'user_stop_typing',
			(response: SocketResponse<TypingEvent>) => {
				if (response.success && response.data) {
					this.notifyTypingHandlers(response.data);
				}
			}
		);

		// Status events
		this.socket.on(
			'user_online_status',
			(response: SocketResponse<UserOnlineStatusEvent>) => {
				console.log('🟢 Received user_online_status event:', response);
				if (response.success && response.data) {
					console.log('🟢 Processing presence update:', response.data);
					this.notifyOnlineStatusHandlers(response.data);
				} else {
					console.warn('🟡 Invalid user_online_status response:', response);
				}
			}
		);

		// Block events
		this.socket.on('block_user', (response: SocketResponse<BlockEvent>) => {
			if (response.success && response.data) {
				this.notifyBlockHandlers(response.data);
			}
		});

		this.socket.on('unblock_user', (response: SocketResponse<BlockEvent>) => {
			if (response.success && response.data) {
				this.notifyBlockHandlers(response.data);
			}
		});

		// Error events
		this.socket.on('error', (error: any) => {
			console.error('🔴 Socket error:', error);
			this.notifyErrorHandlers(error);
		});

		this.socket.on('exception', (error: any) => {
			console.error('🔴 Socket exception:', error);
			this.notifyErrorHandlers(error);
		});

		// Socket.IO connection errors
		this.socket.on('connect_error', (error: any) => {
			console.error('🔴 Connection error:', error);
			this.notifyErrorHandlers(error);
		});
	}

	/**
	 * Add diagnostic logging for all socket events
	 */
	private setupDiagnosticListeners(): void {
		if (!this.socket) return;

		// Listen for all events for debugging
		const originalOn = this.socket.on.bind(this.socket);
		const originalEmit = this.socket.emit.bind(this.socket);

		// Override emit to log outgoing events
		this.socket.emit = (event: string, ...args: any[]) => {
			console.log('📤 Socket EMIT:', event, args);
			return originalEmit.call(this.socket, event, ...args);
		};

		// Log all incoming events
		this.socket.onAny((eventName: string, ...args: any[]) => {
			console.log('📥 Socket RECEIVE:', eventName, args);
		});
	}

	/**
	 * Ensure connection exists, attempt to connect if not
	 */
	private ensureConnection(): boolean {
		if (!this.isConnected() && this.shouldReconnect) {
			console.log('⚡ Auto-connecting...');
			this.connect().catch(console.error);
			return false;
		}
		return this.isConnected();
	}

	// Event notification methods
	private notifyMessageHandlers(message: MessageEvent): void {
		this.messageHandlers.forEach((handler) => {
			try {
				handler(message);
			} catch (error) {
				console.error('Message handler error:', error);
			}
		});
	}

	private notifyTypingHandlers(typing: TypingEvent): void {
		this.typingHandlers.forEach((handler) => {
			try {
				handler(typing);
			} catch (error) {
				console.error('Typing handler error:', error);
			}
		});
	}

	private notifyMessageReadHandlers(readEvent: MessageReadEvent): void {
		this.messageReadHandlers.forEach((handler) => {
			try {
				handler(readEvent);
			} catch (error) {
				console.error('Message read handler error:', error);
			}
		});
	}

	private notifyConnectionHandlers(connection: ConnectionEvent): void {
		this.connectionHandlers.forEach((handler) => {
			try {
				handler(connection);
			} catch (error) {
				console.error('Connection handler error:', error);
			}
		});
	}

	private notifyDisconnectHandlers(): void {
		this.disconnectHandlers.forEach((handler) => {
			try {
				handler();
			} catch (error) {
				console.error('Disconnect handler error:', error);
			}
		});
	}

	private notifyErrorHandlers(error: any): void {
		this.errorHandlers.forEach((handler) => {
			try {
				handler(error);
			} catch (error) {
				console.error('Error handler error:', error);
			}
		});
	}

	private notifyOnlineStatusHandlers(status: UserOnlineStatusEvent): void {
		this.onlineStatusHandlers.forEach((handler) => {
			try {
				handler(status);
			} catch (error) {
				console.error('Online status handler error:', error);
			}
		});
	}

	private notifyBlockHandlers(block: BlockEvent): void {
		this.blockHandlers.forEach((handler) => {
			try {
				handler(block);
			} catch (error) {
				console.error('Block handler error:', error);
			}
		});
	}
}

// Export singleton instance
export const socketService = new SocketService();

// Export types for use in components
export type {
	SocketMessage,
	SocketResponse,
	MessageEvent,
	TypingEvent,
	MessageReadEvent,
	ConnectionEvent,
	UserOnlineStatusEvent,
	BlockEvent,
	MessageHandler,
	TypingHandler,
	MessageReadHandler,
	ConnectionHandler,
	DisconnectHandler,
	ErrorHandler,
	OnlineStatusHandler,
	BlockHandler,
};
