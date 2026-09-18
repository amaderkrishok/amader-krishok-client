'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, ShieldCheck, Zap } from 'lucide-react';

const whyUsFeatures = [
	{
		id: 1,
		title: 'সরাসরি কৃষকের সাথে',
		description: 'কোনো মধ্যস্বত্বভোগী ছাড়াই মাঠের কৃষক থেকে সরাসরি পণ্য ক্রয়ের সহজ সুযোগ।',
		icon: Users,
	},
	{
		id: 2,
		title: 'মানসম্মত কৃষিপণ্য',
		description: 'প্রাকৃতিক ও সতেজ কৃষিপণ্যের শতভাগ মান ও গুণগত নিশ্চয়তা প্রদান।',
		icon: Award,
	},
	{
		id: 3,
		title: 'সহজ ও নিরাপদ কেনাকাটা',
		description: 'সহজ ইন্টারফেস এবং নিরাপদ ডিজিটাল পেমেন্ট প্রক্রিয়ায় দ্রুত কেনাকাটা।',
		icon: ShieldCheck,
	},
	{
		id: 4,
		title: 'দ্রুত ডেলিভারি',
		description: 'খামার থেকে সরাসরি গ্রাহকের দোরগোড়ায় দ্রুততম সময়ে পণ্য পৌঁছানো।',
		icon: Zap,
	},
];

export function AboutWhyUs() {
	return (
		<section className='w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 bg-white py-16 md:py-24 border-t border-[#2D331F]/10'>
			<div className='max-w-7xl mx-auto'>
				
				{/* Section Header */}
				<div className='text-center max-w-2xl mx-auto mb-16'>
					<h2 className='text-3xl sm:text-4xl font-extrabold text-[#1C2415] mb-4'>
						কেন আমাদের কৃষক?
					</h2>
					<div className='w-20 h-1 bg-[#EAB308] mx-auto rounded-full mb-4' />
					<p className='text-slate-600 text-base sm:text-lg font-medium leading-relaxed'>
						কৃষি সেক্টরে নির্ভরযোগ্যতা, সতেজতা ও স্বচ্ছতার এক নতুন ডিজিটাল অভিজ্ঞতা।
					</p>
				</div>

				{/* 4 Cards Grid */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
					{whyUsFeatures.map((feature, index) => {
						const IconComponent = feature.icon;
						return (
							<motion.div
								key={feature.id}
								initial={{ opacity: 0, y: 25 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: '-40px' }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								whileHover={{ y: -6, transition: { duration: 0.2 } }}
								className='bg-[#F7F9F4] rounded-2xl p-7 border border-emerald-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden'
							>
								{/* Subtle top bar accent */}
								<div className='absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#EAB308] transition-colors duration-300' />

								<div>
									<div className='w-14 h-14 rounded-2xl bg-white border border-emerald-900/10 flex items-center justify-center text-[#2D331F] mb-6 shadow-sm group-hover:bg-[#2D331F] group-hover:text-[#EAB308] transition-colors duration-300'>
										<IconComponent className='w-7 h-7' />
									</div>

									<h3 className='text-xl font-bold text-[#1C2415] mb-3 group-hover:text-[#2D331F] transition-colors'>
										{feature.title}
									</h3>

									<p className='text-slate-600 text-sm sm:text-base leading-relaxed font-medium'>
										{feature.description}
									</p>
								</div>

								<div className='mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-[#2D331F]'>
									<span className='w-2 h-2 rounded-full bg-[#4ADE80]' />
									<span>আমাদের অঙ্গীকার</span>
								</div>
							</motion.div>
						);
					})}
				</div>

			</div>
		</section>
	);
}
