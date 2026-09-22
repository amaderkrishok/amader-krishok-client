'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Leaf, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutCta() {
	return (
		<section className='w-full px-4 sm:px-6 lg:px-[10%] xl:px-[18.5%] 2xl:px-12 py-16'>
			<div className='max-w-7xl mx-auto'>
				<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className='bg-gradient-to-r from-[#4A5E3A] via-[#3D4F2E] to-[#4A5E3A] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-8'
			>
				{/* Background Glow */}
				<div className='absolute right-0 bottom-0 w-80 h-80 bg-[#EAB308]/10 rounded-full blur-3xl pointer-events-none' />

				{/* Left Content */}
				<div className='space-y-3 max-w-xl text-center sm:text-left z-10'>
					<div className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAB308]/20 border border-[#EAB308]/30 text-[#EAB308] text-xs font-bold'>
						<ShieldCheck className='w-4 h-4' />
						<span>আমাদের কৃষক প্ল্যাটফর্ম</span>
					</div>
					<h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight'>
						কৃষির সাথে থাকুন, <span className='text-[#EAB308]'>সতেজতার সাথে থাকুন</span>
					</h2>
					<p className='text-gray-200 text-sm sm:text-base font-normal leading-relaxed'>
						কৃষকের উৎপাদিত মানসম্মত পণ্য সহজেই খুঁজে নিন এবং আপনার প্রয়োজনীয় কৃষিপণ্য সরাসরি অর্ডার করুন।
					</p>
				</div>

				{/* Right CTA Button */}
				<div className='flex flex-wrap items-center justify-center gap-3 shrink-0 z-10'>
					<Button
						asChild
						size='lg'
						className='bg-[#EAB308] hover:bg-[#FCD34D] text-[#1C2415] font-extrabold px-7 py-4 h-auto text-base rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer border-none'
					>
						<Link href='/marketplace' className='flex items-center gap-2'>
							<ShoppingBag className='w-5 h-5' />
							<span>কৃষকের বাজার দেখুন</span>
							<ArrowRight className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-1' />
						</Link>
					</Button>
				</div>
			</motion.div>
		</div>
	</section>
	);
}
