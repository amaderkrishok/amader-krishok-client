'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, ShoppingBag, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutHero() {
	// Floating leaf animation configurations (matching crop-calculator & weather)
	const floatingLeaves = [
		{ left: '8%', top: '15%', scale: 1.1, duration: 8, delay: 0 },
		{ left: '85%', top: '12%', scale: 0.9, duration: 9, delay: 1 },
		{ left: '78%', top: '65%', scale: 1.2, duration: 10, delay: 1.5 },
		{ left: '12%', top: '70%', scale: 0.8, duration: 7, delay: 0.5 },
		{ left: '50%', top: '80%', scale: 1.0, duration: 11, delay: 2 },
	];

	// Feature chips in hero
	const featureChips = [
		{ icon: '🌾', text: 'স্বচ্ছ বাজারব্যবস্থা' },
		{ icon: '👨‍🌾', text: 'যাচাইকৃত কৃষক' },
		{ icon: '🚚', text: 'সরাসরি সরবরাহ' },
		{ icon: '🤝', text: 'মধ্যস্বত্বভোগীমুক্ত' },
	];

	return (
		<section className='relative bg-gradient-to-b from-[#37462A] via-[#2F3C23] to-[#37462A] text-white pt-28 sm:pt-36 pb-20 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden'>
			
			{/* Background Glows & Floating Leaves (Matching other hero banners) */}
			<div className='absolute inset-0 pointer-events-none z-0'>
				<div className='absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.12)_0%,transparent_60%)] blur-2xl' />
				<div className='absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(76,175,80,0.12)_0%,transparent_60%)] blur-2xl' />

				{floatingLeaves.map((leaf, i) => (
					<motion.div
						key={i}
						className='absolute text-[#4CAF50] opacity-[0.08]'
						style={{ left: leaf.left, top: leaf.top }}
						animate={{
							y: [-12, 12, -12],
							rotate: [0, 18, -18, 0],
							scale: [leaf.scale, leaf.scale * 1.1, leaf.scale],
						}}
						transition={{
							duration: leaf.duration,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: leaf.delay,
						}}
					>
						<Leaf className='w-12 h-12 md:w-16 md:h-16' />
					</motion.div>
				))}
			</div>

			{/* Hero Content */}
			<div className='relative z-10 max-w-[800px] mx-auto text-center space-y-6'>
				
				{/* Top Eyebrow Badge */}
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-md shadow-xs'
				>
					<Sprout className='w-4 h-4 text-[#EAB308]' />
					<span className='text-xs sm:text-sm font-semibold text-white/90'>
						আমাদের কৃষক — কৃষকের সাথে, কৃষির পাশে
					</span>
				</motion.div>

				{/* Main Title */}
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.2] shadow-xs'
				>
					প্রযুক্তিতে সমৃদ্ধ <span className='text-[#EAB308]'>স্মার্ট কৃষি</span> ও সরাসরি বাজার
				</motion.h1>

				{/* Subtitle / Supporting Paragraph */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className='text-gray-200 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto'
				>
					আমরা প্রযুক্তির মাধ্যমে দেশের কৃষকদের ক্ষমতায়ন এবং ক্রেতা-কৃষকের মধ্যে সহজ, স্বচ্ছ ও সরাসরি সংযোগ নিশ্চিত করতে নিবেদিত।
				</motion.p>

				{/* Feature Chips */}
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className='flex flex-wrap items-center justify-center gap-2.5 pt-2'
				>
					{featureChips.map((chip, idx) => (
						<span
							key={idx}
							className='px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-md text-white/90 text-xs sm:text-sm font-medium shadow-xs'
						>
							{chip.icon} {chip.text}
						</span>
					))}
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className='flex flex-wrap items-center justify-center gap-4 pt-4'
				>
					<Button
						asChild
						size='lg'
						className='bg-[#EAB308] hover:bg-[#FCD34D] text-[#1C2415] font-extrabold px-8 py-6 text-base rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer border-none'
					>
						<Link href='/marketplace' className='flex items-center gap-2'>
							<ShoppingBag className='w-5 h-5' />
							<span>কৃষকের বাজার দেখুন</span>
							<ArrowRight className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-1' />
						</Link>
					</Button>

					<Button
						asChild
						variant='outline'
						size='lg'
						className='bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white font-semibold px-8 py-6 text-base rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur-sm'
					>
						<a href='#mission' className='flex items-center gap-2'>
							<span>আমাদের লক্ষ্য জানুন</span>
						</a>
					</Button>
				</motion.div>

			</div>
		</section>
	);
}
