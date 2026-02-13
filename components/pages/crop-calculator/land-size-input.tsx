'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin } from 'lucide-react';

interface LandSizeInputProps {
	value: string;
	unit: 'shatak' | 'bigha';
	onChange: (value: string, unit: 'shatak' | 'bigha') => void;
	language: 'en' | 'bn';
}

export function LandSizeInput({
	value,
	unit,
	onChange,
	language,
}: LandSizeInputProps) {
	return (
		<div className='space-y-2'>
			<Label>
				<MapPin className='w-4 h-4 inline-block mr-2' />
				{language === 'bn' ? 'জমির পরিমাণ' : 'Land Size'}
			</Label>
			<div className='flex items-center space-x-4'>
				<Input
					type='number'
					value={value}
					onChange={(e) => onChange(e.target.value, unit)}
					placeholder={language === 'bn' ? 'পরিমাণ লিখুন' : 'Enter size'}
					className='flex-1'
				/>
				<RadioGroup
					value={unit}
					onValueChange={(value) =>
						onChange(value, value as 'shatak' | 'bigha')
					}
					className='flex space-x-2'
				>
					<div className='flex items-center space-x-1'>
						<RadioGroupItem value='shatak' id='shatak' />
						<Label htmlFor='shatak'>
							{language === 'bn' ? 'শতাংশ' : 'Shatak'}
						</Label>
					</div>
					<div className='flex items-center space-x-1'>
						<RadioGroupItem value='bigha' id='bigha' />
						<Label htmlFor='bigha'>
							{language === 'bn' ? 'বিঘা' : 'Bigha'}
						</Label>
					</div>
				</RadioGroup>
			</div>
		</div>
	);
}
