import { ProductForm } from '@/components/dashbaord/products/product-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'পণ্য তৈরি করুন',
	description: 'আপনার স্টোরের জন্য একটি নতুন পণ্য তৈরি করুন',
};

export default function CreateProductPage() {
	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold tracking-tight'>পণ্য তৈরি করুন</h1>
				<p className='text-muted-foreground mt-2'>
					আপনার স্টোরের ইনভেন্টরিতে একটি নতুন পণ্য যোগ করুন
				</p>
			</div>
			<ProductForm />
		</div>
	);
}