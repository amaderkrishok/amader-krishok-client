'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { FertilizerService } from '@/services/fertilizer-service';
import { FertilizerForm } from './fertilizer-form';
import type { FertilizerCalculatorType } from '@/types/fertilizer';

interface FertilizerEditFormProps {
	calculatorId: number;
}

export function FertilizerEditForm({ calculatorId }: FertilizerEditFormProps) {
	const [calculator, setCalculator] = useState<FertilizerCalculatorType | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		fetchCalculator();
	}, [calculatorId]);

	const fetchCalculator = async () => {
		try {
			setIsLoading(true);
			const response = await FertilizerService.getCalculator(calculatorId);
			setCalculator(response.data);
		} catch (error) {
			toast.error('Failed to load calculator data');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (calculatorData: FertilizerCalculatorType) => {
		try {
			await FertilizerService.updateCalculator(calculatorId, calculatorData);
			toast.success('Calculator updated successfully');
			router.push('/admin/fertilizer');
		} catch (error) {
			toast.error('Failed to update calculator');
		}
	};

	const handleCancel = () => {
		router.push('/admin/fertilizer');
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>Loading calculator data...</div>
			</div>
		);
	}

	if (!calculator) {
		return (
			<div className='flex flex-col items-center justify-center h-64'>
				<div className='text-center mb-4'>Calculator not found</div>
				<Button
					variant='outline'
					onClick={() => router.push('/admin/fertilizer')}
				>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Calculators
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<Button
				variant='outline'
				onClick={() => router.push('/admin/fertilizer')}
			>
				<ArrowLeft className='mr-2 h-4 w-4' />
				Back to Calculators
			</Button>

			<Card>
				<CardHeader>
					<CardTitle>Edit Fertilizer Calculator</CardTitle>
					<CardDescription>
						Update fertilizer calculator information
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FertilizerForm
						calculator={calculator}
						onSubmit={handleSubmit}
						onCancel={handleCancel}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
