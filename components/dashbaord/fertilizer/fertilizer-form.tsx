'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { FertilizerCalculatorType } from '@/types/fertilizer';

interface FertilizerFormProps {
	calculator: FertilizerCalculatorType | null;
	onSubmit: (calculator: FertilizerCalculatorType) => void;
	onCancel: () => void;
}

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	// We'll handle the fertilizer amounts separately
});

export function FertilizerForm({
	calculator,
	onSubmit,
	onCancel,
}: FertilizerFormProps) {
	const [fertilizers, setFertilizers] = useState<
		{ name: string; amount: string }[]
	>(
		calculator
			? Object.entries(calculator.fertilizerAmounts).map(([name, amount]) => ({
					name,
					amount: amount.toString(),
			  }))
			: [{ name: '', amount: '' }]
	);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: calculator?.name || '',
		},
	});

	function onFormSubmit(values: z.infer<typeof formSchema>) {
		// Validate fertilizers
		const validFertilizers = fertilizers.filter(
			(f) => f.name.trim() !== '' && f.amount.trim() !== ''
		);
		if (validFertilizers.length === 0) {
			form.setError('root', {
				message: 'At least one fertilizer is required',
			});
			return;
		}

		// Convert fertilizers to the required format
		const fertilizerAmounts = validFertilizers.reduce(
			(acc, { name, amount }) => {
				acc[name] = Number.parseFloat(amount);
				return acc;
			},
			{} as Record<string, number>
		);

		onSubmit({
			id: calculator?.id,
			name: values.name,
			fertilizerAmounts,
		});
	}

	const addFertilizer = () => {
		setFertilizers([...fertilizers, { name: '', amount: '' }]);
	};

	const removeFertilizer = (index: number) => {
		setFertilizers(fertilizers.filter((_, i) => i !== index));
	};

	const updateFertilizer = (
		index: number,
		field: 'name' | 'amount',
		value: string
	) => {
		const updated = [...fertilizers];
		updated[index][field] = value;
		setFertilizers(updated);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onFormSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Crop Name</FormLabel>
							<FormControl>
								<Input placeholder='Enter crop name' {...field} />
							</FormControl>
							<FormDescription>
								The name of the crop for which fertilizer amounts will be
								calculated.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<h3 className='text-sm font-medium'>Fertilizer Amounts</h3>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={addFertilizer}
						>
							<Plus className='h-4 w-4 mr-2' />
							Add Fertilizer
						</Button>
					</div>

					{fertilizers.map((fertilizer, index) => (
						<Card className='p-0' key={index}>
							<CardContent className='p-2' >
								<div className='flex items-start gap-4'>
									<div className='flex-1'>
										<label
											htmlFor={`fertilizer-name-${index}`}
											className='text-sm font-medium'
										>
											Fertilizer Name
										</label>
										<Input
											id={`fertilizer-name-${index}`}
											value={fertilizer.name}
											onChange={(e) =>
												updateFertilizer(index, 'name', e.target.value)
											}
											placeholder='e.g., Urea'
											className='mt-1'
										/>
									</div>
									<div className='flex-1'>
										<label
											htmlFor={`fertilizer-amount-${index}`}
											className='text-sm font-medium'
										>
											Amount (grams)
										</label>
										<Input
											id={`fertilizer-amount-${index}`}
											type='number'
											value={fertilizer.amount}
											onChange={(e) =>
												updateFertilizer(index, 'amount', e.target.value)
											}
											placeholder='e.g., 250'
											className='mt-1'
										/>
									</div>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										className='mt-6'
										onClick={() => removeFertilizer(index)}
										disabled={fertilizers.length === 1}
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}

					{form.formState.errors.root && (
						<p className='text-sm font-medium text-destructive'>
							{form.formState.errors.root.message}
						</p>
					)}
				</div>

				<div className='flex justify-end space-x-2'>
					<Button variant='outline' type='button' onClick={onCancel}>
						Cancel
					</Button>
					<Button type='submit'>{calculator ? 'Update' : 'Create'} Crop</Button>
				</div>
			</form>
		</Form>
	);
}
