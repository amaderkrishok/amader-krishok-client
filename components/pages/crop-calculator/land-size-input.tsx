'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface LandSizeInputProps {
	value: string;
	unit: 'shatak' | 'bigha';
	onChange: (value: string, unit: 'shatak' | 'bigha') => void;
	language: 'en' | 'bn';
	error?: string;
}

export function LandSizeInput({
	value,
	unit,
	onChange,
	language,
	error,
}: LandSizeInputProps) {
	return (
		<div className='space-y-2 w-full'>
			<Label className='text-[#2A351F] font-semibold text-base flex items-center gap-2 mb-2'>
				<div className='w-7 h-7 rounded-lg bg-[#4CAF50]/15 text-[#2E7D32] flex items-center justify-center'>
					<MapPin className='w-4 h-4' />
				</div>
				{language === 'bn' ? 'জমির পরিমাণ' : 'Land Size'}
			</Label>

			<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
				{/* Input box */}
				<div className='relative flex-1'>
					<Input
						type='number'
						value={value}
						onChange={(e) => onChange(e.target.value, unit)}
						placeholder={language === 'bn' ? 'জমির পরিমাণ লিখুন (যেমন: ৫০)' : 'Enter land size (e.g. 50)'}
						className={`w-full h-[58px] rounded-[16px] bg-white border ${
							error ? 'border-red-500 focus:ring-red-200' : 'border-[#E5E7EB] hover:border-gray-300 focus:border-[#4CAF50] focus:ring-4 focus:ring-[#4CAF50]/12'
						} transition-all px-4 text-base font-medium text-gray-800 placeholder:text-gray-400 shadow-xs`}
					/>
				</div>

				{/* Segmented Toggle Control */}
				<div className='bg-[#F5F5F5] p-1.5 rounded-[16px] flex h-[58px] items-center gap-1 border border-gray-200/70 shrink-0 min-w-[200px]'>
					<button
						type='button'
						onClick={() => onChange(value, 'shatak')}
						className={`flex-1 h-full rounded-[12px] text-sm font-semibold transition-all duration-300 flex items-center justify-center cursor-pointer ${
							unit === 'shatak'
								? 'bg-[#2A351F] text-white shadow-sm scale-[1.02]'
								: 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
						}`}
					>
						{language === 'bn' ? 'শতাংশ' : 'Shatak'}
					</button>
					<button
						type='button'
						onClick={() => onChange(value, 'bigha')}
						className={`flex-1 h-full rounded-[12px] text-sm font-semibold transition-all duration-300 flex items-center justify-center cursor-pointer ${
							unit === 'bigha'
								? 'bg-[#2A351F] text-white shadow-sm scale-[1.02]'
								: 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
						}`}
					>
						{language === 'bn' ? 'বিঘা' : 'Bigha'}
					</button>
				</div>
			</div>

			{error && (
				<p className='text-red-500 text-sm font-medium pl-1'>{error}</p>
			)}
		</div>
	);
}
