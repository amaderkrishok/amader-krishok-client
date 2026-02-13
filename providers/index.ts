/**
 * Chat Provider Exports
 *
 * @description Central export file for all chat-related providers and context utilities.
 * This provides a clean API for importing chat functionality throughout the application.
 */

// Core provider and context
export { ChatProvider, default as ChatContext } from './chat-provider';
export { ChatProviderWrapper, ChatErrorBoundary } from './ChatProviderWrapper';

// Hooks
export { useChatContext } from '@/hooks/useChatContext';
export { useChat } from '@/hooks/use-chat';
export { useChatParticipant } from '@/hooks/use-chat-participant';
export { useChatSearch } from '@/hooks/use-chat-search';

// Types
export type {
	ChatContextValue,
	ChatHookReturn,
	User,
	ConnectionStatus,
	MessageType,
	UserRole,
	RoomResponseDto,
	MessageEvent,
	TypingEvent,
	UserPresenceDto,
	ChatError,
	GlobalMessageHandler,
	GlobalPresenceHandler,
	GlobalBlockHandler,
} from '@/types/chat';

/**
 * Re-export everything for convenience
 */
export * from './chat-provider';
export * from './ChatProviderWrapper';
