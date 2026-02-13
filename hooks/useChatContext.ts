import { useContext } from 'react';
import ChatContext from '@/providers/chat-provider';
import type { ChatContextValue } from '@/types/chat';

/**
 * Custom hook to access the ChatContext
 *
 * @description This hook provides access to the global chat context state and methods.
 * It includes error handling to ensure the hook is used within a ChatProvider.
 *
 * @throws {Error} If used outside of a ChatProvider
 * @returns {ChatContextValue} The chat context value containing all global chat state and methods
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const {
 *     currentUser,
 *     allRooms,
 *     createRoom,
 *     globalConnectionStatus
 *   } = useChatContext();
 *
 *   // Use the chat context...
 * }
 * ```
 */
export const useChatContext = (): ChatContextValue => {
	const context = useContext(ChatContext);

	if (!context) {
		throw new Error(
			'useChatContext must be used within a ChatProvider. ' +
				'Make sure your component is wrapped with <ChatProvider>.'
		);
	}

	return context;
};

export default useChatContext;
