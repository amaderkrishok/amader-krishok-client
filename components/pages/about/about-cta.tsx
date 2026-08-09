'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutCta() {
	return (
		<section className='bg-[#2D331F] text-white py-16 md:py-24 relative overflow-hidden selection:bg-[#EAB308] selection:text-[#2D331F]'>
			{/* Decorative background glows */}
			<div className='absolute top-0 right-0 w-96 h-96 bg-[#EAB308]/10 rounded-full blur-3xl pointer-events-none' />
			<div className='absolute bottom-0 left-0 w-96 h-96 bg-[#4ADE80]/10 rounded-full blur-3xl pointer-events-none' />

			<div className='max-w-5xl mx-auto px-6 lg:px-12 text-center relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='flex flex-col items-center'
				>
					<div className='w-14 h-14 rounded-full bg-[#EAB308]/20 flex items-center justify-center mb-6 text-[#EAB308] border border-[#EAB308]/30'>
						<Leaf className='w-7 h-7 text-[#EAB308]' />
					</div>

					<h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 max-w-3xl'>
						কৃষির সাথে থাকুন, <span className='text-[#EAB308]'>সতেজতার সাথে থাকুন</span>
					</h2>

					<p className='text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-10 font-medium'>
						কৃষকের উৎপাদিত মানসম্মত পণ্য সহজেই খুঁজে নিন এবং আপনার প্রয়োজনীয় কৃষিপণ্য অর্ডার করুন।
					</p>

					<div className='flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto'>
						<Button
							asChild
							size='lg'
							className='bg-[#EAB308] hover:bg-[#FCD34D] text-[#2D331F] font-bold px-8 py-6 text-base rounded-xl shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer'
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
							className='bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white font-semibold px-8 py-6 text-base rounded-xl transition-all duration-300 cursor-pointer backdrop-blur-sm'
						>
							<Link href='/marketplace' className='flex items-center gap-2'>
								<span>সব পণ্য দেখুন</span>
							</Link>
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
