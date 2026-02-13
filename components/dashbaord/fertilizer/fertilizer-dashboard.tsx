'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { FertilizerList } from './fertilizer-list';
import { FertilizerForm } from './fertilizer-form';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FertilizerService } from '@/services/fertilizer-service';
import type { FertilizerCalculatorType } from '@/types/fertilizer';
import { getAxiosErrorMessage } from '@/lib/utils';
import React from 'react';

export function FertilizerDashboard() {
	const [calculators, setCalculators] = useState<FertilizerCalculatorType[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCalculator, setSelectedCalculator] =
		useState<FertilizerCalculatorType | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('list');

	useEffect(() => {
		fetchCalculators();
	}, []);

	const fetchCalculators = async () => {
		try {
			setIsLoading(true);
			const response = await FertilizerService.getAllCalculators();
			setCalculators(response.data);
		} catch (error) {
			toast.error(getAxiosErrorMessage(error))
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddCalculator = () => {
		setSelectedCalculator(null);
		setIsFormOpen(true);
		setActiveTab('form');
	};

	const handleEditCalculator = (calculator: FertilizerCalculatorType) => {
		setSelectedCalculator(calculator);
		setIsFormOpen(true);
		setActiveTab('form');
	};

	const handleDeleteCalculator = async (id: number) => {
		try {
			await FertilizerService.deleteCalculator(id);
			toast.success('Fertilizer calculator deleted successfully');
			fetchCalculators();
		} catch (error) {
			toast.error(getAxiosErrorMessage(error))
		}
	};

	const handleFormSubmit = async (calculator: FertilizerCalculatorType) => {
		try {
			if (calculator.id) {
				await FertilizerService.updateCalculator(calculator.id, calculator);
				toast.success('Fertilizer calculator updated successfully');
			} else {
				await FertilizerService.createCalculator(calculator);
				toast.success('Fertilizer calculator created successfully');
			}
			setIsFormOpen(false);
			setActiveTab('list');
			fetchCalculators();
		} catch (error) {
			toast.error(getAxiosErrorMessage(error))
		}
	};

	const handleFormCancel = () => {
		setIsFormOpen(false);
		setActiveTab('list');
	};

	return (
		<Card className='w-full'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<div>
					<CardTitle className='text-2xl font-bold tracking-tight'>
						Fertilizer Calculator Management
					</CardTitle>
					<CardDescription>
						Manage your fertilizer calculator data
					</CardDescription>
				</div>
				<Button onClick={handleAddCalculator}>
					<Plus className='mr-2 h-4 w-4' />
					Add Crop
				</Button>
			</CardHeader>
			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className='mb-4'>
						<TabsTrigger value='list'>Crop List</TabsTrigger>
						<TabsTrigger value='form' disabled={!isFormOpen}>
							{selectedCalculator ? 'Edit Crop' : 'New Crop'}
						</TabsTrigger>
					</TabsList>
					<TabsContent value='list'>
						<FertilizerList
							calculators={calculators}
							isLoading={isLoading}
							onEdit={handleEditCalculator}
							onDelete={handleDeleteCalculator}
						/>
					</TabsContent>
					<TabsContent value='form'>
						{isFormOpen && (
							<FertilizerForm
								calculator={selectedCalculator}
								onSubmit={handleFormSubmit}
								onCancel={handleFormCancel}
							/>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
