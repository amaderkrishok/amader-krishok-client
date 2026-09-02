import { ProductForm } from '@/components/dashbaord/products/product-form';
import type { Metadata } from 'next';
import { PackagePlus } from 'lucide-react';

export const metadata: Metadata = {
	title: 'পণ্য তৈরি করুন - Amader Krishok Seller Center',
	description: 'আপনার স্টোরের জন্য একটি নতুন পণ্য তৈরি করুন',
};

export default function CreateProductPage() {
	return (
		<div className='p-4 sm:p-6 lg:p-8 space-y-7 w-full bg-[#F7F6F0] min-h-screen selection:bg-[#F5B800] selection:text-[#172033]'>
			{/* HERO HEADER */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-7 rounded-[18px] border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
				<div className='space-y-1.5 z-10'>
					<div className='flex items-center gap-2.5'>
						<div className='p-2.5 rounded-xl bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/30 shadow-xs'>
							<PackagePlus className='w-5 h-5 text-[#26351B]' />
						</div>
						<h1 className='text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight'>
							পণ্য তৈরি করুন
						</h1>
					</div>
					<p className='text-sm text-[#64748B] font-medium'>
						আপনার স্টোরে একটি নতুন পণ্য যোগ করতে বিবরণ, মূল্য ও ছবি সঠিকভাবে ফিলাপ করুন।
					</p>
				</div>
			</div>

			{/* PRODUCT FORM */}
			<ProductForm />
		</div>
	);
}