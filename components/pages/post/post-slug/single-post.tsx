'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
	Clock,
	ArrowLeft,
	ChevronRight,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { PostService } from '@/services/post-service';
import type { PostType } from '@/types/post';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEditorToHtml } from '@/hooks/use-editor-to-html';
import { cn } from '@/lib/utils';
import { PostSkeleton } from '@/components/pages/post/post-slug/single-post-skeleton';
import { ShareArticle } from './share-article';

interface PostPageClientProps {
	initialPost?: PostType | null;
}

export default function PostPageClient({
	initialPost = null,
}: PostPageClientProps) {
	const params = useParams();
	const router = useRouter();
	const [post, setPost] = useState<PostType | null>(initialPost);
	const [relatedPosts, setRelatedPosts] = useState<PostType[]>([]);
	const [loading, setLoading] = useState(initialPost ? false : true);
	const [error, setError] = useState('');
	const [htmlContent, setHtmlContent] = useState('');
	const [activeSection, setActiveSection] = useState<string>('');
	const slug = params?.slug as string;
	const convertToHtml = useEditorToHtml();
	const contentRef = useRef<HTMLDivElement>(null);

	// Process editor data and generate HTML content
	useEffect(() => {
		const processEditorContent = async () => {
			if (post?.description?.value && Array.isArray(post.description.value)) {
				try {
					const html = await convertToHtml(post.description.value);
					setHtmlContent(html);
				} catch (err) {
					console.error('Error converting editor content to HTML:', err);
					setError('Failed to render post content');
				}
			}
		};

		if (post) {
			processEditorContent();
		}
	}, [post, convertToHtml]);

	// Fetch post data if not provided via initialPost
	useEffect(() => {
		const fetchPost = async () => {
			// If we have initialPost or no slug, don't fetch
			if (!slug || initialPost) return;

			try {
				setLoading(true);
				const response = await PostService.getPostBySlug(slug);
				setPost(response.data);

				// Fetch related posts from the same category
				if (response.data.categories?.length > 0) {
					const categoryId = response.data.categories[0].id;
					const relatedResponse = await PostService.getPosts({
						categoryId,
						limit: 3,
						published: true,
					});

					// Filter out the current post from related posts
					const filteredRelated = relatedResponse.data.filter(
						(relatedPost) => relatedPost.id !== response.data.id
					);

					setRelatedPosts(filteredRelated);
				}
			} catch (err) {
				console.error('Error fetching post:', err);
				setError('Failed to load post');
			} finally {
				setLoading(false);
			}
		};

		fetchPost();
	}, [slug, initialPost]);

	// Fetch related posts even when initialPost is provided
	useEffect(() => {
		const fetchRelatedPosts = async () => {
			if (!post || !post.categories?.length) return;

			try {
				const categoryId = post.categories[0].id;
				const relatedResponse = await PostService.getPosts({
					categoryId,
					limit: 3,
					published: true,
				});

				// Filter out the current post from related posts
				const filteredRelated = relatedResponse.data.filter(
					(relatedPost) => relatedPost.id !== post.id
				);

				setRelatedPosts(filteredRelated);
			} catch (err) {
				console.error('Error fetching related posts:', err);
			}
		};

		if (initialPost && !relatedPosts.length) {
			fetchRelatedPosts();
		}
	}, [initialPost, post, relatedPosts.length]);

	// SINGLE, CONSOLIDATED TABLE OF CONTENTS EFFECT
	useEffect(() => {
		if (!htmlContent || !contentRef.current || !post?.tableOfContent?.length) {
			return;
		}

		// 1. Create a mapping of TOC titles to IDs
		const tocMapping = new Map(
			post.tableOfContent.map((item) => [item.title.trim(), item.id])
		);

		// 2. Find and prepare all heading elements
		const prepareHeadings = () => {
			const headingElements = Array.from(
				contentRef.current?.querySelectorAll('h1, h2, h3, h4, h5, h6') || []
			) as HTMLElement[];

			// Ensure all headings have proper IDs matching the TOC
			headingElements.forEach((heading) => {
				const headingText = heading.textContent?.trim() || '';
				const tocId = tocMapping.get(headingText);

				if (tocId) {
					// If this heading matches a TOC entry, ensure it has the right ID
					if (!heading.id) {
						heading.id = tocId;
					}
				}
			});

			return headingElements;
		};

		// 3. Scroll event handler for manual scrolling
		const handleScroll = () => {
			if (!contentRef.current) return;

			const headings = Array.from(
				contentRef.current.querySelectorAll(
					'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'
				)
			) as HTMLElement[];

			if (!headings.length) return;

			// Find the heading that's currently at the top of the viewport (with offset)
			let currentHeading: HTMLElement | null = null;
			const scrollPosition = window.scrollY;
			const headerOffset = 150; // Adjust based on your layout

			// Check each heading's position
			for (let i = 0; i < headings.length; i++) {
				const heading = headings[i];
				const headingTop = heading.getBoundingClientRect().top + window.scrollY;

				// If this heading is above our scroll position (including offset)
				if (headingTop - headerOffset <= scrollPosition) {
					currentHeading = heading;
				} else {
					// Once we find a heading below our scroll position, we can stop
					break;
				}
			}

			if (currentHeading && currentHeading.id !== activeSection) {
				setActiveSection(currentHeading.id);
			} else if (
				!currentHeading &&
				headings.length > 0 &&
				scrollPosition <= headings[0].getBoundingClientRect().top
			) {
				// If we're above the first heading, highlight it
				setActiveSection(headings[0].id);
			}
		};

		// 4. Intersection Observer for smoother updates
		const setupObserver = (headingElements: HTMLElement[]) => {
			const observer = new IntersectionObserver(
				(entries) => {
					const visibleHeadings = entries
						.filter((entry) => entry.isIntersecting)
						.sort((a, b) => {
							const aTop = a.boundingClientRect.top;
							const bTop = b.boundingClientRect.top;
							return Math.abs(aTop) - Math.abs(bTop);
						});

					if (visibleHeadings.length > 0) {
						const activeElement = visibleHeadings[0].target as HTMLElement;
						if (activeElement.id) {
							setActiveSection(activeElement.id);
						}
					}
				},
				{
					rootMargin: '-100px 0px -80% 0px',
					threshold: [0, 0.25, 0.5, 0.75, 1],
				}
			);

			headingElements
				.filter((heading) => heading.id)
				.forEach((heading) => {
					observer.observe(heading);
				});

			return observer;
		};

		// 5. Set everything up with a delay to ensure content is rendered
		const timeoutId = setTimeout(() => {
			const headings = prepareHeadings();
			const observer = setupObserver(headings);

			// Initial scroll check
			handleScroll();

			// Set up scroll listener
			window.addEventListener('scroll', handleScroll, { passive: true });

			return () => {
				observer.disconnect();
				window.removeEventListener('scroll', handleScroll);
			};
		}, 500);

		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener('scroll', handleScroll);
		};
	}, [htmlContent, post?.tableOfContent, activeSection]);

	// Scroll to section function
	const scrollToSection = (id: string) => {
		if (!contentRef.current) return;

		// Find the element by ID
		const element = contentRef.current.querySelector(`#${id}`);

		if (element) {
			// Set the active section immediately for better UX feedback
			setActiveSection(id);

			// Calculate position with offset
			const yOffset = -100;
			const y =
				element.getBoundingClientRect().top + window.pageYOffset + yOffset;

			// Scroll to the element
			window.scrollTo({
				top: y,
				behavior: 'smooth',
			});
		}
	};

	if (loading) {
		return <PostSkeleton />;
	}

	if (error || !post) {
		return (
			<div className='container mx-auto py-20 px-4 text-center'>
				<h1 className='text-3xl font-bold mb-6'>Post not found</h1>
				<p className='text-gray-600 mb-8'>
					{error ||
						"The post you're looking for doesn't exist or has been removed."}
				</p>
				<Button onClick={() => router.push('/post')}>
					<ArrowLeft className='w-4 h-4 mr-2' />
					Back to All Posts
				</Button>
			</div>
		);
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<div className='flex flex-col min-h-screen bg-white'>
			{/* Blog Content */}
			<main className='flex-grow bg-white'>
				<div className='container mx-auto px-4 py-10'>
					{/* Breadcrumb */}
					<div className='text-sm text-gray-500 mb-8'>
						<Link href='/' className='hover:text-black transition-colors'>
							Home
						</Link>
						<ChevronRight className='inline w-4 h-4 mx-1' />
						<Link href='/post' className='hover:text-black transition-colors'>
							Blog
						</Link>
						{post.categories?.length > 0 && (
							<>
								<ChevronRight className='inline w-4 h-4 mx-1' />
								<Link
									href={`/post/categories/${post.categories[0].slug}`}
									className='hover:text-black transition-colors'
								>
									{post.categories[0].name}
								</Link>
							</>
						)}
						<ChevronRight className='inline w-4 h-4 mx-1' />
						<span className='text-gray-700'>{post.title}</span>
					</div>

					<div className='flex flex-col lg:flex-row gap-10'>
						{/* Table of Contents - Sticky Sidebar */}
						{post.tableOfContent?.length > 0 && (
							<aside className='lg:w-1/4 order-2 lg:order-1'>
								<div className='sticky top-8 p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm'>
									<h3 className='text-xl font-bold mb-6'>Table of Contents</h3>
									<nav className='space-y-2 text-base'>
										{post.tableOfContent.map((item) => (
											<button
												key={item.id}
												onClick={() => scrollToSection(item.id)}
												className={cn(
													'block w-full text-left transition-all',
													'hover:text-black focus-visible:outline-none',
													activeSection === item.id
														? 'text-black font-bold'
														: 'text-gray-600'
												)}
											>
												<div
													className='flex items-start'
													style={{
														paddingLeft: `${(item.level - 1) * 12}px`,
													}}
												>
													<div
														className={cn(
															'relative pr-2',
															activeSection === item.id &&
																'before:content-[""] before:absolute before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-full before:bg-black before:rounded-full'
														)}
													>
														{item.title}
													</div>
												</div>
											</button>
										))}
									</nav>
								</div>
							</aside>
						)}

						{/* Main Article Content */}
						<article
							className={`${
								post.tableOfContent?.length > 0 ? 'lg:w-3/4' : 'w-full'
							} order-1 lg:order-2`}
						>
							{/* Article Header */}
							<div className='mb-10'>
								{/* Categories */}
								{post.categories && post.categories.length > 0 && (
									<div className='flex flex-wrap gap-2 mb-6'>
										{post.categories.map((category) => (
											<Badge
												key={category.id}
												variant='outline'
												className='px-4 py-1 bg-gray-100'
											>
												<Link href={`/post/categories/${category.slug}`}>
													{category.name}
												</Link>
											</Badge>
										))}
									</div>
								)}

								<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
									{post.title}
								</h1>

								<div className='flex flex-wrap items-center gap-6 mb-8 text-gray-600'>
									<div className='flex items-center text-gray-500 text-base'>
										<Clock className='w-5 h-5 mr-2' />
										<span>{formatDate(post.createdAt)}</span>
									</div>
								</div>

								{/* Featured Image */}
								{post.featuredImage && (
									<div className='relative h-[300px] md:h-[500px] mb-10 rounded-xl overflow-hidden shadow-md'>
										<Image
											src={post.featuredImage}
											alt={post.title}
											fill
											className='object-cover'
											priority
										/>
									</div>
								)}

								{/* Excerpt */}
								{post.excerpt && (
									<div className='border-l-4 border-black pl-6 italic text-xl text-gray-700 mb-10'>
										{post.excerpt}
									</div>
								)}
							</div>

							{/* Article Content */}
							<div className='prose prose-lg max-w-none' ref={contentRef}>
								{/* Render the HTML content from the editor */}
								{htmlContent ? (
									<div
										className='editor-content'
										dangerouslySetInnerHTML={{ __html: htmlContent }}
									/>
								) : (
									<div className='text-gray-500'>No content available</div>
								)}
							</div>

							{/* Article Footer */}
							<div className='mt-16 pt-8 border-t border-gray-100'>
								<div className='flex flex-wrap justify-between items-center'>
									<div className='mb-6 md:mb-0'>
										<h4 className='font-bold text-xl mb-4'>
											এই পোস্টটি শেয়ার করুন
										</h4>
										<ShareArticle
											url={`/post/${post.slug}`}
											title={post.title}
											summary={post.excerpt}
										/>
									</div>
									<div>
										<Button
											variant='outline'
											onClick={() => router.push('/post')}
										>
											<ArrowLeft className='mr-2 h-4 w-4' />
											সমস্ত পোস্ট পেজ এ ফিরে যান
										</Button>
									</div>
								</div>
							</div>

							{/* Related Articles Section */}
							{relatedPosts.length > 0 && (
								<div className='mt-16 pt-8 border-t border-gray-100'>
									<h3 className='text-2xl font-bold mb-8'>
										সম্পর্কিত আরো পোস্ট
									</h3>
									<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
										{relatedPosts.map((relatedPost) => (
											<Card
												key={relatedPost.id}
												className='overflow-hidden border border-gray-100 transition-shadow hover:shadow-md'
											>
												<Link href={`/post/${relatedPost.slug}`}>
													<div className='relative h-48 w-full'>
														<Image
															src={
																relatedPost.featuredImage ||
																'/images/placeholder.jpg'
															}
															alt={relatedPost.title}
															fill
															className='object-cover'
														/>
													</div>
												</Link>
												<div className='p-5'>
													{relatedPost.categories &&
														relatedPost.categories[0] && (
															<Badge variant='outline' className='mb-2'>
																{relatedPost.categories[0].name}
															</Badge>
														)}
													<Link href={`/post/${relatedPost.slug}`}>
														<h4 className='text-xl font-bold mb-2 hover:text-gray-700 transition-colors'>
															{relatedPost.title}
														</h4>
													</Link>
													<p className='text-gray-600 text-sm mb-4 line-clamp-2'>
														{relatedPost.excerpt ||
															'Read more about this topic...'}
													</p>
													<div className='flex items-center text-gray-500 text-xs'>
														<Clock className='w-3 h-3 mr-1' />
														<span>{formatDate(relatedPost.createdAt)}</span>
													</div>
												</div>
											</Card>
										))}
									</div>
								</div>
							)}
						</article>
					</div>
				</div>
			</main>
		</div>
	);
}
