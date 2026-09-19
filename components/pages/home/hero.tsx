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
		<section className='relative w-full min-h-[600px] sm:min-h-[660px] lg:min-h-[560px] xl:min-h-[580px] 2xl:min-h-[700px] flex flex-col justify-between overflow-visible bg-[#1B2813] select-none pt-28 sm:pt-32 lg:pt-28 xl:pt-32 2xl:pt-36 pb-12 sm:pb-16'>
			{/* --- Real Agriculture Background Video --- */}
			<div className='absolute inset-0 z-0 w-full h-full overflow-hidden bg-[#1B2813]'>
				<video
					ref={videoRef}
					autoPlay
					muted
				  	loop
					playsInline
					className='absolute inset-0 w-full h-full object-cover pointer-events-none'
				>
					<source src='/videos/banner-10.mp4' type='video/mp4' />
				</video>
			</div>

			{/* --- Hero Dark Overlay rgba(20, 32, 12, 0.35) --- */}
			<div
				className='absolute inset-0 z-10 pointer-events-none'
				style={{
					backgroundColor: 'rgba(20, 32, 12, 0.35)',
				}}
			/>

			{/* --- HERO TEXT CONTENT AREA --- */}
			<div className='relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center justify-center gap-4 sm:gap-5 flex-1 mb-6 sm:mb-8'>
				{/* 1. Small Badge */}
				{/* <motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
					className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/12 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-white shadow-sm'
				>
					<Sparkles className='w-4 h-4 text-[#F5B800]' />
					<span>বাংলাদেশের ১ম আধুনিক ডিজিটাল কৃষকের বাজার</span>
				</motion.div> */}

				{/* 2. Main Headline & 3. Subtitle (Updated as requested) */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
					className='space-y-3 max-w-4xl'
				>
					<h1 className='text-[36px] sm:text-[52px] md:text-[60px] lg:text-[44px] xl:text-[48px] 2xl:text-[64px] lg:mt-6 xl:mt-8 2xl:mt-20 font-extrabold text-white leading-[1.12] tracking-tight drop-shadow-sm'>
						কোনো মধ্যস্বত্বভোগী নেই
					</h1>

					<p className='text-white/90 text-[15px] sm:text-[18px] md:text-[19px] lg:text-[16px] xl:text-[17px] 2xl:text-[19px] font-normal leading-relaxed max-w-[800px] mx-auto drop-shadow-sm'>
						বাংলাদেশের ৪২টি জেলার যাচাইকৃত কৃষকদের প্রোফাইল ঘুরে দেখুন, সরাসরি কথা বলুন এবং নিজেই দরদাম করে কিনুন।
					</p>
				</motion.div>

				{/* Hero Secondary CTA Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
					className='flex flex-wrap items-center justify-center gap-3 pt-1'
				>
					<button
						onClick={() => router.push('/marketplace')}
						className='h-[46px] px-5 rounded-[12px] bg-[#F5B800] hover:bg-[#e0a800] text-[#26351B] font-bold text-sm sm:text-base transition-all duration-200 shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]'
					>
						<Store className='w-4 h-4' />
						<span>কৃষকের বাজার দেখুন</span>
					</button>

					<button
						onClick={() => router.push('/about')}
						className='h-[46px] px-5 rounded-[12px] bg-white/10 hover:bg-white/20 border border-white/35 text-white font-bold text-sm sm:text-base transition-all duration-200 backdrop-blur-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]'
					>
						<ShieldCheck className='w-4 h-4' />
						<span>কৃষকদের সম্পর্কে জানুন</span>
					</button>
				</motion.div>
			</div>

			{/* --- SHARETRIP-INSPIRED LARGE & WIDE FLOATING SEARCH MODULE CARD OVERLAPPING HERO BOUNDARY --- */}
			<div className='relative z-30 w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 translate-y-1/2 -mt-16 sm:-mt-20 lg:-mt-24 mb-16 sm:mb-20'>
				<div className='max-w-7xl mx-auto'>
					<motion.div
						initial={{ opacity: 1, y: 0 }}
						animate={{ opacity: 1, y: 0 }}
						className='bg-white rounded-[24px] shadow-[0_30px_75px_rgba(0,0,0,0.22)] border border-gray-100 p-6 sm:p-8 lg:p-10 flex flex-col gap-6 sm:gap-7'
					>
						{/* 1. Category Tabs Header inside Search Module */}
						<div className='flex items-center gap-4 sm:gap-6 overflow-x-auto pb-1 border-b border-gray-200 scrollbar-none'>
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
										className={`flex items-center gap-2 px-2.5 sm:px-3.5 py-3 relative font-bold text-sm sm:text-base whitespace-nowrap transition-colors duration-150 bg-transparent border-none cursor-pointer group ${
											isActive
												? 'text-[#B45309] font-extrabold'
												: 'text-gray-600 hover:text-[#172033]'
										}`}
									>
										<IconComponent
											className={`w-5 h-5 transition-colors ${
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

						{/* 2. Main Search Input & Submit Button Row */}
						<div className='flex flex-col sm:flex-row items-center gap-3 bg-gray-50/80 border border-gray-200/80 rounded-[18px] p-2.5 sm:p-3 transition-all focus-within:bg-white focus-within:border-[#F5B800] focus-within:ring-4 focus-within:ring-[#F5B800]/20 shadow-inner min-h-[64px] sm:min-h-[72px]'>
							{/* Input */}
							<div className='flex-1 w-full flex items-center px-4 sm:px-5 py-2 sm:py-0 gap-3.5 bg-transparent'>
								<Search className='w-6 h-6 sm:w-7 sm:h-7 text-[#64748B] flex-shrink-0' />
								<input
									type='text'
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') handleSearch();
									}}
									placeholder='সবজি, ফল, মাছ, শস্য খুঁজুন...'
									className='w-full text-[#172033] placeholder-[#64748B] text-base sm:text-lg lg:text-xl font-semibold outline-none bg-transparent border-none'
								/>
							</div>

							{/* Search Button */}
							<button
								onClick={handleSearch}
								className='w-full sm:w-auto h-[56px] sm:h-[62px] px-9 sm:px-12 bg-[#F5B800] hover:bg-[#e0a800] text-[#26351B] font-extrabold text-base sm:text-lg rounded-[15px] transition-all duration-200 shadow-md flex items-center justify-center gap-2.5 flex-shrink-0 hover:scale-[1.01] active:scale-[0.99]'
							>
								<span>খুঁজুন</span>
								<ArrowRight className='w-5 h-5 sm:w-6 sm:h-6' />
							</button>
						</div>

						{/* 3. Bottom Popular Search Chips inside Module */}
						<div className='flex flex-wrap items-center gap-2.5 pt-1'>
							<span className='text-xs sm:text-sm font-semibold text-gray-500 mr-1'>
								জনপ্রিয় অনুসন্ধান:
							</span>
							{quickChips.map((chip) => (
								<Link
									key={chip.label}
									href={`/marketplace?term=${encodeURIComponent(chip.term)}`}
									className='px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gray-100 hover:bg-[#F5B800] text-gray-700 hover:text-[#26351B] transition-colors duration-200 cursor-pointer'
								>
									{chip.label}
								</Link>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}