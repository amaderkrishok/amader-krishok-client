'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { PostType } from '@/types/post';
import { Leaf, Sprout, ArrowRight, Clock, Sparkles } from 'lucide-react';

interface PostHeroCarouselProps {
	posts: PostType[];
	formatTimeAgo: (dateString: string) => string;
}

export function PostHeroCarousel({
	posts,
	formatTimeAgo,
}: PostHeroCarouselProps) {
	// Up to 5 posts for carousel
	const slides = posts.slice(0, 5).map((post) => ({
		id: post.id,
		image: post.featuredImage || '/images/hero_farmer_fresh_produce.jpg',
		category: post.categories?.length ? post.categories[0].name : 'কৃষি জ্ঞান',
		title: post.title,
		excerpt:
			post.excerpt ||
			'কৃষি, ফসল চাষ, রোগবালাই ও কৃষি প্রযুক্তি সম্পর্কে প্রয়োজনীয় তথ্য ও পরামর্শ এক জায়গায়।',
		date: formatTimeAgo(post.createdAt),
		readTime: '৫ মিনিট পড়ার সময়',
		slug: post.slug,
	}));

	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [direction, setDirection] = useState(0);
	const [isHovering, setIsHovering] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

	const getNextIndex = (current: number, dir: number) => {
		return (current + dir + slides.length) % slides.length;
	};

	const startAutoPlay = () => {
		if (autoPlayRef.current) clearInterval(autoPlayRef.current);
		autoPlayRef.current = setInterval(() => {
			if (isAutoPlaying && !isHovering && !isDragging && slides.length > 1) {
				const nextIndex = getNextIndex(currentIndex, 1);
				setDirection(1);
				setCurrentIndex(nextIndex);
			}
		}, 6000);
	};

	useEffect(() => {
		if (slides.length <= 1) return;

		startAutoPlay();
		return () => {
			if (autoPlayRef.current) clearInterval(autoPlayRef.current);
		};
	}, [isAutoPlaying, isHovering, isDragging, currentIndex, slides.length]);

	const handleDotClick = (index: number) => {
		if (index === currentIndex) return;
		setDirection(index > currentIndex ? 1 : -1);
		setCurrentIndex(index);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 6000);
	};

	const handleDragEnd = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		setIsDragging(false);

		if (slides.length <= 1) return;

		const threshold = 80;
		const velocity = 0.4;

		if (
			Math.abs(info.offset.x) > threshold ||
			Math.abs(info.velocity.x) > velocity
		) {
			const dir = info.offset.x > 0 ? -1 : 1;
			const nextIndex = getNextIndex(currentIndex, dir);

			setDirection(dir);
			setCurrentIndex(nextIndex);
			setIsAutoPlaying(false);
			setTimeout(() => setIsAutoPlaying(true), 6000);
		}
	};

	// Fallback static Hero if no posts from API
	const activeSlide = slides.length > 0 ? slides[currentIndex] : null;

	return (
		<section
			className='relative w-full pt-28 md:pt-36 pb-8 min-h-[420px] md:min-h-[500px] overflow-hidden bg-[#37462A] shadow-xl'
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			{/* Floating Background Leaf Animations (Low Opacity) */}
			<div className='absolute inset-0 z-10 pointer-events-none overflow-hidden'>
				{[
					{ left: '8%', top: '15%', scale: 1.1, duration: 8, delay: 0 },
					{ left: '82%', top: '20%', scale: 0.9, duration: 9, delay: 1 },
					{ left: '72%', top: '65%', scale: 1.2, duration: 10, delay: 1.5 },
					{ left: '25%', top: '75%', scale: 0.8, duration: 7, delay: 0.5 },
				].map((leaf, i) => (
					<motion.div
						key={i}
						className='absolute text-[#4CAF50]/10'
						style={{ left: leaf.left, top: leaf.top }}
						animate={{
							y: [-12, 12, -12],
							rotate: [0, 15, -15, 0],
							scale: [leaf.scale, leaf.scale * 1.08, leaf.scale],
						}}
						transition={{
							duration: leaf.duration,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: leaf.delay,
						}}
					>
						<Leaf className='w-12 h-12' />
					</motion.div>
				))}
			</div>

			{/* Static or Animated Slide */}
			{slides.length === 0 ? (
				<div className='absolute inset-0 h-full w-full'>
					<Image
						src='/images/post_hero_crop_field.jpg'
						alt='আমাদের কৃষক'
						fill
						className='object-cover object-center'
						priority
					/>
					<div
						className='absolute inset-0 z-10'
						style={{
							background:
								'linear-gradient(90deg, rgba(35,50,25,0.85) 0%, rgba(45,65,32,0.50) 55%, rgba(45,65,32,0.15) 100%)',
						}}
					/>
					<div className='absolute inset-0 pt-28 sm:pt-36 pb-8 z-20 w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 flex items-center'>
						<div className='max-w-7xl mx-auto w-full'>
							<div className='max-w-2xl text-white space-y-4'>
								<div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FBBF24] text-xs sm:text-sm font-semibold shadow-sm'>
									<Sprout className='w-4 h-4 text-[#FBBF24]' />
									<span>🌱 কৃষি জ্ঞান ও পরামর্শ</span>
								</div>
								<h1 className='text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight'>
									আধুনিক কৃষির <span className='text-[#FBBF24]'>সহজ সমাধান</span>
								</h1>
								<p className='text-gray-200 text-sm sm:text-base md:text-lg font-normal max-w-xl leading-relaxed'>
									কৃষি, ফসল চাষ, রোগবালাই ও কৃষি প্রযুক্তি সম্পর্কে প্রয়োজনীয় তথ্য ও পরামর্শ এক জায়গায়।
								</p>
								<div className='flex items-center gap-3 text-xs sm:text-sm text-gray-300 font-medium pt-2'>
									<span className='inline-flex items-center gap-1.5 bg-[#37462A]/80 px-2.5 py-1 rounded-md border border-white/10'>
										নতুন পোস্ট
									</span>
									<span>•</span>
									<span>৫ মিনিট পড়ার সময়</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<AnimatePresence initial={false} custom={direction} mode='wait'>
					<motion.div
						key={currentIndex}
						custom={direction}
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.98 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
						className='absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing'
						drag='x'
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={0.2}
						onDragStart={() => setIsDragging(true)}
						onDragEnd={handleDragEnd}
					>
						{/* Background Image */}
						<div className='relative h-full w-full overflow-hidden'>
							<Image
								src={activeSlide?.image || '/images/post_hero_crop_field.jpg'}
								alt={activeSlide?.title || 'কৃষি পোস্ট'}
								fill
								className='object-cover object-center transform scale-105 transition-transform duration-1000'
								priority
							/>
							{/* Dark Olive Overlay requested in design specification */}
							<div
								className='absolute inset-0 z-10'
								style={{
									background:
										'linear-gradient(90deg, rgba(35,50,25,0.85) 0%, rgba(45,65,32,0.50) 55%, rgba(45,65,32,0.15) 100%)',
								}}
							/>
						</div>

						{/* Hero Content aligned Left */}
						<div className='absolute inset-0 pt-28 sm:pt-36 pb-8 z-20 w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 flex items-center'>
							<div className='max-w-7xl mx-auto w-full'>
								<div className='max-w-2xl text-white space-y-3 sm:space-y-4'>
								<motion.div
									initial={{ y: 15, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.4, delay: 0.1 }}
									className='flex flex-wrap items-center gap-2'
								>
									<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FBBF24] text-xs sm:text-sm font-semibold shadow-sm'>
										<Sprout className='w-4 h-4 text-[#FBBF24]' />
										<span>🌱 কৃষি জ্ঞান ও পরামর্শ</span>
									</div>
									{activeSlide?.category && (
										<Badge className='bg-[#4CAF50]/90 text-white font-medium text-xs px-2.5 py-0.5 rounded-full shadow-sm'>
											{activeSlide.category}
										</Badge>
									)}
								</motion.div>

								<Link href={`/post/${activeSlide?.slug}`} className='group block'>
									<motion.h1
										className='text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight group-hover:text-[#FBBF24] transition-colors line-clamp-2'
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ duration: 0.4, delay: 0.2 }}
									>
										{activeSlide?.title}
									</motion.h1>
								</Link>

								<motion.p
									className='text-gray-200 text-xs sm:text-sm md:text-base font-normal line-clamp-2 max-w-xl leading-relaxed'
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.4, delay: 0.3 }}
								>
									{activeSlide?.excerpt}
								</motion.p>

								<motion.div
									className='flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-300 font-medium pt-1'
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.4, delay: 0.4 }}
								>
									<span className='inline-flex items-center gap-1.5 bg-[#2A351F]/80 px-2.5 py-1 rounded-md border border-white/10 text-white'>
										
										নতুন পোস্ট
									</span>
									<span>•</span>
									<span className='inline-flex items-center gap-1'>
										<Clock className='w-3.5 h-3.5 text-gray-300' />
										{activeSlide?.readTime}
									</span>
									<span>•</span>
									<span>{activeSlide?.date}</span>

									<Link
										href={`/post/${activeSlide?.slug}`}
										className='inline-flex items-center gap-1 text-[#FBBF24] font-bold hover:underline ml-2 group/link'
									>
										<span>পড়ুন</span>
										<ArrowRight className='w-4 h-4 transform group-hover/link:translate-x-1 transition-transform' />
									</Link>
								</motion.div>
							</div>
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		)}

			{/* Slide Indicators */}
			{slides.length > 1 && (
				<div className='absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2'>
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => handleDotClick(index)}
							className={`h-2 rounded-full transition-all duration-300 ${
								index === currentIndex
									? 'w-8 bg-[#FBBF24]'
									: 'w-2 bg-white/40 hover:bg-white/70'
							}`}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			)}
		</section>
	);
}

