'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { VendorBanner } from './vendor-banner';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { Product, ProductFilters, PaginationMeta } from '@/types/product';
import { StoreStatus } from '@/types/product';
import { ProductCategoryType } from '@/types/product-category';
import { FilterButton } from './sidebar/filter-button';
import { FilterSidebar } from './sidebar/filter-sidebar';
import { ViewToggle } from './product/view-toggle';
import { ProductGrid } from './product/product-grid';
import { ProductList } from './product/product-list';
import { Pagination } from './product/product-pagination';
import { ProductService } from '@/services/product-service';
import { ProductCategoryService } from '@/services/product-category-service';
import { toast } from 'sonner';
import { debounce } from 'lodash'; // Make sure to install lodash if not already
import { useSession } from '@/components/providers/session-provider';

// Default filters values (for reset functionality)
const defaultFilters: ProductFilters = {
	categoryId: undefined,
	minPrice: 0,
	maxPrice: 100000, // Changed to 10000 BDT
	storeId: undefined,
	productType: undefined,
	page: 1,
	limit: 9,
};

export function MarketplaceContainer() {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<ProductCategoryType[]>([]);
	const [isLoading, setIsLoading] = useState(true); // Start as true to show loading on initial render
	const [initialLoadComplete, setInitialLoadComplete] = useState(false); // Track whether the first load is done
	const [isCategoriesLoading, setCategoriesLoading] = useState(false);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [filters, setFilters] = useState<ProductFilters>({ ...defaultFilters });
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const isMobile = useMediaQuery('(max-width: 768px)');
	const { isAuthenticated } = useSession();

	// Keep track of the current category name for display purposes
	const [currentCategoryName, setCurrentCategoryName] = useState<
		string | undefined
	>();

	// Pagination state
	const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
		itemsPerPage: 9,
		totalItems: 0,
		currentPage: 1,
		totalPages: 1,
	});

	// Load categories on component mount
	useEffect(() => {
		const fetchCategories = async () => {
			setCategoriesLoading(true);
			try {
				const response = await ProductCategoryService.getProductAllCategories();
				console.log(response.data);

				if (response && response.data) {
					// Filter out "All Products" and just use its children
					if (
						response.data.length > 0 &&
						response.data[0]?.name === 'All Products' &&
						response.data[0]?.children
					) {
						setCategories(response.data[0].children);
					} else {
						setCategories(response.data);
					}
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
				toast.error('বিভাগগুলি লোড করতে সমস্যা হয়েছে।');
				setCategories([]);
			} finally {
				setCategoriesLoading(false);
			}
		};

		fetchCategories();
	}, []);

	// Function to find category name by ID
	const findCategoryNameById = useCallback(
		(
			categoryId: number | undefined,
			cats: ProductCategoryType[]
		): string | undefined => {
			if (!categoryId) return undefined;

			// Recursive function to search through categories
			const findCategoryName = (
				id: number,
				categories: ProductCategoryType[],
				path: string = ''
			): string | undefined => {
				for (const cat of categories) {
					if (cat.id === id) {
						return path ? `${path} > ${cat.name}` : cat.name;
					}

					if (cat.children && cat.children.length > 0) {
						const childResult = findCategoryName(
							id,
							cat.children,
							path ? `${path} > ${cat.name}` : cat.name
						);
						if (childResult) return childResult;
					}
				}
				return undefined;
			};

			return findCategoryName(categoryId, cats);
		},
		[]
	);

	// Update current category name when filters change
	useEffect(() => {
		if (filters.categoryId) {
			const name = findCategoryNameById(filters.categoryId, categories);
			setCurrentCategoryName(name);
		} else {
			setCurrentCategoryName(undefined);
		}
	}, [filters.categoryId, categories, findCategoryNameById]);

	// Create debounced search handler with correct dependencies
	const debouncedFetchProducts = useMemo(
		() =>
			debounce(
				async (currentFilters: ProductFilters, currentSearchTerm: string) => {
					setIsLoading(true);
					try {
						// Prepare filters with search term
						const apiFilters = { ...currentFilters };
						if (currentSearchTerm) {
							apiFilters.name = currentSearchTerm;
						}

						const response = await ProductService.getProducts(apiFilters);

						// ADD THIS LOGGING BLOCK HERE:
						console.group('Product API Response Debug');
						console.log(`Search Term: "${currentSearchTerm || 'None'}"`);
						console.log(
							`Category ID: ${apiFilters.categoryId || 'All Categories'}`
						);
						console.log(`Products found: ${response?.data?.length || 0}`);
						console.log('Pagination meta:', response?.meta);
						console.log('Raw API response:', response);
						console.groupEnd();

						if (response && response.data) {
							const allProducts: Product[] = response.data;
							const approvedProducts = allProducts.filter(
								(p) => p.store?.status === StoreStatus.APPROVED
							);
							setProducts(approvedProducts);
						}

						if (response && response.data) {
							// If the API returns no products, force totalItems to 0 regardless of what meta says
							const approvedProductsCount = (response.data as Product[]).filter(
								(p) => p.store?.status === StoreStatus.APPROVED
							).length;

							setPaginationMeta({
								itemsPerPage:
									response.meta?.itemsPerPage || apiFilters.limit || 9,
								totalItems:
									approvedProductsCount > 0
										? response.meta?.totalItems || approvedProductsCount
										: 0,
								currentPage: response.meta?.currentPage || 1,
								totalPages:
									approvedProductsCount > 0
										? response.meta?.totalPages || 1
										: 0,
							});

							// Log the discrepancy if there is one
							if (
								response.meta &&
								response.meta.totalItems !== approvedProductsCount
							) {
								console.warn('Product count mismatch!', {
									apiReportedCount: response.meta.totalItems,
									actualProductCount: approvedProductsCount,
								});
							}
						}
					} catch (error) {
						console.error('Error fetching products:', error);
						toast.error('পণ্যসমূহ লোড করতে সমস্যা হয়েছে।');

						// Clear products on error
						setProducts([]);
						setPaginationMeta({
							itemsPerPage: currentFilters.limit || 9,
							totalItems: 0,
							currentPage: 1,
							totalPages: 0,
						});
					} finally {
						setIsLoading(false);
						setInitialLoadComplete(true); // Mark that initial loading is complete
					}
				},
				500
			), // 500ms debounce
		[]
	);

	// Fetch products based on filters with debounce
	useEffect(() => {
		debouncedFetchProducts(filters, searchTerm);
		// Cleanup function
		return () => {
			debouncedFetchProducts.cancel();
		};
	}, [filters, searchTerm, debouncedFetchProducts]);

	const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
		// Reset to page 1 when filters change (except when explicitly changing page)
		if (!('page' in newFilters)) {
			newFilters.page = 1;
		}
		setFilters((prev) => ({ ...prev, ...newFilters }));
	};

	const handleCategoryClick = (categoryId: number | undefined) => {
		handleFilterChange({ categoryId });
	};

	const handlePriceRangeChange = (minPrice: number, maxPrice: number) => {
		handleFilterChange({ minPrice, maxPrice });
	};

	const handlePageChange = (page: number) => {
		handleFilterChange({ page });
		// Scroll to top when changing pages
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const toggleMobileFilter = () => {
		setIsMobileFilterOpen(!isMobileFilterOpen);
	};

	const handleSidebarSearch = (term: string) => {
		setSearchTerm(term);
	};

	const handleResetFilters = () => {
		// Reset all filters to defaults but keep the current page size
		const limit = filters.limit || defaultFilters.limit;
		setFilters({ ...defaultFilters, limit });
		setSearchTerm('');
	};

	return (
		<div className='min-h-screen pb-8'>
			<div className='container mx-auto px-4 py-8'>
				{!isAuthenticated && <VendorBanner />}

				<div className='flex flex-col md:flex-row gap-8 mt-8'>
					{/* Mobile filter button */}
					{isMobile && (
						<div className='flex justify-between items-center mb-4'>
							<h1 className='text-2xl font-bold'>কৃষকের বাজার</h1>
							<FilterButton onClick={toggleMobileFilter} />
						</div>
					)}

					{/* Sidebar - fixed on desktop, modal on mobile */}
					<div
						className={`${
							isMobile
								? isMobileFilterOpen
									? 'fixed inset-0 z-50 bg-black/50'
									: 'hidden'
								: 'block'
						} md:w-1/4`}
					>
						<div
							className={`${
								isMobile
									? 'absolute right-0 top-0 h-full w-80 max-w-full transform transition-transform duration-300 ease-in-out bg-white'
									: 'sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto'
							} ${
								isMobileFilterOpen
									? 'translate-x-0'
									: 'translate-x-full md:translate-x-0'
							}`}
						>
							<FilterSidebar
								categories={categories}
								selectedCategoryId={filters.categoryId}
								onCategoryClick={handleCategoryClick}
								priceRange={{
									min: filters.minPrice || 0,
									max: filters.maxPrice || 100000, // Max 10000 BDT
								}}
								onPriceRangeChange={handlePriceRangeChange}
								onClose={isMobile ? toggleMobileFilter : undefined}
								alwaysOpenParent={true}
								isLoading={isCategoriesLoading}
								searchTerm={searchTerm}
								onSearchChange={handleSidebarSearch}
								onResetFilters={handleResetFilters}
							/>
						</div>
					</div>

					{/* Main content */}
					<div className='w-full md:w-3/4'>
						{!isMobile && (
							<h1 className='text-2xl font-bold mb-6'>কৃষকের বাজার</h1>
						)}

						<div className='flex justify-between items-center mb-6'>
							<p className='text-gray-600'>
								{isLoading
									? 'লোড হচ্ছে...'
									: products.length > 0
									? `${products.length} টি পণ্য পাওয়া গেছে`
									: 'কোন পণ্য পাওয়া যায়নি'}
							</p>
							<ViewToggle currentView={viewMode} onViewChange={setViewMode} />
						</div>

						{/* Always render Grid or List component to show loading states properly */}
						{viewMode === 'grid' ? (
							<ProductGrid products={products} isLoading={isLoading} />
						) : (
							<ProductList products={products} isLoading={isLoading} />
						)}

						{/* Pagination - only show if we have products and more than 1 page */}
						{paginationMeta.totalPages > 1 && products.length > 0 && (
							<div className='mt-8'>
								<Pagination
									currentPage={paginationMeta.currentPage}
									totalPages={paginationMeta.totalPages}
									onPageChange={handlePageChange}
								/>
							</div>
						)}

						{/* No products found message - only show when both:
                            1. Not currently loading AND
                            2. Initial load has completed AND
                            3. No products found
                        */}
						{!isLoading && initialLoadComplete && products.length === 0 && (
							<div className='text-center py-12'>
								<p className='text-xl text-gray-600'>
									{searchTerm ? (
										<>
											<span className='font-semibold'>
												&quot;{searchTerm}&quot;
											</span>
											{currentCategoryName
												? ` ${currentCategoryName} বিভাগে পাওয়া যায়নি`
												: ` এর কোন পণ্য পাওয়া যায়নি`}
										</>
									) : currentCategoryName ? (
										`${currentCategoryName} বিভাগে কোন পণ্য পাওয়া যায়নি`
									) : (
										'কোন পণ্য পাওয়া যায়নি'
									)}
								</p>
								<p className='text-gray-500 mt-2'>
									অনুসন্ধান বাক্য বা ফিল্টার পরিবর্তন করে দেখুন
								</p>
								<Button
									variant='outline'
									className='mt-4'
									onClick={handleResetFilters}
								>
									ফিল্টার রিসেট করুন
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// Simple button component for the "No products found" section
function Button({
	children,
	variant = 'default',
	className = '',
	onClick,
}: {
	children: React.ReactNode;
	variant?: 'default' | 'outline';
	className?: string;
	onClick?: () => void;
}) {
	const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
	const variantClasses =
		variant === 'outline'
			? 'border border-gray-300 hover:bg-gray-50'
			: 'bg-green-600 text-white hover:bg-green-700';

	return (
		<button
			className={`${baseClasses} ${variantClasses} ${className}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
