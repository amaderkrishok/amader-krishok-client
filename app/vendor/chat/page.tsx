'use client';

import dynamic from 'next/dynamic';
import { ChatProviderWrapper } from '@/providers/ChatProviderWrapper';

// Create a client-only version of your ChatInterface
// This prevents server-side rendering issues
const ChatInterface = dynamic(
	() => import('@/components/chat').then((mod) => mod.ChatInterface),
	{ ssr: false }
);

export default function MessagesPage() {
	return (
		<ChatProviderWrapper>
			<div className='container mx-auto p-4'>
				<div className='h-[calc(100vh-120px)]'>
					<ChatInterface />
				</div>
			</div>
		</ChatProviderWrapper>
	);
}
