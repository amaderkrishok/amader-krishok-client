'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { StoreService } from '@/services/store-service';
import type { Store as StoreType } from '@/types/store';
import { ShieldCheck, MapPin, Star, ArrowRight, Award, ChevronRight, Store } from 'lucide-react';

interface FallbackVendor {
  id: string;
  name: string;
  location: string;
  rating: number;
  ordersCount: number;
  coverImage: string;
  profileImage: string;
  specialty: string;
  isVerified: boolean;
}

const fallbackVendors: FallbackVendor[] = [
  {
    id: 'vendor-101',
    name: 'ন্যাচারাল অর্গানিক হাউস',
    location: 'যশোর, খুলনা',
    rating: 4.9,
    ordersCount: 340,
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600',
    profileImage: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200',
    specialty: 'খাঁটি দেশি ফলমূল ও সবজি অর্গানিক বাগান',
    isVerified: true,
  },
  {
    id: 'vendor-102',
    name: 'পদ্মা ফিশারিজ ও খামার',
    location: 'রাজশাহী, রাজশাহী',
    rating: 5.0,
    ordersCount: 520,
    coverImage: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&q=80&w=600',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    specialty: 'পদ্মা নদী ও প্রাকৃতিক উপায়ে পালিত মাছ',
    isVerified: true,
  },
  {
    id: 'vendor-103',
    name: 'বরেন্দ্র গ্রীন ডেইরি ও ফার্ম',
    location: 'পাবনা, রাজশাহী',
    rating: 4.8,
    ordersCount: 290,
    coverImage: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&q=80&w=600',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    specialty: 'বিশুদ্ধ গাওয়া ঘি, দুধ ও ঘি প্রস্তুতকারক',
    isVerified: true,
  },
  {
    id: 'vendor-104',
    name: 'সবুজ বাংলা অর্গানিক নার্সারি',
    location: 'বগুড়া, রাজশাহী',
    rating: 4.9,
    ordersCount: 410,
    coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    specialty: 'উন্নত জাতের হাইব্রিড বীজ ও জৈব সার',
    isVerified: true,
  },
];

export function VendorsSection() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchVendors = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await StoreService.getStores({ limit: 4, status: 'approved' });
      if (res && res.data && res.data.length > 0) {
        setStores(res.data.slice(0, 4));
      } else {
        setStores([]);
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const activeVendorList = stores.length > 0 ? stores : fallbackVendors;

  return (
    <section className="py-24 bg-[#2D331F] text-white relative overflow-hidden selection:bg-[#EAB308] selection:text-[#2D331F] border-t border-white/10">
      {/* Background Lighting Elements */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(234,179,8,0.15)_0%,transparent_60%)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(74,222,128,0.12)_0%,transparent_60%)] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3f472f]/80 border border-white/10 mb-4 text-[#EAB308] text-xs font-black uppercase tracking-wider shadow-lg"
            >
              <Award className="w-4 h-4 text-[#EAB308]" />
              <span>যাচাইকৃত খামারি ও মার্চেন্ট</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-[#EAB308] tracking-tight leading-tight"
            >
              আমাদের শীর্ষ খামার ও বিক্রেতাবৃন্দ
            </motion.h2>
            <p className="text-gray-300 text-base md:text-lg mt-3 max-w-xl font-medium">
              সরাসরি মাঠ পর্যায়ের ভেরিফাইড কৃষক ও অর্গানিক খামারিদের সাথে যুক্ত হয়ে নিরাপদে কেনাকাটা করুন।
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/marketplace/stores"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#EAB308] hover:bg-[#FCD34D] text-[#2D331F] font-black text-sm transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>সকল দোকান দেখুন</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* 4 Vendor Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[400px] rounded-[32px] bg-[#3f472f]/60 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeVendorList.map((vendor, idx) => {
              const storeId = vendor.id;
              const storeName = vendor.name;
              const location =
                ('district' in vendor && vendor.district ? `${vendor.district}, ${vendor.division || ''}` : null) ||
                (vendor as any).location ||
                'বাংলাদেশ';
              const coverImg =
                ('storeCoverImage' in vendor && vendor.storeCoverImage) ||
                (vendor as any).coverImage ||
                'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600';
              const profileImg =
                ('storeImage' in vendor && vendor.storeImage) ||
                (vendor as any).profileImage ||
                'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200';
              const specialty = vendor?.description || (vendor as any).specialty || 'উচ্চমানের তাজা কৃষি ও খামার পণ্য সরবরাহকারী';
              const rating = (vendor as any).rating || 4.9;

              return (
                <motion.div
                  key={storeId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="group bg-[#3f472f]/90 rounded-[32px] border border-white/10 shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Banner Image */}
                    <div className="relative aspect-[16/9] w-full bg-gray-900 overflow-hidden">
                      <Image
                        src={coverImg}
                        alt={storeName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2D331F]/80 via-transparent to-transparent" />
                      
                      {/* Location Badge on Cover */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full border border-white/20">
                          <MapPin className="w-3 h-3 text-[#EAB308]" />
                          <span>{location}</span>
                        </span>
                      </div>
                    </div>

                    {/* Profile Avatar Overlay & Store Header */}
                    <div className="px-5 pt-0 pb-4 relative">
                      <div className="flex justify-between items-end -mt-10 mb-3">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-4 border-[#3f472f] shadow-xl bg-gray-800">
                          <Image
                            src={profileImg}
                            alt={storeName}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>

                        {/* Verified Shield Badge */}
                        <div className="inline-flex items-center gap-1 bg-[#2D331F] text-[#4ADE80] text-[10px] font-black px-2.5 py-1 rounded-full border border-white/10 shadow-md">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
                          <span>ভেরিফাইড খামার</span>
                        </div>
                      </div>

                      {/* Store Name */}
                      <Link href={`/marketplace/stores/${storeId}`}>
                        <h3 className="text-lg font-black text-[#EAB308] mb-1 leading-snug group-hover:text-amber-200 transition-colors line-clamp-1">
                          {storeName}
                        </h3>
                      </Link>

                      {/* Rating & Review */}
                      <div className="flex items-center gap-1 text-[#EAB308] font-extrabold text-xs mb-3">
                        <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
                        <span>{rating}</span>
                        <span className="text-gray-300 font-medium ml-1">(৩০০+ হ্যাপি কাস্টমার)</span>
                      </div>

                      {/* Specialty / Description */}
                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-2 mb-4 font-medium">
                        {specialty}
                      </p>
                    </div>
                  </div>

                  {/* Visit Store Action Button */}
                  <div className="p-5 pt-0">
                    <Link href={`/marketplace/stores/${storeId}`} className="block w-full">
                      <button className="w-full py-3 rounded-2xl bg-[#2D331F] hover:bg-[#EAB308] text-[#EAB308] hover:text-[#2D331F] font-black text-xs flex items-center justify-center gap-2 transition-all duration-300 border border-white/10 group-hover:bg-[#EAB308] group-hover:text-[#2D331F]">
                        <Store className="w-3.5 h-3.5" />
                        <span>দোকান পরিদর্শন করুন</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
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