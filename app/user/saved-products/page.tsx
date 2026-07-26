'use client';

import { useSavedProducts } from '@/context/saved-products-context';
import { ProductGrid } from '@/components/pages/marketplace/product/product-grid';
import { Bookmark, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SavedProductsPage() {
	const { savedProducts } = useSavedProducts();

	return (
		<div className='space-y-6'>
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
						<Bookmark className='h-6 w-6 text-green-600 fill-green-600/20' />
						সংরক্ষিত পণ্যসমূহ (Saved Products)
					</h1>
					<p className='text-gray-500 mt-1'>
						আপনার পছন্দের সংরক্ষিত পণ্যসমূহ এখানে দেখতে পাবেন
					</p>
				</div>
			</div>

			{savedProducts.length === 0 ? (
				<div className='bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]'>
					<div className='bg-gray-50 p-4 rounded-full mb-4'>
						<Bookmark className='h-12 w-12 text-gray-300' />
					</div>
					<h2 className='text-xl font-semibold text-gray-900 mb-2'>
						কোনো সংরক্ষিত পণ্য নেই
					</h2>
					<p className='text-gray-500 max-w-md mx-auto mb-6'>
						আপনি এখনও কোনো পণ্য সংরক্ষণ করেননি। মার্কেটপ্লেস থেকে আপনার পছন্দের পণ্যগুলো সংরক্ষণ করুন।
					</p>
					<Button asChild className='bg-green-600 hover:bg-green-700 text-white'>
						<Link href='/marketplace'>
							<ShoppingBag className='mr-2 h-4 w-4' />
							মার্কেটপ্লেসে যান
						</Link>
					</Button>
				</div>
			) : (
				<div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
					<ProductGrid products={savedProducts} isLoading={false} />
				</div>
			)}
		</div>
	);
}
