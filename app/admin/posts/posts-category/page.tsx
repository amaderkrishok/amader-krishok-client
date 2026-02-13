import { PostCategoryDashboard } from '@/components/dashbaord/post-categories/post-category-dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Post Categories',
	description: 'Manage your post categories',
};

export default function PostCategoriesPage() {
	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			<PostCategoryDashboard />
		</div>
	);
}
