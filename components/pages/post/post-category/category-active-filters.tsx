import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface CategoryActiveFiltersProps {
	searchTerm: string;
	clearAllFilters: () => void;
}

export function CategoryActiveFilters({
	searchTerm,
	clearAllFilters,
}: CategoryActiveFiltersProps) {
	return (
		<div className='flex flex-wrap gap-2 mb-6'>
			<Badge variant='secondary' className='flex items-center gap-1'>
				Search: {searchTerm}
				<button
					onClick={clearAllFilters}
					className='ml-1 hover:bg-gray-300/20 rounded-full p-1'
				>
					<X className='h-3 w-3' />
				</button>
			</Badge>
		</div>
	);
}
