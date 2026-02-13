import { Metadata } from 'next';
import { PostCategoryService } from '@/services/post-category-service';

// Generate metadata dynamically for category pages
export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Promise<Metadata> {
	// Ensure params is properly awaited
	const resolvedParams = await Promise.resolve(params);
	const slug = resolvedParams.slug;

	try {
		const response = await PostCategoryService.getCategoryBySlug(slug);
		const category = response.data;

		// Generate appropriate SEO metadata
		return {
			title: `${category.name} - Articles and Posts`,
			description:
				category.description ||
				`Browse all articles in the ${category.name} category`,
			openGraph: {
				title: `${category.name} - Articles and Posts`,
				description:
					category.description ||
					`Browse all articles in the ${category.name} category`,
				images: category.featuredImage
					? [
							{
								url: category.featuredImage,
								width: 1200,
								height: 630,
								alt: category.name,
							},
					  ]
					: undefined,
			},
			// Add canonical URL to avoid duplicate content issues
			alternates: {
				canonical: `/post/categories/${slug}`,
			},
		};
	} catch (error) {
		// Fallback metadata if category isn't found
		return {
			title: 'Category - Articles and Posts',
			description: 'Browse articles by category',
		};
	}
}

// Layout wrapper for category pages
export default function CategoryLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className='category-layout'>{children}</div>;
}
