import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import { ProductList } from '@/components/dashbaord/products/product-list';

export const metadata: Metadata = {
	title: 'পণ্যসমূহ',
	description: 'আপনার পণ্য ইনভেন্টরি পরিচালনা করুন',
};

export default function ProductsPage() {
	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			<div className='flex items-center justify-between mb-8'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>পণ্যসমূহ</h1>
					<p className='text-muted-foreground mt-2'>
						আপনার পণ্য ইনভেন্টরি পরিচালনা করুন
					</p>
				</div>
				<Link href='products/create'>
					<Button>
						<Plus className='mr-2 h-4 w-4' />
						পণ্য যোগ করুন
					</Button>
				</Link>
			</div>
			<ProductList />
		</div>
	);
}
