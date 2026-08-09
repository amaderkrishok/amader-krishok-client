'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Package, HeartHandshake } from 'lucide-react';

const statsData = [
	{
		id: 1,
		number: '১০,০০০+',
		label: 'কৃষকের সাথে সংযোগ',
		icon: Users,
		accentBg: 'bg-[#2D331F]/10',
		iconColor: 'text-[#2D331F]',
	},
	{
		id: 2,
		number: '৪০+',
		label: 'জেলায় কার্যক্রম',
		icon: MapPin,
		accentBg: 'bg-[#EAB308]/20',
		iconColor: 'text-[#855D00]',
	},
	{
		id: 3,
		number: '১,০০০+',
		label: 'কৃষিপণ্য',
		icon: Package,
		accentBg: 'bg-[#4ADE80]/20',
		iconColor: 'text-[#1B7038]',
	},
	{
		id: 4,
		number: '৯৫%+',
		label: 'সন্তুষ্ট গ্রাহক',
		icon: HeartHandshake,
		accentBg: 'bg-[#2D331F]/10',
		iconColor: 'text-[#2D331F]',
	},
];

export function AboutStats() {
	return (
		<section className='bg-white py-12 md:py-16 border-y border-[#2D331F]/10 relative z-20'>
			<div className='max-w-7xl mx-auto px-6 lg:px-12'>
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'>
					{statsData.map((stat, index) => {
						const IconComponent = stat.icon;
						return (
							<motion.div
								key={stat.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: '-50px' }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								whileHover={{ y: -4, transition: { duration: 0.2 } }}
								className='bg-[#F7F9F4] p-6 rounded-2xl border border-emerald-900/10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group'
							>
								<div className={`w-12 h-12 rounded-xl ${stat.accentBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
									<IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
								</div>
								<h3 className='text-3xl sm:text-4xl font-extrabold text-[#1C2415] mb-1 tracking-tight'>
									{stat.number}
								</h3>
								<p className='text-slate-600 text-sm sm:text-base font-semibold'>
									{stat.label}
								</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
