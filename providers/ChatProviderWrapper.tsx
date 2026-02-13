'use client';

import React, { ReactNode } from 'react';
import { ChatProvider } from '@/providers/chat-provider';

/**
 * Props for the ChatProviderWrapper component
 */
interface ChatProviderWrapperProps {
	/**
	 * Child components that will have access to chat context
	 */
	children: ReactNode;
	/**
	 * Optional flag to disable the chat provider (useful for testing or conditional rendering)
	 * @default false
	 */
	disabled?: boolean;
	/**
	 * Optional custom error boundary component to wrap the provider
	 */
	errorBoundary?: React.ComponentType<{ children: ReactNode }>;
}

/**
 * Wrapper component for ChatProvider with additional configuration options
 *
 * @description This component provides a configurable wrapper around ChatProvider
 * that can be conditionally enabled/disabled and includes error boundary support.
 * It's useful for:
 * - Conditional chat functionality (e.g., for different user roles)
 * - Testing environments where chat should be disabled
 * - Adding error boundaries around the chat system
 * - Future feature flags or A/B testing
 *
 * @param props - The wrapper props
 * @param props.children - Child components
 * @param props.disabled - Whether to disable chat functionality
 * @param props.errorBoundary - Optional error boundary component
 * @returns JSX element with or without chat context
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ChatProviderWrapper>
 *   <App />
 * </ChatProviderWrapper>
 *
 * // With disabled state
 * <ChatProviderWrapper disabled={!user.hasChatAccess}>
 *   <App />
 * </ChatProviderWrapper>
 *
 * // With error boundary
 * <ChatProviderWrapper errorBoundary={ChatErrorBoundary}>
 *   <App />
 * </ChatProviderWrapper>
 * ```
 */
export const ChatProviderWrapper: React.FC<ChatProviderWrapperProps> = ({
	children,
	disabled = false,
	errorBoundary: ErrorBoundary,
}) => {
	// If chat is disabled, just render children without context
	if (disabled) {
		return <>{children}</>;
	}

	// Wrap with error boundary if provided
	if (ErrorBoundary) {
		return (
			<ErrorBoundary>
				<ChatProvider>{children}</ChatProvider>
			</ErrorBoundary>
		);
	}

	// Default: wrap with ChatProvider
	return <ChatProvider>{children}</ChatProvider>;
};

/**
 * Simple error boundary component for chat-related errors
 *
 * @description This is a basic error boundary that catches JavaScript errors
 * anywhere in the chat provider tree and displays a fallback UI.
 */
export class ChatErrorBoundary extends React.Component<
	{ children: ReactNode },
	{ hasError: boolean; error?: Error }
> {
	constructor(props: { children: ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		// Update state so the next render will show the fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log the error to console or error reporting service
		console.error('Chat Error Boundary caught an error:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			// Fallback UI when chat system fails
			return (
				<div className='chat-error-boundary p-4 bg-red-50 border border-red-200 rounded-md'>
					<h3 className='text-red-800 font-medium mb-2'>Chat System Error</h3>
					<p className='text-red-600 text-sm'>
						The chat system encountered an error and has been disabled
						temporarily. Please refresh the page or contact support if the
						problem persists.
					</p>
					{process.env.NODE_ENV === 'development' && this.state.error && (
						<details className='mt-2'>
							<summary className='text-red-700 cursor-pointer'>
								Error Details
							</summary>
							<pre className='text-xs mt-1 p-2 bg-red-100 rounded overflow-auto'>
								{this.state.error.stack}
							</pre>
						</details>
					)}
				</div>
			);
		}

		return this.props.children;
	}
}

export default ChatProviderWrapper;
