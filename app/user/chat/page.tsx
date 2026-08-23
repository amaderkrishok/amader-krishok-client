'use client';

import dynamic from 'next/dynamic';
import { ChatProviderWrapper } from '@/providers/ChatProviderWrapper';
import { Skeleton } from '@/components/ui/skeleton';

// Create a client-only version of ChatInterface to prevent SSR issues
const ChatInterface = dynamic(
	() => import('@/components/chat').then((mod) => mod.ChatInterface),
	{
		ssr: false,
		loading: () => (
			<div className='w-full h-[calc(100vh-100px)] min-h-[600px] bg-white rounded-3xl border border-[#E5E7EB] p-8 flex items-center justify-center shadow-xs'>
				<div className='space-y-4 text-center max-w-sm'>
					<Skeleton className='h-12 w-12 rounded-full mx-auto bg-[#F5B800]/20' />
					<Skeleton className='h-4 w-48 mx-auto' />
					<Skeleton className='h-3 w-32 mx-auto' />
				</div>
			</div>
		),
	}
);

export default function MessagesPage() {
	return (
		<ChatProviderWrapper>
			<div className='w-full h-[calc(100vh-100px)] min-h-[600px] max-w-[1450px] mx-auto'>
				<ChatInterface />
			</div>
		</ChatProviderWrapper>
	);
}
