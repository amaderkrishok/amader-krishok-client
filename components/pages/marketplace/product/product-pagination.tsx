'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useEffect } from 'react';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	maxVisiblePages?: number;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	maxVisiblePages = 5,
}: PaginationProps) {
	// Add debug logging to help track pagination issues
	useEffect(() => {
		console.log('Pagination Component Debug:', {
			currentPage,
			totalPages,
			shouldRender: totalPages > 1,
		});
	}, [currentPage, totalPages]);

	// Don't render pagination if there's only one page
	// This is the key fix - ensuring we don't show pagination when it's not needed
	if (!totalPages || totalPages <= 1) {
		console.log('Pagination not rendered: totalPages <= 1');
		return null;
	}

	// Sanitize inputs for safety
	const sanitizedCurrentPage = Math.max(
		1,
		Math.min(currentPage || 1, totalPages)
	);
	const sanitizedTotalPages = Math.max(1, totalPages);

	// Calculate the range of page numbers to display
	const getPageNumbers = () => {
		const pageNumbers = [];

		// Always show first page
		pageNumbers.push(1);

		// Calculate start and end of the middle section
		let startPage = Math.max(
			2,
			sanitizedCurrentPage - Math.floor(maxVisiblePages / 2)
		);
		let endPage = Math.min(
			sanitizedTotalPages - 1,
			startPage + maxVisiblePages - 3
		);

		// Adjust if we're near the end
		if (endPage <= startPage) {
			endPage = Math.min(sanitizedTotalPages - 1, startPage + 1);
		}

		// Adjust if we're near the beginning
		if (startPage <= 2) {
			startPage = 2;
			endPage = Math.min(
				sanitizedTotalPages - 1,
				startPage + maxVisiblePages - 3
			);
		}

		// Add ellipsis after first page if needed
		if (startPage > 2) {
			pageNumbers.push('ellipsis-start');
		}

		// Add middle pages
		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}

		// Add ellipsis before last page if needed
		if (endPage < sanitizedTotalPages - 1) {
			pageNumbers.push('ellipsis-end');
		}

		// Only add last page if it's different from the first page
		// This is another key fix - don't duplicate page 1 as the "last page"
		if (sanitizedTotalPages > 1) {
			pageNumbers.push(sanitizedTotalPages);
		}

		return pageNumbers;
	};

	const pageNumbers = getPageNumbers();

	// Additional validation to ensure we don't render empty pagination
	if (pageNumbers.length <= 1) {
		console.log('Pagination not rendered: not enough pages to show');
		return null;
	}

	return (
		<nav
			className='flex justify-center items-center space-x-2'
			aria-label='Pagination'
		>
			{/* Previous button */}
			<Button
				variant='outline'
				size='icon'
				onClick={() => onPageChange(sanitizedCurrentPage - 1)}
				disabled={sanitizedCurrentPage === 1}
				aria-label='Go to previous page'
			>
				<ChevronLeft className='h-4 w-4' />
			</Button>

			{/* Page numbers */}
			<div className='flex items-center space-x-2'>
				{pageNumbers.map((page, index) => {
					if (page === 'ellipsis-start' || page === 'ellipsis-end') {
						return (
							<div
								key={`ellipsis-${index}`}
								className='flex items-center justify-center w-9 h-9'
							>
								<MoreHorizontal className='h-4 w-4 text-gray-400' />
							</div>
						);
					}

					const pageNum = page as number;
					return (
						<Button
							key={pageNum}
							variant={sanitizedCurrentPage === pageNum ? 'default' : 'outline'}
							size='icon'
							onClick={() => onPageChange(pageNum)}
							aria-label={`Go to page ${pageNum}`}
							aria-current={
								sanitizedCurrentPage === pageNum ? 'page' : undefined
							}
							className='w-9 h-9'
						>
							{pageNum}
						</Button>
					);
				})}
			</div>

			{/* Next button */}
			<Button
				variant='outline'
				size='icon'
				onClick={() => onPageChange(sanitizedCurrentPage + 1)}
				disabled={sanitizedCurrentPage === sanitizedTotalPages}
				aria-label='Go to next page'
			>
				<ChevronRight className='h-4 w-4' />
			</Button>
		</nav>
	);
}
