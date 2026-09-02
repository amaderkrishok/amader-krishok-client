'use client';

import { useState, useMemo } from 'react';
import { useSavedProducts } from '@/context/saved-products-context';
import { ProductGrid } from '@/components/pages/marketplace/product/product-grid';
import { Bookmark, ShoppingBag, Search, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SavedProductsPage() {
	const { savedProducts } = useSavedProducts();
	const [selectedCategory, setSelectedCategory] = useState<string>('সব পণ্য');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [sortBy, setSortBy] = useState<string>('recent');

	// Filtered & Sorted saved products
	const processedProducts = useMemo(() => {
		let result = [...savedProducts];

		// Filter by search
		if (searchTerm.trim()) {
			result = result.filter((p) =>
				p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.description?.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Filter by category
		if (selectedCategory !== 'সব পণ্য') {
			result = result.filter((p) => {
				if (!p.productCategories || p.productCategories.length === 0) return false;
				return p.productCategories.some((cat) =>
					cat.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
					selectedCategory.toLowerCase().includes(cat.name.toLowerCase())
				);
			});
		}

		// Sort products
		if (sortBy === 'price-low') {
			result.sort((a, b) => {
				const pA = Number(a.simpleProduct?.price || a.variableProduct?.variants?.[0]?.price || 0);
				const pB = Number(b.simpleProduct?.price || b.variableProduct?.variants?.[0]?.price || 0);
				return pA - pB;
			});
		} else if (sortBy === 'price-high') {
			result.sort((a, b) => {
				const pA = Number(a.simpleProduct?.price || a.variableProduct?.variants?.[0]?.price || 0);
				const pB = Number(b.simpleProduct?.price || b.variableProduct?.variants?.[0]?.price || 0);
				return pB - pA;
			});
		}

		return result;
	}, [savedProducts, selectedCategory, searchTerm, sortBy]);

	return (
		<div className='space-y-6 pb-8'>
			{/* 1. PAGE HEADER */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-xs'>
				<div className='space-y-1'>
					<h1 className='text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2.5'>
						<Bookmark className='h-6.5 w-6.5 text-[#28321A]' />
						সংরক্ষিত পণ্যসমূহ
					</h1>
					<p className='text-sm text-[#64748B] font-medium'>
						আপনার পছন্দের পণ্যগুলো এখানে সংরক্ষণ করে রাখতে পারেন।
					</p>
				</div>

				{/* Dynamic Count Badge */}
				<div className='inline-flex items-center gap-2 bg-[#FFF9E8] text-[#28321A] border border-[#F4B400]/40 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-xs'>
					<Bookmark className='w-4 h-4 text-[#F4B400] fill-[#F4B400]' />
					<span>{savedProducts.length}টি পণ্য সংরক্ষিত</span>
				</div>
			</div>

			{/* 3. TOOLBAR */}
			{savedProducts.length > 0 && (
				<div className='flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-1'>
					{/* Category Filter Pills */}
					<div className='flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide'>
						{['সব পণ্য', 'সবজি', 'ফল', 'মাছ', 'শস্য', 'সার ও উপকরণ'].map((cat) => {
							const isActive = selectedCategory === cat;
							return (
								<button
									key={cat}
									onClick={() => setSelectedCategory(cat)}
									className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
										isActive
											? 'bg-[#28321A] text-white border-[#28321A] shadow-xs scale-102'
											: 'bg-white text-[#111827] border-[#E5E7EB] hover:bg-[#FFF4CC] hover:border-[#F4B400]/40 font-medium'
									}`}
								>
									{isActive && <span className='w-1.5 h-1.5 rounded-full bg-[#F4B400]' />}
									{cat}
								</button>
							);
						})}
					</div>

					{/* Search & Sort Controls */}
					<div className='flex items-center gap-2.5 flex-shrink-0'>
						<div className='relative flex-1 sm:w-auto'>
							<Search className='absolute left-3 top-2.5 h-4 w-4 text-[#64748B]' />
							<Input
								type='search'
								placeholder='পণ্য খুঁজুন...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='pl-9 w-full sm:w-[180px] md:w-[220px] rounded-xl border-[#E5E7EB] focus:border-[#28321A] text-xs sm:text-sm font-medium bg-white'
							/>
						</div>

						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className='bg-white border border-[#E5E7EB] text-[#111827] text-xs sm:text-sm font-bold rounded-xl px-3.5 py-2 outline-none focus:border-[#28321A] cursor-pointer shadow-xs'
						>
							<option value='recent'>সাজান ▾</option>
							<option value='price-low'>কম দাম থেকে বেশি</option>
							<option value='price-high'>বেশি দাম থেকে কম</option>
						</select>
					</div>
				</div>
			)}

			{/* 6. EMPTY STATE OR 2 & 7. RESPONSIVE PRODUCT GRID */}
			{savedProducts.length === 0 ? (
				/* Polished Empty State (Requirement #6) */
				<div className='bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-12 sm:p-16 text-center max-w-md mx-auto my-8 space-y-4'>
					<div className='w-20 h-20 bg-[#FFF4CC] rounded-full flex items-center justify-center mx-auto border border-[#F4B400]/30 shadow-inner'>
						<Bookmark className='h-10 w-10 text-[#28321A]' />
					</div>
					<div className='space-y-1.5'>
						<h2 className='text-xl font-extrabold text-[#111827]'>
							এখনও কোনো পণ্য সংরক্ষণ করেননি
						</h2>
						<p className='text-sm text-[#64748B] font-medium leading-relaxed'>
							আপনার পছন্দের কৃষিপণ্য Save করে পরে সহজেই কিনতে পারবেন।
						</p>
					</div>
					<Button asChild className='bg-[#F4B400] hover:bg-[#E5A700] text-[#28321A] font-bold rounded-xl px-6 shadow-xs border-0 mt-2'>
						<Link href='/marketplace'>
							<ShoppingBag className='mr-2 h-4 w-4 text-[#28321A]' />
							পণ্য দেখুন
						</Link>
					</Button>
				</div>
			) : processedProducts.length === 0 ? (
				<div className='bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-12 text-center max-w-md mx-auto my-8 space-y-3'>
					<h3 className='text-lg font-bold text-[#111827]'>কোনো পণ্য পাওয়া যায়নি</h3>
					<p className='text-xs text-[#64748B] font-medium'>অন্যান্য ফিল্টার বা অনুসন্ধান শব্দ চেষ্টা করুন।</p>
				</div>
			) : (
				/* Product Grid directly without full-width white box wrapper (Requirement #2) */
				<div className='pt-1'>
					<ProductGrid products={processedProducts} isLoading={false} />
				</div>
			)}
		</div>
	);
}
