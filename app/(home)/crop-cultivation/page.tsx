'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/pages/crop-cultivation/sidebar';
import { CropInfo } from '@/components/pages/crop-cultivation/crop-info';
import {
	CropCultivationService,
	type CropNameIdDto,
} from '@/services/crop-cultivation-service';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Sprout, Search, Leaf, ArrowRight, ShieldCheck, BookOpen, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function CropCultivationContent() {
	const searchParams = useSearchParams();
	const urlCropId = searchParams?.get('cropId');
	const urlCropName = searchParams?.get('crop');

	const [crops, setCrops] = useState<CropNameIdDto[]>([]);
	const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [heroSearchTerm, setHeroSearchTerm] = useState('');

	const popularCrops = ['ধান', 'টমেটো', 'আলু', 'গম', 'সরিষা', 'ভুট্টা'];

	useEffect(() => {
		const fetchCropNames = async () => {
			try {
				setLoading(true);
				const response: CropNameIdDto[] | { data: CropNameIdDto[] } =
					await CropCultivationService.getCropNamesAndIds();
				const cropNamesData = Array.isArray(response)
					? response
					: (response as { data: CropNameIdDto[] }).data || [];
				setCrops(cropNamesData);

				// Auto-select crop based on URL query param or fallback to first crop
				if (urlCropId && cropNamesData.some(c => c.id === urlCropId)) {
					setSelectedCropId(urlCropId);
				} else if (urlCropName) {
					const matched = cropNamesData.find(c => c.name.toLowerCase().includes(urlCropName.toLowerCase()));
					if (matched) {
						setSelectedCropId(matched.id);
					} else if (cropNamesData.length > 0) {
						setSelectedCropId(cropNamesData[0].id);
					}
				} else if (cropNamesData.length > 0) {
					setSelectedCropId(cropNamesData[0].id);
				}
			} catch (err) {
				console.error('Failed to fetch crop names:', err);
				setError('ফসল তালিকা লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
			} finally {
				setLoading(false);
			}
		};

		fetchCropNames();
	}, [urlCropId, urlCropName]);

	const handleCropSelect = (cropId: string) => {
		setSelectedCropId(cropId);
	};

	// Handle chip or search click from hero
	const handleSearchClick = (term: string) => {
		setHeroSearchTerm(term);
		const matchedCrop = crops.find(c => c.name.toLowerCase().includes(term.toLowerCase()));
		if (matchedCrop) {
			setSelectedCropId(matchedCrop.id);
		}
	};

	if (error) {
		return (
			<div className='min-h-screen bg-[#37462A] text-white p-6 flex items-center justify-center'>
				<div className='container mx-auto max-w-lg'>
					<div className='bg-[#4A5E3A]/90 border border-white/10 p-10 rounded-3xl shadow-2xl text-center backdrop-blur-md'>
						<div className='bg-rose-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/30'>
							<AlertCircle className='h-10 w-10 text-rose-400' />
						</div>
						<h2 className='text-3xl font-extrabold text-[#EAB308] mb-3'>সমস্যা হয়েছে</h2>
						<p className='text-gray-300 text-lg mb-8'>{error}</p>
						<button
							onClick={() => window.location.reload()}
							className='w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#EAB308] to-[#D97706] text-[#37462A] rounded-xl font-bold shadow-lg hover:brightness-110 transition-all duration-300'
						>
							আবার চেষ্টা করুন
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#FDFBF7] text-[#2D331F] selection:bg-[#EAB308] selection:text-[#2D331F]'>
			
			{/* --- HERO SECTION --- */}
			<section className='relative bg-[#37462A] text-white pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden'>
				{/* Background Decorations (Matching Banner Pattern) */}
				<div className='absolute inset-0 z-0 pointer-events-none'>
					<div className='absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.15)_0%,transparent_60%)]'></div>
					<div className='absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.1)_0%,transparent_60%)]'></div>
					
					{/* Floating Leaves */}
					{[
						{ left: '10%', top: '20%', scale: 1.1, duration: 8, delay: 0 },
						{ left: '85%', top: '15%', scale: 0.9, duration: 9, delay: 1 },
						{ left: '75%', top: '70%', scale: 1.2, duration: 10, delay: 1.5 },
						{ left: '20%', top: '75%', scale: 0.8, duration: 7, delay: 0.5 },
					].map((leaf, i) => (
						<motion.div
							key={i}
							className='absolute text-[#4ADE80]/20'
							style={{ left: leaf.left, top: leaf.top }}
							animate={{
								y: [-10, 10, -10],
								rotate: [0, 15, -15, 0],
								scale: [leaf.scale, leaf.scale * 1.08, leaf.scale],
							}}
							transition={{
								duration: leaf.duration,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: leaf.delay,
							}}
						>
							<Leaf className='w-9 h-9' />
						</motion.div>
					))}
				</div>

				<div className='relative z-10 max-w-5xl mx-auto text-center space-y-6'>
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3f472f]/80 border border-white/10 shadow-lg'
					>
						<Sprout className='w-4 h-4 text-[#4ADE80]' />
						<span className='text-xs sm:text-sm font-bold text-[#EAB308] tracking-wide uppercase'>আধুনিক কৃষি নির্দেশিকা</span>
					</motion.div>

					<motion.h1 
						initial={{ opacity: 0, y: 25 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className='text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#EAB308] tracking-tight leading-tight'
					>
						ফসল চাষাবাদ ও পরিচর্যা জ্ঞানকোষ
					</motion.h1>

					<motion.p 
						initial={{ opacity: 0, y: 25 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className='text-gray-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto font-medium leading-relaxed'
					>
						দেশসেরা কৃষি বিশেষজ্ঞদের দ্বারা প্রণীত আধুনিক চাষাবাদ পদ্ধতি, সঠিক জমি প্রস্তুতি, সার প্রয়োগ ও রোগ-বালাই প্রতিরোধ নির্দেশিকা।
					</motion.p>

					{/* Quick Popular Crop Chips */}
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className='pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3'
					>
						<span className='text-xs text-gray-400 font-bold uppercase tracking-wider mr-1'>জনপ্রিয় ফসল:</span>
						{popularCrops.map((cropName) => (
							<button
								key={cropName}
								onClick={() => handleSearchClick(cropName)}
								className='px-3.5 py-1.5 rounded-full bg-[#3f472f]/90 border border-white/10 text-gray-200 hover:text-[#2D331F] hover:bg-[#EAB308] text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm'
							>
								🌾 {cropName}
							</button>
						))}
					</motion.div>
				</div>
			</section>

			{/* --- MAIN CONTENT WORKSPACE --- */}
			<div className='max-w-[1550px] mx-auto p-4 md:p-6 lg:p-8 -mt-6 relative z-20'>
				<div className='flex flex-col lg:flex-row gap-6 lg:gap-8 items-start'>
					
					{/* Sidebar */}
					{loading ? (
						<div className='w-full lg:w-72 sm:w-80 p-6 bg-[#FDFBF7] rounded-3xl border border-gray-200 shadow-sm space-y-4'>
							<Skeleton className='h-8 w-3/4 mb-6 rounded-xl bg-gray-200' />
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<Skeleton key={i} className='h-12 w-full rounded-2xl bg-gray-200' />
							))}
						</div>
					) : (
						<Sidebar 
							onSelectCrop={handleCropSelect} 
							crops={crops} 
							selectedCropId={selectedCropId} 
						/>
					)}

					{/* Main Info Display */}
					<main className='flex-1 w-full lg:min-w-0'>
						{selectedCropId ? (
							<CropInfo cropId={selectedCropId} />
						) : (
							<div className='flex items-center justify-center h-full min-h-[450px] bg-[#FDFBF7] rounded-3xl border border-gray-200/80 shadow-sm p-8 text-center'>
								<div>
									<div className='w-20 h-20 bg-[#2D331F]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#2D331F]/20'>
										<Sprout className='w-10 h-10 text-[#2D331F]' />
									</div>
									<h3 className='text-2xl font-bold text-[#2D331F] mb-2'>ফসল নির্বাচন করুন</h3>
									<p className='text-gray-600 max-w-sm mx-auto font-medium text-sm sm:text-base'>
										পর্যায়ক্রমিক চাষাবাদ ধাপ ও রোগ প্রতিরোধ গাইড দেখতে বামপাশের তালিকা থেকে একটি ফসল নির্বাচন করুন।
									</p>
								</div>
							</div>
						)}
					</main>
				</div>
			</div>

			{/* --- BOTTOM CTA SECTION --- */}
			<section className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className='bg-gradient-to-r from-[#4A5E3A] via-[#3D4F2E] to-[#4A5E3A] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-white/15 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8'>
					
					<div className='space-y-3 max-w-xl'>
						<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAB308]/20 border border-[#EAB308]/30 text-[#EAB308] text-xs font-bold'>
							<ShieldCheck className='w-4 h-4' />
							<span>কৃষক মার্কেটপ্লেস</span>
						</div>
						<h3 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight'>
							সরাসরি কৃষক ও বীজ সরবরাহকারীদের সাথে যুক্ত হতে চান?
						</h3>
						<p className='text-gray-300 text-sm sm:text-base font-medium'>
							আমাদের ডিজিটাল মার্কেটপ্লেসে যাচাইকৃত কৃষকদের পণ্য কিনুন বা নিজ অঞ্চলের কৃষকদের সাথে সরাসরি কথা বলুন।
						</p>
					</div>

					<Link 
						href='/marketplace'
						className='px-8 py-4 bg-gradient-to-r from-[#EAB308] to-[#D97706] hover:from-[#FCD34D] hover:to-[#EAB308] text-[#2D331F] rounded-2xl font-extrabold text-base transition-all duration-300 shadow-xl shadow-[#EAB308]/20 flex items-center gap-3 shrink-0'
					>
						<span>মার্কেটপ্লেসে যান</span>
						<ArrowRight className='w-5 h-5' />
					</Link>
				</div>
			</section>
		</div>
	);
}

export default function CropCultivationPage() {
	return (
		<Suspense fallback={<div className="min-h-screen bg-[#37462A] flex items-center justify-center text-[#EAB308] font-bold text-xl">লোডিং...</div>}>
			<CropCultivationContent />
		</Suspense>
	);
}
