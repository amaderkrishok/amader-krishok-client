'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, RefreshCw } from 'lucide-react';
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

// API response format
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
				console.log(response.data);

				if (Array.isArray(response.data)) {
					// Transform API data to match our component's expected format
					const transformedData = response.data.map((crop: ApiCropData) => {
						// Convert fertilizerAmounts object to fertilizers array
						const fertilizers: Fertilizer[] = Object.entries(
							crop.fertilizerAmounts
						).map(([name, amount]) => ({
							name,
							amount,
							// Assign units based on fertilizer name or use default
							unit: name === 'গোবর' ? 'কেজি' : 'গ্রাম',
						}));

						return {
							value: crop.id.toString(), // Convert ID to string for select component
							labelEn: crop.name, // Use name for both labels if English not provided
							labelBn: crop.name,
							fertilizers,
						};
					});

					setCropData(transformedData);
				} else {
					console.error('Unexpected data format:', response.data);
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
				// Calculate the raw amount based on the land size
				const rawAmount = fertilizer.amount * sizeInShatak;

				// Simple conversion: if any amount exceeds 1000 grams, show in kg
				let displayValue: string;

				if (rawAmount >= 1000) {
					const kgAmount = (rawAmount / 1000).toFixed(2);
					displayValue = `${kgAmount} কেজি`;
				} else {
					displayValue = `${Math.round(rawAmount)} গ্রাম`;
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

	// Clear crop type error when user selects a valid crop type
	const handleCropTypeChange = (value: string) => {
		setCropType(value);
		setErrors((prev) => ({ ...prev, cropType: undefined }));
	};

	// Clear land size error when user enters a valid value
	const handleLandSizeChange = (value: string, unit: 'shatak' | 'bigha') => {
		setLandSize({ value, unit });

		if (value && !isNaN(Number(value)) && Number(value) > 0) {
			setErrors((prev) => ({ ...prev, landSize: undefined }));
		}
	};

	return (
		<Card>
			<CardContent className='p-6'>
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
					/>
					{errors.cropType && (
						<p className='text-red-500 text-sm'>{errors.cropType}</p>
					)}

					<LandSizeInput
						value={landSize.value}
						unit={landSize.unit}
						onChange={handleLandSizeChange}
						language={language}
					/>
					{errors.landSize && (
						<p className='text-red-500 text-sm'>{errors.landSize}</p>
					)}

					<div className='flex space-x-4'>
						<Button type='submit' className='flex-1' disabled={isLoading}>
							<Calculator className='w-4 h-4 mr-2' />
							{language === 'bn' ? 'হিসাব করুন' : 'Calculate'}
						</Button>
						<Button
							type='button'
							variant='outline'
							onClick={handleReset}
							disabled={isLoading}
						>
							<RefreshCw className='w-4 h-4 mr-2' />
							{language === 'bn' ? 'রিসেট' : 'Reset'}
						</Button>
					</div>
				</form>
				{calculatedResults && (
					<FertilizerOutput results={calculatedResults} language={language} />
				)}
			</CardContent>
		</Card>
	);
}
