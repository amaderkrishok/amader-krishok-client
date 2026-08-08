'use client';

import { motion } from 'framer-motion';
import { Sprout, CheckCircle2 } from 'lucide-react';

interface FertilizerOutputProps {
	results: Record<string, string>; // Dynamically handle any fertilizer type
	language: 'en' | 'bn';
}

export function FertilizerOutput({ results, language }: FertilizerOutputProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className='mt-10 rounded-[24px] bg-white border border-gray-100 shadow-xl border-t-4 border-t-[#FBBF24] p-6 md:p-8 overflow-hidden'
		>
			<div className='flex items-center justify-between pb-6 border-b border-gray-100 mb-6'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 rounded-xl bg-[#4CAF50]/15 text-[#2E7D32] flex items-center justify-center'>
						<Sprout className='w-5 h-5' />
					</div>
					<div>
						<h3 className='text-xl md:text-2xl font-bold text-[#2A351F]'>
							{language === 'bn' ? 'সারের প্রস্তাবিত পরিমাণ' : 'Recommended Fertilizer Amounts'}
						</h3>
						<p className='text-xs sm:text-sm text-gray-500 mt-0.5 font-medium'>
							{language === 'bn' ? 'আপনার জমির জন্য সঠিক প্রয়োগযোগ্য মাত্রা' : 'Calculated optimal doses for your land'}
						</p>
					</div>
				</div>
				<div className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60'>
					<CheckCircle2 className='w-4 h-4 text-[#4CAF50]' />
					<span>{language === 'bn' ? 'অনুমোদিত সুপারিশ' : 'Verified Doses'}</span>
				</div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
				{Object.entries(results).map(([fertilizer, amount], index) => (
					<motion.div
						key={fertilizer}
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.08 }}
						className='rounded-[16px] bg-[#F8F8F8] border-l-4 border-l-[#4CAF50] border-y border-r border-gray-200/60 p-4 sm:p-5 flex items-center justify-between shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group'
					>
						<div className='flex items-center gap-3'>
							<div className='w-2.5 h-2.5 rounded-full bg-[#4CAF50] group-hover:scale-125 transition-transform' />
							<span className='font-bold text-[#2A351F] text-base md:text-lg'>
								{language === 'bn'
									? translateFertilizer(fertilizer, language)
									: fertilizer}
							</span>
						</div>

						<div className='bg-white px-4 py-2 rounded-xl border border-gray-200/80 shadow-2xs font-extrabold text-[#2E7D32] text-base md:text-lg tracking-wide'>
							{formatAmount(amount)}
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	);
}

// Helper function to format amounts
function formatAmount(amount: string): string {
	const match = amount.match(/^([\d.]+)\s*(g|kg)$/i);
	if (!match) return amount; // Return as is if the format is unrecognized

	const value = Number.parseFloat(match[1]);
	const unit = match[2].toLowerCase();

	if (unit === 'kg') {
		return `${value.toFixed(1)} কেজি`;
	}

	if (unit === 'g' && value >= 1000) {
		return `${(value / 1000).toFixed(1)} কেজি`;
	}

	return `${value.toFixed(1)} গ্রাম`;
}

// Helper function to translate fertilizer names to Bengali
function translateFertilizer(fertilizer: string, language: 'en' | 'bn') {
	const translations: Record<string, string> = {
		Urea: 'ইউরিয়া',
		TSP: 'টিএসপি',
		DAP: 'ডিএপি',
		MOP: 'এমওপি',
		Potas: 'পটাশ',
		Cow_dang: 'গোবর',
		Boron: 'বোরন',
		Borex: 'বোর্ক্স',
		Zipsam: 'জিপসাম',
		Gypsum: 'জিপসাম',
		Zinc: 'জিঙ্ক',
		Ass: 'অ্যাস',
	};

	return language === 'bn'
		? translations[fertilizer] || fertilizer
		: fertilizer;
}
