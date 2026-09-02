'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Product, PaginatedResponse } from '@/types/product';
import { ProductService } from '@/services/product-service';
import { ProductGrid } from '../product/product-grid';
import { Pagination } from '../product/product-pagination';
import { PackageX, SlidersHorizontal } from 'lucide-react';

interface StoreProductsProps {
  storeId: string;
  storeName?: string;
  initialProducts: Product[];
  initialMeta?: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
}

const CATEGORY_TABS = ['সব পণ্য', 'সবজি', 'ফল', 'মাছ', 'শস্য', 'সার ও উপকরণ'];

export function StoreProducts({
  storeId,
  storeName = 'দোকান',
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

  // Filter & Sorting State
  const [selectedCategory, setSelectedCategory] = useState<string>('সব পণ্য');
  const [sortOption, setSortOption] = useState<string>('popular');

  // Use initialMeta if available
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

  // Filtered & Sorted Products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'সব পণ্য') {
      result = result.filter((p) => {
        if (!p.productCategories || p.productCategories.length === 0) return false;
        return p.productCategories.some((cat) =>
          cat.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          selectedCategory.toLowerCase().includes(cat.name.toLowerCase())
        );
      });
    }

    // Sort Products
    if (sortOption === 'price-low') {
      result.sort((a, b) => {
        const pA = Number(a.simpleProduct?.price || a.variableProduct?.variants?.[0]?.price || 0);
        const pB = Number(b.simpleProduct?.price || b.variableProduct?.variants?.[0]?.price || 0);
        return pA - pB;
      });
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => {
        const pA = Number(a.simpleProduct?.price || a.variableProduct?.variants?.[0]?.price || 0);
        const pB = Number(b.simpleProduct?.price || b.variableProduct?.variants?.[0]?.price || 0);
        return pB - pA;
      });
    } else if (sortOption === 'newest') {
      result.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id || 0);
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id || 0);
        return timeB - timeA;
      });
    }

    return result;
  }, [products, selectedCategory, sortOption]);

  return (
    <div className='space-y-6'>
      {/* 6. PRODUCT SECTION HEADER & CATEGORY FILTERS */}
      <div className='space-y-4 pt-2'>
        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight'>
              {storeName} এর পণ্যসমূহ
            </h2>
            <p className='text-sm text-[#667085] mt-1 font-medium'>
              এই দোকানের তাজা ও মানসম্মত পণ্যগুলো দেখুন।
            </p>
          </div>

          {/* Sorting Control */}
          <div className='flex items-center gap-2 flex-shrink-0'>
            <SlidersHorizontal className='w-4 h-4 text-[#667085]' />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className='bg-white border border-[#E5E7EB] text-[#172033] text-sm font-semibold rounded-xl px-4 py-2.5 outline-none focus:border-[#28321A] cursor-pointer shadow-xs transition-all'
            >
              <option value='popular'>জনপ্রিয়তা ▼</option>
              <option value='price-low'>কম দাম থেকে বেশি</option>
              <option value='price-high'>বেশি দাম থেকে কম</option>
              <option value='newest'>নতুন পণ্য</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills (Horizontally Scrollable) */}
        <div className='flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide pt-1'>
          {CATEGORY_TABS.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#28321A] text-white border-[#28321A] shadow-md shadow-[#28321A]/20 scale-102'
                    : 'bg-white text-[#172033] border-[#E5E7EB] hover:bg-[#FFF9E8] hover:border-[#F4B400]/40'
                }`}
              >
                {isActive && <span className='w-1.5 h-1.5 rounded-full bg-[#F4B400]' />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 10. SHOP EMPTY STATE OR PRODUCT GRID */}
      {processedProducts.length === 0 && !isLoading ? (
        <div className='text-center py-16 px-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs max-w-lg mx-auto my-6'>
          <div className='w-20 h-20 bg-[#FFF9E8] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F4B400]/30 shadow-inner'>
            <PackageX className='w-10 h-10 text-[#28321A]' />
          </div>
          <h3 className='text-xl font-bold text-[#172033] mb-2'>
            এই দোকানে এখনো কোনো পণ্য নেই
          </h3>
          <p className='text-sm text-[#667085] leading-relaxed font-medium'>
            দোকানটি নতুন পণ্য যোগ করলে এখানে দেখা যাবে। অন্যান্য ফিল্টার বেছে দেখতে পারেন।
          </p>
        </div>
      ) : (
        <>
          {/* 7, 8, 9. PRODUCT GRID */}
          <ProductGrid products={processedProducts} isLoading={isLoading} />

          {totalPages > 1 && (
            <div className='mt-8 pt-4'>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
