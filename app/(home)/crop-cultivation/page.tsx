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
			<div className='min-h-screen bg-gray-50 p-6'>
				<div className='container mx-auto'>
					<div className='flex items-center justify-center min-h-[60vh]'>
						<div className='bg-white p-8 rounded-lg shadow-md text-center'>
							<AlertCircle className='mx-auto h-12 w-12 text-red-500 mb-4' />
							<h2 className='text-2xl font-bold text-gray-800 mb-2'>Error</h2>
							<p className='text-gray-600'>{error}</p>
							<button
								onClick={() => window.location.reload()}
								className='mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90'
							>
								Try Again
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='mx-auto p-5'>
				<div className='flex flex-col lg:flex-row gap-0'>
					{/* Sidebar */}
					{loading ? (
						<div className='w-64 p-4'>
							<Skeleton className='h-8 w-full mb-4' />
							<div className='space-y-2'>
								{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
									<Skeleton key={i} className='h-10 w-full' />
								))}
							</div>
						</div>
					) : (
						<Sidebar onSelectCrop={handleCropSelect} crops={crops} />
					)}

					{/* Main content */}
					<main className='flex-1 px-0 py-0 lg:pl-0 lg:pr-0 lg:ml-64'>
						{selectedCropId ? (
							<CropInfo cropId={selectedCropId} />
						) : (
							<div className='text-center py-12'>
								<p className='text-gray-500'>
									Select a crop from the sidebar to view cultivation
									information.
								</p>
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
