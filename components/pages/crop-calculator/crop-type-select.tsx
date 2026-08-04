'use client';

import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Sprout } from 'lucide-react';

interface CropTypeSelectProps {
	value: string;
	onChange: (value: string) => void;
	language: 'en' | 'bn';
	cropData: { value: string; labelEn: string; labelBn: string }[];
	error?: string;
}

export function CropTypeSelect({
	value,
	onChange,
	language,
	cropData,
	error,
}: CropTypeSelectProps) {
	return (
		<div className='space-y-2 w-full'>
			<Label className='text-[#2A351F] font-semibold text-base flex items-center gap-2 mb-2'>
				<div className='w-7 h-7 rounded-lg bg-[#4CAF50]/15 text-[#2E7D32] flex items-center justify-center'>
					<Sprout className='w-4 h-4' />
				</div>
				{language === 'bn' ? 'ফসলের ধরন' : 'Crop Type'}
			</Label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger 
					className={`w-full h-[58px] rounded-[16px] bg-white border ${
						error ? 'border-red-500 focus:ring-red-200' : 'border-[#E5E7EB] hover:border-gray-300 focus:border-[#4CAF50] focus:ring-4 focus:ring-[#4CAF50]/12'
					} transition-all px-4 text-base font-medium text-gray-800 focus:outline-none shadow-xs`}
				>
					<SelectValue
						placeholder={
							language === 'bn' ? 'ফসল নির্বাচন করুন' : 'Select crop'
						}
					/>
				</SelectTrigger>
				<SelectContent className='rounded-[16px] border border-gray-100 shadow-xl bg-white p-2 max-h-[300px] z-50'>
					{cropData.map((crop) => (
						<SelectItem 
							key={crop.value} 
							value={crop.value}
							className='rounded-[10px] py-3 px-4 text-base cursor-pointer focus:bg-[#4CAF50]/10 focus:text-[#2E7D32] data-[state=checked]:bg-[#2E7D32] data-[state=checked]:text-white font-medium my-0.5 transition-colors'
						>
							{language === 'bn' ? crop.labelBn : crop.labelEn}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{error && (
				<p className='text-red-500 text-sm font-medium pl-1'>{error}</p>
			)}
		</div>
	);
}
