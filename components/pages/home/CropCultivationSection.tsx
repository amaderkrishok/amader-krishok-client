'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Sprout, Bug, ShieldCheck, ArrowRight, ShoppingCart, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { CropCultivationService, type CropDto } from '@/services/crop-cultivation-service';

interface CropCardItem {
  id: string;
  name: string;
  season: string;
  stagesCount: number;
  diseaseCount: number;
  description: string;
  image: string;
  badge: string;
}

const getCropImage = (name: string, index: number): string => {
  const lower = name.toLowerCase();
  if (lower.includes('ধান') || lower.includes('চাল') || lower.includes('rice') || lower.includes('paddy')) {
    return '/images/Dhan.avif';
  }
  if (lower.includes('আলু') || lower.includes('potato')) {
    return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800';
  }
  if (lower.includes('টমেটো') || lower.includes('tomato')) {
    return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800';
  }
  if (lower.includes('গম') || lower.includes('wheat')) {
    return 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800';
  }
  const fallbacks = [
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
    '/images/Dhan.avif',
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800',
  ];
  return fallbacks[index % fallbacks.length];
};

const defaultFallbackCrops: CropCardItem[] = [
  {
    id: '1',
    name: 'টমেটো',
    season: 'রবি মৌসুম',
    stagesCount: 4,
    diseaseCount: 3,
    description: 'উন্নত প্রযুক্তিতে টমেটো চাষ, জমি প্রস্তুতি, সুষম সার প্রয়োগ ও নাবি ধসা রোগ দমন।',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
    badge: 'জনপ্রিয় ফসল',
  },
  {
    id: '2',
    name: 'ধান',
    season: 'আমন ও বোরো মৌসুম',
    stagesCount: 5,
    diseaseCount: 4,
    description: 'বীজ শোধন, চারা রোপণ, সেচ ব্যবস্থাপনা ও মাজরা পোকা দমনের বৈজ্ঞানিক উপায়।',
    image: '/images/Dhan.avif',
    badge: 'প্রধান খাদ্যশস্য',
  },
  {
    id: '3',
    name: 'আলু',
    season: 'শীতকালীন রবি',
    stagesCount: 4,
    diseaseCount: 3,
    description: 'উচ্চ ফলনশীল জাত নির্বাচন, সুষম সার এবং লেইট ব্লাইট মড়ক রোগ প্রতিরোধ।',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800',
    badge: 'উচ্চ ফলনশীল',
  },
];

export function CropCultivationSection() {
  const [crops, setCrops] = useState<CropCardItem[]>(defaultFallbackCrops);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDynamicCrops = useCallback(async () => {
    try {
      setLoading(true);
      const res = await CropCultivationService.getCrops({ page: 1, limit: 3, includeRelations: true });
      let cropsList: CropDto[] = [];
      if ('data' in res && Array.isArray(res.data)) {
        cropsList = res.data;
      }

      if (cropsList.length > 0) {
        const formatted: CropCardItem[] = cropsList.slice(0, 3).map((c, i) => ({
          id: c.id,
          name: c.name,
          season: i === 0 ? 'রবি মৌসুম' : i === 1 ? 'আমন ও বোরো' : 'শীতকালীন রবি',
          stagesCount: c.cultivations?.length || 4,
          diseaseCount: c.diseases?.length || 3,
          description: `${c.name} চাষের উন্নত প্রযুক্তি, পর্যায়ক্রমিক জমি প্রস্তুত, সার প্রয়োগ ও রোগ-বালাই প্রতিরোধ নির্দেশিকা।`,
          image: getCropImage(c.name, i),
          badge: i === 0 ? 'জনপ্রিয় ফসল' : i === 1 ? 'প্রধান খাদ্যশস্য' : 'উচ্চ ফলনশীল',
        }));
        setCrops(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch dynamic crops for home section:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDynamicCrops();
  }, [fetchDynamicCrops]);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-[10%] xl:px-[14%] 2xl:px-12 py-16 sm:py-24 bg-gradient-to-b from-[#FAF9F3] via-white to-[#FAF9F3] text-[#172033] relative overflow-hidden border-b border-gray-200/60">
      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5B800]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3F6212]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3F6212]/10 border border-[#3F6212]/20 mb-3 text-[#3F6212] text-xs font-bold uppercase tracking-wider"
            >
              <Sprout className="w-4 h-4 text-[#F5B800]" />
              <span>আধুনিক কৃষি নির্দেশিকা</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-[#172033] tracking-tight leading-tight"
            >
              ফসল চাষ প্রক্রিয়া ও রোগবালাই
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#64748B] text-sm sm:text-base mt-2 max-w-2xl font-medium"
            >
              দেশসেরা কৃষি বিশেষজ্ঞদের দ্বারা প্রণীত আধুনিক চাষাবাদ পদ্ধতি, জমি প্রস্তুতি, সঠিক সার প্রয়োগ ও রোগ-বালাই প্রতিরোধ নির্দেশিকা।
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-3 flex-wrap sm:flex-nowrap"
          >
            <Link
              href="/crop-cultivation"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 hover:border-[#3F6212] text-[#172033] font-bold text-sm transition-all shadow-sm hover:bg-gray-50"
            >
              <BookOpen className="w-4 h-4 text-[#3F6212]" />
              <span>সব গাইড দেখুন</span>
            </Link>

            <Link
              href="/marketplace"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5B800] hover:bg-[#e0a800] text-[#172033] font-bold text-sm transition-all shadow-md hover:scale-105"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>বীজ ও উপকরণ কিনুন</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Crop Grid (3 items in 1 row) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[380px] rounded-3xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {crops.slice(0, 3).map((crop, idx) => {
              const cultivationUrl = crop.id.length > 5 
                ? `/crop-cultivation?cropId=${crop.id}`
                : `/crop-cultivation?crop=${encodeURIComponent(crop.name)}`;
              const marketplaceUrl = `/marketplace?term=${encodeURIComponent(crop.name)}`;

              return (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-3xl p-5 border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Crop Image */}
                    <Link href={cultivationUrl} className="block relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-5 bg-gray-100">
                      <Image
                        src={crop.image}
                        alt={crop.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#26351B]/90 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                          {crop.badge}
                        </span>
                      </div>
                    </Link>

                    {/* Meta Tags */}
                    <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold mb-2">
                      <span className="flex items-center gap-1 text-[#3F6212] bg-[#3F6212]/10 px-2.5 py-0.5 rounded-md">
                        <Sprout className="w-3.5 h-3.5" />
                        {crop.season}
                      </span>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {crop.stagesCount} ধাপ
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-rose-600 font-bold">
                          <Bug className="w-3.5 h-3.5" />
                          {crop.diseaseCount} প্রতিরোধ
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <Link href={cultivationUrl}>
                      <h3 className="text-xl font-extrabold text-[#172033] group-hover:text-[#3F6212] transition-colors mb-2 leading-snug">
                        {crop.name} চাষ ও পরিচর্যা
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-[#64748B] font-medium leading-relaxed line-clamp-2 mb-4">
                      {crop.description}
                    </p>
                  </div>

                  {/* Dynamic Action Buttons */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <Link
                      href={cultivationUrl}
                      className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-[#3F6212] hover:text-white text-xs font-bold text-[#3F6212] flex items-center gap-1 transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>চাষ পদ্ধতি</span>
                    </Link>

                    <Link
                      href={marketplaceUrl}
                      className="px-3.5 py-2 rounded-xl bg-[#26351B] hover:bg-[#F5B800] hover:text-[#172033] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>ওষুধ ও বীজ কিনুন</span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Call-to-Action Banner with Direct /marketplace Redirection */}
        

      </div>
    </section>
  );
}

