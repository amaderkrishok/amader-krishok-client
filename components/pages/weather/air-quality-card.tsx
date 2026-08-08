'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wind, ShieldAlert, HeartHandshake } from 'lucide-react';

interface AirQualityCardProps {
	data: any;
}

export function AirQualityCard({ data }: AirQualityCardProps) {
	if (!data) return null;

	// Estimate AQI score based on humidity and visibility for illustration/demo
	const visibility = data.list?.[0]?.visibility || 10000;
	const humidity = data.list?.[0]?.main?.humidity || 50;

	// Calculate synthetic AQI representation
	let aqiScore = 42;
	let statusText = 'উৎকৃষ্ট (Good)';
	let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
	let barColor = 'bg-emerald-500';
	let desc = 'বাতাসের মান চমৎকার। দীর্ঘক্ষণ মাঠে কাজ করার জন্য উপযুক্ত আবহাওয়া।';

	if (visibility < 5000 || humidity > 90) {
		aqiScore = 115;
		statusText = 'অস্বাস্থ্যকর (Moderate)';
		statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
		barColor = 'bg-amber-500';
		desc = 'বাতাসে কুয়াশা বা আর্দ্রতা বেশি। সংবেদনশীল ব্যক্তিরা মাস্ক ব্যবহার করুন।';
	} else if (visibility < 3000) {
		aqiScore = 168;
		statusText = 'খুবই অস্বাস্থ্যকর (Unhealthy)';
		statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
		barColor = 'bg-rose-500';
		desc = 'বাতাসের মান খারাপ। প্রবীণ ও শিশুরা বাইরে কাজ করার সময় সতর্ক থাকুন।';
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className='bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 w-full'
		>
			<div className='flex items-center justify-between pb-4 border-b border-gray-100 mb-4'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 rounded-xl bg-[#4CAF50]/15 text-[#2E7D32] flex items-center justify-center'>
						<Wind className='w-5 h-5' />
					</div>
					<div>
						<h4 className='text-lg font-bold text-[#2A351F]'>
							বাতাসের গুণমান (Air Quality Index)
						</h4>
						<p className='text-xs text-gray-500 font-medium'>
							আশেপাশের বায়ুমণ্ডলের বিশুদ্ধতা মান
						</p>
					</div>
				</div>
				<span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${statusColor}`}>
					{statusText}
				</span>
			</div>

			<div className='space-y-4'>
				<div className='flex items-baseline justify-between'>
					<span className='text-3xl font-extrabold text-[#2A351F]'>
						AQI {aqiScore}
					</span>
					<span className='text-xs text-gray-500 font-semibold'>
						০ - ৫০০ স্কেল
					</span>
				</div>

				{/* Progress bar */}
				<div className='w-full bg-gray-100 h-3 rounded-full overflow-hidden p-0.5 border border-gray-200/60'>
					<div
						className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
						style={{ width: `${Math.min((aqiScore / 300) * 100, 100)}%` }}
					/>
				</div>

				<div className='bg-[#F8F8F8] p-3.5 rounded-2xl border border-gray-100 flex items-start gap-2.5 text-xs text-gray-600 font-medium leading-relaxed'>
					<HeartHandshake className='w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5' />
					<span>{desc}</span>
				</div>
			</div>
		</motion.div>
	);
}
