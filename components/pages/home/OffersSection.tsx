'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Eye, Store, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { ProductService } from '@/services/product-service';
import type { Product } from '@/types/product';
import { ProductType, StoreStatus } from '@/types/product';
import { useCart } from '@/context/cart-context';
import { toast } from 'sonner';

interface FallbackItem {
  id: number;
  name: string;
  price: string;
  unit: string;
  rating: number;
  image: string;
  storeName: string;
}

const fallbackItems: FallbackItem[] = [
  {
    id: 401,
    name: 'দেশি টাটকা শসা',
    price: '৬০',
    unit: 'কেজি',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600',
    storeName: 'কৃষক ভাই অর্গানিক্স',
  },
  {
    id: 402,
    name: 'সোনালী মুরগির ডিম',
    price: '১৫০',
    unit: 'ডজন',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&q=80&w=600',
    storeName: 'গ্রামের পোল্ট্রি',
  },
  {
    id: 403,
    name: 'বিশুদ্ধ গাওয়া ঘি',
    price: '১২০০',
    unit: 'কেজি',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1581454536642-4f329971bc1d?auto=format&fit=crop&q=80&w=600',
    storeName: 'আসল ডেইরি ফার্ম',
  },
  {
    id: 404,
    name: 'টাটকা লাল শাক',
    price: '৩০',
    unit: 'আঁটি',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1615485925600-97237c4ff1cb?auto=format&fit=crop&q=80&w=600',
    storeName: 'সবুজ বাংলা কৃষিক্ষেত',
  }
];

export function OffersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>({});
  const { addItem } = useCart();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ProductService.getProducts({ limit: 4 });
      if (res && res.data && res.data.length > 0) {
        setProducts(res.data.slice(0, 4));
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

  return (
    <section className="py-28 bg-[#1C2314] text-white relative overflow-hidden">
      {/* Ambient Lighting Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.15)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.12)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D331F] border border-white/15 mb-4 text-[#EAB308] text-xs font-black uppercase tracking-wider shadow-lg"
            >
              <Store className="w-4 h-4 text-[#EAB308]" />
              <span>ডিজিটাল কৃষি বাজার</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
            >
              কৃষকের বাজার থেকে সরাসরি
            </motion.h2>
            <p className="text-gray-300 text-base md:text-lg mt-3 max-w-xl">
              মধ্যস্বত্বভোগী ছাড়াই সরাসরি কৃষকের খামার থেকে তাজা পণ্য আপনার দোরগোড়ায়। যাচাইকৃত, নিরাপদ এবং ১০০% অর্গানিক।
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
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#EAB308] hover:bg-[#FCD34D] text-[#2D331F] font-black text-sm transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>বাজারে প্রবেশ করুন</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[450px] rounded-3xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeList.map((product, idx) => {
              const img =
                ('simpleProduct' in product && product.simpleProduct?.images?.[0]?.imageUrl) ||
                ('image' in product && (product as any).image) ||
                'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600';
              const price =
                ('simpleProduct' in product && product.simpleProduct?.price) ||
                (product as any).price ||
                '১০০';
              const isLiked = likedProducts[product.id];
              const storeName = ('store' in product && product.store?.name) || (product as any).storeName || 'কৃষক শপ';

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="group bg-[#262E1B] rounded-[32px] p-4 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-[#EAB308]/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden mb-5 bg-[#1C2314]">
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      />
                      
                      {/* Organic Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 bg-[#2D331F]/90 backdrop-blur-md text-[#4ADE80] text-[10px] font-black px-2.5 py-1 rounded-full border border-white/10 shadow-md">
                          <ShieldCheck className="w-3 h-3" />
                          <span>খাঁটি</span>
                        </span>
                      </div>

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={() => toggleLike(product.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#1C2314]/70 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-[#EAB308] hover:text-[#2D331F] text-white transition-colors border border-white/10"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isLiked ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Store & Rating */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                      <span className="font-bold flex items-center gap-1.5 truncate max-w-[120px]">
                        <Store className="w-3.5 h-3.5 text-[#EAB308]" />
                        <span className="truncate">{storeName}</span>
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-extrabold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>৪.৯</span>
                      </div>
                    </div>

                    {/* Name Link */}
                    <Link href={`/marketplace/product/${product.id}`}>
                      <h4 className="text-lg font-extrabold text-white mb-2 leading-snug group-hover:text-[#EAB308] transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                    </Link>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-5">
                      <span className="text-2xl font-black text-[#EAB308]">
                        ৳{price}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        / {product.unit || 'কেজি'}
                      </span>
                    </div>
                  </div>

                  {/* Action Triggers */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                    <Link href={`/marketplace/product/${product.id}`} className="w-full">
                      <button className="w-full py-2.5 rounded-xl border border-white/15 text-gray-300 font-bold text-xs hover:bg-white/10 flex items-center justify-center gap-1.5 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                        <span>দেখুন</span>
                      </button>
                    </Link>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#EAB308] hover:text-[#2D331F] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>কিনুন</span>
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
