'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass } from 'lucide-react';

export function AboutMission() {
	return (
		<section id='mission' className='w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 bg-[#F7F9F4] py-16 md:py-24 scroll-mt-20'>
			<div className='max-w-7xl mx-auto'>
				<div className='text-center max-w-2xl mx-auto mb-14'>
					<h2 className='text-3xl sm:text-4xl font-extrabold text-[#1C2415] mb-4'>
						আমাদের লক্ষ্য ও উদ্দেশ্য
					</h2>
					<div className='w-20 h-1 bg-[#EAB308] mx-auto rounded-full mb-4' />
					<p className='text-slate-600 text-base sm:text-lg font-medium leading-relaxed'>
						টেকসই কৃষি ও আধুনিক প্রযুক্তির সমন্বয়ে আমরা গড়ে তুলছি নতুন সম্ভাবনার এক রূপরেখা।
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10'>
					
					{/* Card 1 - Our Mission */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-50px' }}
						transition={{ duration: 0.5 }}
						whileHover={{ y: -6, transition: { duration: 0.2 } }}
						className='bg-white rounded-[24px] p-8 md:p-10 border border-emerald-900/10 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between'
					>
						{/* Golden accent line at top */}
						<div className='absolute top-0 left-0 right-0 h-1.5 bg-[#EAB308]' />

						<div>
							<div className='w-14 h-14 rounded-2xl bg-[#4ADE80]/20 flex items-center justify-center mb-6 text-[#2D331F] transition-transform duration-300 group-hover:scale-110 shadow-inner'>
								<Target className='w-7 h-7 text-[#2D331F]' />
							</div>

							<h3 className='text-2xl font-bold text-[#1C2415] mb-4 flex items-center gap-2'>
								আমাদের লক্ষ্য
							</h3>

							<p className='text-slate-600 text-base sm:text-lg leading-relaxed font-medium'>
								কৃষকের উৎপাদিত পণ্য, কৃষি জ্ঞান ও আধুনিক প্রযুক্তিকে একসাথে নিয়ে একটি সহজ, স্বচ্ছ ও টেকসই কৃষি ব্যবস্থা তৈরি করা।
							</p>
						</div>

						<div className='mt-8 pt-6 border-t border-slate-100 flex items-center text-sm font-semibold text-[#2D331F]'>
							<span>স্থায়িত্ব • স্বচ্ছতা • সমৃদ্ধি</span>
						</div>
					</motion.div>

					{/* Card 2 - Our Vision/Purpose */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-50px' }}
						transition={{ duration: 0.5, delay: 0.2 }}
						whileHover={{ y: -6, transition: { duration: 0.2 } }}
						className='bg-white rounded-[24px] p-8 md:p-10 border border-emerald-900/10 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between'
					>
						{/* Golden accent line at top */}
						<div className='absolute top-0 left-0 right-0 h-1.5 bg-[#EAB308]' />

						<div>
							<div className='w-14 h-14 rounded-2xl bg-[#EAB308]/20 flex items-center justify-center mb-6 text-[#2D331F] transition-transform duration-300 group-hover:scale-110 shadow-inner'>
								<Compass className='w-7 h-7 text-[#2D331F]' />
							</div>

							<h3 className='text-2xl font-bold text-[#1C2415] mb-4 flex items-center gap-2'>
								আমাদের উদ্দেশ্য
							</h3>

							<p className='text-slate-600 text-base sm:text-lg leading-relaxed font-medium'>
								প্রযুক্তির মাধ্যমে কৃষককে আরও শক্তিশালী করা এবং ক্রেতাদের কাছে মানসম্মত কৃষিপণ্য ও নির্ভরযোগ্য কৃষি তথ্য সহজে পৌঁছে দেওয়া।
							</p>
						</div>

						<div className='mt-8 pt-6 border-t border-slate-100 flex items-center text-sm font-semibold text-[#2D331F]'>
							<span>ক্ষমতায়ন • মানসম্পন্ন পণ্য • সঠিক তথ্য</span>
						</div>
					</motion.div>

				</div>
			</div>
		</section>
	);
}
