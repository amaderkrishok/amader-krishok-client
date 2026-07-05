'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/pages/crop-cultivation/sidebar';
import { CropInfo } from '@/components/pages/crop-cultivation/crop-info';
import {
	CropCultivationService,
	type CropNameIdDto,
} from '@/services/crop-cultivation-service';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export default function CropCultivationPage() {
	const [crops, setCrops] = useState<CropNameIdDto[]>([]);
	const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCropNames = async () => {
			try {
				setLoading(true);
				const response: CropNameIdDto[] | { data: CropNameIdDto[] } =
					await CropCultivationService.getCropNamesAndIds();
				// Handle the API response structure correctly
				const cropNamesData = Array.isArray(response)
					? response
					: (response as { data: CropNameIdDto[] }).data || [];
				setCrops(cropNamesData);

				// Auto-select first crop if available
				if (cropNamesData.length > 0) {
					setSelectedCropId(cropNamesData[0].id);
				}
			} catch (err) {
				console.error('Failed to fetch crop names:', err);
				setError('Failed to load crops. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		fetchCropNames();
	}, []);

	const handleCropSelect = (cropId: string) => {
		setSelectedCropId(cropId);
	};

	if (error) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/50 p-6 flex items-center justify-center'>
				<div className='container mx-auto max-w-lg'>
					<div className='bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-red-100 text-center'>
						<div className='bg-red-100/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6'>
							<AlertCircle className='h-10 w-10 text-red-500' />
						</div>
						<h2 className='text-3xl font-extrabold text-gray-900 mb-3'>সমস্যা হয়েছে</h2>
						<p className='text-gray-600 text-lg mb-8'>{error}</p>
						<button
							onClick={() => window.location.reload()}
							className='w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95'
						>
							আবার চেষ্টা করুন
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40'>
			<div className='max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8'>
				<div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
					{/* Sidebar */}
					{loading ? (
						<div className='w-full lg:w-72 xl:w-80 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50'>
							<Skeleton className='h-8 w-3/4 mb-6 rounded-lg' />
							<div className='space-y-3'>
								{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
									<Skeleton key={i} className='h-12 w-full rounded-xl' />
								))}
							</div>
						</div>
					) : (
						<div className='w-full lg:w-72 xl:w-80'>
							<Sidebar onSelectCrop={handleCropSelect} crops={crops} />
						</div>
					)}

					{/* Main content */}
					<main className='flex-1 lg:min-w-0'>
						{selectedCropId ? (
							<CropInfo cropId={selectedCropId} />
						) : (
							<div className='flex items-center justify-center h-full min-h-[400px] bg-white/60 backdrop-blur-sm rounded-3xl border border-white/50 shadow-sm'>
								<div className='text-center p-8'>
									<div className='w-24 h-24 bg-green-100/50 rounded-full flex items-center justify-center mx-auto mb-6'>
										<svg className="w-12 h-12 text-green-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
									</div>
									<h3 className='text-xl font-bold text-gray-800 mb-2'>ফসল নির্বাচন করুন</h3>
									<p className='text-gray-500 max-w-sm mx-auto'>
										বিস্তারিত চাষাবাদ তথ্য দেখতে বাম পাশের তালিকা থেকে একটি ফসল নির্বাচন করুন।
									</p>
								</div>
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
