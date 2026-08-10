'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
	Clock,
	ArrowLeft,
	ChevronRight,
	User,
	Calendar,
	Sparkles,
	BookOpen,
	Flame,
	ArrowRight,
	Sprout,
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
	const [readingProgress, setReadingProgress] = useState(0);
	const slug = params?.slug as string;
	const convertToHtml = useEditorToHtml();
	const contentRef = useRef<HTMLDivElement>(null);

	// Reading Progress Bar Effect
	useEffect(() => {
		const handleScroll = () => {
			const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
			if (totalHeight > 0) {
				const currentProgress = (window.scrollY / totalHeight) * 100;
				setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Process editor content to HTML
	useEffect(() => {
		const processEditorContent = async () => {
			if (post?.description?.value && Array.isArray(post.description.value)) {
				try {
					const html = await convertToHtml(post.description.value as any[]);
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

	// Fetch post data if not provided
	useEffect(() => {
		const fetchPost = async () => {
			if (!slug || initialPost) return;

			try {
				setLoading(true);
				const response = await PostService.getPostBySlug(slug);
				setPost(response.data);

				if (response.data.categories?.length > 0) {
					const categoryId = response.data.categories[0].id;
					const relatedResponse = await PostService.getPosts({
						categoryId,
						limit: 4,
						published: true,
					});

					const filteredRelated = relatedResponse.data.filter(
						(relatedPost) => relatedPost.id !== response.data.id
					);

					setRelatedPosts(filteredRelated.slice(0, 3));
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

	// Fetch related posts when initialPost is provided
	useEffect(() => {
		const fetchRelatedPosts = async () => {
			if (!post || !post.categories?.length) return;

			try {
				const categoryId = post.categories[0].id;
				const relatedResponse = await PostService.getPosts({
					categoryId,
					limit: 4,
					published: true,
				});

				const filteredRelated = relatedResponse.data.filter(
					(relatedPost) => relatedPost.id !== post.id
				);

				setRelatedPosts(filteredRelated.slice(0, 3));
			} catch (err) {
				console.error('Error fetching related posts:', err);
			}
		};

		if (initialPost && !relatedPosts.length) {
			fetchRelatedPosts();
		}
	}, [initialPost, post, relatedPosts.length]);

	// Table of contents effect
	useEffect(() => {
		if (!htmlContent || !contentRef.current || !post?.tableOfContent?.length) {
			return;
		}

		const tocMapping = new Map(
			post.tableOfContent.map((item) => [item.title.trim(), item.id])
		);

		const prepareHeadings = () => {
			const headingElements = Array.from(
				contentRef.current?.querySelectorAll('h1, h2, h3, h4, h5, h6') || []
			) as HTMLElement[];

			headingElements.forEach((heading) => {
				const headingText = heading.textContent?.trim() || '';
				const tocId = tocMapping.get(headingText);

				if (tocId && !heading.id) {
					heading.id = tocId;
				}
			});

			return headingElements;
		};

		const handleScroll = () => {
			if (!contentRef.current) return;

			const headings = Array.from(
				contentRef.current.querySelectorAll(
					'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]'
				)
			) as HTMLElement[];

			if (!headings.length) return;

			let currentHeading: HTMLElement | null = null;
			const scrollPosition = window.scrollY;
			const headerOffset = 150;

			for (let i = 0; i < headings.length; i++) {
				const heading = headings[i];
				const headingTop = heading.getBoundingClientRect().top + window.scrollY;

				if (headingTop - headerOffset <= scrollPosition) {
					currentHeading = heading;
				} else {
					break;
				}
			}

			if (currentHeading && currentHeading.id !== activeSection) {
				setActiveSection(currentHeading.id);
			}
		};

		const timeoutId = setTimeout(() => {
			prepareHeadings();
			handleScroll();
			window.addEventListener('scroll', handleScroll, { passive: true });
		}, 500);

		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener('scroll', handleScroll);
		};
	}, [htmlContent, post?.tableOfContent, activeSection]);

	const scrollToSection = (id: string) => {
		if (!contentRef.current) return;
		const element = contentRef.current.querySelector(`#${id}`);

		if (element) {
			setActiveSection(id);
			const yOffset = -100;
			const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	};

	if (loading) {
		return <PostSkeleton />;
	}

	if (error || !post) {
		return (
			<div className='min-h-screen bg-[#F8FAF7] flex items-center justify-center py-20 px-4 text-center'>
				<div className='bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E7EB] shadow-md max-w-md w-full space-y-4'>
					<div className='w-16 h-16 bg-[#1E2817]/5 rounded-full flex items-center justify-center mx-auto text-[#2E7D32]'>
						<Sprout className='w-8 h-8' />
					</div>
					<h1 className='text-2xl font-bold text-[#172018]'>পোস্টটি পাওয়া যায়নি</h1>
					<p className='text-sm text-[#667085] leading-relaxed'>
						{error || 'আপনি যে পোস্টটি খুঁজছেন তা মুছে ফেলা হয়েছে বা উপলব্ধ নেই।'}
					</p>
					<Button
						onClick={() => router.push('/post')}
						className='bg-[#1E2817] hover:bg-[#2A351F] text-white rounded-2xl px-6 py-3 font-bold gap-2'
					>
						<ArrowLeft className='w-4 h-4' />
						<span>সব পোস্টে ফিরে যান</span>
					</Button>
				</div>
			</div>
		);
	}

	const formatDateInBengali = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString('bn-BD', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		} catch (e) {
			return dateString;
		}
	};

	// Clean category name fallback (Rule 24: remove 'Test' placeholders)
	const rawCategoryName = post.categories && post.categories[0] ? post.categories[0].name : '';
	const categoryName = (!rawCategoryName || rawCategoryName.toLowerCase() === 'test')
		? 'কৃষি প্রযুক্তি'
		: rawCategoryName;

	return (
		<div className='min-h-screen bg-[#F8FAF7] text-[#172018] font-sans antialiased relative selection:bg-[#FBBF24] selection:text-[#1E2817]'>
			{/* READING PROGRESS BAR AT TOP */}
			<div
				className='fixed top-0 left-0 z-50 h-[3px] bg-[#4CAF50] transition-all duration-150 ease-out'
				style={{ width: `${readingProgress}%` }}
			/>

			{/* BREADCRUMB SECTION */}
			<div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4'>
				<nav className='flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-[#667085]'>
					<Link href='/' className='hover:text-[#1E2817] transition-colors font-medium'>
						হোম
					</Link>
					<ChevronRight className='w-3.5 h-3.5 text-gray-400' />
					<Link href='/post' className='hover:text-[#1E2817] transition-colors font-medium'>
						ব্লগ
					</Link>
					<ChevronRight className='w-3.5 h-3.5 text-gray-400' />
					<span className='font-semibold text-[#2E7D32]'>{categoryName}</span>
					<ChevronRight className='w-3.5 h-3.5 text-gray-400 hidden sm:inline' />
					<span className='text-[#172018] font-medium line-clamp-1 max-w-[200px] sm:max-w-[300px] hidden sm:inline'>
						{post.title}
					</span>
				</nav>
			</div>

			{/* ARTICLE HEADER SECTION (CENTERED EDITORIAL LAYOUT) */}
			<header className='max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 text-center space-y-4'>
				{/* Category Badge */}
				<div className='inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#4CAF50]/15 border border-[#4CAF50]/30 text-[#2E7D32] text-xs sm:text-sm font-bold shadow-sm'>
					<Sprout className='w-4 h-4 text-[#2E7D32]' />
					<span>🌱 {categoryName}</span>
				</div>

				{/* Title */}
				<h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#172018] tracking-tight leading-[1.25] max-w-[880px] mx-auto'>
					{post.title}
				</h1>

				{/* Metadata Row */}
				<div className='flex items-center justify-center flex-wrap gap-2 text-xs sm:text-sm text-[#667085] font-medium pt-2'>
					<span className='inline-flex items-center gap-1.5 text-[#172018] font-semibold'>
						<User className='w-4 h-4 text-[#2E7D32]' />
						<span>Amader Krishok</span>
					</span>
					<span>•</span>
					<span className='inline-flex items-center gap-1.5'>
						<Calendar className='w-4 h-4 text-gray-400' />
						<span>{formatDateInBengali(post.createdAt)}</span>
					</span>
					<span>•</span>
					<span className='inline-flex items-center gap-1.5'>
						<Clock className='w-4 h-4 text-gray-400' />
						<span>৫ মিনিট পড়ুন</span>
					</span>
				</div>
			</header>
			{post.featuredImage && (
				<div className='max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 mb-10'>
					<div className='relative w-full aspect-[16/7] md:aspect-[16/7] rounded-3xl overflow-hidden shadow-md border border-[#E5E7EB] group bg-gray-100'>
						<Image
							src={post.featuredImage}
							alt={post.title}
							fill
							className='object-cover transform group-hover:scale-[1.02] transition-transform duration-500 ease-out'
							priority
						/>
					</div>
					{post.excerpt && (
						<p className='text-center text-xs sm:text-sm italic text-[#667085] mt-3 max-w-2xl mx-auto'>
							{post.excerpt}
						</p>
					)}
				</div>
			)}

			{/* MAIN ARTICLE LAYOUT (DESKTOP: GRID 1FR ARTICLE + 320PX SIDEBAR, GAP 32-40PX) */}
			<div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
				<div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-10 items-start'>
					
					{/* MAIN ARTICLE CONTENT COLUMN */}
					<article className='w-full space-y-8 min-w-0'>
						
						{/* HIGHLIGHTED INTRO / EXCERPT BLOCK */}
						{post.excerpt && (
							<div className='bg-[#F3F7EF] border-l-4 border-[#FBBF24] p-6 sm:p-7 rounded-2xl shadow-sm space-y-2'>
								<p className='text-base sm:text-lg text-[#1E2817] font-semibold leading-relaxed'>
									{post.excerpt}
								</p>
							</div>
						)}

						{/* ARTICLE BODY & TYPOGRAPHY CARD */}
						<div
							className='editor-content bg-white p-5 sm:p-8 md:p-10 rounded-[20px] border border-[#E5E7EB] shadow-sm space-y-6 text-base md:text-lg text-[#374151] leading-[1.8]'
							ref={contentRef}
						>
							<style jsx global>{`
								.editor-content h1, .editor-content h2, .editor-content h3 {
									font-size: 1.625rem;
									font-weight: 800;
									color: #1E2817;
									margin-top: 2rem;
									margin-bottom: 1rem;
									display: flex;
									align-items: center;
									gap: 0.5rem;
									line-height: 1.3;
								}
								.editor-content h2::before, .editor-content h3::before {
									content: '🌱';
									font-size: 1.2rem;
								}
								.editor-content p {
									font-size: 1.125rem;
									line-height: 1.85;
									color: #374151;
									margin-bottom: 1.5rem;
								}
								.editor-content ul, .editor-content ol {
									margin-bottom: 1.5rem;
									padding-left: 1.5rem;
								}
								.editor-content li {
									font-size: 1.125rem;
									line-height: 1.8;
									color: #374151;
									margin-bottom: 0.5rem;
								}
								.editor-content blockquote {
									border-left: 4px solid #2E7D32;
									background-color: #F8FAF7;
									padding: 1rem 1.5rem;
									border-radius: 0.75rem;
									font-style: italic;
									margin-bottom: 1.5rem;
								}
							`}</style>

							{htmlContent ? (
								<div
									dangerouslySetInnerHTML={{ __html: htmlContent }}
								/>
							) : (
								<p className='text-gray-500 italic'>কোনো বিষয়বস্তু পাওয়া যায়নি।</p>
							)}
						</div>

						{/* SHARE ARTICLE SECTION */}
						<ShareArticle
							url={`/post/${post.slug}`}
							title={post.title}
							summary={post.excerpt}
						/>

						{/* AUTHOR CARD */}
						<div className='bg-white border border-[#E5E7EB] rounded-[20px] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left'>
							<div className='w-16 h-16 rounded-full bg-[#1E2817] text-[#FBBF24] flex items-center justify-center font-extrabold text-xl shadow-md shrink-0 border-2 border-white'>
								🌱
							</div>
							<div className='space-y-1.5 flex-1'>
								<div className='flex items-center justify-center sm:justify-start gap-2'>
									<h4 className='text-lg font-bold text-[#172018]'>Amader Krishok</h4>
									<Badge className='bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#2E7D32]/20'>
										অফিশিয়াল লেখক
									</Badge>
								</div>
								<p className='text-sm text-[#667085] leading-relaxed font-normal'>
									কৃষি বিষয়ক তথ্য, পরামর্শ ও আধুনিক কৃষি প্রযুক্তি নিয়ে নির্ভরযোগ্য কনটেন্ট প্রকাশ করা আমাদের মূল লক্ষ্য।
								</p>
							</div>
						</div>

						{/* BACK TO POSTS BUTTON */}
						<div className='pt-2 flex items-center justify-start'>
							<Button
								onClick={() => router.push('/post')}
								className='border-2 border-[#1E2817] bg-white hover:bg-[#1E2817] text-[#1E2817] hover:text-white rounded-2xl px-6 py-3 font-extrabold text-sm transition-all shadow-sm flex items-center gap-2'
							>
								<ArrowLeft className='w-4 h-4' />
								<span>← সব পোস্টে ফিরে যান</span>
							</Button>
						</div>

					</article>

					{/* RIGHT STICKY SIDEBAR COLUMN (320PX WIDE - DESKTOP STICKY TOP 100PX) */}
					<aside className='w-full lg:w-[320px] shrink-0 space-y-5 lg:sticky lg:top-[100px]'>
						
						{/* CARD 1: TABLE OF CONTENTS CARD */}
						{post.tableOfContent && post.tableOfContent.length > 0 && (
							<div className='bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm space-y-4'>
								<h3 className='text-base font-extrabold text-[#172018] flex items-center gap-2 border-b border-gray-100 pb-3'>
									<BookOpen className='w-4.5 h-4.5 text-[#2E7D32]' />
									<span>📌 এই পোস্টে যা থাকছে</span>
								</h3>
								<nav className='space-y-2 text-xs sm:text-sm font-medium'>
									{post.tableOfContent.map((item, index) => {
										const isActive = activeSection === item.id;
										const itemNum = String(index + 1).padStart(2, '0');
										return (
											<button
												key={item.id}
												onClick={() => scrollToSection(item.id)}
												className={cn(
													'w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group',
													isActive
														? 'bg-[#1E2817] text-white font-bold shadow-sm'
														: 'text-[#667085] hover:bg-[#F8FAF7] hover:text-[#172018]'
												)}
											>
												<span
													className={cn(
														'text-xs font-mono font-bold px-2 py-0.5 rounded-md shrink-0 transition-colors',
														isActive
															? 'bg-[#FBBF24] text-[#1E2817]'
															: 'bg-gray-100 text-gray-500 group-hover:bg-[#2E7D32]/10 group-hover:text-[#2E7D32]'
													)}
												>
													{itemNum}
												</span>
												<span className='line-clamp-2 leading-snug pt-0.5'>{item.title}</span>
											</button>
										);
									})}
								</nav>
							</div>
						)}

						{/* CARD 2: POPULAR POSTS SIDEBAR CARD */}
						{relatedPosts.length > 0 && (
							<div className='bg-white border border-[#E5E7EB] rounded-[20px] p-6 shadow-sm space-y-4'>
								<h3 className='text-base font-extrabold text-[#172018] flex items-center gap-2 border-b border-gray-100 pb-3'>
									<Flame className='w-4.5 h-4.5 text-[#FF9800]' />
									<span>🔥 জনপ্রিয় পোস্ট</span>
								</h3>
								<div className='space-y-4'>
									{relatedPosts.map((rPost) => {
										const rCatName = rPost.categories && rPost.categories[0] ? rPost.categories[0].name : '';
										const displayCat = (!rCatName || rCatName.toLowerCase() === 'test') ? 'কৃষি' : rCatName;
										return (
											<Link
												key={rPost.id}
												href={`/post/${rPost.slug}`}
												className='flex gap-3.5 items-center group pb-3.5 border-b border-gray-100 last:border-0 last:pb-0'
											>
												<div className='relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 shadow-sm'>
													{rPost.featuredImage ? (
														<Image
															src={rPost.featuredImage}
															alt={rPost.title}
															fill
															className='object-cover group-hover:scale-105 transition-transform duration-300'
														/>
													) : (
														<div className='w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold bg-[#1E2817]/5 text-[#2E7D32]'>
															🌱
														</div>
													)}
												</div>
												<div className='space-y-1 min-w-0 flex-1'>
													<span className='text-[11px] font-bold text-[#2E7D32] block'>
														{displayCat}
													</span>
													<h4 className='text-xs font-bold text-[#172018] line-clamp-2 leading-snug group-hover:text-[#2E7D32] transition-colors'>
														{rPost.title}
													</h4>
													<div className='flex items-center gap-1 text-[11px] text-[#667085]'>
														<Clock className='w-3 h-3 text-gray-400' />
														<span>৫ মিনিট পড়ুন</span>
													</div>
												</div>
											</Link>
										);
									})}
								</div>
							</div>
						)}

						{/* CARD 3: AGRICULTURAL HELP & MARKETPLACE CTA CARD */}
						<div className='bg-[#1E2817] text-white rounded-[20px] p-6 shadow-md space-y-3 relative overflow-hidden group border border-[#2A351F]'>
							<div className='absolute -right-4 -bottom-4 w-24 h-24 bg-[#FBBF24]/10 rounded-full blur-xl pointer-events-none' />
							<div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24]/20 text-[#FBBF24] text-xs font-bold'>
								🌾 কৃষি সহায়তা
							</div>
							<h4 className='text-sm font-bold leading-snug text-white'>
								উন্নত বীজ, সার ও আধুনিক কৃষি সরঞ্জাম খুঁজছেন?
							</h4>
							<p className='text-xs text-gray-300 leading-relaxed font-normal'>
								আমাদের এগ্রিকালচার মার্কেটপ্লেসে পাচ্ছেন যাচাইকৃত মানসম্মত কৃষি পণ্য ও সেবা।
							</p>
							<Link
								href='/marketplace'
								className='inline-flex items-center gap-1.5 text-xs font-bold text-[#FBBF24] hover:underline pt-1 group-hover:translate-x-1 transition-transform'
							>
								<span>মার্কেটপ্লেস দেখুন</span>
								<ArrowRight className='w-3.5 h-3.5' />
							</Link>
						</div>

					</aside>

				</div>

				{/* RELATED POSTS BOTTOM SECTION */}
				{relatedPosts.length > 0 && (
					<section className='mt-16 pt-10 border-t border-gray-200/80 space-y-8'>
						<div className='space-y-1 text-center sm:text-left'>
							<h3 className='text-2xl sm:text-3xl font-extrabold text-[#172018] tracking-tight'>
								আরও পড়ুন
							</h3>
							<p className='text-sm sm:text-base text-[#667085] font-normal'>
								আপনার জন্য আরও কিছু কৃষি বিষয়ক পোস্ট
							</p>
						</div>

						<div className={cn(
							'grid gap-6',
							relatedPosts.length === 1 && 'grid-cols-1 max-w-md',
							relatedPosts.length === 2 && 'grid-cols-1 sm:grid-cols-2 max-w-3xl',
							relatedPosts.length >= 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
						)}>
							{relatedPosts.map((relatedPost) => (
								<div
									key={relatedPost.id}
									className='group bg-[#FFFFFF] border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full'
								>
									<Link
										href={`/post/${relatedPost.slug}`}
										className='block relative aspect-video w-full overflow-hidden bg-gray-100'
									>
										{relatedPost.featuredImage ? (
											<Image
												src={relatedPost.featuredImage}
												alt={relatedPost.title}
												fill
												className='object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out'
											/>
										) : (
											<div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
												<span className='text-gray-400 font-medium text-xs'>আমাদের কৃষক</span>
											</div>
										)}
										<div className='absolute left-3.5 top-3.5 z-10'>
											<span className='text-xs font-semibold px-3 py-1 bg-[#1E2817]/90 text-[#FBBF24] backdrop-blur-md rounded-full shadow-md border border-white/10 inline-block'>
												{relatedPost.categories && relatedPost.categories[0]
													? relatedPost.categories[0].name
													: 'কৃষি'}
											</span>
										</div>
									</Link>

									<div className='p-5 flex flex-col flex-1 justify-between space-y-4'>
										<div className='space-y-2'>
											<Link href={`/post/${relatedPost.slug}`} className='block'>
												<h4 className='text-base font-bold text-[#172018] line-clamp-2 leading-snug group-hover:text-[#2E7D32] transition-colors'>
													{relatedPost.title}
												</h4>
											</Link>
											{relatedPost.excerpt && (
												<p className='text-[#667085] text-xs leading-relaxed line-clamp-2 font-normal'>
													{relatedPost.excerpt}
												</p>
											)}
										</div>

										<div className='pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#667085] font-medium'>
											<span className='inline-flex items-center gap-1 text-gray-500'>
												<Clock className='w-3.5 h-3.5 text-gray-400' />
												<span>৫ মিনিট পড়ুন</span>
											</span>
											<Link
												href={`/post/${relatedPost.slug}`}
												className='inline-flex items-center gap-1 font-bold text-[#1E2817] group-hover:text-[#2E7D32] transition-colors'
											>
												<span>পড়ুন</span>
												<ArrowRight className='w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300' />
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>
					</section>
				)}

			</div>
		</div>
	);
}

