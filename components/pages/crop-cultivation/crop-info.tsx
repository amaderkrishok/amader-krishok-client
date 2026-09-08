'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import {
	CropCultivationService,
	type CropDto,
} from '@/services/crop-cultivation-service';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Sprout, Bug, ShieldCheck, CheckCircle2, Calendar, MapPin, Layers } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useEditorToHtml } from '@/hooks/use-editor-to-html';
import { motion } from 'framer-motion';

interface CropInfoProps {
	cropId: string;
}

export function CropInfo({ cropId }: CropInfoProps) {
	const convertToHtml = useEditorToHtml();
	const [selectedCrop, setSelectedCrop] = useState<CropDto | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [cultivationHtml, setCultivationHtml] = useState<{
		[key: string]: string;
	}>({});
	const [diseaseHtml, setDiseaseHtml] = useState<{ [key: string]: string }>({});

	// Normalize editor values
	const normalizeEditorValue = (input: any): any[] => {
		if (!input) return [];
		if (Array.isArray(input?.value)) return input.value;
		if (Array.isArray(input)) return input;
		if (typeof input === 'object') return [input];
		return [];
	};

	// Fetch crop data
	useEffect(() => {
		const fetchCropDetails = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await CropCultivationService.getCropById(cropId);
				setSelectedCrop(response.data);
			} catch (err) {
				console.error(`Failed to fetch crop details for ID ${cropId}:`, err);
				setError('ফসলের তথ্য লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
			} finally {
				setLoading(false);
			}
		};

		if (cropId) {
			fetchCropDetails();
		}
	}, [cropId]);

	// Convert rich text content to HTML
	useEffect(() => {
		const loadContent = async () => {
			if (!selectedCrop) return;

			// Convert cultivation methods
			const cultivationResults: { [key: string]: string } = {};
			for (const cultivation of selectedCrop.cultivations) {
				const nodes = normalizeEditorValue(cultivation.method);
				if (nodes.length) {
					const html = await convertToHtml(nodes as []);
					cultivationResults[cultivation.id as string] = html;
				} else {
					cultivationResults[cultivation.id as string] = '';
				}
			}
			setCultivationHtml(cultivationResults);

			// Convert disease descriptions
			if (selectedCrop.diseases?.length) {
				const diseaseResults: { [key: string]: string } = {};
				for (const disease of selectedCrop.diseases) {
					const nodes = normalizeEditorValue(disease.description);
					if (nodes.length) {
						const html = await convertToHtml(nodes as []);
						diseaseResults[disease.id as string] = html;
					} else {
						diseaseResults[disease.id as string] = '';
					}
				}
				setDiseaseHtml(diseaseResults);
			}
		};

		loadContent();
	}, [selectedCrop, convertToHtml]);

	if (loading) {
		return <CropInfoSkeleton />;
	}

	if (error) {
		return (
			<Alert variant='destructive' className='rounded-2xl border-rose-200 bg-rose-50 text-rose-900 p-6'>
				<AlertCircle className='h-5 w-5 text-rose-600' />
				<AlertTitle className='font-bold text-lg'>ত্রুটি</AlertTitle>
				<AlertDescription className='text-sm mt-1'>{error}</AlertDescription>
			</Alert>
		);
	}

	if (!selectedCrop) {
		return (
			<Card className='mt-6 rounded-3xl border-gray-200 bg-[#FDFBF7]/80 p-8 text-center'>
				<CardContent>
					<p className='text-gray-600 font-medium'>তথ্য দেখতে বামপাশের তালিকা থেকে একটি ফসল নির্বাচন করুন।</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<motion.div 
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='space-y-8'
		>
			<Card className='border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-[#FDFBF7]/95 backdrop-blur-md rounded-3xl overflow-hidden'>
				
				{/* Crop Info Header */}
				<CardHeader className='bg-gradient-to-r from-[#37462A] to-[#4A5E3A] text-white p-6 sm:p-8 relative overflow-hidden'>
					<div className='absolute -right-10 -bottom-10 opacity-10 pointer-events-none'>
						<Sprout className='w-64 h-64 text-[#4ADE80]' />
					</div>

					<div className='relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
						<div>
							<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAB308]/20 border border-[#EAB308]/40 text-[#EAB308] text-xs font-bold uppercase tracking-wider mb-3'>
								<Sprout className='w-3.5 h-3.5' />
								<span>যাচাইকৃত চাষাবাদ গাইড</span>
							</div>

							<CardTitle className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight flex items-center gap-3'>
								{selectedCrop.name}
							</CardTitle>
							<p className='text-gray-300 text-sm sm:text-base mt-2 max-w-xl font-medium'>
								{selectedCrop.name} চাষের উন্নত প্রযুক্তি, পর্যায়ক্রমিক জমি প্রস্তুত, সার প্রয়োগ ও রোগ-বালাই প্রতিরোধ নির্দেশিকা।
							</p>
						</div>

						{/* Quick Meta Badges */}
						<div className='flex sm:flex-col gap-2.5 flex-wrap'>
							<div className='px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-semibold text-amber-200'>
								<Calendar className='w-4 h-4 text-[#EAB308]' />
								<span>রবি ও খরিপ মৌসুম</span>
							</div>
							<div className='px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-semibold text-emerald-200'>
								<MapPin className='w-4 h-4 text-[#4ADE80]' />
								<span>৪২ জেলায় উপযুক্ত</span>
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent className='p-5 sm:p-8'>
					<Tabs defaultValue='cultivation' className='w-full'>
						<TabsList className='bg-gray-100/90 p-1.5 rounded-2xl mb-8 flex flex-wrap h-auto border border-gray-200/80 gap-1.5'>
							<TabsTrigger 
								value='cultivation' 
								className='rounded-xl px-6 py-3 data-[state=active]:bg-[#37462A] data-[state=active]:text-[#EAB308] data-[state=active]:shadow-md text-sm sm:text-base font-bold flex-1 transition-all'
							>
								🌱 চাষাবাদ ধাপসমূহ ({selectedCrop.cultivations.length})
							</TabsTrigger>
							{selectedCrop.diseases && selectedCrop.diseases.length > 0 && (
								<TabsTrigger 
									value='diseases' 
									className='rounded-xl px-6 py-3 data-[state=active]:bg-rose-900 data-[state=active]:text-rose-100 data-[state=active]:shadow-md text-sm sm:text-base font-bold flex-1 transition-all'
								>
									🦠 রোগ-বালাই ও প্রতিকার ({selectedCrop.diseases.length})
								</TabsTrigger>
							)}
						</TabsList>

						{/* Cultivation Stages Timeline */}
						<TabsContent value='cultivation' className='animate-in fade-in duration-300 outline-none'>
							<div className='relative pl-4 sm:pl-8 border-l-2 border-emerald-500/30 space-y-8 my-2'>
								{selectedCrop.cultivations.map((cultivation, idx) => (
									<motion.div 
										key={cultivation.id || idx} 
										initial={{ opacity: 0, x: -15 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: idx * 0.1 }}
										className='relative group'
									>
										{/* Timeline Step Number Marker */}
										<div className='absolute -left-[27px] sm:-left-[43px] top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#2D331F] border-4 border-[#FDFBF7] text-[#EAB308] font-black text-xs sm:text-sm flex items-center justify-center shadow-md group-hover:scale-110 transition-transform'>
											0{idx + 1}
										</div>

										<div className='bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-[#EAB308]/50 transition-all duration-300'>
											<div className='flex items-center justify-between border-b border-gray-100 pb-3 mb-4'>
												<h4 className='text-lg sm:text-xl font-extrabold text-[#2D331F] flex items-center gap-2.5'>
													<span className='w-2.5 h-2.5 rounded-full bg-[#EAB308]'></span>
													{cultivation.name}
												</h4>
												<span className='px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60'>
													ধাপ ০{idx + 1}
												</span>
											</div>

											<div
												className='prose prose-emerald max-w-none text-gray-700 leading-relaxed prose-headings:text-[#2D331F] prose-a:text-[#EAB308] prose-strong:text-[#2D331F] prose-li:marker:text-[#4ADE80] text-sm sm:text-base'
												dangerouslySetInnerHTML={{
													__html: cultivationHtml[cultivation.id as string] || '<p className="text-gray-400">তথ্য প্রক্রিয়াকরণ হচ্ছে...</p>',
												}}
											/>
										</div>
									</motion.div>
								))}
							</div>
						</TabsContent>

						{/* Diseases & Remediation Section */}
						{selectedCrop.diseases && selectedCrop.diseases.length > 0 && (
							<TabsContent value='diseases' className='animate-in fade-in duration-300 outline-none'>
								<div className='grid grid-cols-1 gap-6'>
									{selectedCrop.diseases.map((disease, idx) => (
										<motion.div 
											key={disease.id || idx}
											initial={{ opacity: 0, y: 15 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: idx * 0.1 }}
											className='bg-rose-50/40 border border-rose-200/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300'
										>
											<div className='flex items-center justify-between border-b border-rose-200/60 pb-4 mb-4'>
												<h4 className='text-lg sm:text-xl font-bold text-rose-900 flex items-center gap-2.5'>
													<Bug className='w-5 h-5 text-rose-600' />
													{disease.diseaseName}
												</h4>
												<div className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold'>
													<ShieldCheck className='w-3.5 h-3.5 text-rose-600' />
													<span>দমন ব্যবস্থাপনা</span>
												</div>
											</div>
											<div
												className='prose prose-rose max-w-none text-gray-700 leading-relaxed prose-headings:text-rose-900 prose-a:text-rose-600 prose-strong:text-rose-900 prose-li:marker:text-rose-500 text-sm sm:text-base'
												dangerouslySetInnerHTML={{
													__html: diseaseHtml[disease.id as string] || '<p className="text-gray-400">তথ্য প্রক্রিয়াকরণ হচ্ছে...</p>',
												}}
											/>
										</motion.div>
									))}
								</div>
							</TabsContent>
						)}
					</Tabs>
				</CardContent>
			</Card>
		</motion.div>
	);
}

function CropInfoSkeleton() {
	return (
		<Card className='rounded-3xl border border-gray-200 bg-[#FDFBF7] overflow-hidden'>
			<CardHeader className='bg-[#2D331F] p-8'>
				<Skeleton className='h-10 w-2/3 mb-3 bg-white/20' />
				<Skeleton className='h-5 w-1/3 bg-white/10' />
			</CardHeader>
			<CardContent className='p-8 space-y-6'>
				<Skeleton className='h-12 w-full rounded-2xl' />
				<div className='space-y-4'>
					<Skeleton className='h-32 w-full rounded-2xl' />
					<Skeleton className='h-32 w-full rounded-2xl' />
				</div>
			</CardContent>
		</Card>
	);
}
