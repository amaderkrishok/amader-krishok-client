import { PostService } from '@/services/post-service';
import { getPostJsonLd } from '@/lib/metadata';
import PostPageClient from '@/components/pages/post/post-slug/single-post';

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
	try {
		const { slug } = await props.params;
		const response = await PostService.getPostBySlug(String(slug));
		const post = response.data;

		// Generate JSON-LD
		const jsonLd = getPostJsonLd(post);

		return (
			<>
				{/* Add JSON-LD structured data */}
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>

				{/* Render your client component */}
				<PostPageClient initialPost={post} />
			</>
		);
	} catch (error) {
		// Handle error state
		return <PostPageClient />;
	}
}
