import { PostDashboard } from '@/components/dashbaord/posts/post-dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Post Management',
	description: 'Manage your blog posts',
};

export default function PostsPage() {
	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			<PostDashboard />
		</div>
	);
}
