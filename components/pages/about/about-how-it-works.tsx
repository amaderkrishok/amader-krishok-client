'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, ShoppingBag, ShieldCheck, Truck, ArrowRight } from 'lucide-react';

const steps = [
	{
		number: '01',
		title: 'কৃষকের সাথে সংযোগ',
		description: 'স্থানীয় কৃষকদের কাছ থেকে সরাসরি পণ্য ও তথ্য সংগ্রহ।',
		icon: Sprout,
	},
	{
		number: '02',
		title: 'পণ্য সংগ্রহ',
		description: 'কৃষকের উৎপাদিত মানসম্মত কৃষিপণ্য সংগ্রহ করা।',
		icon: ShoppingBag,
	},
	{
		number: '03',
		title: 'মান যাচাই',
		description: 'পণ্যের মান ও সতেজতা নিশ্চিত করার জন্য যাচাই করা।',
		icon: ShieldCheck,
	},
	{
		number: '04',
		title: 'আপনার ঘরে পৌঁছে দেওয়া',
		description: 'সহজ অর্ডার ও দ্রুত ডেলিভারির মাধ্যমে পণ্য আপনার কাছে পৌঁছে দেওয়া।',
		icon: Truck,
	},
];

export function AboutHowItWorks() {
	return (
		<section className='w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 bg-white py-16 md:py-24 border-t border-[#2D331F]/10 relative overflow-hidden'>
			<div className='max-w-7xl mx-auto'>
				
				{/* Section Header */}
				<div className='text-center max-w-2xl mx-auto mb-16'>
					<h2 className='text-3xl sm:text-4xl font-extrabold text-[#1C2415] mb-4'>
						আমরা কীভাবে কাজ করি
					</h2>
					<div className='w-20 h-1 bg-[#EAB308] mx-auto rounded-full mb-4' />
					<p className='text-slate-600 text-base sm:text-lg font-medium leading-relaxed'>
						কৃষক থেকে আপনার ঘর পর্যন্ত — সহজ, স্বচ্ছ ও নির্ভরযোগ্য একটি প্রক্রিয়া।
					</p>
				</div>

				{/* Steps Container */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative'>
					
					{/* Connecting Line for Desktop */}
					<div className='hidden lg:block absolute top-1/3 left-12 right-12 h-0.5 bg-gradient-to-r from-[#2D331F]/20 via-[#EAB308]/40 to-[#4ADE80]/30 -z-0' />

					{steps.map((step, index) => {
						const IconComponent = step.icon;
						return (
							<motion.div
								key={step.number}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: '-40px' }}
								transition={{ duration: 0.5, delay: index * 0.15 }}
								whileHover={{ y: -6, transition: { duration: 0.2 } }}
								className='bg-[#F7F9F4] rounded-2xl p-7 border border-emerald-900/10 shadow-sm hover:shadow-lg transition-all duration-300 relative z-10 flex flex-col justify-between group'
							>
								<div>
									{/* Top Step Row */}
									<div className='flex items-center justify-between mb-6'>
										<span className='text-xs font-bold px-3 py-1 rounded-full bg-[#2D331F] text-[#EAB308]'>
											ধাপ {step.number}
										</span>
										<div className='w-12 h-12 rounded-xl bg-white border border-emerald-900/10 flex items-center justify-center text-[#2D331F] shadow-sm group-hover:bg-[#EAB308] group-hover:text-[#2D331F] transition-colors duration-300'>
											<IconComponent className='w-6 h-6' />
										</div>
									</div>

									<h3 className='text-xl font-bold text-[#1C2415] mb-3 group-hover:text-[#2D331F] transition-colors'>
										{step.title}
									</h3>

									<p className='text-slate-600 text-sm sm:text-base leading-relaxed font-medium'>
										{step.description}
									</p>
								</div>

								{/* Mobile/Tablet Arrow Indicator */}
								{index < steps.length - 1 && (
									<div className='lg:hidden mt-6 pt-4 border-t border-slate-200/60 flex justify-end text-slate-400'>
										<ArrowRight className='w-5 h-5 text-[#EAB308]' />
									</div>
								)}
							</motion.div>
						);
					})}
				</div>

				{/* Visual Banner Bar */}
				<div className='mt-14 bg-[#4A5E3A] rounded-2xl p-6 md:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md'>
					<div className='flex items-center gap-4 text-center sm:text-left'>
						<div className='w-12 h-12 rounded-full bg-[#EAB308] text-[#2D331F] flex items-center justify-center font-bold text-xl flex-shrink-0'>
							✓
						</div>
						<div>
							<h4 className='text-lg font-bold text-white'>সম্পূর্ণ স্বচ্ছ ও নিশ্চিত গুণমান</h4>
							<p className='text-sm text-gray-300 font-medium'>প্রতিটি ধাপে আমরা নিশ্চিত করি সর্বোচ্চ সতেজতা ও গ্রাহক সন্তুষ্টি</p>
						</div>
					</div>
				</div>

			</div>
		</section>
	);
}
