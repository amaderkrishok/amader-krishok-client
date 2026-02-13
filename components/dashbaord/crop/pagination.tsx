import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
	total: number;
	pageSize: number;
	siblingCount: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

export function Pagination({
	total,
	pageSize,
	siblingCount,
	currentPage,
	onPageChange,
}: PaginationProps) {
	const totalPages = Math.ceil(total / pageSize);

	const range = (start: number, end: number) => {
		const length = end - start + 1;
		return Array.from({ length }, (_, idx) => idx + start);
	};

	const paginationRange = React.useMemo(() => {
		const totalPageNumbers = siblingCount + 5;

		if (totalPageNumbers >= totalPages) {
			return range(1, totalPages);
		}

		const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
		const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

		const shouldShowLeftDots = leftSiblingIndex > 2;
		const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

		const firstPageIndex = 1;
		const lastPageIndex = totalPages;

		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = 3 + 2 * siblingCount;
			const leftRange = range(1, leftItemCount);

			return [...leftRange, '...', totalPages];
		}

		if (shouldShowLeftDots && !shouldShowRightDots) {
			const rightItemCount = 3 + 2 * siblingCount;
			const rightRange = range(totalPages - rightItemCount + 1, totalPages);
			return [firstPageIndex, '...', ...rightRange];
		}

		if (shouldShowLeftDots && shouldShowRightDots) {
			const middleRange = range(leftSiblingIndex, rightSiblingIndex);
			return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
		}
	}, [totalPages, siblingCount, currentPage]);

	return (
		<nav className='flex items-center space-x-2'>
			<Button
				variant='outline'
				size='icon'
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				<ChevronLeft className='h-4 w-4' />
				<span className='sr-only'>Previous page</span>
			</Button>
			{paginationRange?.map((pageNumber, index) => {
				if (pageNumber === '...') {
					return <span key={index}>...</span>;
				}

				return (
					<Button
						key={index}
						variant={pageNumber === currentPage ? 'default' : 'outline'}
						size='icon'
						onClick={() => onPageChange(pageNumber as number)}
					>
						{pageNumber}
					</Button>
				);
			})}
			<Button
				variant='outline'
				size='icon'
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				<ChevronRight className='h-4 w-4' />
				<span className='sr-only'>Next page</span>
			</Button>
		</nav>
	);
}
