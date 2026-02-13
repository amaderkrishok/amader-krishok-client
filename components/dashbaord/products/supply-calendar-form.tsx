'use client';

import type React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface SupplyCalendarFormProps {
	value?: {
		months: number[];
		description?: string;
	};
	onChange: (value: { months: number[]; description?: string }) => void;
}

export function SupplyCalendarForm({
	value,
	onChange,
}: SupplyCalendarFormProps) {
	const months = [
		{ id: 1, name: 'জানুয়ারি' },
		{ id: 2, name: 'ফেব্রুয়ারি' },
		{ id: 3, name: 'মার্চ' },
		{ id: 4, name: 'এপ্রিল' },
		{ id: 5, name: 'মে' },
		{ id: 6, name: 'জুন' },
		{ id: 7, name: 'জুলাই' },
		{ id: 8, name: 'আগস্ট' },
		{ id: 9, name: 'সেপ্টেম্বর' },
		{ id: 10, name: 'অক্টোবর' },
		{ id: 11, name: 'নভেম্বর' },
		{ id: 12, name: 'ডিসেম্বর' },
	];

	const selectedMonths = value?.months || [];

	const handleMonthToggle = (monthId: number) => {
		const newSelectedMonths = selectedMonths.includes(monthId)
			? selectedMonths.filter((id) => id !== monthId)
			: [...selectedMonths, monthId];

		onChange({
			months: newSelectedMonths,
			description: value?.description || '',
		});
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		onChange({
			months: selectedMonths,
			description: e.target.value,
		});
	};

	return (
		<div className='space-y-4'>
			<div>
				<Label className='mb-2 block'>উপলব্ধ মাস (ঐচ্ছিক)</Label>
				<p className='text-sm text-muted-foreground mb-3'>
					আপনার পণ্য বছরের কোন মাসগুলিতে উপলব্ধ থাকে তা নির্বাচন করুন। এটি
					সম্পূর্ণ ঐচ্ছিক।
				</p>
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
					{months.map((month) => (
						<div key={month.id} className='flex items-center space-x-2'>
							<Checkbox
								id={`month-${month.id}`}
								checked={selectedMonths.includes(month.id)}
								onCheckedChange={() => handleMonthToggle(month.id)}
							/>
							<Label
								htmlFor={`month-${month.id}`}
								className='text-sm font-normal cursor-pointer'
							>
								{month.name}
							</Label>
						</div>
					))}
				</div>
			</div>

			<div>
				<Label htmlFor='calendar-description'>বিবরণ (ঐচ্ছিক)</Label>
				<Textarea
					id='calendar-description'
					placeholder='পণ্যের উপলব্ধতা সম্পর্কে বিস্তারিত যোগ করুন... (ঐচ্ছিক)'
					value={value?.description || ''}
					onChange={handleDescriptionChange}
					className='mt-1'
				/>
				<p className='text-xs text-muted-foreground mt-1'>
					সরবরাহ ক্যালেন্ডার সম্পূর্ণ ঐচ্ছিক। আপনি চাইলে এটি খালি রাখতে পারেন।
				</p>
			</div>
		</div>
	);
}
