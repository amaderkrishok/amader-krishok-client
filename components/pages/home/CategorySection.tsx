'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Compass, Sparkles } from 'lucide-react';
import { ProductCategoryService } from '@/services/product-category-service';
import type { ProductCategoryType } from '@/types/product-category';

interface CategoryVisual {
  name: string;
  count: string;
  image: string;
  gradient: string;
  badgeBg: string;
  tagline: string;
  subcategories: string[];
}

const defaultCategoryVisuals: Record<string, CategoryVisual> = {
  'সবজি': {
    name: 'তাজা সবজি',
    count: '২৪০+ পণ্য',
    tagline: 'ক্ষেত থেকে সরাসরি সংগৃহীত ১০০% সতেজ ও রাসায়নিক মুক্ত সবজি',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
    gradient: 'from-emerald-950/90 via-emerald-900/50 to-transparent',
    badgeBg: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40',
    subcategories: ['টমেটো', 'আলু', 'বেগুন', 'গাজর', 'পুইশাক'],
  },
  'ফল': {
    name: 'মৌসুমি মিষ্টি ফল',
    count: '১৮৫+ পণ্য',
    tagline: 'গাছ পাকা খাঁটি মিষ্টি ও মৌসুমি ফলমূল',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=600',
    gradient: 'from-amber-950/90 via-amber-900/50 to-transparent',
    badgeBg: 'bg-amber-500/25 text-amber-300 border-amber-500/40',
    subcategories: ['আম', 'লিচু', 'কাঁঠাল', 'পেয়ারা'],
  },
  'শস্য': {
    name: 'ধান, চাল ও শস্য',
    count: '৯৫+ পণ্য',
    tagline: 'সুগন্ধি ও পুষ্টিকর অর্গানিক চাল-ডাল',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    gradient: 'from-yellow-950/90 via-yellow-900/50 to-transparent',
    badgeBg: 'bg-yellow-500/25 text-yellow-300 border-yellow-500/40',
    subcategories: ['কাটারিভোগ', 'নাজিরশাইল', 'মুগ ডাল'],
  },
  'মাছ': {
    name: 'মাছ ও জলজ চাষ',
    count: '৭০+ পণ্য',
    tagline: 'নদী ও পুকুরের একদম তাজা দেশি মাছ',
    image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&q=80&w=600',
    gradient: 'from-cyan-950/90 via-cyan-900/50 to-transparent',
    badgeBg: 'bg-cyan-500/25 text-cyan-300 border-cyan-500/40',
    subcategories: ['রুই', 'কাতলা', 'চিংড়ি', 'ইলিশ'],
  },
  'সার ও উপকরণ': {
    name: 'জৈব সার ও উপকরণ',
    count: '৪২+ পণ্য',
    tagline: 'উচ্চ ফলনশীল জৈব সার, বীজ ও আধুনিক সরঞ্জাম',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600',
    gradient: 'from-emerald-950/90 via-emerald-900/50 to-transparent',
    badgeBg: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40',
    subcategories: ['ভার্মিকম্পোস্ট', 'জৈব সার', 'টব'],
  },
};

export function CategorySection() {
  const [categories, setCategories] = useState<ProductCategoryType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const res = await ProductCategoryService.getProductAllCategories();
        if (res && res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const heroCategory = defaultCategoryVisuals['সবজি'];

  return (
    <section className="py-24 bg-[#FDFBF7] relative overflow-hidden">
      {/* Organic Ambient Illumination */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#EAB308]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-[#2D331F]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Floating Organic Leaf Backdrop */}
      <div className="absolute top-16 right-16 text-[#2D331F]/5 pointer-events-none animate-pulse">
        <Leaf className="w-32 h-32" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D331F]/10 border border-[#2D331F]/15 mb-4 text-[#2D331F] text-xs font-extrabold uppercase tracking-wider"
            >
              <Compass className="w-3.5 h-3.5 text-[#EAB308]" />
              <span>মৌসুমি শস্য ও বিভাগ</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2D331F] tracking-tight leading-[1.15]"
            >
              মৌসুমি সেরা বিভাগ ও খাঁটি ফসল
            </motion.h2>
            <p className="text-gray-600 text-base md:text-lg mt-3 max-w-2xl leading-relaxed">
              মাঠ থেকে সরাসরি আপনার খাবার টেবিলে — ১০০% বিশুদ্ধ, ক্ষতিকারক কেমিক্যাল মুক্ত তাজা ফসল ও অর্গানিক কৃষিপণ্য।
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
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#2D331F] hover:bg-[#3F472F] text-white font-extrabold text-sm transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>সব বিভাগ দেখুন</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Asymmetric Editorial Category Layout */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 h-[480px] rounded-3xl bg-gray-200 animate-pulse" />
            <div className="lg:col-span-6 grid grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[228px] rounded-3xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Large Spotlight Hero Category Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6"
            >
              <Link
                href="/marketplace?category=সবজি"
                className="group relative block h-[480px] rounded-[32px] overflow-hidden shadow-2xl border border-black/5 hover:-translate-y-2 transition-all duration-500"
              >
                {/* Hero Background Image */}
                <Image
                  src={heroCategory.image}
                  alt={heroCategory.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Editorial Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${heroCategory.gradient}`} />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#EAB308] text-[#2D331F] shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-[#2D331F]" />
                      <span>বিশেষ স্থান</span>
                    </span>
                    <span className={`text-xs font-extrabold px-3.5 py-1 rounded-full border backdrop-blur-md ${heroCategory.badgeBg}`}>
                      {heroCategory.count}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-3 group-hover:text-[#EAB308] transition-colors leading-tight">
                      {heroCategory.name}
                    </h3>
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6 max-w-md">
                      {heroCategory.tagline}
                    </p>

                    {/* Subcategory Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {heroCategory.subcategories.map((sub, sIdx) => (
                        <span key={sIdx} className="text-xs px-3 py-1 rounded-lg bg-white/15 backdrop-blur-md text-white font-semibold">
                          #{sub}
                        </span>
                      ))}
                    </div>

                    <div className="inline-flex items-center gap-2 text-sm font-extrabold text-[#EAB308] group-hover:underline">
                      <span>তাজা সবজি সংগ্রহ দেখুন</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Right Side 4-card Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {['ফল', 'শস্য', 'মাছ', 'সার ও উপকরণ'].map((key, idx) => {
                const visual = defaultCategoryVisuals[key];
                if (!visual) return null;

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                  >
                    <Link
                      href={`/marketplace?category=${encodeURIComponent(key)}`}
                      className="group relative block h-[228px] rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-black/5 hover:-translate-y-1.5"
                    >
                      <Image
                        src={visual.image}
                        alt={visual.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${visual.gradient}`} />

                      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                        <div className="flex justify-end">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border backdrop-blur-md ${visual.badgeBg}`}>
                            {visual.count}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xl font-extrabold text-white mb-1 group-hover:text-[#EAB308] transition-colors leading-tight">
                            {visual.name}
                          </h4>
                          <p className="text-xs text-gray-300 line-clamp-1 mb-3">
                            {visual.tagline}
                          </p>

                          <div className="flex items-center gap-1 text-xs font-bold text-[#EAB308]">
                            <span>খুঁজুন</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
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
