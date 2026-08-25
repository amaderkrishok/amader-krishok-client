import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OrderPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function OrderPagination({
	currentPage,
	totalPages,
	onPageChange,
}: OrderPaginationProps) {
	const generatePageNumbers = () => {
		const pages: (number | string)[] = [];
		pages.push(1);

		const rangeStart = Math.max(2, currentPage - 1);
		const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

		if (rangeStart > 2) {
			pages.push('...');
		}

		for (let i = rangeStart; i <= rangeEnd; i++) {
			pages.push(i);
		}

		if (rangeEnd < totalPages - 1) {
			pages.push('...');
		}

		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	};

	const pages = generatePageNumbers();

	return (
		<div className='flex items-center justify-center gap-1.5 pt-2'>
			<Button
				variant='outline'
				size='icon'
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage <= 1}
				className='h-8 w-8 rounded-xl border-[#E5E7EB] text-xs font-bold'
			>
				<ChevronLeft className='h-4 w-4 text-[#172033]' />
			</Button>

			{pages.map((page, index) =>
				page === '...' ? (
					<span key={`ellipsis-${index}`} className='px-1.5 text-xs text-[#64748B] font-bold'>
						...
					</span>
				) : (
					<Button
						key={`page-${page}`}
						variant={currentPage === page ? 'default' : 'outline'}
						size='sm'
						onClick={() => typeof page === 'number' && onPageChange(page)}
						className={`h-8 w-8 rounded-xl text-xs font-bold ${
							currentPage === page
								? 'bg-[#F5B800] text-[#172033] hover:bg-[#E0A800] border-0 shadow-xs'
								: 'border-[#E5E7EB] text-[#172033] hover:bg-[#FFF9E8]'
						}`}
					>
						{page}
					</Button>
				)
			)}

			<Button
				variant='outline'
				size='icon'
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= totalPages}
				className='h-8 w-8 rounded-xl border-[#E5E7EB] text-xs font-bold'
			>
				<ChevronRight className='h-4 w-4 text-[#172033]' />
			</Button>
		</div>
	);
}