'use client';

import { useState, useEffect } from 'react';
import { ProductService } from '@/services/product-service';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/pages/marketplace/product/product-card';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function RecommendedProducts() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRecommended = async () => {
			try {
				setLoading(true);
				const res = await ProductService.getProducts(1, 4);
				if (res && res.data) {
					setProducts(res.data.slice(0, 4));
				}
			} catch (err) {
				console.error('Error fetching recommended products:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchRecommended();
	}, []);

	if (loading) {
		return (
			<div className='space-y-4'>
				<div className='h-6 w-48 bg-gray-200 rounded animate-pulse'></div>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className='h-64 bg-gray-200 rounded-[18px] animate-pulse'></div>
					))}
				</div>
			</div>
		);
	}

	if (products.length === 0) return null;

	return (
		<div className='space-y-4 pt-2'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight flex items-center gap-2'>
						<Sparkles className='w-5 h-5 text-[#F4B400]' />
						আপনার জন্য পছন্দ হতে পারে
					</h2>
					<p className='text-xs sm:text-sm text-[#667085] font-medium mt-0.5'>
						আমাদের তাজা কৃষি পণ্যের সংগ্রহ থেকে আপনার পছন্দমতো কিনুন।
					</p>
				</div>

				<Link
					href='/marketplace'
					className='inline-flex items-center gap-1 text-xs font-extrabold text-[#28321A] hover:text-[#F4B400] transition-colors group'
				>
					সব দেখুন
					<ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-1 transition-transform' />
				</Link>
			</div>

			<div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6'>
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}
