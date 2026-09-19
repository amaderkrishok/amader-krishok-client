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
    <section className="w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 py-16 sm:py-20 bg-[#F5F3EA] text-[#172033] relative overflow-hidden border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3F6212]/10 border border-[#3F6212]/20 mb-3 text-[#3F6212] text-xs font-bold uppercase tracking-wider"
            >
              <Award className="w-4 h-4 text-[#F5B800]" />
              <span>যাচাইকৃত কৃষক ও বিক্রেতা</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-[#172033] tracking-tight leading-tight"
            >
              আমাদের কৃষক
            </motion.h2>
            <p className="text-[#64748B] text-sm sm:text-base mt-2 max-w-xl font-medium">
              দেশের বিভিন্ন জেলার নিবন্ধিত ও বিশ্বস্ত খামারিদের সাথে সরাসরি কথা বলুন এবং সরাসরি অর্ডার করুন।
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
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#26351B] hover:bg-[#1B2813] text-white font-bold text-sm transition-all shadow-md hover:scale-105"
            >
              <span>সকল কৃষক দেখুন</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* 4 Minimal Vendor Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[280px] rounded-2xl bg-gray-200 animate-pulse" />
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
              const profileImg =
                ('storeImage' in vendor && vendor.storeImage) ||
                (vendor as any).profileImage ||
                'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200';
              const rating = (vendor as any).rating || 4.9;

              return (
                <motion.div
                  key={storeId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Profile image + Badge */}
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#65A30D] shadow-sm bg-gray-100 flex-shrink-0">
                        <Image
                          src={profileImg}
                          alt={storeName}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>

                      <div className="overflow-hidden">
                        <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#3F6212] mb-0.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#65A30D]" />
                          <span>ভেরিফাইড কৃষক</span>
                        </div>
                        <Link href={`/marketplace/stores/${storeId}`}>
                          <h3 className="text-base font-bold text-[#172033] group-hover:text-[#3F6212] transition-colors truncate">
                            {storeName}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    {/* Location & Details */}
                    <div className="space-y-1.5 text-xs text-[#64748B] font-medium mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#F5B800]" />
                        <span className="truncate">{location}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-[#172033] font-bold">
                          <Star className="w-3.5 h-3.5 fill-[#F5B800] text-[#F5B800]" />
                          <span>{rating}</span>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F3] border border-gray-200 text-[11px] font-semibold text-[#3F6212]">
                          ১৫+ তাজা পণ্য
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visit Store Action Button */}
                  <Link href={`/marketplace/stores/${storeId}`} className="block w-full">
                    <button className="w-full py-2.5 rounded-xl bg-[#FAF9F3] hover:bg-[#26351B] text-[#172033] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 border border-gray-200/80 group-hover:border-[#26351B]">
                      <Store className="w-3.5 h-3.5" />
                      <span>প্রোফাইল দেখুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}