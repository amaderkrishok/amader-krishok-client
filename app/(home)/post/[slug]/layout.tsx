import { Metadata } from 'next';
import { PostService } from '@/services/post-service';
import { getPostMetadata } from '@/lib/metadata';

// Generate metadata dynamically when the page is requested
export async function generateMetadata(props: {
	params: { slug: string };
}): Promise<Metadata> {
	try {
		// Use the parameter from props directly
		const slug = String(props.params.slug);
		const response = await PostService.getPostBySlug(slug);
		const post = response.data;

		return getPostMetadata(post);
	} catch (error) {
		// Fallback metadata if post isn't found
		return {
			title: 'Post Not Found',
			description: 'The requested blog post could not be found.',
		};
	}
}

export default function PostLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
