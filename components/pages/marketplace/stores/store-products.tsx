'use client';

import { useState, useEffect } from 'react';
import type { Product, PaginatedResponse } from '@/types/product';
import { ProductService } from '@/services/product-service';
import { ProductGrid } from '../product/product-grid';
import { Pagination } from '../product/product-pagination';

interface StoreProductsProps {
	storeId: string;
	initialProducts: Product[];
	initialMeta?: {
		itemsPerPage: number;
		totalItems: number;
		currentPage: number;
		totalPages: number;
	};
}

export function StoreProducts({
	storeId,
	initialProducts,
	initialMeta,
}: StoreProductsProps) {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(initialMeta?.currentPage || 1);
	const [totalPages, setTotalPages] = useState(initialMeta?.totalPages || 1);
	const [totalItems, setTotalItems] = useState(
		initialMeta?.totalItems || initialProducts.length
	);
	const itemsPerPage = initialMeta?.itemsPerPage || 12;

	// Use initialMeta if available, otherwise calculate from products array
	useEffect(() => {
		if (!initialMeta) {
			setTotalItems(initialProducts.length);
			setTotalPages(
				Math.max(1, Math.ceil(initialProducts.length / itemsPerPage))
			);
		}
	}, [initialProducts, initialMeta, itemsPerPage]);

	useEffect(() => {
		const fetchProducts = async () => {
			// Only fetch if we're not on the initial page or if we've changed pages after initial load
			if (currentPage === 1 && initialProducts.length > 0) return;

			setIsLoading(true);
			try {
				const response: PaginatedResponse<Product> =
					await ProductService.getProductsByStore(
						storeId,
						currentPage,
						itemsPerPage
					);

				if (response && response.data) {
					setProducts(response.data);
					if (response.meta) {
						setTotalPages(response.meta.totalPages || 1);
						setTotalItems(response.meta.totalItems || response.data.length);
					}
				}
			} catch (error) {
				console.error('Error fetching store products:', error);
				// Show error state but keep existing products
			} finally {
				setIsLoading(false);
			}
		};

		fetchProducts();
	}, [currentPage, storeId, itemsPerPage, initialProducts.length]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Error state when no products
	if (products.length === 0 && !isLoading) {
		return (
			<div className='text-center py-12'>
				<h3 className='text-lg font-medium text-gray-900'>
					কোন পণ্য পাওয়া যায়নি
				</h3>
				<p className='mt-2 text-sm text-gray-500'>
					এই দোকানে এখনও কোন পণ্য যোগ করা হয়নি।
				</p>
			</div>
		);
	}

	return (
		<>
			<ProductGrid products={products} isLoading={isLoading} />

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
