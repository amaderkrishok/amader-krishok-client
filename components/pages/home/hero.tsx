'use client';

import { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Truck,
  Grid,
  Package,
  Leaf
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TextType from '@/components/global/TextType';

export function Hero() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');

  const popularSearches = [
    { label: '🥬 শাকসবজি', term: 'শাকসবজি' },
    { label: '🍅 টমেটো', term: 'টমেটো' },
    { label: '🥭 আম', term: 'আম' },
    { label: '🌾 চাল', term: 'চাল' },
    { label: '🥔 আলু', term: 'আলু' },
  ];

  const handleSearch = (term?: string) => {
    const query = term !== undefined ? term : searchInput;
    if (query.trim()) {
      router.push(`/marketplace?term=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/marketplace');
    }
  };

  // Motion animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  return (
    <div className="relative w-full bg-[#2D331F] text-white overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 selection:bg-[#EAB308] selection:text-[#2D331F]">
      
      {/* --- Background Decorations (Previous Dark Theme Glows & Leaves) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.15)_0%,transparent_60%)]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.12)_0%,transparent_60%)]" />
        
        {/* Floating Leaves */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-[#4ADE80]/20 animate-pulse"
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${12 + (i * 14 + (i % 2) * 20)}%`,
              transform: `scale(${0.8 + (i % 3) * 0.2}) rotate(${i * 45}deg)`,
            }}
          >
            <Leaf className="w-8 h-8" />
          </div>
        ))}
      </div>

      {/* Main Content Container (Max width 1280px) */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* --- LEFT SIDE (45% -> lg:col-span-6 xl:col-span-5) --- */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 xl:col-span-5 flex flex-col items-start"
          >
            {/* Small Badge */}
            <motion.div variants={fadeInUp} className="mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3f472f]/90 border border-white/10 shadow-lg">
               
                <span className="text-[#EAB308] text-xs sm:text-sm font-semibold tracking-wide uppercase">
                  সরাসরি কৃষকের হাত থেকে
                </span>
              </div>
            </motion.div>

            {/* Main Animated Headline using TextType */}
            <motion.div variants={fadeInUp} className="mb-5 min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] w-full">
              <TextType 
                as="h1"
                text={"সতেজতার নিশ্চয়তা,\nকৃষকের হাত থেকে"}
                typingSpeed={80}
                deletingSpeed={40}
                pauseDuration={2500}
                loop={true}
                showCursor={true}
                cursorCharacter="|"
                cursorClassName="text-[#EAB308]"
                textColors={['#FFFFFF', '#EAB308', '#4ADE80']}
                className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.2] tracking-tight"
              />
            </motion.div>

            {/* Subheading */}
            <motion.p variants={fadeInUp} className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              বাংলাদেশের বিশ্বস্ত কৃষকদের কাছ থেকে তাজা শাকসবজি, ফলমূল, চাল, মসলা ও অন্যান্য কৃষিপণ্য সরাসরি আপনার ঘরে পৌঁছে দিই।
            </motion.p>

            {/* Large Rounded Search Bar */}
            <motion.div variants={fadeInUp} className="w-full max-w-xl mb-3">
              <div className="h-[60px] w-full bg-white border border-white/20 rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center px-4 transition-all focus-within:ring-2 focus-within:ring-[#EAB308]/60">
                <Search className="w-5 h-5 text-[#2D331F] shrink-0 mr-3" />
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                  placeholder="আপনি কী খুঁজছেন? যেমন: টমেটো, আম, চাল..."
                  className="w-full bg-transparent outline-none text-[#2D331F] placeholder-gray-400 text-sm sm:text-base font-medium"
                />
                <button 
                  onClick={() => handleSearch()}
                  className="bg-gradient-to-r from-[#FF9800] to-[#E65100] hover:from-[#F57C00] hover:to-[#FF9800] text-white font-semibold text-sm sm:text-base px-6 py-2.5 rounded-[14px] shadow-md hover:shadow-lg transition-all shrink-0 ml-2 cursor-pointer active:scale-95"
                >
                  খুঁজুন
                </button>
              </div>
            </motion.div>

            {/* Popular Searches */}
            <motion.div variants={fadeInUp} className="w-full max-w-xl flex flex-wrap items-center gap-2 mb-8 text-xs sm:text-sm text-gray-300">
              <span className="font-medium text-gray-200 mr-1">জনপ্রিয়:</span>
              {popularSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchInput(item.term);
                    handleSearch(item.term);
                  }}
                  className="bg-[#3f472f]/80 hover:bg-[#3f472f] text-gray-200 border border-white/10 px-3.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all hover:scale-105 hover:border-[#EAB308]/40"
                >
                  {item.label}
                </button>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <Link href="/marketplace" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#EAB308] to-[#D97706] hover:from-[#FCD34D] hover:to-[#EAB308] text-[#2D331F] font-bold text-base px-8 py-3.5 rounded-[16px] shadow-[0_8px_30px_rgba(234,179,8,0.3)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 text-[#2D331F]" />
                  <span>এখনই কিনুন</span>
                </motion.button>
              </Link>

              <Link href="/marketplace" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto bg-[#3f472f]/80 hover:bg-[#4a5438] text-white border border-white/10 font-semibold text-base px-8 py-3.5 rounded-[16px] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>সব পণ্য দেখুন</span>
                  <ArrowRight className="w-5 h-5 text-gray-300" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Small Trust Badges */}
            <motion.div variants={fadeInUp} className="w-full pt-6 border-t border-white/10 flex flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center gap-2 bg-[#3f472f]/60 border border-white/10 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span>সরাসরি কৃষকের কাছ থেকে</span>
              </div>

              <div className="flex items-center gap-2 bg-[#3f472f]/60 border border-white/10 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span>সতেজতার নিশ্চয়তা</span>
              </div>

              <div className="flex items-center gap-2 bg-[#3f472f]/60 border border-white/10 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span>দ্রুত হোম ডেলিভারি</span>
              </div>
            </motion.div>
          </motion.div>

          {/* --- RIGHT SIDE (55% -> lg:col-span-6 xl:col-span-7) --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 xl:col-span-7 relative w-full flex items-center justify-center lg:justify-end"
          >
            {/* Main Image Container */}
            <div className="relative w-full max-w-[580px] aspect-[4/3] sm:aspect-[14/10] rounded-[28px] overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#3f472f]/50">
              
              {/* Photo Image */}
              <Image 
                src="/images/hero_farmer_fresh_produce.jpg"
                alt="Bangladeshi farmer holding basket of fresh produce"
                fill
                priority
                className="object-cover object-center"
              />

              {/* Soft Gradient Overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Top Organic Badge UI */}
              <motion.div 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 backdrop-blur-md bg-[#3f472f]/90 border border-white/15 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-3 z-20"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4ADE80] to-[#16A34A] flex items-center justify-center shadow-inner">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white">১০০% খামার সতেজ</p>
                  <p className="text-[10px] sm:text-xs text-gray-300">অর্গানিক সার্টিফাইড</p>
                </div>
              </motion.div>

              {/* Glassmorphism Card Overlay at Bottom */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 backdrop-blur-xl bg-[#3f472f]/90 border border-white/15 shadow-2xl rounded-[22px] p-3.5 sm:p-4 z-20"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
                  
                  {/* Item 1 */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#4ADE80]/20 text-[#4ADE80] flex items-center justify-center shrink-0">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">🌾 Fresh Today</div>
                      <div className="text-[10px] sm:text-xs text-gray-300">আজকের তাজা পণ্য</div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EAB308]/20 text-[#EAB308] flex items-center justify-center shrink-0">
                      <Grid className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">20+ Categories</div>
                      <div className="text-[10px] sm:text-xs text-gray-300">বিভিন্ন ক্যাটাগরি</div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#4ADE80]/20 text-[#4ADE80] flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">1000+ Products</div>
                      <div className="text-[10px] sm:text-xs text-gray-300">মানসম্মত পণ্য</div>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EAB308]/20 text-[#EAB308] flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">Fast Delivery</div>
                      <div className="text-[10px] sm:text-xs text-gray-300">দ্রুত ডেলিভারি</div>
                    </div>
                  </div>

                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}