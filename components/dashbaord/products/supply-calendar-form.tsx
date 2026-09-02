'use client';

import type React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Check } from 'lucide-react';

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
		<div className='space-y-5'>
			<div>
				<div className='flex items-center gap-2 mb-1'>
					<Calendar className='w-4 h-4 text-[#F5B800]' />
					<Label className='text-xs sm:text-sm font-extrabold text-[#172033]'>
						সরবরাহ ক্যালেন্ডার (ঐচ্ছিক)
					</Label>
				</div>
				<p className='text-xs text-[#64748B] font-medium mb-4'>
					পণ্যটি বছরের কোন কোন মাসে উপলব্ধ থাকে তা নির্বাচন করুন।
				</p>

				{/* 9. Month Selectable Chips Grid */}
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5'>
					{months.map((month) => {
						const isSelected = selectedMonths.includes(month.id);
						return (
							<button
								type='button'
								key={month.id}
								onClick={() => handleMonthToggle(month.id)}
								className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
									isSelected
										? 'bg-[#F5B800] text-[#172033] border-[#F5B800] shadow-xs'
										: 'bg-white text-[#64748B] border-[#E5E7EB] hover:bg-[#FFF9E8] hover:text-[#172033] hover:border-[#F5B800]/40'
								}`}
							>
								<span>{month.name}</span>
								{isSelected && <Check className='w-3.5 h-3.5 text-[#172033] flex-shrink-0' />}
							</button>
						);
					})}
				</div>
			</div>

			{/* 10. Seasonal Description */}
			<div className='pt-2 space-y-2 border-t border-[#E5E7EB]'>
				<Label htmlFor='calendar-description' className='text-xs font-extrabold text-[#172033]'>
					সরবরাহ সম্পর্কে (ঐচ্ছিক)
				</Label>
				<Textarea
					id='calendar-description'
					placeholder='পণ্যের সরবরাহ সম্পর্কে বিস্তারিত যোগ করুন... (ঐচ্ছিক)'
					value={value?.description || ''}
					onChange={handleDescriptionChange}
					className='min-h-[110px] rounded-xl border-[#E5E7EB] text-xs font-medium focus-visible:ring-1 focus-visible:ring-[#F5B800] bg-white placeholder:text-[#64748B]'
				/>
				<p className='text-[11px] text-[#64748B] font-medium'>
					সরবরাহ ক্যালেন্ডার সম্পূর্ণ ঐচ্ছিক। আপনি চাইলে এটি খালি রাখতে পারেন।
				</p>
			</div>
		</div>
	);
}
