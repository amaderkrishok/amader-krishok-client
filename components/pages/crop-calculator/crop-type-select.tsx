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
}

export function CropTypeSelect({
	value,
	onChange,
	language,
	cropData,
}: CropTypeSelectProps) {
	return (
		<div className='space-y-2 w-full'>
			<Label>
				<Sprout className='w-4 h-4 inline-block mr-2' />
				{language === 'bn' ? 'ফসলের ধরণ' : 'Crop Type'}
			</Label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className='w-full'>
					<SelectValue
						placeholder={
							language === 'bn' ? 'ফসল নির্বাচন করুন' : 'Select crop'
						}
					/>
				</SelectTrigger>
				<SelectContent>
					{cropData.map((crop) => (
						<SelectItem key={crop.value} value={crop.value}>
							{language === 'bn' ? crop.labelBn : crop.labelEn}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
