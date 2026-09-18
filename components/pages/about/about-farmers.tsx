'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sprout, PackageCheck, Handshake, CheckCircle2 } from 'lucide-react';

const farmerFeatures = [
	{
		id: 1,
		title: 'সরাসরি কৃষকের সাথে',
		subtitle: 'মধ্যস্বত্বভোগী ছাড়াই কৃষকের সাথে সরাসরি যোগাযোগ ও লেনদেন।',
		icon: Sprout,
		iconBg: 'bg-[#4ADE80]/20',
	},
	{
		id: 2,
		title: 'সহজ কৃষিপণ্যের বাজার',
		subtitle: 'খামার থেকে উৎপাদিত সতেজ শাকসবজি ও ফসলের সমৃদ্ধ ডিজিটাল বাজার।',
		icon: PackageCheck,
		iconBg: 'bg-[#EAB308]/20',
	},
	{
		id: 3,
		title: 'স্বচ্ছ ও নির্ভরযোগ্য লেনদেন',
		subtitle: 'কৃষকের সঠিক মূল্য নিশ্চিতকরণ ও নিরাপদ কেনাকাটার নিশ্চয়তা।',
		icon: Handshake,
		iconBg: 'bg-[#2D331F]/10',
	},
];

export function AboutFarmers() {
	return (
		<section className='w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 bg-[#F7F9F4] py-16 md:py-24 border-t border-[#2D331F]/10'>
			<div className='max-w-7xl mx-auto'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
					
					{/* Left Column - Text Content */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: '-50px' }}
						transition={{ duration: 0.6 }}
						className='flex flex-col items-start'
					>
						<span className='px-3.5 py-1.5 rounded-full bg-[#EAB308]/20 border border-[#EAB308]/40 text-[#855D00] text-sm font-bold mb-4'>
							কৃষক ও কমিউনিটি
						</span>

						<h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C2415] mb-6 leading-tight'>
							কৃষকই আমাদের শক্তি
						</h2>

						<p className='text-slate-700 text-base sm:text-lg leading-relaxed font-medium mb-8'>
							কৃষকের পরিশ্রম ও উৎপাদনকে কেন্দ্র করেই আমাদের কাজ। আমরা প্রযুক্তির মাধ্যমে কৃষক ও ক্রেতার মধ্যে একটি সহজ ও নির্ভরযোগ্য সংযোগ তৈরি করতে চাই।
						</p>

						{/* 3 Feature Items */}
						<div className='space-y-4 w-full'>
							{farmerFeatures.map((item, idx) => {
								const IconComponent = item.icon;
								return (
									<motion.div
										key={item.id}
										initial={{ opacity: 0, y: 15 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.4, delay: idx * 0.1 }}
										className='bg-white rounded-2xl p-4 sm:p-5 border border-emerald-900/10 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4'
									>
										<div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0 text-[#2D331F]`}>
											<IconComponent className='w-6 h-6 text-[#2D331F]' />
										</div>
										<div>
											<h3 className='text-base sm:text-lg font-bold text-[#1C2415] flex items-center gap-2 mb-1'>
												{item.title}
												<CheckCircle2 className='w-4 h-4 text-[#4ADE80] fill-[#2D331F]' />
											</h3>
											<p className='text-slate-600 text-xs sm:text-sm font-medium leading-relaxed'>
												{item.subtitle}
											</p>
										</div>
									</motion.div>
								);
							})}
						</div>
					</motion.div>

					{/* Right Column - Large Farmer Image */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: '-50px' }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='relative'
					>
						<div className='relative w-full aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl border-4 border-white'>
							<Image
								src='https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?q=80&w=1600&auto=format&fit=crop'
								alt='Bangladeshi Farmer in green field'
								fill
								className='object-cover transition-transform duration-700 hover:scale-105'
								sizes='(max-width: 1024px) 100vw, 50vw'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-[#1C2415]/60 via-transparent to-transparent' />
							
							<div className='absolute bottom-6 left-6 right-6 text-white'>
								<p className='text-xs uppercase tracking-wider font-semibold text-[#EAB308] mb-1'>আমাদের গর্ব</p>
								<p className='text-lg font-bold'>বাংলাদেশের পরিশ্রমী কৃষকদের ডিজিটাল ক্ষমতায়ন</p>
							</div>
						</div>
					</motion.div>

				</div>
			</div>
		</section>
	);
}
