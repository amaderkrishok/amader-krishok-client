'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function WeatherHeader() {
	return (
		<header className='flex items-center justify-between'>
			<div className='flex items-center gap-4'>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4' />
					<Input
						placeholder='Search city or postcode'
						className='pl-10 bg-gray-100 border-gray-200'
					/>
				</div>
				<Button>Search</Button>
			</div>
		</header>
	);
}
