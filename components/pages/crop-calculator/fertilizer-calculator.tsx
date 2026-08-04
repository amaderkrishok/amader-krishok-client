'use client';

import { useEffect, useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { CropTypeSelect } from './crop-type-select';
import { LandSizeInput } from './land-size-input';
import { FertilizerOutput } from './fertilizer-output';
import { FertilizerService } from '@/services/fertilizer-service';
import React from 'react';

interface FertilizerCalculatorProps {
	language: 'en' | 'bn';
}

interface Fertilizer {
	name: string;
	amount: number;
	unit: string;
}

interface Crop {
	value: string;
	labelEn: string;
	labelBn: string;
	fertilizers: Fertilizer[];
}

interface ApiCropData {
	id: number;
	name: string;
	fertilizerAmounts: Record<string, number>;
}

export function FertilizerCalculator({ language }: FertilizerCalculatorProps) {
	const [cropData, setCropData] = useState<Crop[]>([]);
	const [landSize, setLandSize] = useState<{
		value: string;
		unit: 'shatak' | 'bigha';
	}>({ value: '', unit: 'shatak' });
	const [cropType, setCropType] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [calculatedResults, setCalculatedResults] = useState<Record<
		string,
		string
	> | null>(null);
	const [errors, setErrors] = useState<{
		landSize?: string;
		cropType?: string;
	}>({});

	useEffect(() => {
		const fetchCrops = async () => {
			setIsLoading(true);
			try {
				const response = await FertilizerService.getAllCalculators();

				if (Array.isArray(response.data)) {
					const transformedData = response.data.map((crop: ApiCropData) => {
						const fertilizers: Fertilizer[] = Object.entries(
							crop.fertilizerAmounts
						).map(([name, amount]) => ({
							name,
							amount,
							unit: name === 'গোবর' ? 'কেজি' : 'গ্রাম',
						}));

						return {
							value: crop.id.toString(),
							labelEn: crop.name,
							labelBn: crop.name,
							fertilizers,
						};
					});

					setCropData(transformedData);
				}
			} catch (error) {
				console.error('Error fetching crop data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCrops();
	}, []);

	const validateInputs = () => {
		const validationErrors: { landSize?: string; cropType?: string } = {};

		if (
			!landSize.value ||
			isNaN(Number(landSize.value)) ||
			Number(landSize.value) <= 0
		) {
			validationErrors.landSize =
				language === 'bn' ? 'সঠিক পরিমাণ লিখুন' : 'Enter a valid land size';
		}

		if (!cropType) {
			validationErrors.cropType =
				language === 'bn' ? 'ফসলের ধরন নির্বাচন করুন' : 'Select a crop type';
		}

		setErrors(validationErrors);
		return Object.keys(validationErrors).length === 0;
	};

	const handleCalculate = () => {
		if (!validateInputs()) return;

		const crop = cropData.find((c) => c.value === cropType);
		if (!crop) return;

		const sizeInShatak =
			landSize.unit === 'bigha'
				? Number.parseFloat(landSize.value) * 33
				: Number.parseFloat(landSize.value);

		const results = crop.fertilizers.reduce(
			(acc: Record<string, string>, fertilizer) => {
				const rawAmount = fertilizer.amount * sizeInShatak;
				let displayValue: string;

				if (rawAmount >= 1000) {
					const kgAmount = (rawAmount / 1000).toFixed(2);
					displayValue = `${kgAmount} kg`;
				} else {
					displayValue = `${Math.round(rawAmount)} g`;
				}

				acc[fertilizer.name] = displayValue;
				return acc;
			},
			{}
		);

		setCalculatedResults(results);
	};

	const handleReset = () => {
		setLandSize({ value: '', unit: 'shatak' });
		setCropType('');
		setCalculatedResults(null);
		setErrors({});
	};

	const handleCropTypeChange = (value: string) => {
		setCropType(value);
		setErrors((prev) => ({ ...prev, cropType: undefined }));
	};

	const handleLandSizeChange = (value: string, unit: 'shatak' | 'bigha') => {
		setLandSize({ value, unit });

		if (value && !isNaN(Number(value)) && Number(value) > 0) {
			setErrors((prev) => ({ ...prev, landSize: undefined }));
		}
	};

	return (
		<div className='w-full'>
			{/* Card Header */}
			<div className='flex items-start gap-4 mb-8 pb-6 border-b border-gray-100'>
				<div className='w-14 h-14 rounded-2xl bg-[#4CAF50]/10 border border-[#4CAF50]/20 flex items-center justify-center shrink-0 shadow-xs'>
					<Calculator className='w-7 h-7 text-[#2E7D32]' />
				</div>
				<div>
					<h2 className='text-2xl md:text-3xl font-extrabold text-[#2A351F] tracking-tight'>
						{language === 'bn' ? 'সারের হিসাব করুন' : 'Calculate Fertilizer'}
					</h2>
					<p className='text-gray-500 font-medium text-sm md:text-base mt-1'>
						{language === 'bn'
							? 'প্রয়োজনীয় তথ্য দিন এবং ফলাফল দেখুন।'
							: 'Provide details to get accurate fertilizer recommendations.'}
					</p>
				</div>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleCalculate();
				}}
				className='space-y-6'
			>
				<CropTypeSelect
					value={cropType}
					onChange={handleCropTypeChange}
					language={language}
					cropData={cropData}
					error={errors.cropType}
				/>

				<LandSizeInput
					value={landSize.value}
					unit={landSize.unit}
					onChange={handleLandSizeChange}
					language={language}
					error={errors.landSize}
				/>

				<div className='flex flex-col sm:flex-row items-center gap-4 pt-4'>
					{/* Primary Button */}
					<button
						type='submit'
						disabled={isLoading}
						className='w-full sm:flex-1 h-[58px] rounded-[18px] bg-[#2E3B20] hover:bg-[#384A2C] text-white font-extrabold text-base md:text-lg flex items-center justify-center shadow-[0_10px_25px_rgba(46,59,32,0.25)] hover:shadow-[0_15px_30px_rgba(46,59,32,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer'
					>
						<Calculator className='w-5 h-5 mr-2.5 text-[#FBBF24] group-hover:rotate-12 transition-transform' />
						<span>{language === 'bn' ? 'হিসাব করুন' : 'Calculate'}</span>
					</button>

					{/* Secondary Button */}
					<button
						type='button'
						onClick={handleReset}
						disabled={isLoading}
						className='w-full sm:w-auto h-[58px] px-8 rounded-[18px] bg-white border-2 border-[#4CAF50] hover:border-[#2E7D32] hover:bg-[#F0FDF4] text-[#2E7D32] font-bold text-base flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs'
					>
						<RotateCcw className='w-5 h-5 mr-2 text-[#4CAF50]' />
						<span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
					</button>
				</div>
			</form>

			{calculatedResults && (
				<FertilizerOutput results={calculatedResults} language={language} />
			)}
		</div>
	);
}
