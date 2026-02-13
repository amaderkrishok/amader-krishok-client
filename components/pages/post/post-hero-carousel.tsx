'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { PostType } from '@/types/post';

interface PostHeroCarouselProps {
	posts: PostType[];
	formatTimeAgo: (dateString: string) => string;
}

export function PostHeroCarousel({
	posts,
	formatTimeAgo,
}: PostHeroCarouselProps) {
	// Use only up to 5 posts for carousel
	const slides = posts.slice(0, 5).map((post) => ({
		id: post.id,
		image: post.featuredImage || '/placeholder-hero.jpg',
		category: post.categories?.length ? post.categories[0].name : 'Blog',
		title: post.title,
		excerpt:
			post.excerpt ||
			'Explore our latest agricultural insights and farming innovations.',
		date: formatTimeAgo(post.createdAt),
		readTime: '5 min read',
		slug: post.slug,
	}));

	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [direction, setDirection] = useState(0);
	const [isHovering, setIsHovering] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

	// Get the next slide index
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
		}, 5000);
	};

	useEffect(() => {
		if (slides.length <= 1) return;

		startAutoPlay();
		return () => {
			if (autoPlayRef.current) clearInterval(autoPlayRef.current);
		};
	}, [isAutoPlaying, isHovering, isDragging, currentIndex]);

	const handleDotClick = (index: number) => {
		if (index === currentIndex) return;
		setDirection(index > currentIndex ? 1 : -1);
		setCurrentIndex(index);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 5000);
	};

	const handleDragEnd = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		setIsDragging(false);

		if (slides.length <= 1) return;

		const threshold = 100; // Distance required for a swipe
		const velocity = 0.5; // Velocity required for a swipe

		if (
			Math.abs(info.offset.x) > threshold ||
			Math.abs(info.velocity.x) > velocity
		) {
			const direction = info.offset.x > 0 ? -1 : 1;
			const nextIndex = getNextIndex(currentIndex, direction);

			setDirection(direction);
			setCurrentIndex(nextIndex);
			setIsAutoPlaying(false);
			setTimeout(() => setIsAutoPlaying(true), 5000);
		}
	};

	const slideVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? '100%' : '-100%',
			opacity: 0,
			scale: 0.95,
		}),
		center: {
			x: 0,
			opacity: 1,
			scale: 1,
			transition: {
				x: { type: 'spring', stiffness: 300, damping: 30 },
				opacity: { duration: 0.4 },
				scale: { duration: 0.4 },
			},
		},
		exit: (direction: number) => ({
			x: direction > 0 ? '-100%' : '100%',
			opacity: 0,
			scale: 0.95,
			transition: {
				x: { type: 'spring', stiffness: 300, damping: 30 },
				opacity: { duration: 0.4 },
				scale: { duration: 0.4 },
			},
		}),
	};

	const maskVariants = {
		initial: { scale: 1.2, opacity: 0 },
		animate: {
			scale: 1,
			opacity: 1,
			transition: {
				duration: 0.8,
				ease: 'easeOut',
			},
		},
		exit: {
			scale: 1.2,
			opacity: 0,
			transition: {
				duration: 0.5,
				ease: 'easeIn',
			},
		},
	};

	// If no posts, don't render
	if (!slides.length) {
		return null;
	}

	// If only one post, render static version
	if (slides.length === 1) {
		const slide = slides[0];
		return (
			<section className='relative mb-10 h-[500px] w-full overflow-hidden bg-black'>
				<div className='relative h-full w-full'>
					<Image
						src={slide.image}
						alt={slide.title}
						width={1920}
						height={1080}
						className='h-full w-full object-cover'
						priority
					/>
					<div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent' />

					<div className='absolute bottom-[60px] left-[60px] max-w-[600px] text-white'>
						<Badge className='mb-[12px] rounded-[4px] bg-gray-800/70 px-[10px] py-[6px] text-[12px] font-medium text-white hover:bg-gray-800/90'>
							{slide.category}
						</Badge>

						<Link href={`/post/${slide.slug}`} className='group'>
							<h1 className='mb-[16px] text-[36px] font-bold leading-tight group-hover:text-white/80 transition-colors'>
								{slide.title}
							</h1>
						</Link>

						<p className='mb-[24px] text-[16px] leading-tight text-gray-200'>
							{slide.excerpt}
						</p>

						<div className='flex items-center gap-[8px] text-[14px] text-gray-300'>
							<span>{slide.date}</span>
							<span>•</span>
							<span>{slide.readTime}</span>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			className='relative h-[500px] w-full overflow-hidden bg-black mb-10'
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			{/* Carousel */}
			<AnimatePresence initial={false} custom={direction} mode='wait'>
				<motion.div
					key={currentIndex}
					custom={direction}
					variants={slideVariants}
					initial='enter'
					animate='center'
					exit='exit'
					className='absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing'
					drag='x'
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={0.2}
					onDragStart={() => setIsDragging(true)}
					onDragEnd={handleDragEnd}
				>
					{/* Image with mask effect */}
					<div className='relative h-full w-full overflow-hidden'>
						<motion.div
							variants={maskVariants}
							initial='initial'
							animate='animate'
							exit='exit'
							className='absolute inset-0'
						>
							<Image
								src={slides[currentIndex].image}
								alt={slides[currentIndex].title}
								width={1920}
								height={1080}
								className='h-full w-full object-cover'
								priority
							/>
							<div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent' />
						</motion.div>
					</div>

					{/* Content */}
					<div className='absolute bottom-[60px] left-[60px] max-w-[600px] text-white'>
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<Badge className='mb-[12px] rounded-[4px] bg-gray-800/70 px-[10px] py-[6px] text-[12px] font-medium text-white hover:bg-gray-800/90'>
								{slides[currentIndex].category}
							</Badge>
						</motion.div>

						<Link href={`/post/${slides[currentIndex].slug}`} className='group'>
							<motion.h1
								className='mb-[16px] text-[36px] font-bold leading-tight group-hover:text-white/80 transition-colors'
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.3 }}
							>
								{slides[currentIndex].title}
							</motion.h1>
						</Link>

						<motion.p
							className='mb-[24px] text-[16px] leading-tight text-gray-200'
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							{slides[currentIndex].excerpt}
						</motion.p>

						<motion.div
							className='flex items-center gap-[8px] text-[14px] text-gray-300'
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.5 }}
						>
							<span>{slides[currentIndex].date}</span>
							<span>•</span>
							<span>{slides[currentIndex].readTime}</span>
						</motion.div>
					</div>
				</motion.div>
			</AnimatePresence>

			{/* Indicators */}
			{slides.length > 1 && (
				<div className='absolute bottom-[20px] left-1/2 z-10 flex -translate-x-1/2 gap-[12px]'>
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => handleDotClick(index)}
							className='group'
							aria-label={`Go to slide ${index + 1}`}
						>
							<div className='relative h-[3px] w-[30px] overflow-hidden rounded-full bg-white/30'>
								<motion.div
									className='absolute left-0 top-0 h-full bg-white'
									initial={{ width: index === currentIndex ? '0%' : '0%' }}
									animate={{
										width: index === currentIndex ? '100%' : '0%',
										transition: {
											duration: index === currentIndex ? 5 : 0.3,
											ease: 'linear',
										},
									}}
									key={`indicator-${currentIndex}-${index}`}
								/>
							</div>
						</button>
					))}
				</div>
			)}
		</section>
	);
}
