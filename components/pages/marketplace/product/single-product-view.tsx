'use client';

import { useState, useEffect, useRef } from 'react';
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
    Copy,
    Check,
    X,
    Link2,
    Package,
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
import { ProductReviewsSection } from './product-reviews-section';

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
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const shareModalRef = useRef<HTMLDivElement>(null);

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
    // Generate share URL with shop name
    const getShareUrl = () => {
        const baseUrl = window.location.origin;
        const shopName = product.store?.name || '';
        const shopParam = shopName
            ? `?shop=${encodeURIComponent(shopName.replace(/\s+/g, '-'))}`
            : '';
        return `${baseUrl}/marketplace/product/${product.id}${shopParam}`;
    };

    // Copy URL to clipboard
    const handleCopyLink = async () => {
        const shareUrl = getShareUrl();
        const shareText = product.store?.name 
            ? `${product.name} - ${product.store.name} | আমাদের কৃষক`
            : `${product.name} | আমাদের কৃষক`;
        const textToCopy = `${shareText}\n${shareUrl}`;
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            toast.success('লিংক কপি হয়েছে!', {
                description: 'পণ্যের তথ্য আপনার ক্লিপবোর্ডে কপি করা হয়েছে।',
            });
            setTimeout(() => setIsCopied(false), 2000);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setIsCopied(true);
            toast.success('লিংক কপি হয়েছে!');
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    // Share to a specific platform
    const handleShareTo = (platform: string) => {
        const shareUrl = encodeURIComponent(getShareUrl());
        const shareText = encodeURIComponent(
            product.store?.name
                ? `${product.name} - ${product.store.name} | আমাদের কৃষক`
                : `${product.name} | আমাদের কৃষক`
        );

        const urls: Record<string, string> = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
            whatsapp: `https://wa.me/?text=${shareText}%20${shareUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
            telegram: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
            email: `mailto:?subject=${shareText}&body=${shareText}%0A%0A${shareUrl}`,
        };

        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=500');
        }
        setIsShareOpen(false);
    };

    // Open share modal
    const handleShare = () => {
        setIsShareOpen(true);
        setIsCopied(false);
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
                    className='inline-flex items-center text-[#2D331F] hover:text-[#40492F] font-medium transition-all duration-300 hover:gap-2'
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
        onClick={handleShare}
        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all"
        aria-label="Share product"
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
                                            ? 'border-[#2D331F] shadow-lg' 
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
                                            <Badge key={category.id} variant='secondary' className='bg-[#2D331F]/10 text-[#2D331F] border-[#2D331F]/20 font-semibold'>
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
                            className='bg-gradient-to-r from-[#2D331F]/5 to-[#2D331F]/10 rounded-xl p-4 border border-[#2D331F]/15'
                        >
                            <div className='flex items-center gap-3'>
                                <div className="w-10 h-10 rounded-full bg-[#2D331F]/15 flex items-center justify-center">
                                    <Store className='w-5 h-5 text-[#2D331F]' />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/marketplace/stores/${product.store.id}`}
                                            className='text-[#2D331F] hover:underline font-bold'
                                        >
                                            {product.store.name}
                                        </Link>
                                        <Badge className="bg-[#2D331F] text-[#EAB308] text-xs font-bold">বিশ্বস্ত</Badge>
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
                                <span className='text-3xl md:text-4xl font-bold text-[#2D331F]'>
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
                            <span className='text-3xl md:text-4xl font-bold text-[#2D331F]'>
                                {priceInfo.formattedPrice}
                            </span>
                        )}
                    </div>

                    {/* Delivery Charge & Unit Info */}
                    <div className="flex flex-wrap gap-3">
                        {/* Delivery Charge */}
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2.5 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5"
                        >
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                <Truck className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-orange-500 uppercase tracking-wide">ডেলিভারি চার্জ</p>
                                <p className="text-sm font-bold text-orange-700">
                                    {product.deliveryCharge && Number(product.deliveryCharge) > 0
                                        ? `৳ ${Number(product.deliveryCharge).toLocaleString('bn-BD')}`
                                        : 'ফ্রি ডেলিভারি'
                                    }
                                </p>
                            </div>
                        </motion.div>

                        {/* Unit / Weight */}
                        {product.unit && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Package className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium text-blue-500 uppercase tracking-wide">পরিমাপ একক</p>
                                    <p className="text-sm font-bold text-blue-700">{product.unit}</p>
                                </div>
                            </motion.div>
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
                                                    ? 'border-[#2D331F] bg-[#2D331F]/10 text-[#2D331F] font-semibold shadow-md'
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
                                className='w-9 h-9 rounded-full border-2 border-gray-200 hover:border-[#2D331F] flex items-center justify-center bg-white transition-all disabled:opacity-50'
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                            >
                                <Minus className='h-4 w-4' />
                            </motion.button>
                            <span className='w-10 text-center text-xl font-semibold'>{quantity}</span>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className='w-9 h-9 rounded-full border-2 border-gray-200 hover:border-[#2D331F] flex items-center justify-center bg-white transition-all'
                                onClick={() => handleQuantityChange(quantity + 1)}
                            >
                                <Plus className='h-4 w-4' />
                            </motion.button>
                        </div>
                    </div>
                    {/* Share Button */}
                    <div className="relative">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                variant="outline"
                                className='w-full border-2 border-gray-300 text-gray-600 hover:border-[#2D331F] hover:text-[#2D331F] hover:bg-[#2D331F]/10 transition-all'
                                size='lg'
                                onClick={handleShare}
                            >
                                <Share2 className='mr-2 h-5 w-5' />
                                শেয়ার করুন
                            </Button>
                        </motion.div>

                        {/* Custom Share Modal */}
                        <AnimatePresence>
                            {isShareOpen && (
                                <>
                                    {/* Backdrop */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                                        onClick={() => setIsShareOpen(false)}
                                    />

                                    {/* Modal */}
                                    <motion.div
                                        ref={shareModalRef}
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#2D331F]/15 flex items-center justify-center">
                                                    <Share2 className="w-5 h-5 text-[#2D331F]" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">শেয়ার করুন</h3>
                                                    <p className="text-xs text-gray-500">পণ্যটি বন্ধুদের সাথে শেয়ার করুন</p>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1, rotate: 90 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setIsShareOpen(false)}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                            >
                                                <X className="w-4 h-4 text-gray-500" />
                                            </motion.button>
                                        </div>

                                        {/* Product Preview */}
                                        <div className="px-5 py-3 bg-gray-50/50">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                                                    <Image
                                                        src={allImages[0] || '/placeholder.svg'}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                                                    {product.store?.name && (
                                                        <p className="text-xs text-[#2D331F] flex items-center gap-1 font-medium">
                                                            <Store className="w-3 h-3" />
                                                            {product.store.name}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="ml-auto font-bold text-[#2D331F] text-sm whitespace-nowrap">
                                                    {priceInfo.hasDiscount ? priceInfo.formattedDiscountPrice : priceInfo.formattedPrice}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Social Platforms */}
                                        <div className="px-5 py-4">
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">শেয়ার করুন</p>
                                            <div className="grid grid-cols-6 gap-3">
                                                {[
                                                    { name: 'Facebook', platform: 'facebook', color: 'bg-[#1877F2]', icon: (
                                                        <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                                    )},
                                                    { name: 'WhatsApp', platform: 'whatsapp', color: 'bg-[#25D366]', icon: (
                                                        <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                                    )},
                                                    { name: 'Telegram', platform: 'telegram', color: 'bg-[#0088cc]', icon: (
                                                        <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                                                    )},
                                                    { name: 'Twitter', platform: 'twitter', color: 'bg-black', icon: (
                                                        <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                                    )},
                                                    { name: 'LinkedIn', platform: 'linkedin', color: 'bg-[#0A66C2]', icon: (
                                                        <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                                    )},
                                                    { name: 'Email', platform: 'email', color: 'bg-gradient-to-br from-orange-400 to-red-500', icon: (
                                                        <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                                    )},
                                                ].map((item) => (
                                                    <motion.button
                                                        key={item.platform}
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleShareTo(item.platform)}
                                                        className="flex flex-col items-center gap-1.5 group"
                                                    >
                                                        <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                                                            {item.icon}
                                                        </div>
                                                        <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                                                            {item.name}
                                                        </span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Copy Link Section */}
                                        <div className="px-5 pb-5">
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">অথবা লিংক কপি করুন</p>
                                            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-2">
                                                <div className="flex items-center gap-2 flex-1 min-w-0 bg-white rounded-lg px-3 py-2.5 border border-gray-200">
                                                    <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span className="text-sm text-gray-600 truncate">
                                                        {getShareUrl()}
                                                    </span>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handleCopyLink}
                                                    className={`flex-shrink-0 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                                                        isCopied
                                                            ? 'bg-[#2D331F] text-white'
                                                            : 'bg-[#2D331F] hover:bg-[#3F472F] text-white'
                                                    }`}
                                                >
                                                    {isCopied ? (
                                                        <span className="flex items-center gap-1.5">
                                                            <Check className="w-4 h-4" />
                                                            কপি হয়েছে
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5">
                                                            <Copy className="w-4 h-4" />
                                                            কপি
                                                        </span>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* Action Buttons */}
                    <div className='flex flex-col sm:flex-row gap-3 pt-2'>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                            <Button
                                className='w-full bg-gradient-to-r from-[#2D331F] to-[#40492F] hover:from-[#40492F] hover:to-[#2D331F] text-white shadow-lg hover:shadow-xl transition-all'
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
                                className='w-full bg-white border-2 border-[#2D331F] text-[#2D331F] hover:bg-[#2D331F]/10 transition-all font-semibold'
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
                        <div className='flex items-center gap-2 text-sm text-gray-600 font-medium'>
                            <Shield className='h-4 w-4 text-[#2D331F]' />
                            <span>নিরাপদ লেনদেন</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600 font-medium'>
                            <Truck className='h-4 w-4 text-[#2D331F]' />
                            <span>দ্রুত ডেলিভারি</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600 font-medium'>
                            <CheckCircle className='h-4 w-4 text-[#2D331F]' />
                            <span>গুণগত মান</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue='description' className='mt-6'>
                        <TabsList className='w-full bg-gray-100 p-1 rounded-xl'>
                            <TabsTrigger value='description' className='flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm'>
                                বিবরণ
                            </TabsTrigger>
                            <TabsTrigger value='reviews' className='flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm'>
                                রিভিউ ও রেটিং
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

                        <TabsContent value='reviews' className='mt-4'>
                            <ProductReviewsSection productId={product.id} />
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
                                            <div className='w-16 h-16 rounded-full bg-[#2D331F]/15 flex items-center justify-center'>
                                                <Store className='h-8 w-8 text-[#2D331F]' />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className='text-lg font-semibold'>
                                                {product.store.name}
                                            </h3>
                                            {/* <Link
                                                href={`/store/${product.store.id}`}
                                                className='text-sm text-[#2D331F] hover:underline font-medium'
                                            >
                                                দোকান দেখুন →
                                            </Link> */}
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

                                    {/* <Button asChild className='bg-[#2D331F] hover:bg-[#3F472F]'>
                                        <Link href={`/store/${product.store.id}`}>
                                            এই বিক্রেতার অন্যান্য পণ্য দেখুন
                                        </Link>
                                    </Button> */}
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
                                                            ? 'bg-[#2D331F]/10 text-[#2D331F] border border-[#2D331F]/20 font-semibold'
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
