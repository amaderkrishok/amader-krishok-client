import { PostCategoryService } from '@/services/post-category-service';
import { getCategoryJsonLd } from '@/lib/metadata';
import CategoryPageClient from '@/components/pages/post/post-category/category-page-client';
export default async function CategoryPage({
	params,
}: {
	params: { slug: string };
}) {
	// Ensure params is properly awaited
	const resolvedParams = await Promise.resolve(params);
	const slug = resolvedParams.slug;

	try {
		// Fetch category data
		const response = await PostCategoryService.getCategoryBySlug(slug);
		const category = response.data;

		// Generate structured data for SEO
		const jsonLd = getCategoryJsonLd(category);

		return (
			<>
				{/* Add JSON-LD structured data */}
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>

				{/* Client component to handle interaction */}
				<CategoryPageClient initialCategory={category} slug={slug} />
			</>
		);
	} catch (error) {
		// If category fetch fails, pass only the slug
		// The client component will attempt to fetch the data itself
		return <CategoryPageClient slug={resolvedParams.slug} />;
	}
}
