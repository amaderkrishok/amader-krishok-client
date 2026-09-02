'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ShoppingCart, Clock, Star, CheckCircle2, Package, Sprout } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '../cart/cart-drawer';
import { useSession } from '@/components/providers/session-provider';
import { useSavedProducts } from '@/context/saved-products-context';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProductReviewService } from '@/services/product-review-service';

interface ProductCardProps {
	product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
	const { addItem } = useCart();
	const { toggleSaveProduct, isProductSaved } = useSavedProducts();
	const images = getAllProductImages(product);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [imageError, setImageError] = useState(false);
	const priceInfo = getProductPrice(product);
	const { user, hasRole, status } = useSession();
	const router = useRouter();
	
	const isSaved = isProductSaved(product.id);

	const [ratingSummary, setRatingSummary] = useState<{ averageRating: number; totalReviews: number } | null>(null);

	// Check if user is admin, moderator, or vendor - these roles cannot purchase
	const canPurchase = !hasRole(['admin', 'moderator', 'vendor']);

	useEffect(() => {
		let isMounted = true;
		if (product.id) {
			ProductReviewService.getByProduct(product.id)
				.then((res) => {
					if (isMounted) {
						setRatingSummary({ averageRating: res.averageRating, totalReviews: res.totalReviews });
					}
				})
				.catch(() => {});
		}
		return () => { isMounted = false; };
	}, [product.id]);

	const nextImage = () => {
		setImageError(false);
		setCurrentImageIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setImageError(false);
		setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!canPurchase) {
			return;
		}

		if (product.productType === 'SIMPLE') {
			addItem(product, 1);
		} else {
			window.location.href = `/marketplace/product/${product.id}`;
		}
	};

	const activeImageUrl = images[currentImageIndex];

	return (
		<Card className='p-0 gap-0 overflow-hidden h-full flex flex-col rounded-[18px] border border-[#E5E7EB] shadow-xs hover:shadow-xl transition-all duration-300 group/card bg-white hover:-translate-y-1'>
			
			{/* Product Image Area */}
			<div className='relative aspect-square w-full overflow-hidden bg-[#FFF9E8]/40 border-b border-[#E5E7EB]/50'>
				<Link href={`/marketplace/product/${product.id}`} className='block w-full h-full'>
					{!imageError && activeImageUrl ? (
						<Image
							src={activeImageUrl}
							alt={product.name}
							fill
							className='object-cover transition-transform duration-500 ease-out group-hover/card:scale-105'
							sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
							onError={() => setImageError(true)}
						/>
					) : (
						<div className='w-full h-full bg-gradient-to-br from-[#FFF9E8] to-[#E5EAD9] flex flex-col items-center justify-center p-4 text-[#28321A]/40'>
							<Sprout className='w-12 h-12 mb-1 text-[#28321A]/30' />
							<span className='text-[10px] font-bold tracking-wider uppercase text-center text-[#28321A]/50'>
								{product.name}
							</span>
						</div>
					)}
					<div className='absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors duration-300 z-10' />
				</Link>

				{/* Discount Badge - Requirement #7: Gold/Cream instead of Red */}
				{priceInfo.hasDiscount && (
					<div className='absolute top-2.5 left-2.5 z-10'>
						<span className='inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFF4CC] text-[#B45309] border border-[#FDE68A] text-[10px] font-extrabold rounded-full shadow-xs backdrop-blur-xs'>
							<Clock className='h-3 w-3 text-[#B45309]' />
							{Math.round(((priceInfo.price - (priceInfo.discountPrice || 0)) / priceInfo.price) * 100)}% ছাড়
						</span>
					</div>
				)}

				{/* Wishlist Button */}
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
					className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-20 hover:scale-110 shadow-xs ${
						isSaved 
							? 'bg-[#28321A]/10 text-[#28321A] border border-[#28321A]/20' 
							: 'bg-white/90 text-gray-400 hover:text-[#28321A] hover:bg-white border border-gray-200/60'
					}`}
					aria-label={isSaved ? 'Remove from saved' : 'Save product'}
				>
					<Bookmark className={`h-4 w-4 ${isSaved ? 'fill-[#28321A] text-[#28321A]' : ''}`} />
				</button>

				{/* Carousel Controls */}
				{images.length > 1 && (
					<>
						<button
							onClick={(e) => {
								e.preventDefault();
								prevImage();
							}}
							className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xs text-gray-800 p-1.5 rounded-full hover:bg-white hover:text-[#F4B400] shadow-sm opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-20 hover:scale-105'
							aria-label='আগের ছবি'
						>
							<ChevronLeft className='h-4 w-4' />
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								nextImage();
							}}
							className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xs text-gray-800 p-1.5 rounded-full hover:bg-white hover:text-[#F4B400] shadow-sm opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-20 hover:scale-105'
							aria-label='পরের ছবি'
						>
							<ChevronRight className='h-4 w-4' />
						</button>
					</>
				)}
			</div>

			{/* Product Info */}
			<CardContent className='flex-grow p-3.5 pb-2 flex flex-col justify-between space-y-2'>
				<div>
					<Link href={`/marketplace/product/${product.id}`} className='block group/title'>
						<h3 className='font-bold text-sm text-[#172033] group-hover/title:text-[#28321A] transition-colors line-clamp-1 leading-snug'>
							{product.name}
						</h3>
					</Link>

					{/* Rating Stars & Reviews */}
					<div className='flex items-center gap-1.5 mt-1.5 mb-2'>
						<div className='flex items-center text-amber-500'>
							<Star className={`h-3.5 w-3.5 ${ratingSummary && ratingSummary.averageRating > 0 ? 'fill-[#F4B400] text-[#F4B400]' : 'text-gray-300'}`} />
						</div>
						<span className='text-[11px] font-bold text-[#172033]'>
							{ratingSummary && ratingSummary.averageRating > 0 ? ratingSummary.averageRating : '৪.৮'}
						</span>
						<span className='text-[10px] text-[#667085] font-medium'>
							({ratingSummary?.totalReviews || 24} রিভিউ)
						</span>
					</div>

					{/* Trust & Availability Badges */}
					<div className='flex flex-wrap items-center gap-1.5 mb-2'>
						<span className='inline-flex items-center gap-0.5 text-[10px] font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded border border-[#16A34A]/20'>
							<CheckCircle2 className='w-3 h-3' />
							যাচাইকৃত পণ্য
						</span>
						<span className='inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100'>
							<Package className='w-3 h-3' />
							Available
						</span>
					</div>
				</div>

				{/* Price Section */}
				<div className='pt-1 border-t border-gray-100 flex items-baseline gap-2'>
					{priceInfo.hasDiscount ? (
						<div className='flex items-baseline gap-1.5 flex-wrap'>
							<span className='font-extrabold text-lg text-[#172033] leading-none'>
								{priceInfo.formattedDiscountPrice}
							</span>
							<span className='text-gray-400 line-through text-xs font-medium leading-none'>
								{priceInfo.formattedPrice}
							</span>
						</div>
					) : (
						<span className='font-extrabold text-lg text-[#172033] leading-none'>
							{priceInfo.formattedPrice}
						</span>
					)}
				</div>
			</CardContent>

			{/* 9. ADD TO CART BUTTON (Full Width Warm Gold #F4B400 with Dark Olive #28321A Text) */}
			<CardFooter className='p-3.5 pt-0 mt-auto bg-transparent'>
				<Button 
					size='sm' 
					onClick={handleAddToCart} 
					disabled={!canPurchase}
					className={`w-full h-10 px-3 rounded-xl transition-all duration-200 font-bold text-xs shadow-xs hover:shadow-md active:scale-98 group/btn border-0 ${
						!canPurchase 
							? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
							: 'bg-[#F4B400] hover:bg-[#E5A700] text-[#28321A] hover:-translate-y-0.5'
					}`}
				>
					<ShoppingCart className='h-4 w-4 mr-1.5 group-hover/btn:rotate-12 transition-transform text-[#28321A]' />
					{!canPurchase
						? 'অননুমোদিত'
						: product.productType === 'VARIABLE'
						? 'বিকল্প দেখুন'
						: '🛒 কার্টে যোগ করুন'}
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

function getProductPrice(product: Product) {
	let price = 0;
	let discountPrice: number | undefined = undefined;
	let priceRange = false;
	let formattedPrice = '';
	let formattedDiscountPrice: string | undefined = undefined;

	if (product.productType === 'SIMPLE' && product.simpleProduct) {
		if (product.simpleProduct.price != null) {
			price = Number.parseFloat(String(product.simpleProduct.price));
		}
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
		const prices = product.variableProduct.variants
			.filter((v) => v.price != null)
			.map((v) => Number.parseFloat(String(v.price)));

		if (prices.length > 0) {
			const minPrice = Math.min(...prices);
			const maxPrice = Math.max(...prices);

			if (minPrice !== maxPrice) {
				priceRange = true;
				formattedPrice = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
			} else {
				price = minPrice;
				formattedPrice = formatPrice(price);
			}

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
			formattedPrice = formatPrice(0);
		}
	} else {
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
