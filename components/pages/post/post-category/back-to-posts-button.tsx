import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function BackToPostsButton() {
	const router = useRouter();

	return (
		<div className='mt-10 flex justify-center'>
			<Button variant='outline' onClick={() => router.push('/post')}>
				<ArrowLeft className='mr-2 h-4 w-4' />
				Back to all posts
			</Button>
		</div>
	);
}
