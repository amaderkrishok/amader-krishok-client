'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
	{
		id: 1,
		name: 'মোঃ রফিকুল ইসলাম',
		role: 'কৃষক',
		location: 'বগুড়া',
		avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200',
		fallback: 'র',
		rating: 5,
		quote: 'আমাদের কৃষক প্ল্যাটফর্মের মাধ্যমে সরাসরি ক্রেতার কাছে ভালো দামে ধান ও সবজি বিক্রি করতে পারছি। মধ্যস্বত্বভোগীদের ঝামেলা থেকে মুক্তি পেয়েছি।',
	},
	{
		id: 2,
		name: 'আনোয়ার হোসেন',
		role: 'খামারি',
		location: 'রংপুর',
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
		fallback: 'আ',
		rating: 4,
		quote: 'ফসল চাষের তথ্য জানা এবং ভালো মানের কৃষিপণ্য সংগ্রহ করা এখন অনেক সহজ হয়ে গেছে। সার ক্যালকুলেটর আমাদের অনেক কাজে দেয়।',
	},
	{
		id: 3,
		name: 'তানভীর আহমেদ',
		role: 'ক্রেতা',
		location: 'ঢাকা',
		avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
		fallback: 'তা',
		rating: 3,
		quote: 'সতেজ ও কেমিক্যাল-মুক্ত শাকসবজি সরাসরি কৃষকের কাছ থেকে ঘরে বসে অর্ডার করতে পারি। পণ্যের মান ভালো, তবে ডেলিভারি আরও দ্রুত প্রত্যাশা করি।',
	},
];

export function AboutTestimonials() {
	return (
		<section className='w-full px-4 sm:px-6 lg:px-[10%] xl:px-[18.5%] 2xl:px-12 bg-[#F7F9F4] py-16 md:py-24 border-t border-[#2D331F]/10'>
			<div className='max-w-7xl mx-auto'>
				
				{/* Section Header */}
				<div className='text-center max-w-2xl mx-auto mb-16'>
					<span className='px-3 py-1 rounded-full bg-[#2D331F]/10 text-[#2D331F] text-xs font-bold uppercase tracking-wider mb-3 inline-block'>
						আস্থা ও মতামত
					</span>
					<h2 className='text-3xl sm:text-4xl font-extrabold text-[#1C2415] mb-4'>
						কৃষক ও ক্রেতার আস্থাই আমাদের শক্তি
					</h2>
					<div className='w-20 h-1 bg-[#EAB308] mx-auto rounded-full mb-4' />
					<p className='text-slate-600 text-base sm:text-lg font-medium leading-relaxed'>
						আমাদের প্ল্যাটফর্ম ব্যবহার করে কৃষক ও ক্রেতারা কীভাবে উপকৃত হচ্ছেন
					</p>
				</div>

				{/* 3 Testimonial Cards */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{testimonials.map((item, index) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 25 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-40px' }}
							transition={{ duration: 0.5, delay: index * 0.15 }}
							whileHover={{ y: -6, transition: { duration: 0.2 } }}
							className='bg-white rounded-2xl p-7 border border-emerald-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group'
						>
							<Quote className='w-10 h-10 text-[#EAB308]/20 absolute top-6 right-6 pointer-events-none group-hover:text-[#EAB308]/40 transition-colors' />

							<div>
								{/* Rating Stars */}
								<div className='flex items-center gap-1 mb-4'>
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={i}
											className={`w-4 h-4 ${
												i < item.rating
													? 'fill-[#EAB308] text-[#EAB308]'
													: 'text-gray-200 fill-gray-200'
											}`}
										/>
									))}
								</div>

								{/* Quote text */}
								<p className='text-slate-700 text-sm sm:text-base leading-relaxed font-medium mb-6 italic'>
									&quot;{item.quote}&quot;
								</p>
							</div>

							{/* User Info */}
							<div className='flex items-center gap-3.5 pt-4 border-t border-slate-100'>
								<Avatar className='w-11 h-11 border-2 border-[#EAB308]'>
									<AvatarImage src={item.avatar} alt={item.name} />
									<AvatarFallback className='bg-[#2D331F] text-white font-bold text-xs'>
										{item.fallback}
									</AvatarFallback>
								</Avatar>
								<div>
									<h4 className='text-base font-bold text-[#1C2415] leading-snug'>
										{item.name}
									</h4>
									<p className='text-xs font-semibold text-slate-500 flex items-center gap-1'>
										<span>{item.role}</span>
										<span>•</span>
										<span className='flex items-center gap-0.5'>
											<MapPin className='w-3 h-3 text-[#EAB308]' />
											{item.location}
										</span>
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>

			</div>
		</section>
	);
}
