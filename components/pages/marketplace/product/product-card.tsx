'use client';

import type React from 'react';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '../cart/cart-drawer';
import { useSession } from '@/components/providers/session-provider';

interface ProductCardProps {
	product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
	const { addItem } = useCart();
	const images = getAllProductImages(product);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const priceInfo = getProductPrice(product);
	const { user, hasRole } = useSession();

	// Check if user is admin, moderator, or vendor - these roles cannot purchase
	const canPurchase = !hasRole(['admin', 'moderator', 'vendor']);

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		// Don't allow admins, mods, or vendors to add to cart
		if (!canPurchase) {
			return;
		}

		// For simple products, add directly
		// For variable products, navigate to product page to select variant
		if (product.productType === 'SIMPLE') {
			addItem(product, 1);
		} else {
			window.location.href = `/marketplace/product/${product.id}`;
		}
	};

	return (
		<Card className='overflow-hidden h-full flex flex-col'>
			<div className='relative aspect-square overflow-hidden'>
				<Link href={`/marketplace/product/${product.id}`}>
					<Image
						src={images[currentImageIndex] || '/placeholder.svg'}
						alt={product.name}
						fill
						className='object-cover transition-transform hover:scale-105'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					/>
				</Link>

				{images.length > 1 && (
					<>
						<button
							onClick={(e) => {
								e.preventDefault();
								prevImage();
							}}
							className='absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-r-md hover:bg-black/50'
							aria-label='আগের ছবি'
						>
							<ChevronLeft className='h-4 w-4' />
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								nextImage();
							}}
							className='absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-l-md hover:bg-black/50'
							aria-label='পরের ছবি'
						>
							<ChevronRight className='h-4 w-4' />
						</button>
						<div className='absolute bottom-1 left-0 right-0 flex justify-center gap-1'>
							{images.map((_, idx) => (
								<button
									key={idx}
									onClick={(e) => {
										e.preventDefault();
										setCurrentImageIndex(idx);
									}}
									className={`h-1.5 rounded-full ${
										currentImageIndex === idx
											? 'w-3 bg-white'
											: 'w-1.5 bg-white/60'
									}`}
									aria-label={`ছবি ${idx + 1} দেখুন`}
								/>
							))}
						</div>
					</>
				)}
			</div>

			<CardContent className='flex-grow p-4'>
				<Link href={`/marketplace/product/${product.id}`} className='block'>
					<h3 className='font-semibold text-lg mb-1 hover:text-green-600 transition-colors'>
						{product.name}
					</h3>
				</Link>
				<p className='text-gray-600 text-sm mb-2 line-clamp-2'>
					{product.description}
				</p>

				{product.productCategories && product.productCategories.length > 0 && (
					<div className='flex flex-wrap gap-1 mt-1'>
						{product.productCategories.map((category) => (
							<span
								key={category.id}
								className='text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600'
							>
								{category.name}
							</span>
						))}
					</div>
				)}
			</CardContent>

			<CardFooter className='p-4 pt-0 flex items-center justify-between'>
				<div>
					{priceInfo.hasDiscount ? (
						<div className='flex items-center gap-2'>
							<span className='font-semibold text-lg'>
								{priceInfo.formattedDiscountPrice}
							</span>
							<span className='text-gray-500 line-through text-sm'>
								{priceInfo.formattedPrice}
							</span>
						</div>
					) : (
						<span className='font-semibold text-lg'>
							{priceInfo.formattedPrice}
						</span>
					)}
				</div>
				<Button size='sm' onClick={handleAddToCart} disabled={!canPurchase}>
					<ShoppingCart className='h-4 w-4 mr-1' />
					{!canPurchase
						? 'ক্রয় করতে পারবেন না'
						: product.productType === 'VARIABLE'
						? 'বিকল্প দেখুন'
						: 'কার্টে যোগ করুন'}
				</Button>
			</CardFooter>
		</Card>
	);
}

// Helper functions
function getAllProductImages(product: Product): string[] {
	const images: string[] = [];

	if (
		product.productType === 'SIMPLE' &&
		product.simpleProduct?.images?.length
	) {
		return product.simpleProduct.images.map((img) => img.imageUrl);
	} else if (
		product.productType === 'VARIABLE' &&
		product.variableProduct?.variants?.length
	) {
		product.variableProduct.variants.forEach((variant) => {
			if (variant.images?.length) {
				variant.images.forEach((img) => {
					if (!images.includes(img.imageUrl)) {
						images.push(img.imageUrl);
					}
				});
			}
		});
	}

	return images.length ? images : ['/placeholder.svg?height=300&width=300'];
}

// Update the getProductPrice function to handle null values properly
function getProductPrice(product: Product) {
	let price = 0;
	let discountPrice: number | undefined = undefined;
	let priceRange = false;
	let formattedPrice = '';
	let formattedDiscountPrice: string | undefined = undefined;

	if (product.productType === 'SIMPLE' && product.simpleProduct) {
		// Handle null or undefined price
		if (product.simpleProduct.price != null) {
			price = Number.parseFloat(String(product.simpleProduct.price));
		}

		// Handle null or undefined discountPrice
		if (product.simpleProduct.discountPrice != null) {
			discountPrice = Number.parseFloat(
				String(product.simpleProduct.discountPrice)
			);
		}

		formattedPrice = formatPrice(price);
		formattedDiscountPrice =
			discountPrice !== undefined ? formatPrice(discountPrice) : undefined;
	} else if (
		product.productType === 'VARIABLE' &&
		product.variableProduct?.variants?.length
	) {
		// Extract prices, handling null or undefined values
		const prices = product.variableProduct.variants
			.filter((v) => v.price != null)
			.map((v) => Number.parseFloat(String(v.price)));

		if (prices.length > 0) {
			const minPrice = Math.min(...prices);
			const maxPrice = Math.max(...prices);

			// If there's a price range, show it
			if (minPrice !== maxPrice) {
				priceRange = true;
				formattedPrice = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
			} else {
				price = minPrice;
				formattedPrice = formatPrice(price);
			}

			// Handle discount prices, filtering out null or undefined values
			const discountPrices = product.variableProduct.variants
				.filter((v) => v.discountPrice != null)
				.map((v) => Number.parseFloat(String(v.discountPrice)));

			if (discountPrices.length > 0) {
				const minDiscountPrice = Math.min(...discountPrices);
				const maxDiscountPrice = Math.max(...discountPrices);

				if (
					minDiscountPrice !== maxDiscountPrice &&
					discountPrices.length === prices.length
				) {
					formattedDiscountPrice = `${formatPrice(
						minDiscountPrice
					)} - ${formatPrice(maxDiscountPrice)}`;
				} else if (discountPrices.length > 0) {
					discountPrice = minDiscountPrice;
					formattedDiscountPrice = formatPrice(discountPrice);
				}
			}
		} else {
			// No valid prices found
			formattedPrice = formatPrice(0);
		}
	} else {
		// Fallback for any other case
		formattedPrice = formatPrice(0);
	}

	const hasDiscount = discountPrice !== undefined && discountPrice < price;

	return {
		price,
		discountPrice,
		hasDiscount,
		priceRange,
		formattedPrice,
		formattedDiscountPrice,
	};
}
