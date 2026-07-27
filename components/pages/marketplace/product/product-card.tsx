'use client';

import type React from 'react';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ShoppingCart, Clock } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '../cart/cart-drawer';
import { useSession } from '@/components/providers/session-provider';
import { useSavedProducts } from '@/context/saved-products-context';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
	product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
	const { addItem } = useCart();
	const { toggleSaveProduct, isProductSaved } = useSavedProducts();
	const images = getAllProductImages(product);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const priceInfo = getProductPrice(product);
	const { user, hasRole, status } = useSession();
	const router = useRouter();
	
	const isSaved = isProductSaved(product.id);

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
		<Card className='p-0 gap-0 overflow-hidden h-full flex flex-col rounded-xl border border-gray-100 shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(45,51,31,0.2)] transition-all duration-500 group/card bg-white hover:-translate-y-1.5'>
			<div className='relative aspect-[4/3] w-full overflow-hidden bg-gray-50/50'>
				<Link href={`/marketplace/product/${product.id}`}>
					<Image
						src={images[currentImageIndex] || '/placeholder.svg'}
						alt={product.name}
						fill
						className='object-cover transition-transform duration-700 ease-in-out group-hover/card:scale-110'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					/>
					<div className='absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors duration-300 z-10'></div>
				</Link>

				{priceInfo.hasDiscount && (
					<div className='absolute top-2 right-12 z-10'>
						<span className='inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50/90 backdrop-blur-sm text-red-600 text-[10px] font-bold rounded-full border border-red-100/50 shadow-sm'>
							<Clock className='h-3 w-3' />
							{Math.round(((priceInfo.price - (priceInfo.discountPrice || 0)) / priceInfo.price) * 100)}% OFF
						</span>
					</div>
				)}

				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						if (status === 'unauthenticated' || !user) {
							router.push('/auth/login');
							return;
						}
						toggleSaveProduct(product);
					}}
					className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-20 hover:scale-110 shadow-sm ${
						isSaved 
							? 'bg-[#2D331F]/10 text-[#2D331F] border border-[#2D331F]/20' 
							: 'bg-white/80 text-gray-500 hover:text-[#2D331F] hover:bg-white border border-gray-200/50'
					}`}
					aria-label={isSaved ? 'Remove from saved' : 'Save product'}
				>
					<Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
				</button>

				{images.length > 1 && (
					<>
						<button
							onClick={(e) => {
								e.preventDefault();
								prevImage();
							}}
							className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur text-gray-800 p-1.5 rounded-full hover:bg-white hover:text-[#EAB308] shadow-md opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-20 hover:scale-110'
							aria-label='আগের ছবি'
						>
							<ChevronLeft className='h-5 w-5' />
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								nextImage();
							}}
							className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur text-gray-800 p-1.5 rounded-full hover:bg-white hover:text-[#EAB308] shadow-md opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-20 hover:scale-110'
							aria-label='পরের ছবি'
						>
							<ChevronRight className='h-5 w-5' />
						</button>
						<div className='absolute bottom-1 left-0 right-0 flex justify-center gap-1'>
							{images.map((_, idx) => (
								<button
									key={idx}
									onClick={(e) => {
										e.preventDefault();
										setCurrentImageIndex(idx);
									}}
									className={`h-1.5 rounded-full transition-all duration-300 z-20 ${
										currentImageIndex === idx
											? 'w-4 bg-[#EAB308] shadow-[0_0_5px_rgba(234,179,8,0.5)]'
											: 'w-1.5 bg-white/80 hover:bg-white'
									}`}
									aria-label={`ছবি ${idx + 1} দেখুন`}
								/>
							))}
						</div>
					</>
				)}
			</div>

			<CardContent className='flex-grow p-3 pb-1'>
				<Link href={`/marketplace/product/${product.id}`} className='block group/title'>
					<h3 className='font-semibold text-sm mb-0.5 text-gray-900 group-hover/title:text-[#2D331F] transition-colors line-clamp-1'>
						{product.name}
					</h3>
				</Link>
				<p className='text-gray-500 text-[11px] mb-2 line-clamp-1'>
					{product.description}
				</p>

				{product.productCategories && product.productCategories.length > 0 && (
					<div className='flex flex-wrap gap-1 mt-auto'>
						{product.productCategories.slice(0, 2).map((category) => (
							<span
								key={category.id}
								className='text-[9px] font-medium tracking-wide bg-[#2D331F]/10 px-1.5 py-0.5 rounded text-[#2D331F] border border-[#2D331F]/20'
							>
								{category.name}
							</span>
						))}
					</div>
				)}
			</CardContent>

			<CardFooter className='p-3 pt-2 flex items-center justify-between gap-2 border-t border-gray-50/80 mt-auto bg-gray-50/30'>
				<div>
					{priceInfo.hasDiscount ? (
						<div className='flex flex-col'>
							<span className='font-bold text-base text-[#2D331F] leading-none mb-0.5'>
								{priceInfo.formattedDiscountPrice}
							</span>
							<span className='text-gray-400 line-through text-[10px] font-medium leading-none'>
								{priceInfo.formattedPrice}
							</span>
						</div>
					) : (
						<span className='font-bold text-base text-gray-900 leading-none'>
							{priceInfo.formattedPrice}
						</span>
					)}
				</div>
				<Button 
					size='sm' 
					onClick={handleAddToCart} 
					disabled={!canPurchase}
					className={`h-8 px-2.5 rounded-lg transition-all duration-300 font-medium text-[11px] shadow-sm hover:shadow-md active:scale-95 group/btn ${!canPurchase ? 'bg-gray-100 text-gray-400' : 'bg-gradient-to-r from-[#2D331F] to-[#2D331F]/90 hover:from-[#2D331F]/90 hover:to-[#2D331F] text-[#EAB308] border-0'}`}
				>
					<ShoppingCart className='h-3.5 w-3.5 mr-1 group-hover/btn:rotate-12 transition-transform text-[#EAB308]' />
					{!canPurchase
						? 'অননুমোদিত'
						: product.productType === 'VARIABLE'
						? 'বিকল্প'
						: 'যোগ করুন'}
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
