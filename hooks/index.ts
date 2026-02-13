/**
 * Chat Hooks Exports
 *
 * @description Central export file for all chat-related hooks.
 * This provides a clean API for importing chat hooks throughout the application.
 */

// Core chat hooks
export { useChat } from './use-chat';
export { useChatParticipant } from './use-chat-participant';
export { useChatSearch } from './use-chat-search';
export {
	useChatContext,
	default as useChatContextDefault,
} from './useChatContext';

// Types
export type { ChatHookReturn } from '@/types/chat';

/**
 * Hook usage examples and patterns
 *
 * @example
 * ```tsx
 * // Using the global chat context
 * import { useChatContext } from '@/hooks';
 *
 * function ChatSidebar() {
 *   const { allRooms, setActiveRoom, globalConnectionStatus } = useChatContext();
 *   // Component implementation...
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using room-specific chat functionality
 * import { useChat } from '@/hooks';
 *
 * function ChatRoom({ roomId }: { roomId: string }) {
 *   const {
 *     messages,
 *     sendMessage,
 *     typingUsers,
 *     connectionStatus
 *   } = useChat(roomId);
 *   // Component implementation...
 * }
 * ```
 */
