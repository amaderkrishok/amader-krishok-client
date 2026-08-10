'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutHero() {
	return (
		<section className='relative bg-[#F7F9F4] py-12 md:py-20 lg:py-24 overflow-hidden'>
			{/* Subtle decorative background glow */}
			<div className='absolute top-0 right-0 w-96 h-96 bg-[#4ADE80]/10 rounded-full blur-3xl pointer-events-none' />
			<div className='absolute bottom-0 left-0 w-96 h-96 bg-[#EAB308]/10 rounded-full blur-3xl pointer-events-none' />

			<div className='max-w-7xl mx-auto px-6 lg:px-12 relative z-10'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
					
					{/* Left Column - Content */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, ease: 'easeOut' }}
						className='flex flex-col items-start'
					>
						{/* Eyebrow Badge */}
						<div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2D331F]/10 border border-[#2D331F]/20 text-[#2D331F] text-sm font-semibold mb-6 shadow-sm'>
							<Leaf className='w-4 h-4 text-[#4ADE80] fill-[#4ADE80]/30' />
							<span>আমাদের সম্পর্কে</span>
						</div>

						{/* Main Heading */}
						<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-[#1C2415] leading-[1.25] tracking-tight mb-6'>
							কৃষকের সাথে, <span className='text-[#2D331F] relative inline-block'>
								কৃষির পাশে
								<span className='absolute bottom-1 left-0 w-full h-2 bg-[#EAB308]/40 -z-10 rounded-sm' />
							</span>
						</h1>

						{/* Supporting Text */}
						<p className='text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl mb-8 font-medium'>
							প্রযুক্তির মাধ্যমে কৃষক ও ক্রেতার মধ্যে তৈরি করি সহজ, স্বচ্ছ ও নির্ভরযোগ্য সংযোগ।
						</p>

						{/* CTAs */}
						<div className='flex flex-wrap items-center gap-4 w-full sm:w-auto'>
							<Button
								asChild
								size='lg'
								className='bg-[#EAB308] hover:bg-[#d9a307] text-[#2D331F] font-bold px-7 py-6 text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer'
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
								className='border-[#2D331F]/20 hover:border-[#2D331F] text-[#2D331F] hover:bg-[#2D331F]/5 font-semibold px-7 py-6 text-base rounded-xl transition-all duration-300 cursor-pointer'
							>
								<a href='#mission' className='flex items-center gap-2'>
									<span>আমাদের সম্পর্কে জানুন</span>
								</a>
							</Button>
						</div>

						{/* Key Trust Signals */}
						<div className='mt-10 pt-8 border-t border-[#2D331F]/10 grid grid-cols-2 gap-4 w-full max-w-md'>
							<div className='flex items-center gap-2.5 text-slate-700 text-sm font-semibold'>
								<div className='w-7 h-7 rounded-full bg-[#4ADE80]/20 flex items-center justify-center flex-shrink-0'>
									<ShieldCheck className='w-4 h-4 text-[#2D331F]' />
								</div>
								<span>সতেজ কৃষিপণ্য</span>
							</div>
							<div className='flex items-center gap-2.5 text-slate-700 text-sm font-semibold'>
								<div className='w-7 h-7 rounded-full bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0'>
									<Leaf className='w-4 h-4 text-[#2D331F]' />
								</div>
								<span>সরাসরি খামার থেকে</span>
							</div>
						</div>
					</motion.div>

					{/* Right Column - Visual Image */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
						className='relative'
					>
						<div className='relative w-full aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl border-4 border-white'>
							<Image
								src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop'
								alt='Bangladeshi agricultural field and farming'
								fill
								priority
								className='object-cover transition-transform duration-700 hover:scale-105'
								sizes='(max-width: 1024px) 100vw, 50vw'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />
						</div>

						{/* Floating Badge */}
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.5 }}
							className='absolute -bottom-6 left-6 md:-left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-emerald-900/10 flex items-center gap-3.5 z-20 max-w-xs'
						>
							<div className='w-12 h-12 rounded-xl bg-[#2D331F] flex items-center justify-center text-[#EAB308] flex-shrink-0 shadow-inner'>
								<Leaf className='w-6 h-6' />
							</div>
							<div>
								<p className='text-xs text-slate-500 font-medium'>আমাদের বার্তা</p>
								<p className='text-sm font-bold text-[#1C2415] leading-tight'>
									কৃষকের কাছ থেকে সরাসরি
								</p>
							</div>
						</motion.div>
					</motion.div>

				</div>
			</div>
		</section>
	);
}
