'use client';

import dynamic from 'next/dynamic';
import { ChatProviderWrapper } from '@/providers/ChatProviderWrapper';
import { PresenceDebugPanel } from '@/components/chat/presence-debug-panel';

// Create a client-only version of your ChatInterface
// This prevents server-side rendering issues
const ChatInterface = dynamic(
	() => import('@/components/chat').then((mod) => mod.ChatInterface),
	{ ssr: false }
);

export default function MessagesPage() {
	const isDev =
		typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
	return (
		<ChatProviderWrapper>
			<div className='container mx-auto py-4'>
				{/* Show debug panel only in development */}
				{isDev && <PresenceDebugPanel />}
				<div className='h-[calc(100vh-120px)]'>
					<ChatInterface />
				</div>
			</div>
		</ChatProviderWrapper>
	);
}
