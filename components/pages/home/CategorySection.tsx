'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface QuickCategoryItem {
	name: string;
	icon: string;
	query: string;
	count: string;
	colorBg: string;
}

const quickCategories: QuickCategoryItem[] = [
	{
		name: 'সবজি',
		icon: '🥬',
		query: 'সবজি',
		count: '২৪০+ পণ্য',
		colorBg: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white',
	},
	{
		name: 'ফল',
		icon: '🍎',
		query: 'ফল',
		count: '১৮৫+ পণ্য',
		colorBg: 'bg-rose-50 text-rose-700 group-hover:bg-rose-600 group-hover:text-white',
	},
	{
		name: 'মাছ',
		icon: '🐟',
		query: 'মাছ',
		count: '৭০+ পণ্য',
		colorBg: 'bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white',
	},
	{
		name: 'শস্য',
		icon: '🌾',
		query: 'শস্য',
		count: '৯৫+ পণ্য',
		colorBg: 'bg-[#FFF4CC] text-[#172033] group-hover:bg-[#F5B800] group-hover:text-[#172033]',
	},
	{
		name: 'বীজ',
		icon: '🌱',
		query: 'বীজ',
		count: '৫০+ পণ্য',
		colorBg: 'bg-green-50 text-green-700 group-hover:bg-green-600 group-hover:text-white',
	},
	{
		name: 'সার ও কৃষি উপকরণ',
		icon: '🧪',
		query: 'সার ও উপকরণ',
		count: '৪২+ পণ্য',
		colorBg: 'bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white',
	},
];

export function CategorySection() {
	return (
		<section className='pt-28 sm:pt-36 lg:pt-40 pb-14 sm:pb-16 bg-[#FAF9F3] border-b border-gray-200/60 selection:bg-[#F5B800] selection:text-[#172033]'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Section Header */}
				<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10'>
					<div>
						<h2 className='text-3xl md:text-4xl lg:text-4xl font-extrabold text-[#172033] tracking-tight leading-tight'>
							কী খুঁজছেন আজ?
						</h2>
						<p className='text-[#64748B] text-sm sm:text-base mt-1 font-medium'>
							প্রয়োজনীয় কৃষিপণ্য ও উপকরণ বিভাগ থেকে সহজে বেছে নিন
						</p>
					</div>

					<Link
						href='/marketplace'
						className='group inline-flex items-center gap-2 text-sm font-bold text-[#3F6212] hover:text-[#26351B] transition-colors whitespace-nowrap'
					>
						<span>সবগুলো বাজার দেখুন</span>
						<ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
					</Link>
				</div>

				{/* Category Cards Grid */}
				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5'>
					{quickCategories.map((cat, idx) => (
						<motion.div
							key={cat.name}
							initial={{ opacity: 0, y: 15 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: idx * 0.05 }}
						>
							<Link
								href={`/marketplace?category=${encodeURIComponent(cat.query)}`}
								className='group flex flex-col items-center justify-center p-4 sm:p-5 bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#65A30D]/40 transition-all duration-300 text-center hover:-translate-y-1 h-full'
							>
								{/* Icon */}
								<div
									className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 mb-3 ${cat.colorBg}`}
								>
									{cat.icon}
								</div>

								{/* Label */}
								<h3 className='text-sm sm:text-base font-bold text-[#172033] group-hover:text-[#3F6212] transition-colors leading-tight'>
									{cat.name}
								</h3>

								{/* Count Tag */}
								<span className='text-[11px] sm:text-xs font-semibold text-[#64748B] mt-1'>
									{cat.count}
								</span>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
