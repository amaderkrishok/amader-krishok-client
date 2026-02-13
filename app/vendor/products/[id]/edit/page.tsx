// File: app/vendor/products/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductService } from '@/services/product-service';
import { ProductEditForm } from '@/components/dashbaord/products/product-edit-form';
import { Loader2 } from 'lucide-react';

export default function ProductEditPage() {
	const params = useParams();
	const idParam = params?.id;
	const productId = Number(idParam);

	const [product, setProduct] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!productId || isNaN(productId)) {
			setError(true);
			return;
		}

		const fetchProduct = async () => {
			try {
				const productData = await ProductService.getProductById(productId);
				if (!productData) {
					setError(true);
					return;
				}
				setProduct(productData);
			} catch (e) {
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [productId]);

	console.log(product);

	if (error) {
		return <div className='container py-10'>পণ্য পাওয়া যায়নি</div>;
	}

	if (loading) {
		return (
			<div className='container py-10 flex items-center justify-center'>
				<Loader2 className='h-6 w-6 animate-spin' />
				<span className='ml-2'>লোড হচ্ছে...</span>
			</div>
		);
	}

	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold tracking-tight'>
					পণ্য সম্পাদনা করুন
				</h1>
				<p className='text-muted-foreground mt-2'>
					{product.name} পণ্যের তথ্য আপডেট করুন
				</p>
			</div>

			<ProductEditForm productId={productId} initialProduct={product} />
		</div>
	);
}
