import Link from 'next/link';
import { Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import { ProductList } from '@/components/dashbaord/products/product-list';

export const metadata: Metadata = {
	title: 'পণ্যসমূহ - Amader Krishok Seller Center',
	description: 'আপনার পণ্য ইনভেন্টরি পরিচালনা করুন',
};

export default function ProductsPage() {
	return (
		<div className='p-4 sm:p-6 lg:p-8 space-y-6 w-full min-h-screen bg-[#F7F6F0] selection:bg-[#F5B800] selection:text-[#172033]'>
			{/* HERO HEADER */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-7 rounded-[18px] border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
				<div className='space-y-1.5 z-10'>
					<div className='flex items-center gap-2.5'>
						<div className='p-2 rounded-xl bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/30'>
							<Package className='w-5 h-5 text-[#26351B]' />
						</div>
						<h1 className='text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight'>
							পণ্যসমূহ
						</h1>
					</div>
					<p className='text-sm text-[#64748B] font-medium'>
						আপনার স্টোরের সমস্ত পণ্য ইনভেন্টরি, মূল্য ও বিভাগ পরিচালনা করুন।
					</p>
				</div>

				<Link href='/vendor/products/create' className='z-10'>
					<Button className='bg-[#F5B800] hover:bg-[#E0A800] text-[#172033] font-extrabold rounded-xl px-5 py-2.5 shadow-xs border-0 transition-all hover:-translate-y-0.5'>
						<Plus className='mr-1.5 h-4.5 w-4.5 text-[#172033]' />
						নতুন পণ্য যোগ করুন
					</Button>
				</Link>
			</div>

			{/* PRODUCT LIST CONTENT */}
			<ProductList />
		</div>
	);
}
