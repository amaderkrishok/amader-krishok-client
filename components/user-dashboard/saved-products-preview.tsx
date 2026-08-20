'use client';

import { useSavedProducts } from '@/context/saved-products-context';
import { ProductCard } from '@/components/pages/marketplace/product/product-card';
import { Bookmark, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SavedProductsPreview() {
	const { savedProducts } = useSavedProducts();

	return (
		<div className='space-y-4 pt-2'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight flex items-center gap-2'>
						<Bookmark className='w-5 h-5 text-[#28321A]' />
						সংরক্ষিত পণ্য
					</h2>
					<p className='text-xs sm:text-sm text-[#667085] font-medium mt-0.5'>
						আপনার পরবর্তীতে কেনার জন্য বুকমার্ক করে রাখা পণ্যসমূহ।
					</p>
				</div>

				{savedProducts && savedProducts.length > 0 && (
					<Link
						href='/user/saved-products'
						className='inline-flex items-center gap-1 text-xs font-extrabold text-[#28321A] hover:text-[#F4B400] transition-colors group'
					>
						সব সংরক্ষিত পণ্য ({savedProducts.length})
						<ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-1 transition-transform' />
					</Link>
				)}
			</div>

			{savedProducts && savedProducts.length > 0 ? (
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6'>
					{savedProducts.slice(0, 4).map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			) : (
				/* Polished Empty State for Saved Products (Requirement #11 & #12) */
				<div className='bg-white rounded-3xl border border-[#E5E7EB] p-8 text-center max-w-md mx-auto space-y-3 shadow-xs'>
					<div className='w-16 h-16 bg-[#FFF9E8] rounded-full flex items-center justify-center mx-auto border border-[#F4B400]/30 shadow-inner'>
						<Bookmark className='w-8 h-8 text-[#28321A]' />
					</div>
					<h3 className='text-lg font-bold text-[#172033]'>
						আপনার কোনো সংরক্ষিত পণ্য নেই
					</h3>
					<p className='text-xs text-[#667085] font-medium leading-relaxed'>
						পছন্দের পণ্যের বুকমার্ক আইকনে ক্লিক করে এখানে জমা করে রাখতে পারেন।
					</p>
					<Button asChild className='bg-[#F4B400] hover:bg-[#E5A700] text-[#172033] font-bold rounded-xl px-5 shadow-sm border-0 text-xs mt-2'>
						<Link href='/marketplace'>
							<ShoppingBag className='w-4 h-4 mr-2' />
							পণ্য খুঁজে দেখুন
						</Link>
					</Button>
				</div>
			)}
		</div>
	);
}
