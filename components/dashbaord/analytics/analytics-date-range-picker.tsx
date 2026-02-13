'use client';

import * as React from 'react';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { useAnalyticsDateRange } from './analytics-date-range-context';

export function AnalyticsDateRangePicker() {
	const { range, setRange } = useAnalyticsDateRange();

	return (
		<Select
			value={range}
			onValueChange={(v) => setRange(v as '7d' | '30d' | '90d')}
		>
			<SelectTrigger
				className='w-[160px] rounded-lg'
				aria-label='Select date range'
			>
				<SelectValue placeholder='Date Range' />
			</SelectTrigger>
			<SelectContent className='rounded-xl'>
				<SelectItem value='7d' className='rounded-lg'>
					Last 7 days
				</SelectItem>
				<SelectItem value='30d' className='rounded-lg'>
					Last 30 days
				</SelectItem>
				<SelectItem value='90d' className='rounded-lg'>
					Last 90 days
				</SelectItem>
			</SelectContent>
		</Select>
	);
}
