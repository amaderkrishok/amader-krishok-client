// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import {
// 	ChevronLeft,
// 	ChevronRight,
// 	Clock,
// 	MapPin,
// 	Minus,
// 	Plus,
// 	ShoppingBag,
// 	ShoppingCart,
// 	Store,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import type { Product, ProductVariant } from '@/types/product';
// import { useCart } from '@/context/cart-context';
// import { toast } from 'sonner';
// import { formatPrice } from '../cart/cart-drawer';
// import { useSession } from '@/components/providers/session-provider';
// import React from 'react';
// import { MagnifiableImage } from './magnifiable-image';
// interface SingleProductViewProps {
// 	product: Product;
// }

// export function SingleProductView({ product }: SingleProductViewProps) {
// 	const { addItem } = useCart();
// 	const { user, hasRole } = useSession();
// 	const allImages = getAllImages(product);
// 	const [currentImageIndex, setCurrentImageIndex] = useState(0);
// 	const [quantity, setQuantity] = useState(1);
// 	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
// 		product.productType === 'VARIABLE' &&
// 			product.variableProduct?.variants?.length
// 			? product.variableProduct.variants[0]
// 			: null
// 	);

// 	// Check if user is admin, moderator, or vendor - these roles cannot purchase
// 	const canPurchase = !hasRole(['admin', 'moderator', 'vendor']);

// 	// Update images when variant changes
// 	useEffect(() => {
// 		if (selectedVariant?.images?.length) {
// 			// Set the first image of the selected variant
// 			const variantImageUrl = selectedVariant.images[0].imageUrl;
// 			const indexInAllImages = allImages.findIndex(
// 				(img) => img === variantImageUrl
// 			);
// 			if (indexInAllImages >= 0) {
// 				setCurrentImageIndex(indexInAllImages);
// 			}
// 		}
// 	}, [selectedVariant, allImages]);

// 	const priceInfo = getProductPriceInfo(product, selectedVariant);

// 	const handleQuantityChange = (value: number) => {
// 		if (value >= 1) {
// 			setQuantity(value);
// 		}
// 	};

// 	const handleVariantSelect = (variant: ProductVariant) => {
// 		setSelectedVariant(variant);

// 		// If the variant has images, update the current image
// 		if (variant.images?.length) {
// 			const variantImageUrl = variant.images[0].imageUrl;
// 			const indexInAllImages = allImages.findIndex(
// 				(img) => img === variantImageUrl
// 			);
// 			if (indexInAllImages >= 0) {
// 				setCurrentImageIndex(indexInAllImages);
// 			}
// 		}
// 	};

// 	const handleAddToCart = () => {
// 		// Don't allow admins, mods, or vendors to add to cart
// 		if (!canPurchase) {
// 			return;
// 		}

// 		if (product.productType === 'VARIABLE' && !selectedVariant) {
// 			toast.warning('Please select a variant', {
// 				description: 'You need to select a variant before adding to cart.',
// 			});
// 			return;
// 		}

// 		if (product.productType === 'SIMPLE') {
// 			addItem(product, quantity);
// 			toast.success('Added to cart', {
// 				description: `${quantity} × ${product.name} added to your cart.`,
// 			});
// 		} else if (selectedVariant) {
// 			addItem(product, quantity, selectedVariant.id);
// 			toast.success('Added to cart', {
// 				description: `${quantity} × ${product.name} (${selectedVariant.variantName}) added to your cart.`,
// 			});
// 		}
// 	};

// 	const nextImage = () => {
// 		setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
// 	};

// 	const prevImage = () => {
// 		setCurrentImageIndex(
// 			(prev) => (prev - 1 + allImages.length) % allImages.length
// 		);
// 	};

// 	return (
// 		<div className='max-w-7xl mx-auto'>
// 			<div className='mb-6'>
// 				<Link
// 					href='/marketplace'
// 					className='flex items-center text-green-600 hover:text-green-700'
// 				>
// 					<ChevronLeft className='h-4 w-4 mr-1' />
// 					<span>মার্কেটপ্লেসে ফিরে যান</span>
// 				</Link>
// 			</div>

// 			<div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-10'>
// 				{/* Product Images */}
// 				<div className='space-y-4'>
// 					<div className='relative aspect-square rounded-lg overflow-hidden border bg-white'>
// 						<MagnifiableImage
// 							src={allImages[currentImageIndex] || '/placeholder.svg'}
// 							alt={product.name}
// 							fill
// 							className='rounded-lg'
// 							magnifyScale={2.0}
// 							sizes='(max-width: 768px) 100vw, 50vw'
// 						/>

// 						{allImages.length > 1 && (
// 							<>
// 								<button
// 									onClick={prevImage}
// 									className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 z-20'
// 									aria-label='Previous image'
// 								>
// 									<ChevronLeft className='h-5 w-5' />
// 								</button>
// 								<button
// 									onClick={nextImage}
// 									className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 z-20'
// 									aria-label='Next image'
// 								>
// 									<ChevronRight className='h-5 w-5' />
// 								</button>
// 								<div className='absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20'>
// 									{allImages.map((_, idx) => (
// 										<button
// 											key={idx}
// 											onClick={() => setCurrentImageIndex(idx)}
// 											className={`h-2 rounded-full ${
// 												currentImageIndex === idx
// 													? 'w-4 bg-white'
// 													: 'w-2 bg-white/60'
// 											}`}
// 											aria-label={`Go to image ${idx + 1}`}
// 										/>
// 									))}
// 								</div>
// 							</>
// 						)}
// 					</div>

// 					{allImages.length > 1 && (
// 						<div className='grid grid-cols-5 gap-2'>
// 							{allImages.map((image, index) => (
// 								<button
// 									key={index}
// 									className={`relative aspect-square rounded-md overflow-hidden border ${
// 										currentImageIndex === index ? 'ring-2 ring-green-500' : ''
// 									}`}
// 									onClick={() => setCurrentImageIndex(index)}
// 								>
// 									<Image
// 										src={image || '/placeholder.svg'}
// 										alt={`Product view ${index + 1}`}
// 										fill
// 										className='object-cover'
// 									/>
// 								</button>
// 							))}
// 						</div>
// 					)}
// 				</div>
// 				{/* Product Info */}
// 				<div className='space-y-6'>
// 					<div>
// 						<h1 className='text-2xl md:text-3xl font-bold'>{product.name}</h1>
// 						<div className='flex flex-wrap items-center mt-2 gap-2'>
// 							{product.productCategories &&
// 								product.productCategories.length > 0 && (
// 									<div className='flex flex-wrap gap-2'>
// 										{product.productCategories.map((category) => (
// 											<Badge key={category.id} variant='secondary'>
// 												{category.name}
// 											</Badge>
// 										))}
// 									</div>
// 								)}
// 						</div>
// 					</div>

// 					{/* Add this store information section after the categories */}
// 					{product.store && (
// 						<div className='mt-4 space-y-2'>
// 							<div className='flex items-center gap-2'>
// 								<h3 className='text-gray-600'>বিক্রেতা:</h3>
// 								<Link
// 									href={`/marketplace/stores/${product.store.id}`}
// 									className='text-green-600 hover:underline font-medium'
// 								>
// 									{product.store.name}
// 								</Link>
// 							</div>

// 							{product.store.address && (
// 								<p className='text-sm text-gray-600'>
// 									ঠিকানা: {product.store.address}
// 									{product.store.district && `, ${product.store.district}`}
// 									{product.store.division && `, ${product.store.division}`}
// 								</p>
// 							)}
// 						</div>
// 					)}

// 					<Separator />

// 					{/* Price */}
// 					<div>
// 						{priceInfo.hasDiscount ? (
// 							<div className='flex items-end gap-2'>
// 								<span className='text-3xl font-bold'>
// 									<span className='text-lg font-medium mr-1'>মূল্য:</span>
// 									{priceInfo.formattedDiscountPrice}
// 								</span>
// 								<span className='text-xl text-gray-500 line-through'>
// 									{priceInfo.formattedPrice}
// 								</span>
// 								{!priceInfo.priceRange && priceInfo.discountPercentage && (
// 									<Badge className='ml-2 bg-red-500'>
// 										{priceInfo.discountPercentage}% OFF
// 									</Badge>
// 								)}
// 							</div>
// 						) : (
// 							<span className='text-3xl font-bold'>
// 								<span className='text-lg font-medium mr-1'>মূল্য:</span>
// 								{priceInfo.formattedPrice}
// 							</span>
// 						)}
// 					</div>

// 					{/* Variants */}
// 					{product.productType === 'VARIABLE' &&
// 						!!product.variableProduct?.variants &&
// 						product.variableProduct.variants.length > 0 && (
// 							<div className='space-y-3'>
// 								<h3 className='font-medium'>Variants</h3>
// 								<div className='flex flex-wrap gap-2'>
// 									{product.variableProduct.variants.map((variant) => (
// 										<Button
// 											key={variant.id}
// 											variant={
// 												selectedVariant?.id === variant.id
// 													? 'default'
// 													: 'outline'
// 											}
// 											onClick={() => handleVariantSelect(variant)}
// 											className='h-auto py-2'
// 										>
// 											{variant.variantName}
// 										</Button>
// 									))}
// 								</div>
// 							</div>
// 						)}

// 					{/* Quantity with label and controls side by side */}
// 					<div className='flex items-center gap-4'>
// 						<h3 className=' w-20 font-bold'>পরিমাণ</h3>
// 						<div className='flex items-center space-x-3'>
// 							<Button
// 								variant='outline'
// 								size='icon'
// 								onClick={() => handleQuantityChange(quantity - 1)}
// 								disabled={quantity <= 1}
// 							>
// 								<Minus className='h-4 w-4' />
// 							</Button>
// 							<span className='w-8 text-center'>{quantity}</span>
// 							<Button
// 								variant='outline'
// 								size='icon'
// 								onClick={() => handleQuantityChange(quantity + 1)}
// 							>
// 								<Plus className='h-4 w-4' />
// 							</Button>
// 						</div>
// 					</div>
// 					{/* Add to Cart and Buy Now Buttons */}
// 					<div className='flex gap-2 mt-6'>
// 						<Button
// 							className='w-1/2  bg-green-600 hover:bg-green-700'
// 							size='lg'
// 							disabled={!canPurchase}
// 							onClick={() => {
// 								// Don't allow admins, mods, or vendors to purchase
// 								if (!canPurchase) {
// 									return;
// 								}

// 								// Add to cart first
// 								if (product.productType === 'VARIABLE' && !selectedVariant) {
// 									toast.warning('Please select a variant', {
// 										description:
// 											'You need to select a variant before proceeding to checkout.',
// 									});
// 									return;
// 								}

// 								if (product.productType === 'SIMPLE') {
// 									addItem(product, quantity);
// 								} else if (selectedVariant) {
// 									addItem(product, quantity, selectedVariant.id);
// 								}

// 								// Navigate to order page
// 								window.location.href = '/order';
// 							}}
// 						>
// 							<ShoppingBag className='mr-2 h-5 w-5' />
// 							{!canPurchase ? 'ক্রয় করতে পারবেন না' : 'সরাসরি কিনুন'}
// 						</Button>

// 						<Button
// 							className='w-1/2'
// 							size='lg'
// 							disabled={!canPurchase}
// 							onClick={handleAddToCart}
// 						>
// 							<ShoppingCart className='mr-2 h-5 w-5' />
// 							{!canPurchase ? 'ক্রয় করতে পারবেন না' : 'কার্টে যোগ করুন'}
// 						</Button>
// 					</div>

// 					{/* Description */}
// 					<Tabs defaultValue='description' className='mt-8'>
// 						<TabsList className='w-full'>
// 							<TabsTrigger value='description' className='flex-1'>
// 								বিবরণ
// 							</TabsTrigger>

// 							<TabsTrigger value='store' className='flex-1'>
// 								বিক্রেতা
// 							</TabsTrigger>
// 							{product.supplyCalendar && product.supplyCalendar.length > 0 && (
// 								<TabsTrigger value='availability' className='flex-1'>
// 									প্রাপ্যতা
// 								</TabsTrigger>
// 							)}
// 						</TabsList>
// 						<TabsContent value='description' className='mt-4'>
// 							<div className='prose max-w-none'>
// 								<p>{product.description || 'No description available.'}</p>
// 							</div>
// 						</TabsContent>

// 						<TabsContent value='store' className='mt-4'>
// 							{product.store ? (
// 								<div className='space-y-4'>
// 									<div className='flex items-center gap-3'>
// 										{product.store.storeImage ? (
// 											<div className='relative w-16 h-16 rounded-full overflow-hidden'>
// 												<Image
// 													src={product.store.storeImage}
// 													alt={product.store.name}
// 													fill
// 													className='object-cover'
// 												/>
// 											</div>
// 										) : (
// 											<div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center'>
// 												<Store className='h-8 w-8 text-gray-400' />
// 											</div>
// 										)}

// 										<div>
// 											<h3 className='text-lg font-medium'>
// 												{product.store.name}
// 											</h3>
// 											<Link
// 												href={`/store/${product.store.id}`}
// 												className='text-sm text-green-600 hover:underline'
// 											>
// 												দোকান দেখুন
// 											</Link>
// 										</div>
// 									</div>

// 									{product.store.description && (
// 										<p className='text-gray-700'>{product.store.description}</p>
// 									)}

// 									<div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm'>
// 										{product.store.address && (
// 											<div className='flex items-center gap-2'>
// 												<MapPin className='h-4 w-4 text-gray-500' />
// 												<span>
// 													{product.store.address}
// 													{product.store.district &&
// 														`, ${product.store.district}`}
// 													{product.store.division &&
// 														`, ${product.store.division}`}
// 												</span>
// 											</div>
// 										)}

// 										{product.store.createdAt && (
// 											<div className='flex items-center gap-2'>
// 												<Clock className='h-4 w-4 text-gray-500' />
// 												<span>
// 													যোগদান:{' '}
// 													{new Date(product.store.createdAt).toLocaleDateString(
// 														'bn-BD'
// 													)}
// 												</span>
// 											</div>
// 										)}
// 									</div>

// 									<Button asChild className='mt-4'>
// 										<Link href={`/store/${product.store.id}`}>
// 											এই বিক্রেতার অন্যান্য পণ্য দেখুন
// 										</Link>
// 									</Button>
// 								</div>
// 							) : (
// 								<p className='text-gray-500'>বিক্রেতার তথ্য পাওয়া যায়নি।</p>
// 							)}
// 						</TabsContent>
// 						{product.supplyCalendar && product.supplyCalendar.length > 0 && (
// 							<TabsContent value='availability' className='mt-4'>
// 								<div className='space-y-4'>
// 									<h3 className='font-medium'>Available Months</h3>
// 									<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
// 										{getMonthNames().map((month, index) => {
// 											const monthStr = (index + 1).toString();
// 											const isAvailable =
// 												product.supplyCalendar?.[0]?.months?.includes(
// 													monthStr
// 												) ||
// 												product.supplyCalendar?.[0]?.months?.includes(month);
// 											return (
// 												<div
// 													key={month}
// 													className={`p-2 rounded-md text-center ${
// 														isAvailable
// 															? 'bg-green-100 text-green-800'
// 															: 'bg-gray-100 text-gray-400 line-through'
// 													}`}
// 												>
// 													{month}
// 												</div>
// 											);
// 										})}
// 									</div>
// 									{product.supplyCalendar[0]?.description && (
// 										<p className='text-gray-600 mt-2'>
// 											{product.supplyCalendar[0].description}
// 										</p>
// 									)}
// 								</div>
// 							</TabsContent>
// 						)}
// 					</Tabs>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// // Helper functions
// function getAllImages(product: Product): string[] {
// 	const images: string[] = [];

// 	if (
// 		product.productType === 'SIMPLE' &&
// 		product.simpleProduct?.images?.length
// 	) {
// 		return product.simpleProduct.images.map((img) => img.imageUrl);
// 	} else if (
// 		product.productType === 'VARIABLE' &&
// 		product.variableProduct?.variants?.length
// 	) {
// 		product.variableProduct.variants.forEach((variant) => {
// 			if (variant.images?.length) {
// 				variant.images.forEach((img) => {
// 					if (!images.includes(img.imageUrl)) {
// 						images.push(img.imageUrl);
// 					}
// 				});
// 			}
// 		});
// 	}

// 	return images.length ? images : ['/placeholder.svg?height=500&width=500'];
// }

// function getProductPriceInfo(
// 	product: Product,
// 	selectedVariant: ProductVariant | null
// ) {
// 	let price = 0;
// 	let discountPrice: number | undefined = undefined;
// 	let priceRange = false;
// 	let formattedPrice = '';
// 	let formattedDiscountPrice: string | undefined = undefined;
// 	let minPrice = 0;
// 	let maxPrice = 0;

// 	if (product.productType === 'SIMPLE' && product.simpleProduct) {
// 		// Handle null or undefined price
// 		if (product.simpleProduct.price != null) {
// 			price = Number.parseFloat(String(product.simpleProduct.price));
// 		}

// 		// Handle null or undefined discountPrice
// 		if (product.simpleProduct.discountPrice != null) {
// 			discountPrice = Number.parseFloat(
// 				String(product.simpleProduct.discountPrice)
// 			);
// 		}

// 		formattedPrice = formatPrice(price);
// 		formattedDiscountPrice =
// 			discountPrice !== undefined ? formatPrice(discountPrice) : undefined;
// 	} else if (product.productType === 'VARIABLE' && selectedVariant) {
// 		// If a variant is selected, use its price
// 		if (selectedVariant.price != null) {
// 			price = Number.parseFloat(String(selectedVariant.price));
// 		}

// 		if (selectedVariant.discountPrice != null) {
// 			discountPrice = Number.parseFloat(String(selectedVariant.discountPrice));
// 		}

// 		formattedPrice = formatPrice(price);
// 		formattedDiscountPrice =
// 			discountPrice !== undefined ? formatPrice(discountPrice) : undefined;
// 	} else if (
// 		product.productType === 'VARIABLE' &&
// 		product.variableProduct?.variants?.length
// 	) {
// 		// Extract prices, handling null or undefined values
// 		const prices = product.variableProduct.variants
// 			.filter((v) => v.price != null)
// 			.map((v) => Number.parseFloat(String(v.price)));

// 		if (prices.length > 0) {
// 			minPrice = Math.min(...prices);
// 			maxPrice = Math.max(...prices);

// 			// If there's a price range, show it
// 			if (minPrice !== maxPrice) {
// 				priceRange = true;
// 				formattedPrice = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
// 				price = minPrice; // Use min price for discount calculation
// 			} else {
// 				price = minPrice;
// 				formattedPrice = formatPrice(price);
// 			}

// 			// Handle discount prices, filtering out null or undefined values
// 			const discountPrices = product.variableProduct.variants
// 				.filter((v) => v.discountPrice != null)
// 				.map((v) => Number.parseFloat(String(v.discountPrice)));

// 			if (discountPrices.length > 0) {
// 				const minDiscountPrice = Math.min(...discountPrices);
// 				const maxDiscountPrice = Math.max(...discountPrices);

// 				if (
// 					minDiscountPrice !== maxDiscountPrice &&
// 					discountPrices.length === prices.length
// 				) {
// 					formattedDiscountPrice = `${formatPrice(
// 						minDiscountPrice
// 					)} - ${formatPrice(maxDiscountPrice)}`;
// 					discountPrice = minDiscountPrice; // Use min discount price for calculation
// 				} else if (discountPrices.length > 0) {
// 					discountPrice = minDiscountPrice;
// 					formattedDiscountPrice = formatPrice(discountPrice);
// 				}
// 			}
// 		} else {
// 			// No valid prices found
// 			formattedPrice = formatPrice(0);
// 		}
// 	} else {
// 		// Fallback for any other case
// 		formattedPrice = formatPrice(0);
// 	}

// 	const hasDiscount = discountPrice !== undefined && discountPrice < price;
// 	const discountPercentage = hasDiscount
// 		? Math.round(((price - discountPrice!) / price) * 100)
// 		: undefined;

// 	return {
// 		price,
// 		discountPrice,
// 		hasDiscount,
// 		priceRange,
// 		minPrice,
// 		maxPrice,
// 		discountPercentage,
// 		formattedPrice,
// 		formattedDiscountPrice,
// 	};
// }

// function getMonthNames(): string[] {
// 	return [
// 		'January',
// 		'February',
// 		'March',
// 		'April',
// 		'May',
// 		'June',
// 		'July',
// 		'August',
// 		'September',
// 		'October',
// 		'November',
// 		'December',
// 	];
// }
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Minus,
    Plus,
    ShoppingBag,
    ShoppingCart,
    Store,
    Star,
    Shield,
    Truck,
    CheckCircle,
    Heart,
    Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Product, ProductVariant } from '@/types/product';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';
import { formatPrice } from '../cart/cart-drawer';
import { useSession } from '@/components/providers/session-provider';
import React from 'react';
import { MagnifiableImage } from './magnifiable-image';
import { motion, AnimatePresence } from 'framer-motion';

interface SingleProductViewProps {
    product: Product;
}

export function SingleProductView({ product }: SingleProductViewProps) {
    const { addItem } = useCart();
    const { user, hasRole } = useSession();
    const allImages = getAllImages(product);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.productType === 'VARIABLE' &&
            product.variableProduct?.variants?.length
            ? product.variableProduct.variants[0]
            : null
    );
    const [isWishlist, setIsWishlist] = useState(false);

    const canPurchase = !hasRole(['admin', 'moderator', 'vendor']);

    useEffect(() => {
        if (selectedVariant?.images?.length) {
            const variantImageUrl = selectedVariant.images[0].imageUrl;
            const indexInAllImages = allImages.findIndex(
                (img) => img === variantImageUrl
            );
            if (indexInAllImages >= 0) {
                setCurrentImageIndex(indexInAllImages);
            }
        }
    }, [selectedVariant, allImages]);

    const priceInfo = getProductPriceInfo(product, selectedVariant);

    const handleQuantityChange = (value: number) => {
        if (value >= 1) {
            setQuantity(value);
        }
    };

    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        if (variant.images?.length) {
            const variantImageUrl = variant.images[0].imageUrl;
            const indexInAllImages = allImages.findIndex(
                (img) => img === variantImageUrl
            );
            if (indexInAllImages >= 0) {
                setCurrentImageIndex(indexInAllImages);
            }
        }
    };

    const handleAddToCart = () => {
        if (!canPurchase) return;

        if (product.productType === 'VARIABLE' && !selectedVariant) {
            toast.warning('Please select a variant', {
                description: 'You need to select a variant before adding to cart.',
            });
            return;
        }

        if (product.productType === 'SIMPLE') {
            addItem(product, quantity);
            toast.success('Added to cart', {
                description: `${quantity} × ${product.name} added to your cart.`,
            });
        } else if (selectedVariant) {
            addItem(product, quantity, selectedVariant.id);
            toast.success('Added to cart', {
                description: `${quantity} × ${product.name} (${selectedVariant.variantName}) added to your cart.`,
            });
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) => (prev - 1 + allImages.length) % allImages.length
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-0">
            {/* Back Button with Animation */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <Link
                    href='/marketplace'
                    className='inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-all duration-300 hover:gap-2'
                >
                    <ChevronLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
                    <span>মার্কেটপ্লেসে ফিরে যান</span>
                </Link>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10'
            >
                {/* Product Images */}
                <motion.div variants={itemVariants} className='space-y-4'>
                    <div className='relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-lg group'>
                        <MagnifiableImage
                            src={allImages[currentImageIndex] || '/placeholder.svg'}
                            alt={product.name}
                            fill
                            className='rounded-2xl'
                            magnifyScale={2.0}
                            sizes='(max-width: 768px) 100vw, 50vw'
                        />

                        {/* Action Buttons */}
                        {/* <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsWishlist(!isWishlist)}
                                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all"
                            >
                                <Heart className={`w-5 h-5 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all"
                            >
                                <Share2 className="w-5 h-5 text-gray-600" />
                            </motion.button>
                        </div> */}

                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className='absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all z-20 backdrop-blur-sm'
                                    aria-label='Previous image'
                                >
                                    <ChevronLeft className='h-5 w-5' />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all z-20 backdrop-blur-sm'
                                    aria-label='Next image'
                                >
                                    <ChevronRight className='h-5 w-5' />
                                </button>
                                <div className='absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20'>
                                    {allImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                currentImageIndex === idx
                                                    ? 'w-6 bg-white'
                                                    : 'w-1.5 bg-white/50'
                                            }`}
                                            aria-label={`Go to image ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {allImages.length > 1 && (
                        <div className='grid grid-cols-5 gap-2'>
                            {allImages.map((image, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                                        currentImageIndex === index 
                                            ? 'border-emerald-500 shadow-lg' 
                                            : 'border-transparent hover:border-gray-300'
                                    }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <Image
                                        src={image || '/placeholder.svg'}
                                        alt={`Product view ${index + 1}`}
                                        fill
                                        className='object-cover'
                                    />
                                </motion.button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Product Info */}
                <motion.div variants={itemVariants} className='space-y-6'>
                    <div>
                        <div className="flex items-start justify-between">
                            <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900'>
                                {product.name}
                            </h1>
                        </div>
                        <div className='flex flex-wrap items-center mt-3 gap-2'>
                            {product.productCategories &&
                                product.productCategories.length > 0 && (
                                    <div className='flex flex-wrap gap-2'>
                                        {product.productCategories.map((category) => (
                                            <Badge key={category.id} variant='secondary' className='bg-emerald-50 text-emerald-700 border-emerald-200'>
                                                {category.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Store Information */}
                    {product.store && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100'
                        >
                            <div className='flex items-center gap-3'>
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Store className='w-5 h-5 text-emerald-600' />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/marketplace/stores/${product.store.id}`}
                                            className='text-emerald-600 hover:underline font-semibold'
                                        >
                                            {product.store.name}
                                        </Link>
                                        <Badge className="bg-emerald-500 text-white text-xs">বিশ্বস্ত</Badge>
                                    </div>
                                    {product.store.address && (
                                        <p className='text-sm text-gray-600 flex items-center gap-1 mt-0.5'>
                                            <MapPin className='h-3 w-3' />
                                            {product.store.address}
                                            {product.store.district && `, ${product.store.district}`}
                                            {product.store.division && `, ${product.store.division}`}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <Separator className="bg-gray-100" />

                    {/* Price */}
                    <div>
                        {priceInfo.hasDiscount ? (
                            <div className='flex items-end gap-3 flex-wrap'>
                                <span className='text-3xl md:text-4xl font-bold text-emerald-600'>
                                    {priceInfo.formattedDiscountPrice}
                                </span>
                                <span className='text-xl text-gray-400 line-through'>
                                    {priceInfo.formattedPrice}
                                </span>
                                {!priceInfo.priceRange && priceInfo.discountPercentage && (
                                    <Badge className='bg-red-500 text-white px-3 py-1'>
                                        {priceInfo.discountPercentage}% ছাড়
                                    </Badge>
                                )}
                            </div>
                        ) : (
                            <span className='text-3xl md:text-4xl font-bold text-emerald-600'>
                                {priceInfo.formattedPrice}
                            </span>
                        )}
                    </div>

                    {/* Variants */}
                    {product.productType === 'VARIABLE' &&
                        !!product.variableProduct?.variants &&
                        product.variableProduct.variants.length > 0 && (
                            <div className='space-y-3'>
                                <h3 className='font-semibold text-gray-700'>ভেরিয়েন্ট</h3>
                                <div className='flex flex-wrap gap-2'>
                                    {product.variableProduct.variants.map((variant) => (
                                        <motion.button
                                            key={variant.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleVariantSelect(variant)}
                                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                                selectedVariant?.id === variant.id
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold shadow-md'
                                                    : 'border-gray-200 hover:border-gray-400 text-gray-700'
                                            }`}
                                        >
                                            {variant.variantName}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                    {/* Quantity */}
                    <div className='flex items-center gap-4 bg-gray-50 rounded-xl p-3'>
                        <h3 className='font-semibold text-gray-700 min-w-[80px]'>পরিমাণ</h3>
                        <div className='flex items-center gap-3'>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                variant='outline'
                                className='w-9 h-9 rounded-full border-2 border-gray-200 hover:border-emerald-400 flex items-center justify-center bg-white transition-all disabled:opacity-50'
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                            >
                                <Minus className='h-4 w-4' />
                            </motion.button>
                            <span className='w-10 text-center text-xl font-semibold'>{quantity}</span>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                variant='outline'
                                className='w-9 h-9 rounded-full border-2 border-gray-200 hover:border-emerald-400 flex items-center justify-center bg-white transition-all'
                                onClick={() => handleQuantityChange(quantity + 1)}
                            >
                                <Plus className='h-4 w-4' />
                            </motion.button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col sm:flex-row gap-3 pt-2'>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                            <Button
                                className='w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all'
                                size='lg'
                                disabled={!canPurchase}
                                onClick={() => {
                                    if (!canPurchase) return;
                                    if (product.productType === 'VARIABLE' && !selectedVariant) {
                                        toast.warning('Please select a variant', {
                                            description: 'You need to select a variant before proceeding to checkout.',
                                        });
                                        return;
                                    }
                                    if (product.productType === 'SIMPLE') {
                                        addItem(product, quantity);
                                    } else if (selectedVariant) {
                                        addItem(product, quantity, selectedVariant.id);
                                    }
                                    window.location.href = '/order';
                                }}
                            >
                                <ShoppingBag className='mr-2 h-5 w-5' />
                                {!canPurchase ? 'ক্রয় করতে পারবেন না' : 'সরাসরি কিনুন'}
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                            <Button
                                className='w-full bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all'
                                size='lg'
                                disabled={!canPurchase}
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className='mr-2 h-5 w-5' />
                                {!canPurchase ? 'ক্রয় করতে পারবেন না' : 'কার্টে যোগ করুন'}
                            </Button>
                        </motion.div>
                    </div>

                    {/* Trust Badges */}
                    <div className='grid grid-cols-3 gap-3 pt-2'>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Shield className='h-4 w-4 text-emerald-500' />
                            <span>নিরাপদ লেনদেন</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <Truck className='h-4 w-4 text-emerald-500' />
                            <span>দ্রুত ডেলিভারি</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <CheckCircle className='h-4 w-4 text-emerald-500' />
                            <span>গুণগত মান</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue='description' className='mt-6'>
                        <TabsList className='w-full bg-gray-100 p-1 rounded-xl'>
                            <TabsTrigger value='description' className='flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm'>
                                বিবরণ
                            </TabsTrigger>
                            <TabsTrigger value='store' className='flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm'>
                                বিক্রেতা
                            </TabsTrigger>
                            {product.supplyCalendar && product.supplyCalendar.length > 0 && (
                                <TabsTrigger value='availability' className='flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm'>
                                    প্রাপ্যতা
                                </TabsTrigger>
                            )}
                        </TabsList>
                        <TabsContent value='description' className='mt-4'>
                            <div className='prose max-w-none text-gray-700 leading-relaxed'>
                                <p>{product.description || 'No description available.'}</p>
                            </div>
                        </TabsContent>

                        <TabsContent value='store' className='mt-4'>
                            {product.store ? (
                                <div className='space-y-4'>
                                    <div className='flex items-center gap-4'>
                                        {product.store.storeImage ? (
                                            <div className='relative w-16 h-16 rounded-full overflow-hidden'>
                                                <Image
                                                    src={product.store.storeImage}
                                                    alt={product.store.name}
                                                    fill
                                                    className='object-cover'
                                                />
                                            </div>
                                        ) : (
                                            <div className='w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center'>
                                                <Store className='h-8 w-8 text-emerald-600' />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className='text-lg font-semibold'>
                                                {product.store.name}
                                            </h3>
                                            <Link
                                                href={`/store/${product.store.id}`}
                                                className='text-sm text-emerald-600 hover:underline font-medium'
                                            >
                                                দোকান দেখুন →
                                            </Link>
                                        </div>
                                    </div>

                                    {product.store.description && (
                                        <p className='text-gray-700'>{product.store.description}</p>
                                    )}

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm'>
                                        {product.store.address && (
                                            <div className='flex items-center gap-2 text-gray-600'>
                                                <MapPin className='h-4 w-4' />
                                                <span>
                                                    {product.store.address}
                                                    {product.store.district && `, ${product.store.district}`}
                                                    {product.store.division && `, ${product.store.division}`}
                                                </span>
                                            </div>
                                        )}
                                        {product.store.createdAt && (
                                            <div className='flex items-center gap-2 text-gray-600'>
                                                <Clock className='h-4 w-4' />
                                                <span>
                                                    যোগদান:{' '}
                                                    {new Date(product.store.createdAt).toLocaleDateString(
                                                        'bn-BD'
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <Button asChild className='bg-emerald-600 hover:bg-emerald-700'>
                                        <Link href={`/store/${product.store.id}`}>
                                            এই বিক্রেতার অন্যান্য পণ্য দেখুন
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <p className='text-gray-500'>বিক্রেতার তথ্য পাওয়া যায়নি।</p>
                            )}
                        </TabsContent>
                        {product.supplyCalendar && product.supplyCalendar.length > 0 && (
                            <TabsContent value='availability' className='mt-4'>
                                <div className='space-y-4'>
                                    <h3 className='font-semibold'>প্রাপ্ত মাস</h3>
                                    <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2'>
                                        {getMonthNames().map((month, index) => {
                                            const monthStr = (index + 1).toString();
                                            const isAvailable =
                                                product.supplyCalendar?.[0]?.months?.includes(
                                                    monthStr
                                                ) ||
                                                product.supplyCalendar?.[0]?.months?.includes(month);
                                            return (
                                                <div
                                                    key={month}
                                                    className={`p-2 rounded-lg text-center text-sm transition-all ${
                                                        isAvailable
                                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                            : 'bg-gray-100 text-gray-400'
                                                    }`}
                                                >
                                                    {month}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {product.supplyCalendar[0]?.description && (
                                        <p className='text-gray-600 mt-2'>
                                            {product.supplyCalendar[0].description}
                                        </p>
                                    )}
                                </div>
                            </TabsContent>
                        )}
                    </Tabs>
                </motion.div>
            </motion.div>
        </div>
    );
}

// Helper functions (keep all existing helper functions unchanged)
function getAllImages(product: Product): string[] {
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

    return images.length ? images : ['/placeholder.svg?height=500&width=500'];
}

function getProductPriceInfo(
    product: Product,
    selectedVariant: ProductVariant | null
) {
    let price = 0;
    let discountPrice: number | undefined = undefined;
    let priceRange = false;
    let formattedPrice = '';
    let formattedDiscountPrice: string | undefined = undefined;
    let minPrice = 0;
    let maxPrice = 0;

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
    } else if (product.productType === 'VARIABLE' && selectedVariant) {
        if (selectedVariant.price != null) {
            price = Number.parseFloat(String(selectedVariant.price));
        }
        if (selectedVariant.discountPrice != null) {
            discountPrice = Number.parseFloat(String(selectedVariant.discountPrice));
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
            minPrice = Math.min(...prices);
            maxPrice = Math.max(...prices);

            if (minPrice !== maxPrice) {
                priceRange = true;
                formattedPrice = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
                price = minPrice;
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
                    discountPrice = minDiscountPrice;
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
    const discountPercentage = hasDiscount
        ? Math.round(((price - discountPrice!) / price) * 100)
        : undefined;

    return {
        price,
        discountPrice,
        hasDiscount,
        priceRange,
        minPrice,
        maxPrice,
        discountPercentage,
        formattedPrice,
        formattedDiscountPrice,
    };
}

function getMonthNames(): string[] {
    return [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
}