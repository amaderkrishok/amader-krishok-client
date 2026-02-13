'use client';

import { useState, useEffect } from 'react';
import { StoreGrid } from './store-grid';
import { StoreService } from '@/services/store-service';
import type { PaginatedResponse, Store } from '@/types/store';

import { Pagination } from '../product/product-pagination';

interface StoresContainerProps {
	initialStores: Store[];
	initialMeta: {
		itemsPerPage: number;
		totalItems: number;
		currentPage: number;
		totalPages: number;
	};
}

export function StoresContainer({
	initialStores,
	initialMeta,
}: StoresContainerProps) {
	const [stores, setStores] = useState<Store[]>(initialStores);
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [currentPage, setCurrentPage] = useState(initialMeta.currentPage);
	const [totalPages, setTotalPages] = useState(initialMeta.totalPages);

	useEffect(() => {
		const fetchStores = async () => {
			if (currentPage === initialMeta.currentPage) return;

			setIsLoading(true);
			setHasError(false);

			try {
				const response: PaginatedResponse<Store> = await StoreService.getStores({
					page: currentPage
				});

				if (response && response.data) {
					setStores(response.data);
					setTotalPages(response.meta?.totalPages || 1);
				}
			} catch (error) {
				console.error('Error fetching stores:', error);
				setHasError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStores();
	}, [currentPage, initialMeta.currentPage, initialMeta.itemsPerPage]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Show error message
	if (hasError) {
		return (
			<div className='text-center py-12'>
				<p className='text-xl text-red-600'>দোকান লোড করতে সমস্যা হয়েছে</p>
				<button
					onClick={() => setCurrentPage(currentPage)}
					className='mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
				>
					আবার চেষ্টা করুন
				</button>
			</div>
		);
	}

	// Show empty state when no stores and not loading
	if (stores.length === 0 && !isLoading) {
		return (
			<div className='text-center py-12'>
				<p className='text-xl text-gray-600'>কোন দোকান পাওয়া যায়নি</p>
				<p className='text-gray-500 mt-2'>পরে আবার চেষ্টা করুন</p>
			</div>
		);
	}

	return (
		<>
			<StoreGrid stores={stores} isLoading={isLoading} />

			{totalPages > 1 && (
				<div className='mt-8'>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</div>
			)}
		</>
	);
}
