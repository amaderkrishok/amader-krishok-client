'use client';

import { Button } from '@/components/ui/button';

interface NoPostsFoundProps {
	clearAllFilters: () => void;
}

export function NoPostsFound({ clearAllFilters }: NoPostsFoundProps) {
	return (
		<div className='py-16 text-center'>
			<h3 className='text-xl font-medium mb-2'>No posts found</h3>
			<p className='text-gray-500 mb-6'>Try adjusting your filter criteria</p>
			<Button variant='outline' onClick={clearAllFilters}>
				Clear all filters
			</Button>
		</div>
	);
}
