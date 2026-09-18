'use client';

import { FertilizerCalculator } from '@/components/pages/crop-calculator/fertilizer-calculator';
import { motion } from 'framer-motion';
import { Leaf, MessageCircle, ShieldCheck, Target, Zap, Sprout } from 'lucide-react';

export default function CropCalculatorPage() {
	// Bengali is hardcoded as the standard language
	const language = 'bn';

	// Floating leaf animation configurations
	const floatingLeaves = [
		{ left: '8%', top: '15%', scale: 1.1, duration: 8, delay: 0 },
		{ left: '85%', top: '12%', scale: 0.9, duration: 9, delay: 1 },
		{ left: '78%', top: '65%', scale: 1.2, duration: 10, delay: 1.5 },
		{ left: '12%', top: '70%', scale: 0.8, duration: 7, delay: 0.5 },
		{ left: '50%', top: '80%', scale: 1.0, duration: 11, delay: 2 },
	];

	// Feature chips in hero
	const featureChips = [
		{ icon: '🌾', text: 'সরকারি নির্দেশিকা' },
		{ icon: '📍', text: 'নির্ভুল হিসাব' },
		{ icon: '⚡', text: 'দ্রুত ফলাফল' },
		{ icon: '🌱', text: 'সহজ ব্যবহার' },
	];

	// Info cards below calculator
	const infoCards = [
		{
			icon: ShieldCheck,
			title: '🌾 সরকারি সুপারিশ',
			desc: 'কৃষি সম্প্রসারণ অধিদপ্তর অনুমোদিত আধুনিক নির্দেশিকা।',
		},
		{
			icon: Target,
			title: '📍 নির্ভুল হিসাব',
			desc: 'জমির শতাংশ ও বিঘা অনুযায়ী নিখুঁত সারের পরিমাণ।',
		},
		{
			icon: Zap,
			title: '⚡ দ্রুত ফলাফল',
			desc: 'এক নিমেষেই পেয়ে যান প্রয়োজনীয় সারের সম্পূর্ণ তালিকা।',
		},
		{
			icon: Sprout,
			title: '🌱 উন্নত ফলন',
			desc: 'সঠিক সার ব্যবহারে ফসলের সর্বোচ্চ উৎপাদন নিশ্চিত হয়।',
		},
	];

	return (
		<div className='min-h-screen bg-[#F8F8F8] text-[#2A351F] selection:bg-[#FBBF24] selection:text-[#1E2817] font-sans overflow-x-hidden'>
			
			{/* ==================================================== */}
			{/* HERO SECTION                                         */}
			{/* ==================================================== */}
			<section className='relative bg-gradient-to-b from-[#37462A] via-[#2F3C23] to-[#37462A] text-white pt-28 sm:pt-36 pb-20 md:pb-24 w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 overflow-hidden'>
				
				{/* Background Decorations & Soft Glows */}
				<div className='absolute inset-0 pointer-events-none z-0'>
					{/* Radial Glow Top Left */}
					<div className='absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.12)_0%,transparent_60%)] blur-2xl' />
					
					{/* Radial Glow Bottom Right */}
					<div className='absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(76,175,80,0.12)_0%,transparent_60%)] blur-2xl' />

					{/* Low Opacity Floating Leaves */}
					{floatingLeaves.map((leaf, i) => (
						<motion.div
							key={i}
							className='absolute text-[#4CAF50] opacity-[0.08]'
							style={{ left: leaf.left, top: leaf.top }}
							animate={{
								y: [-12, 12, -12],
								rotate: [0, 18, -18, 0],
								scale: [leaf.scale, leaf.scale * 1.1, leaf.scale],
							}}
							transition={{
								duration: leaf.duration,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: leaf.delay,
							}}
						>
							<Leaf className='w-12 h-12 md:w-16 md:h-16' />
						</motion.div>
					))}
				</div>

				{/* Hero Content */}
				<div className='relative z-10 max-w-7xl mx-auto'>
					<div className='max-w-[720px] mx-auto text-center space-y-6'>
					
					{/* Top Badge */}
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-md shadow-xs'
					>
						<span className='text-sm sm:text-base'>🌱</span>
						<span className='text-xs sm:text-sm font-semibold text-[#FBBF24] tracking-wide'>
							কৃষি সহায়ক টুল
						</span>
					</motion.div>

					{/* Heading */}
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className='text-[34px] sm:text-[46px] lg:text-[58px] font-bold text-[#FBBF24] leading-[1.1] tracking-tight drop-shadow-xs'
					>
						সারের হিসাব ক্যালকুলেটর
					</motion.h1>

					{/* Description */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className='text-white/80 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-[720px] mx-auto'
					>
						আপনার ফসল, জমির পরিমাণ ও জমির ধরন অনুযায়ী সঠিক পরিমাণ সার সহজেই নির্ণয় করুন।
					</motion.p>

					{/* Feature Chips */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className='pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3'
					>
						{featureChips.map((chip, index) => (
							<div
								key={index}
								className='px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-md text-white/90 text-xs sm:text-sm font-medium hover:bg-white/[0.15] hover:border-white/[0.25] hover:scale-105 transition-all duration-300 cursor-default shadow-xs flex items-center gap-1.5'
							>
								<span>{chip.icon}</span>
								<span>{chip.text}</span>
							</div>
						))}
					</motion.div>
					</div>
				</div>
			</section>

			{/* ==================================================== */}
			{/* CALCULATOR CARD                                      */}
			{/* ==================================================== */}
			<section className='w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 relative z-20 -mt-10 md:-mt-14'>
				<div className='max-w-7xl mx-auto'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='max-w-4xl mx-auto bg-white rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-gray-100 p-6 md:p-8 lg:p-[48px]'
					>
						<FertilizerCalculator language={language} />
					</motion.div>
				</div>
			</section>

			{/* ==================================================== */}
			{/* INFO CARDS SECTION                                   */}
			{/* ==================================================== */}
			<section className='w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 mt-16 mb-16'>
				<div className='max-w-7xl mx-auto'>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6'>
						{infoCards.map((card, idx) => {
							const IconComponent = card.icon;
							return (
								<motion.div
									key={idx}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.4, delay: idx * 0.1 }}
									className='bg-white rounded-[20px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100/90 flex flex-col items-start hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group'
								>
									<div className='w-12 h-12 rounded-2xl bg-[#4CAF50]/10 text-[#2E7D32] flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform'>
										<IconComponent className='w-6 h-6 text-[#2E7D32]' />
									</div>
									<h4 className='text-base font-bold text-[#2A351F] mb-1.5'>
										{card.title}
									</h4>
									<p className='text-xs sm:text-sm text-gray-500 font-medium leading-relaxed'>
										{card.desc}
									</p>
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ==================================================== */}
			{/* HELP SECTION                                         */}
			{/* ==================================================== */}
			<section className='w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 mb-20'>
				<div className='max-w-7xl mx-auto'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className='bg-gradient-to-r from-[#4A5E3A] via-[#3D4F2E] to-[#4A5E3A] rounded-[28px] p-8 md:p-10 text-white shadow-xl border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden'
					>
						{/* Subtle Background Glow inside help card */}
						<div className='absolute right-0 bottom-0 w-64 h-64 bg-[#4CAF50]/10 rounded-full blur-3xl pointer-events-none' />

						<div className='space-y-2 text-center md:text-left z-10'>
							<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/30 text-[#FBBF24] text-xs font-bold'>
								<span>Need Help?</span>
							</div>
							<h3 className='text-2xl md:text-3xl font-extrabold text-white tracking-tight'>
								বিশেষজ্ঞের সঙ্গে যোগাযোগ করুন
							</h3>
							<p className='text-white/75 text-sm md:text-base font-medium max-w-md'>
								সার প্রয়োগ সংক্রান্ত যেকোনো পরামর্শের জন্য আমাদের কৃষি সহায়কের সাথে যুক্ত হন।
							</p>
						</div>

						<a
							href='https://wa.me/?text=Hello%20Agricultural%20Expert'
							target='_blank'
							rel='noopener noreferrer'
							className='z-10 shrink-0 border-2 border-[#4CAF50] bg-[#4CAF50]/15 hover:bg-[#4CAF50] text-[#FBBF24] hover:text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
						>
							<MessageCircle className='w-5 h-5 text-[#FBBF24]' />
							<span>হোয়াটসঅ্যাপে যোগাযোগ</span>
						</a>
					</motion.div>
				</div>
			</section>

		</div>
	);
}
