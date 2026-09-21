'use client';

import { useState, useRef, useEffect } from 'react';
import {
	Search,
	ArrowRight,
	Store,
	ShieldCheck,
	Leaf,
	Apple,
	Fish,
	Wheat,
	Wrench,
	FlaskConical,
	Sprout,
	BookOpen,
	Calculator,
	CloudSun,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
	const router = useRouter();
	const [searchInput, setSearchInput] = useState('');
	const [activeCategory, setActiveCategory] = useState('সবজি');
	const [videoLoaded, setVideoLoaded] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const tabsRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const updateScrollButtons = () => {
		if (tabsRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
			setCanScrollLeft(scrollLeft > 4);
			setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
		}
	};

	useEffect(() => {
		updateScrollButtons();
		const container = tabsRef.current;
		if (container) {
			container.addEventListener('scroll', updateScrollButtons);
			window.addEventListener('resize', updateScrollButtons);
			return () => {
				container.removeEventListener('scroll', updateScrollButtons);
				window.removeEventListener('resize', updateScrollButtons);
			};
		}
	}, []);

	const scrollTabs = (direction: 'left' | 'right') => {
		if (tabsRef.current) {
			const scrollAmount = 260;
			tabsRef.current.scrollBy({
				left: direction === 'left' ? -scrollAmount : scrollAmount,
				behavior: 'smooth',
			});
		}
	};

	const categoryTabs = [
		{ label: 'সবজি', icon: Leaf, query: 'সবজি' },
		{ label: 'ফল', icon: Apple, query: 'ফল' },
		{ label: 'মাছ', icon: Fish, query: 'মাছ' },
		{ label: 'শস্য', icon: Wheat, query: 'শস্য' },
		{ label: 'কৃষি উপকরণ', icon: Wrench, query: 'কৃষি উপকরণ' },
		{ label: 'সার', icon: FlaskConical, query: 'সার' },
		{ label: 'বীজ', icon: Sprout, query: 'বীজ' },
		{
			label: 'ফসল চাষ প্রক্রিয়া',
			icon: BookOpen,
			route: '/crop-cultivation',
			isFeatureRoute: true,
		},
		{
			label: 'সার ক্যালকুলেটর',
			icon: Calculator,
			route: '/crop-calculator',
			isFeatureRoute: true,
		},
		{
			label: 'আবহাওয়া আপডেট',
			icon: CloudSun,
			route: '/weather',
			isFeatureRoute: true,
		},
	];

	const quickChips = [
		{ label: 'টমেটো', term: 'টমেটো' },
		{ label: 'শাকসবজি', term: 'শাকসবজি' },
		{ label: 'আলু', term: 'আলু' },
		{ label: 'আম', term: 'আম' },
		{ label: 'ইলিশ মাছ', term: 'ইলিশ' },
		{ label: 'ধান', term: 'ধান' },
		{ label: 'ইউরিয়া সার', term: 'ইউরিয়া' },
		{ label: 'হাইব্রিড বীজ', term: 'বীজ' },
	];

	const handleSearch = () => {
		if (searchInput.trim()) {
			router.push(`/marketplace?term=${encodeURIComponent(searchInput.trim())}`);
		} else if (activeCategory) {
			router.push(`/marketplace?category=${encodeURIComponent(activeCategory)}`);
		} else {
			router.push('/marketplace');
		}
	};

	const handleTabClick = (tab: (typeof categoryTabs)[number]) => {
		setActiveCategory(tab.label);
		if (tab.isFeatureRoute && tab.route) {
			router.push(tab.route);
		} else if (tab.query) {
			router.push(`/marketplace?category=${encodeURIComponent(tab.query)}`);
		}
	};

	const handleChipClick = (query: string) => {
		router.push(`/marketplace?category=${encodeURIComponent(query)}`);
	};

	useEffect(() => {
		if (videoRef.current && videoRef.current.readyState >= 3) {
			setVideoLoaded(true);
		}
		// Prefetch all destination routes on client-side for instant 0ms redirection on click
		if (typeof window !== 'undefined') {
			router.prefetch('/marketplace');
			router.prefetch('/crop-cultivation');
			router.prefetch('/crop-calculator');
			router.prefetch('/weather');
		}
	}, [router]);

	return (
		<div className='relative w-full select-none'>
			{/* --- 1. Compact Video Banner (ShareTrip-inspired compact style) --- */}
			<div className='relative w-full h-[250px] sm:h-[250px] md:h-[220px] lg:h-[230px] xl:h-[350px] overflow-hidden '>
				{/* Real Agriculture Background Video */}
				<video
					ref={videoRef}
					autoPlay
					muted
					loop
					playsInline
					className='absolute inset-0 w-full h-full object-cover object-center pointer-events-none shadow-2xl transition-opacity duration-1000'
				>
					<source src='/videos/banner-10.mp4' type='video/mp4' />
				</video>

				{/* HERO TEXT CONTENT AREA — sits inside banner, above the search card */}
				<div className='relative z-20 w-full h-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 flex items-end pb-14 sm:pb-16 md:pb-18 lg:pb-20 xl:pb-22'>
					<div className='max-w-7xl mx-auto w-full'>
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, ease: 'easeOut' }}
						className='space-y-0.5 sm:space-y-1 max-w-2xl text-left'
					>
						<h1 className='text-[18px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[35px] font-extrabold text-white leading-tight tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-left'>
							কোনো মধ্যস্বত্বভোগী নেই
						</h1>

						<p className='text-white/90 text-[11px] sm:text-xs lg:text-[16px] font-medium leading-relaxed max-w-lg text-left drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]'>
							বাংলাদেশের ৪২টি জেলার যাচাইকৃত কৃষকদের প্রোফাইল ঘুরে দেখুন, সরাসরি কথা বলুন এবং নিজেই দরদাম করে কিনুন।
						</p>
					</motion.div>
					</div>
				</div>
			</div>

			{/* --- 2. FLOATING OVERLAPPING SEARCH CARD STRADDLING THE VIDEO BANNER SEAM --- */}
			<div className='relative z-30 w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 -mt-10 sm:-mt-12 md:-mt-13 lg:-mt-14 xl:-mt-16 mb-3 sm:mb-4'>
				<div className='max-w-7xl mx-auto'>
					<motion.div
						initial={{ opacity: 1, y: 0 }}
						animate={{ opacity: 1, y: 0 }}
						className='bg-white rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-gray-100/90 p-3.5 sm:p-4.5 lg:p-5 flex flex-col gap-3 sm:gap-3.5'
					>
						{/* 1. Category Tabs Header inside Search Module */}
						<div className='flex items-center gap-1.5 sm:gap-2 border-b border-gray-200'>
							{/* Left Scroll Chevron Button */}
							{canScrollLeft && (
								<button
									type='button'
									onClick={() => scrollTabs('left')}
									className='shrink-0 w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 hover:text-[#26351B] hover:bg-[#F5B800] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 mr-1'
									aria-label='Previous tabs'
								>
									<ChevronLeft className='w-4 h-4' />
								</button>
							)}

							{/* Category Tabs Scroll Container (Scrollbar completely hidden, zero overlap) */}
							<div
								ref={tabsRef}
								className='flex-1 flex items-center gap-4 sm:gap-6 overflow-x-auto pb-1 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] no-scrollbar scrollbar-none'
							>
								{categoryTabs.map((tab) => {
									const IconComponent = tab.icon;
									const isActive = activeCategory === tab.label;
									const targetHref =
										tab.isFeatureRoute && tab.route
											? tab.route
											: `/marketplace?category=${encodeURIComponent(tab.query || '')}`;

									return (
										<Link
											key={tab.label}
											href={targetHref}
											onClick={() => setActiveCategory(tab.label)}
											className={`flex items-center gap-2 px-2.5 sm:px-3.5 py-2.5 relative font-bold text-xs sm:text-sm whitespace-nowrap transition-colors duration-150 bg-transparent border-none cursor-pointer group shrink-0 ${
												isActive
													? 'text-[#B45309] font-extrabold'
													: 'text-gray-600 hover:text-[#172033]'
											}`}
										>
											<IconComponent
												className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors ${
													isActive
														? 'text-[#F5B800]'
														: 'text-gray-400 group-hover:text-gray-600'
												}`}
											/>
											<span>{tab.label}</span>

											{/* Active Yellow Bottom Underline Indicator */}
											{isActive && (
												<motion.div
													layoutId='activeTabIndicator'
													className='absolute bottom-0 left-0 right-0 h-[3.5px] bg-[#F5B800] rounded-full shadow-xs'
													transition={{ type: 'spring', stiffness: 450, damping: 32 }}
												/>
											)}
										</Link>
									);
								})}
							</div>

							{/* Right Scroll Chevron Button */}
							{canScrollRight && (
								<button
									type='button'
									onClick={() => scrollTabs('right')}
									className='shrink-0 w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 hover:text-[#26351B] hover:bg-[#F5B800] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 ml-1'
									aria-label='Next tabs'
								>
									<ChevronRight className='w-4 h-4' />
								</button>
							)}
						</div>

						{/* 2. Main Search Input & Submit Button Row */}
						<div className='flex flex-col sm:flex-row items-center gap-2.5 bg-gray-50/80 border border-gray-200/80 rounded-[14px] p-2 sm:p-2.5 transition-all focus-within:bg-white focus-within:border-[#F5B800] focus-within:ring-4 focus-within:ring-[#F5B800]/20 shadow-inner min-h-[52px] sm:min-h-[58px]'>
							{/* Input */}
							<div className='flex-1 w-full flex items-center px-3 sm:px-4 py-1.5 sm:py-0 gap-3 bg-transparent'>
								<Search className='w-5 h-5 sm:w-6 sm:h-6 text-[#64748B] flex-shrink-0' />
								<input
									type='text'
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') handleSearch();
									}}
									placeholder='সবজি, ফল, মাছ, শস্য খুঁজুন...'
									className='w-full text-[#172033] placeholder-[#64748B] text-sm sm:text-base lg:text-lg font-semibold outline-none bg-transparent border-none'
								/>
							</div>

							{/* Search Button */}
							<button
								onClick={handleSearch}
								className='w-full sm:w-auto h-[44px] sm:h-[48px] px-7 sm:px-9 bg-[#F5B800] hover:bg-[#e0a800] text-[#26351B] font-extrabold text-sm sm:text-base rounded-[12px] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 flex-shrink-0 hover:scale-[1.01] active:scale-[0.99]'
							>
								<span>খুঁজুন</span>
								<ArrowRight className='w-4 h-4 sm:w-5 sm:h-5' />
							</button>
						</div>

						{/* 3. Bottom Popular Search Chips inside Module */}
						<div className='flex flex-wrap items-center gap-2 pt-0.5'>
							<span className='text-xs font-semibold text-gray-500 mr-1'>
								জনপ্রিয় অনুসন্ধান:
							</span>
							{quickChips.map((chip) => (
								<Link
									key={chip.label}
									href={`/marketplace?term=${encodeURIComponent(chip.term)}`}
									className='px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-[#F5B800] text-gray-700 hover:text-[#26351B] transition-colors duration-200 cursor-pointer'
								>
									{chip.label}
								</Link>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}