import { Metadata } from 'next';
import { PostType, PostCategoryType } from '@/types/post';

type SiteConfig = {
	name: string;
	url: string;
	description: string;
	locale: string;
	logoUrl: string;
	twitter?: string;
	ogImageUrl?: string;
};

// Site-wide configuration - customize these values
export const siteConfig: SiteConfig = {
	name: 'Amader Krishok',
	url: process.env.NEXT_PUBLIC_APP_URL || 'https://amaderkrishok.com',
	description: 'Agriculture insights and farming innovations for Bangladesh',
	locale: 'bn-BD', // Bengali locale for Bangladesh
	logoUrl: '/logo.png',
	twitter: '@amaderkrishok',
	ogImageUrl: '/og-image.jpg',
};

// Base metadata that will be extended for specific pages
export const baseMetadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	openGraph: {
		type: 'website',
		locale: siteConfig.locale,
		url: siteConfig.url,
		siteName: siteConfig.name,
		images: [
			{
				url: siteConfig.ogImageUrl || `/api/og`,
				width: 1200,
				height: 630,
				alt: siteConfig.name,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.name,
		creator: siteConfig.twitter,
	},
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon-16x16.png',
		apple: '/apple-touch-icon.png',
	},
	// manifest: `${siteConfig.url}/site.webmanifest`,
};

// Generate metadata for blog listing page
export function getBlogMetadata(
	categories?: PostCategoryType[],
	activeCategory?: PostCategoryType | null
): Metadata {
	let title = 'Blog';
	let description =
		'Explore our collection of articles on agricultural insights and farming innovations';

	if (activeCategory) {
		title = `${activeCategory.name} Articles`;
		description =
			activeCategory.description ||
			`Explore our collection of articles about ${activeCategory.name}`;
	}

	return {
		...baseMetadata,
		title,
		description,
		openGraph: {
			...baseMetadata.openGraph,
			title,
			description,
			type: 'website',
			url: `${siteConfig.url}/post${
				activeCategory ? `/categories/${activeCategory.slug}` : ''
			}`,
		},
		alternates: {
			canonical: `${siteConfig.url}/post${
				activeCategory ? `/categories/${activeCategory.slug}` : ''
			}`,
		},
	};
}

// Generate metadata for a single blog post
export function getPostMetadata(post: PostType): Metadata {
	const postUrl = `${siteConfig.url}/post/${post.slug}`;
	const postTitle = post.title;
	const postDescription =
		post.excerpt || truncateText(extractTextFromContent(post.description), 160);

	// Determine post image (use featured image or fallback)
	const postImage = post.featuredImage || siteConfig.ogImageUrl || '/api/og';

	// Calculate reading time
	const readingTime = estimateReadingTime(post.description);

	// Get author information if available
	const author = post.updatedBy?.name || 'Amader Krishok';

	// Generate schema.org JSON-LD
	const jsonLd = getPostJsonLd(post);

	return {
		...baseMetadata,
		title: postTitle,
		description: postDescription,
		openGraph: {
			...baseMetadata.openGraph,
			type: 'article',
			title: postTitle,
			description: postDescription,
			url: postUrl,
			images: [
				{
					url: postImage,
					width: 1200,
					height: 630,
					alt: postTitle,
				},
			],
			publishedTime: post.createdAt,
			modifiedTime: post.updatedAt,
			authors: [author],
			section: post.categories?.[0]?.name || 'Blog',
			tags: post.categories?.map((cat) => cat.name) || [],
		},
		twitter: {
			...baseMetadata.twitter,
			title: postTitle,
			description: postDescription,
			images: [postImage],
		},
		alternates: {
			canonical: postUrl,
		},
		other: {
			'og:locale': siteConfig.locale,
			'article:published_time': post.createdAt,
			'article:modified_time': post.updatedAt,
			'twitter:label1': 'Reading time',
			'twitter:data1': `${readingTime} min read`,
		},
	};
}

// Generate schema.org JSON-LD for structured data
export function getPostJsonLd(post: PostType): any {
	const postUrl = `${siteConfig.url}/post/${post.slug}`;

	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description:
			post.excerpt ||
			truncateText(extractTextFromContent(post.description), 160),
		image: post.featuredImage ? [post.featuredImage] : undefined,
		datePublished: post.createdAt,
		dateModified: post.updatedAt,
		author: {
			'@type': 'Person',
			name: post.updatedBy?.name || 'Amader Krishok',
		},
		publisher: {
			'@type': 'Organization',
			name: siteConfig.name,
			logo: {
				'@type': 'ImageObject',
				url: `${siteConfig.url}${siteConfig.logoUrl}`,
			},
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': postUrl,
		},
		articleBody: extractTextFromContent(post.description),
		articleSection: post.categories?.[0]?.name || 'Blog',
		keywords: post.categories?.map((cat) => cat.name).join(', ') || '',
	};
}

// Generate Schema.org JSON-LD for category pages
export function getCategoryJsonLd(category: PostCategoryType): any {
	const categoryUrl = `${siteConfig.url}/post/categories/${category.slug}`;

	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		headline: `${category.name} Articles`,
		description: category.description || `Articles about ${category.name}`,
		url: categoryUrl,
		image: category.featuredImage ? category.featuredImage : undefined,
		publisher: {
			'@type': 'Organization',
			name: siteConfig.name,
			logo: {
				'@type': 'ImageObject',
				url: `${siteConfig.url}${siteConfig.logoUrl}`,
			},
		},
	};
}

// Generate Schema.org JSON-LD for blog listing page
export function getBlogListingJsonLd(): any {
	return {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		headline: 'Agriculture Blog',
		description:
			'Explore our collection of articles on agricultural insights and farming innovations',
		url: `${siteConfig.url}/post`,
		publisher: {
			'@type': 'Organization',
			name: siteConfig.name,
			logo: {
				'@type': 'ImageObject',
				url: `${siteConfig.url}${siteConfig.logoUrl}`,
			},
		},
	};
}

// Helper function to extract plain text from post content
function extractTextFromContent(description: any): string {
	if (!description?.value) return '';

	// If it's already a string, return it
	if (typeof description === 'string') return description;
	if (typeof description.value === 'string') return description.value;

	// If it's an editor content array, extract text from each node
	if (Array.isArray(description.value)) {
		return description.value
			.map((node: any) => {
				// Handle different node types
				if (typeof node.text === 'string') return node.text;
				if (node.children) {
					return node.children.map((child: any) => child.text || '').join(' ');
				}
				return '';
			})
			.join(' ');
	}

	return '';
}

// Helper to truncate text to a specific length
function truncateText(text: string, maxLength: number = 160): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength - 3) + '...';
}

// Calculate estimated reading time
function estimateReadingTime(description: any): number {
	const text = extractTextFromContent(description);
	const wordsPerMinute = 200; // Average reading speed
	const words = text.split(/\s+/).length;
	const minutes = Math.ceil(words / wordsPerMinute);
	return Math.max(1, minutes); // Return at least 1 minute
}
