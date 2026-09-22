'use client';

import { motion } from 'framer-motion';
import { Sprout, ShieldCheck, Truck, UserCheck } from 'lucide-react';

const trustFeatures = [
	{
		icon: Sprout,
		title: 'সরাসরি কৃষকের কাছ থেকে',
		description: 'কোনো মধ্যস্বত্বভোগী নেই, কৃষক সরাসরি পণ্য সরবরাহ করেন।',
	},
	{
		icon: ShieldCheck,
		title: 'তাজা ও মানসম্মত পণ্য',
		description: 'খামার থেকে তাজা সংগৃহীত ১০০% নিরাপদ ও সতেজ ফসল।',
	},
	{
		icon: Truck,
		title: 'নিরাপদ ও দ্রুত অর্ডার',
		description: 'সহজ পেমেন্ট ও দ্রুততম সময়ে আপনার দরগোড়ায় পৌঁছানো।',
	},
	{
		icon: UserCheck,
		title: 'যাচাইকৃত বিশ্বস্ত কৃষক',
		description: 'বাংলাদেশের বিভিন্ন জেলার নিবন্ধিত ও বিশ্বস্ত কৃষক।',
	},
];

export function TrustSection() {
	return (
		<section className='w-full px-4 sm:px-6 lg:px-[10%] xl:px-[18.5%] 2xl:px-12 py-14 sm:py-18 bg-[#F5F3EA] border-b border-gray-200/80 text-[#172033]'>
			<div className='max-w-7xl mx-auto'>
				{/* Section Heading */}
				<div className='text-left max-w-3xl mb-10'>
					<h2 className='text-3xl md:text-4xl lg:text-4xl font-extrabold text-[#172033] tracking-tight leading-tight'>
						কোনো মধ্যস্বত্বভোগী নেই
					</h2>
					<p className='text-[#64748B] text-sm sm:text-base lg:text-lg mt-2 font-medium leading-relaxed'>
						বাংলাদেশের ৪২টি জেলার যাচাইকৃত কৃষকদের প্রোফাইল ঘুরে দেখুন, সরাসরি কথা বলুন এবং নিজেই দরদাম করে কিনুন।
					</p>
				</div>

				{/* 4 Feature Columns */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					{trustFeatures.map((item, idx) => {
						const Icon = item.icon;
						return (
							<motion.div
								key={item.title}
								initial={{ opacity: 0, y: 15 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: idx * 0.08 }}
								className='bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow'
							>
								<div className='w-12 h-12 rounded-xl bg-[#3F6212]/10 text-[#3F6212] flex items-center justify-center mb-4'>
									<Icon className='w-6 h-6' />
								</div>
								<h3 className='text-base font-bold text-[#172033] mb-1.5'>
									{item.title}
								</h3>
								<p className='text-xs sm:text-sm text-[#64748B] font-medium leading-relaxed'>
									{item.description}
								</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
