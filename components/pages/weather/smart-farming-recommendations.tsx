'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, CloudRain, Sun, AlertTriangle, ShieldCheck, Droplets, Scissors } from 'lucide-react';

interface SmartFarmingProps {
	data: any;
}

export function SmartFarmingRecommendations({ data }: SmartFarmingProps) {
	const current = data?.list?.[0];
	if (!current) return null;

	const temp = Math.round(current.main.temp - 273.15);
	const pop = current.pop || 0; // Rain probability 0-1
	const humidity = current.main.humidity || 0;
	const windSpeed = current.wind.speed || 0;

	// Determine recommendations based on weather
	const recommendations = [];

	// 1. Irrigation Advice
	if (pop > 0.6) {
		recommendations.push({
			icon: CloudRain,
			badge: '🌧️ সেচ নিয়ন্ত্রণ',
			badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
			title: 'আজ সেচ প্রদান স্থগিত রাখুন',
			desc: 'আজ বৃষ্টির সম্ভাবনা অনেক বেশি। জমিতে অতিরিক্ত জলবদ্ধতা এড়াতে কৃত্রিম সেচ বন্ধ রাখুন এবং অতিরিক্ত পানি নিষ্কাশনের ব্যবস্থা করুন।',
			action: 'পানি নিষ্কাশন নালা পরিষ্কার রাখুন',
		});
	} else if (temp > 30 && humidity < 60) {
		recommendations.push({
			icon: Droplets,
			badge: '💧 জরুরি সেচ',
			badgeBg: 'bg-[#FBBF24]/20 text-[#D97706] border-[#FBBF24]/40',
			title: 'সকালে বা বিকেলে সেচ দিন',
			desc: 'উচ্চ তাপমাত্রা ও কম আর্দ্রতার কারণে মাটির আর্দ্রতা দ্রুত হ্রাস পাচ্ছে। কচি ফসলে পর্যাপ্ত সেচ দেওয়া নিশ্চিত করুন।',
			action: 'বিকালে মাটির ভেজা ভাব পরীক্ষা করুন',
		});
	} else {
		recommendations.push({
			icon: Sprout,
			badge: '🌱 স্বাভাবিক সেচ',
			badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
			title: 'পরিমিত সেচ প্রদান করুন',
			desc: 'আবহাওয়া অনুকূল রয়েছে। ফসলের চাহিদা অনুযায়ী স্বাভাবিক সেচ কার্যক্রম বজায় রাখতে পারেন।',
			action: 'নিয়মিত মাটির আর্দ্রতা যাচাই করুন',
		});
	}

	// 2. Fertilizer & Pesticide Spraying Advice
	if (pop > 0.4 || windSpeed > 5) {
		recommendations.push({
			icon: AlertTriangle,
			badge: '⚠️ স্প্রে না করার পরামর্শ',
			badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
			title: 'সার ও কীটনাশক প্রয়োগ এড়ান',
			desc: 'বৃষ্টি বা তীব্র বাতাসের সময় স্প্রে করলে তা ধুয়ে যেতে পারে বা অপচয় হতে পারে। বাতাস শান্ত ও রোদ উঠা পর্যন্ত অপেক্ষা করুন।',
			action: 'আবহাওয়া শুষ্ক হওয়া পর্যন্ত স্থগিত রাখুন',
		});
	} else {
		recommendations.push({
			icon: ShieldCheck,
			badge: '✅ স্প্রে করার উপযুক্ত সময়',
			badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
			title: 'কীটনাশক ও সার প্রয়োগের উপযুক্ত আবহাওয়া',
			desc: 'বাতাসের গতি পরিমিত ও বৃষ্টির সম্ভাবনা কম থাকায় আজকে জমিতে সুষম সার বা প্রয়োজনীয় কীটনাশক প্রয়োগ করা যেতে পারে।',
			action: 'সকাল ৮-১০ টার মধ্যে স্প্রে সম্পন্ন করুন',
		});
	}

	// 3. Harvesting / Crop Drying Advice
	if (pop < 0.2 && temp >= 25) {
		recommendations.push({
			icon: Sun,
			badge: '🌾 ফসল মাড়াই ও শুকানো',
			badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
			title: 'ফসল কাটা ও রোদ পোহানোর জন্য সেরা দিন',
			desc: 'আকাশ পরিষ্কার থাকায় আজ পাকা ফসল কাটা, মাড়াই করা এবং রোদে শুকানোর কাজ নিরাপদে সম্পন্ন করা সম্ভব।',
			action: 'শুকানো দানা নিরাপদে সংরক্ষণ করুন',
		});
	} else {
		recommendations.push({
			icon: Scissors,
			badge: '📦 নিরাপত্তা সতর্কতা',
			badgeBg: 'bg-[#313C22]/10 text-[#2A351F] border-[#313C22]/20',
			title: 'কাটা ফসল ঢেকে রাখুন',
			desc: 'আকস্মিক বৃষ্টি বা আর্দ্রতার আশঙ্কায় খোলা মাঠে রাখা ফসল ত্রিপল বা পলিথিন দিয়ে ভালোভাবে ঢেকে রাখুন।',
			action: 'শুকনো গুদামে ফসল স্থানান্তরিত করুন',
		});
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className='w-full max-w-6xl mx-auto mt-10'
		>
			{/* Section Header */}
			<div className='flex items-center gap-3 mb-6'>
				<div className='w-10 h-10 rounded-xl bg-[#4CAF50]/15 text-[#2E7D32] flex items-center justify-center shadow-xs'>
					<Sprout className='w-5 h-5' />
				</div>
				<div>
					<h3 className='text-xl md:text-2xl font-bold text-[#2A351F] tracking-tight'>
						স্মার্ট কৃষি পরামর্শ (Smart Farming Advisory)
					</h3>
					<p className='text-xs sm:text-sm text-gray-500 font-medium'>
						বর্তমান আবহাওয়ার ভিত্তিতে স্বয়ংক্রিয়ভাবে প্রণীত কৃষিকাজের উপযোগী নির্দেশিকা
					</p>
				</div>
			</div>

			{/* Recommendation Cards Grid */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{recommendations.map((rec, index) => {
					const IconComponent = rec.icon;
					return (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 15 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: index * 0.1 }}
							className='bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group'
						>
							{/* Top Accent Line */}
							<div className='absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4CAF50] via-[#FBBF24] to-[#2E7D32]' />

							<div>
								<div className='flex items-center justify-between mb-4'>
									<div className='w-12 h-12 rounded-2xl bg-[#2A351F]/10 text-[#2A351F] flex items-center justify-center group-hover:scale-110 transition-transform'>
										<IconComponent className='w-6 h-6 text-[#2E7D32]' />
									</div>
									<span
										className={`px-3 py-1 rounded-full text-xs font-extrabold border ${rec.badgeBg}`}
									>
										{rec.badge}
									</span>
								</div>

								<h4 className='text-lg font-bold text-[#2A351F] mb-2 leading-snug'>
									{rec.title}
								</h4>
								<p className='text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-4'>
									{rec.desc}
								</p>
							</div>

							<div className='pt-3 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#2E7D32]'>
								<span className='w-2 h-2 rounded-full bg-[#4CAF50]' />
								<span>করণীয়: {rec.action}</span>
							</div>
						</motion.div>
					);
				})}
			</div>
		</motion.div>
	);
}
