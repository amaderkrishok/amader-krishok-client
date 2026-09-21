'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Store, ShieldCheck, Heart, ArrowRight, Star } from 'lucide-react';
import { ProductService } from '@/services/product-service';
import { ProductReviewService } from '@/services/product-review-service';
import type { Product } from '@/types/product';
import { ProductType, StoreStatus } from '@/types/product';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';

interface FallbackItem {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  unit: string;
  rating: number;
  image: string;
  storeName: string;
}

const fallbackItems: FallbackItem[] = [
  {
    id: 409,
    name: 'তাজা নদীর পাঙ্গাস মাছ',
    price: '৫৫০০',
    originalPrice: '৬০০০',
    unit: 'কেজি',
    rating: 0.0,
    image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&q=80&w=600',
    storeName: 'পদ্মা ফিশারিজ',
  },
  {
    id: 402,
    name: 'সোনালী মুরগির ডিম',
    price: '১৫০',
    unit: 'ডজন',
    rating: 0.0,
    image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&q=80&w=600',
    storeName: 'গ্রামের পোল্ট্রি',
  },
  {
    id: 403,
    name: 'বিশুদ্ধ গাওয়া ঘি',
    price: '১৫০০',
    unit: 'কেজি',
    rating: 0.0,
    image: 'https://images.unsplash.com/photo-1581454536642-4f329971bc1d?auto=format&fit=crop&q=80&w=600',
    storeName: 'আসল ডেইরি ফার্ম',
  },
  {
    id: 405,
    name: 'অর্গানিক ল্যাংড়া আম',
    price: '২০০',
    unit: 'কেজি',
    rating: 0.0,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600',
    storeName: 'রাজশাহী আম বাগান',
  },
  {
    id: 401,
    name: 'দেশি টাটকা শসা',
    price: '৬০',
    unit: 'কেজি',
    rating: 0.0,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600',
    storeName: 'কৃষক ভাই অর্গানিক্স',
  },
  {
    id: 406,
    name: 'খাঁটি রানি ধানের চাল',
    price: '৭৫',
    unit: 'কেজি',
    rating: 0.0,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=600',
    storeName: 'দিনাজপুর এগ্রো ফার্ম',
  },
  {
    id: 404,
    name: 'টাটকা লাল শাক',
    price: '৩০',
    unit: 'আঁটি',
    rating: 0.0,
    image: 'https://images.unsplash.com/photo-1615485925600-97237c4ff1cb?auto=format&fit=crop&q=80&w=600',
    storeName: 'সবুজ বাংলা কৃষিক্ষেত',
  },
  {
    id: 407,
    name: 'পাহাড়ি প্রাকৃতিক মধু',
    price: '৮৫০',
    unit: 'কেজি',
    rating: 0.0,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600',
    storeName: 'সুন্দরবন হিল হানি',
  },
];

export function OffersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>({});
  const { addItem } = useCart();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ProductService.getProducts({ limit: 8 });
      if (res && res.data && res.data.length > 0) {
        const fetchedProducts = res.data.slice(0, 8);
        const productIds = fetchedProducts.map((p) => p.id);
        const batchRatings: Record<number, any> = await ProductReviewService.getBatchSummaries(productIds).catch(() => ({}));

        const updatedProducts = fetchedProducts.map((p) => ({
          ...p,
          rating: batchRatings[p.id]?.averageRating ?? 0,
        }));

        setProducts(updatedProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Failed to fetch marketplace products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleLike = (id: number) => {
    setLikedProducts((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success(!likedProducts[id] ? 'পছন্দের তালিকায় যুক্ত হয়েছে!' : 'পছন্দের তালিকা থেকে সরানো হয়েছে');
  };

  const getFullProduct = (item: Product | FallbackItem): Product => {
    if ('productType' in item) {
      return item;
    }
    const numericPrice = Number(String(item.price).replace(/[^\d.]/g, '')) || 100;
    return {
      id: item.id,
      name: item.name,
      slug: `product-${item.id}`,
      unit: item.unit || 'কেজি',
      deliveryCharge: 50,
      productType: ProductType.SIMPLE,
      store: {
        id: 'fallback-store-id',
        name: item.storeName,
        status: StoreStatus.APPROVED,
      },
      productCategories: [],
      simpleProduct: {
        price: numericPrice,
        images: [{ imageUrl: item.image, isPrimary: true }],
      },
    };
  };

  const handleAddToCart = (item: Product | FallbackItem) => {
    const fullProduct = getFullProduct(item);
    addItem(fullProduct, 1);
    toast.success(`"${item.name}" কার্টে যুক্ত করা হয়েছে!`, {
      description: 'অর্ডার সম্পন্ন করতে কার্ট স্ল্যাইডবার অথবা চেকআউটে যান।',
    });
  };

  const activeList = products.length > 0 ? products : fallbackItems;

  // Sort products descending by rating
  const sortedList = [...activeList]
    .sort((a, b) => {
      const rA = Number(('rating' in a && a.rating) ?? (a as any).avgRating ?? 0);
      const rB = Number(('rating' in b && b.rating) ?? (b as any).avgRating ?? 0);
      return rB - rA;
    })
    .slice(0, 8);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 bg-[#FAF9F3] text-[#172033] relative overflow-hidden border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3F6212]/10 border border-[#3F6212]/20 mb-2 text-[#3F6212] text-xs font-bold uppercase tracking-wider"
            >
              <Store className="w-3.5 h-3.5 text-[#F5B800]" />
              <span>আজকের সেরা রেটিংপ্রাপ্ত কৃষিপণ্য</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-[#172033] tracking-tight leading-tight"
            >
              কৃষকের বাজার থেকে সরাসরি
            </motion.h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-1 max-w-xl font-medium">
              সেরা কাস্টমার রেটিংপ্রাপ্ত তাজা কৃষিপণ্য সরাসরি কৃষকের খামার থেকে আপনার দোরগোড়ায়।
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/marketplace"
              className="group inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F5B800] hover:bg-[#e0a800] text-[#172033] font-bold text-xs sm:text-sm transition-all shadow-sm hover:scale-105"
            >
              <span>সকল পণ্য দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Product Grid - 4 items per row across 2 rows (8 items total) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedList.map((product, idx) => {
              const img =
                ('simpleProduct' in product && product.simpleProduct?.images?.[0]?.imageUrl) ||
                ('image' in product && (product as any).image) ||
                'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600';
              const isPangas = product.name?.toLowerCase().includes('pangas') || product.name?.includes('পাঙ্গাস');
              const price = isPangas ? '5500.00' : (
                ('simpleProduct' in product && (product.simpleProduct?.discountPrice || product.simpleProduct?.price)) ||
                (product as any).price ||
                '১০০'
              );
              const originalPrice = isPangas ? '6000.00' : (
                ('simpleProduct' in product && product.simpleProduct?.discountPrice ? product.simpleProduct?.price : undefined) ||
                ('originalPrice' in product ? (product as any).originalPrice : undefined)
              );
              const rating = Number(('rating' in product && product.rating) ?? (product as any).avgRating ?? 0).toFixed(1);
              const isLiked = likedProducts[product.id];
              const storeName = ('store' in product && product.store?.name) || (product as any).storeName || 'কৃষক শপ';

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-4 bg-gray-100">
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-md text-[11px] font-bold text-white shadow-sm flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-white" />
                          <span>সরাসরি খামার</span>
                        </span>
                        
                        {/* <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleLike(product.id);
                          }}
                          className="pointer-events-auto p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-rose-500 transition-colors shadow-sm"
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button> */}
                      </div>
                    </div>

                    {/* Store Info & Rating */}
                    <div className="flex items-center justify-between gap-1.5 text-xs text-[#64748B] font-medium mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <Store className="w-3.5 h-3.5 text-[#65A30D] shrink-0" />
                        <span className="truncate">{storeName}</span>
                      </div>

                      {/* Rating Star Badge */}
                      <div className="flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-[#F5B800] text-[#F5B800]" />
                        <span>{rating}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#172033] group-hover:text-[#3F6212] transition-colors line-clamp-1 mb-2">
                      {product.name}
                    </h3>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
                    <div>
                      <span className="text-xs text-[#64748B] font-medium block">মূল্য</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold text-[#26351B]">
                          ৳{price}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-gray-400 font-medium line-through">
                            ৳{originalPrice}
                          </span>
                        )}
                        <span className="text-xs text-[#64748B] font-normal">/ কেজি</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2.5 rounded-xl bg-[#26351B] hover:bg-[#1B2813] text-white transition-colors shadow-sm flex items-center justify-center cursor-pointer"
                      title="কার্টে যোগ করুন"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
