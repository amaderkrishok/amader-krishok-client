'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Eye, Sparkles, ArrowRight, ShieldCheck, Heart, Truck, CheckCircle2 } from 'lucide-react';
import { ProductService } from '@/services/product-service';
import type { Product } from '@/types/product';
import { ProductType, StoreStatus } from '@/types/product';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';

interface FallbackItem {
  id: number;
  name: string;
  categoryTag: string;
  price: string;
  originalPrice?: string;
  unit: string;
  rating: number;
  reviewsCount: number;
  image: string;
  storeName: string;
  isOrganic?: boolean;
}

const fallbackItems: FallbackItem[] = [
  {
    id: 301,
    name: 'দেশি সুস্বাদু অর্গানিক খেঁজুর',
    categoryTag: 'ফল',
    price: '৭৫০',
    originalPrice: '৯০০',
    unit: 'কেজি',
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600',
    storeName: 'ন্যাচারাল অর্গানিক হাউস',
    isOrganic: true,
  },
  {
    id: 302,
    name: 'পদ্মার তাজা নদীর রুই মাছ',
    categoryTag: 'মাছ',
    price: '৪৫০',
    originalPrice: '৫০০',
    unit: 'কেজি',
    rating: 4.9,
    reviewsCount: 188,
    image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&q=80&w=600',
    storeName: 'পদ্মা ফিশারিজ',
    isOrganic: true,
  },
  {
    id: 303,
    name: 'তাজা লাল টমেটো ও শাকসবজি',
    categoryTag: 'সবজি',
    price: '১২০',
    originalPrice: '১৫০',
    unit: 'কেজি',
    rating: 4.8,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
    storeName: 'টেস্ট শপ',
    isOrganic: true,
  },
  {
    id: 304,
    name: 'মিষ্টি ল্যাংড়া ও হিমসাগর আম',
    categoryTag: 'ফল',
    price: '৩০০',
    originalPrice: '৩৫০০',
    unit: 'কেজি',
    rating: 5.0,
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600',
    storeName: 'বরেন্দ্র গ্রীন খামার',
    isOrganic: true,
  },
];

const categoryTabs = ['সকল পণ্য', 'সবজি', 'ফল', 'সার ও উপকরণ', 'মাছ'];

export function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>('সকল পণ্য');
  const [loading, setLoading] = useState<boolean>(true);
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>({});
  const { addItem } = useCart();

  const fetchProducts = useCallback(async (tabName: string) => {
    try {
      setLoading(true);
      const limit = 8;
      const res = await ProductService.getProducts({ limit });
      if (res && res.data && res.data.length > 0) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(activeTab);
  }, [activeTab, fetchProducts]);

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
    toast.success(`"${item.name}" কার্টে যুক্ত করা হয়েছে!`, {
      description: 'ডিজিটাল বাজারে গিয়ে এখনই আপনার অর্ডার সম্পন্ন করুন।',
    });
  };

  const activeProductsList = products.length > 0 ? products : fallbackItems;

  const spotlightProduct = activeProductsList[0];
  const gridProducts = activeProductsList.slice(1, 4);

  return (
    <section className="py-28 bg-[#FAF8F5] relative overflow-hidden border-t border-gray-200/60">
      {/* Background Lighting Elements */}
      <div className="absolute top-1/4 left-0 w-[30rem] h-[30rem] bg-[#EAB308]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[30rem] h-[30rem] bg-[#2D331F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header & Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D331F]/10 border border-[#2D331F]/15 mb-4 text-[#2D331F] text-xs font-black uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
              <span>জনপ্রিয় পণ্য কালেকশন</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2D331F] tracking-tight leading-tight"
            >
              আকর্ষণীয় সেরা পণ্যসমূহ
            </motion.h2>
            <p className="text-gray-600 text-base md:text-lg mt-3 max-w-xl">
              সরাসরি আমাদের রেজিস্টার্ড কৃষকদের বাগান ও খামার থেকে সংগৃহীত ১০০% বিশুদ্ধ অর্গানিক কৃষিপণ্য।
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
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#2D331F] hover:bg-[#3F472F] text-white font-black text-sm transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>সকল পণ্য দেখুন</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Category Filter Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-12 pb-3 border-b border-gray-200">
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl text-xs font-black transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-[#2D331F] text-white shadow-xl scale-105'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-[#2D331F] hover:text-[#2D331F]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Asymmetric Product Showcase Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 h-[500px] rounded-3xl bg-gray-200 animate-pulse" />
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[500px] rounded-3xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT SPOTLIGHT HERO PRODUCT CARD */}
            {spotlightProduct && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 flex"
              >
                <div className="group relative w-full bg-white rounded-[36px] p-6 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
                  <div>
                    {/* Spotlight Image */}
                    <div className="relative aspect-[4/3] w-full rounded-[28px] overflow-hidden mb-6 bg-gray-100">
                      <Image
                        src={
                          ('simpleProduct' in spotlightProduct && spotlightProduct.simpleProduct?.images?.[0]?.imageUrl) ||
                          ('image' in spotlightProduct && (spotlightProduct as any).image) ||
                          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600'
                        }
                        alt={spotlightProduct.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Organic & Fast Delivery Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-[#2D331F]/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-full border border-white/10 shadow-md">
                          <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
                          <span>১০০% অর্গানিক খাঁটি</span>
                        </span>
                        <span className="inline-flex items-center gap-1 bg-amber-500/90 backdrop-blur-md text-[#2D331F] text-[11px] font-black px-3 py-1 rounded-full shadow-md">
                          <Truck className="w-3.5 h-3.5" />
                          <span>২৪ ঘণ্টায় ডেলিভারি</span>
                        </span>
                      </div>

                      {/* Floating Wishlist Heart */}
                      <button
                        onClick={() => toggleLike(spotlightProduct.id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white text-gray-700 transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            likedProducts[spotlightProduct.id] ? 'fill-rose-500 text-rose-500' : 'hover:text-rose-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Store Name & Rating */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="font-extrabold text-[#2D331F]/80 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />
                        {('store' in spotlightProduct && spotlightProduct.store?.name) ||
                          ('storeName' in spotlightProduct && (spotlightProduct as any).storeName) ||
                          'ন্যাচারাল ফারমার'}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-black">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>৫.০ (১২০+ রিভিউ)</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <Link href={`/marketplace/product/${spotlightProduct.id}`}>
                      <h3 className="text-2xl font-black text-[#2D331F] mb-3 leading-snug group-hover:text-[#D97706] transition-colors">
                        {spotlightProduct.name}
                      </h3>
                    </Link>

                    {/* Price & Unit */}
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-3xl font-black text-[#2D331F]">
                        ৳{('simpleProduct' in spotlightProduct && spotlightProduct.simpleProduct?.price) || (spotlightProduct as any).price}
                      </span>
                      <span className="text-sm text-gray-400 font-bold">
                        / {spotlightProduct.unit || 'কেজি'}
                      </span>
                    </div>
                  </div>

                  {/* Dual Action CTA */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    <Link href={`/marketplace/product/${spotlightProduct.id}`} className="w-full">
                      <button className="w-full py-3.5 rounded-2xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>বিস্তারিত</span>
                      </button>
                    </Link>

                    <button
                      onClick={() => handleAddToCart(spotlightProduct)}
                      className="w-full py-3.5 rounded-2xl bg-[#2D331F] hover:bg-[#EAB308] hover:text-[#2D331F] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg hover:shadow-xl"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>কিনুন</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* RIGHT COLUMN GRID (3 Cards) */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-6">
              {gridProducts.map((product, idx) => {
                const img =
                  ('simpleProduct' in product && product.simpleProduct?.images?.[0]?.imageUrl) ||
                  ('image' in product && (product as any).image) ||
                  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600';
                const price =
                  ('simpleProduct' in product && product.simpleProduct?.price) ||
                  (product as any).price ||
                  '১০০';
                const isLiked = likedProducts[product.id];

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    whileHover={{ y: -6 }}
                    className="group bg-[#FFFFFF] rounded-[32px] p-4 border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden mb-4 bg-gray-100">
                        <Image
                          src={img}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 20vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Wishlist Heart Button */}
                        <button
                          onClick={() => toggleLike(product.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white text-gray-700 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isLiked ? 'fill-rose-500 text-rose-500' : 'hover:text-rose-500'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Store & Rating */}
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                        <span className="font-bold text-[#2D331F]/80">
                          {('store' in product && product.store?.name) || (product as any).storeName || 'খামার শপ'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>৪.৯</span>
                        </div>
                      </div>

                      {/* Name */}
                      <Link href={`/marketplace/product/${product.id}`}>
                        <h4 className="text-base font-extrabold text-[#2D331F] mb-2 leading-snug group-hover:text-[#D97706] transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                      </Link>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-black text-[#2D331F]">
                          ৳{price}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          / {product.unit || 'কেজি'}
                        </span>
                      </div>
                    </div>

                    {/* Action Triggers */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                      <Link href={`/marketplace/product/${product.id}`} className="w-full">
                        <button className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 flex items-center justify-center gap-1 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                          <span>দেখুন</span>
                        </button>
                      </Link>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-2.5 rounded-xl bg-[#2D331F] hover:bg-[#EAB308] hover:text-[#2D331F] text-white font-extrabold text-xs flex items-center justify-center gap-1 transition-all shadow-md"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>কিনুন</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
