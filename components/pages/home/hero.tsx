'use client';

import { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Truck,
  Grid,
  Package,
  Leaf
} from 'lucide-react';
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

  const highlights = [
    { icon: Leaf, title: 'Fresh Today', subtitle: 'আজকের তাজা পণ্য', color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/20' },
    { icon: Grid, title: '20+ Categories', subtitle: 'বিভিন্ন ক্যাটাগরি', color: 'text-[#EAB308]', bg: 'bg-[#EAB308]/20' },
    { icon: Package, title: '1000+ Products', subtitle: 'মানসম্মত পণ্য', color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/20' },
    { icon: Truck, title: 'Fast Delivery', subtitle: 'দ্রুত ডেলিভারি', color: 'text-[#EAB308]', bg: 'bg-[#EAB308]/20' },
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
    <div className="relative w-full min-h-[580px] lg:min-h-[640px] bg-[#2D331F] text-white overflow-hidden py-16 sm:py-20 lg:py-24 flex flex-col items-center justify-center selection:bg-[#EAB308] selection:text-[#2D331F]">
      
      {/* --- Background Decorative Elements --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glows */}
        <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[70vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.14)_0%,transparent_65%)]" />
        <div className="absolute bottom-[-20%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.1)_0%,transparent_60%)]" />
        <div className="absolute bottom-[-20%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.1)_0%,transparent_60%)]" />
        
        {/* Floating Leaves */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-[#4ADE80]/20 animate-pulse"
            style={{
              left: `${10 + (i * 11)}%`,
              top: `${15 + (i * 9 + (i % 2) * 25)}%`,
              transform: `scale(${0.7 + (i % 3) * 0.25}) rotate(${i * 45}deg)`,
            }}
          >
            <Leaf className="w-8 h-8" />
          </div>
        ))}
      </div>

      {/* Main Content Container (Centered Layout) */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col items-center"
        >
          {/* Top Pill Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3f472f]/90 border border-white/10 shadow-lg">
              <Sparkles className="w-4 h-4 text-[#EAB308]" />
              <span className="text-[#EAB308] text-xs sm:text-sm font-semibold tracking-wide uppercase">
                সরাসরি কৃষকের হাত থেকে
              </span>
            </div>
          </motion.div>

          {/* Centered Main Animated Headline */}
          <motion.div variants={fadeInUp} className="mb-6 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] w-full flex justify-center">
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
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.25] tracking-tight text-center"
            />
          </motion.div>

          {/* Centered Subheading */}
          <motion.p 
            variants={fadeInUp} 
            className="text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl text-center"
          >
            বাংলাদেশের বিশ্বস্ত কৃষকদের কাছ থেকে তাজা শাকসবজি, ফলমূল, চাল, মসলা ও অন্যান্য কৃষিপণ্য সরাসরি আপনার ঘরে পৌঁছে দিই।
          </motion.p>

          {/* Centered Large Rounded Search Bar */}
          <motion.div variants={fadeInUp} className="w-full max-w-2xl mb-4">
            <div className="h-[62px] w-full bg-white border border-white/20 rounded-[20px] shadow-[0_12px_35px_rgba(0,0,0,0.35)] flex items-center px-4 transition-all focus-within:ring-2 focus-within:ring-[#EAB308]/70">
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
                className="bg-gradient-to-r from-[#FF9800] to-[#E65100] hover:from-[#F57C00] hover:to-[#FF9800] text-white font-semibold text-sm sm:text-base px-7 py-3 rounded-[16px] shadow-md hover:shadow-lg transition-all shrink-0 ml-2 cursor-pointer active:scale-95"
              >
                খুঁজুন
              </button>
            </div>
          </motion.div>

          {/* Popular Searches */}
          <motion.div variants={fadeInUp} className="w-full max-w-2xl flex flex-wrap items-center justify-center gap-2 mb-10 text-xs sm:text-sm text-gray-300">
            <span className="font-medium text-gray-200 mr-1">জনপ্রিয় অনুসন্ধান:</span>
            {popularSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchInput(item.term);
                  handleSearch(item.term);
                }}
                className="bg-[#3f472f]/80 hover:bg-[#3f472f] text-gray-200 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all hover:scale-105 hover:border-[#EAB308]/50 shadow-sm"
              >
                {item.label}
              </button>
            ))}
          </motion.div>

          {/* Centered CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4 mb-12 w-full sm:w-auto">
            <Link href="/marketplace" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto bg-gradient-to-r from-[#EAB308] to-[#D97706] hover:from-[#FCD34D] hover:to-[#EAB308] text-[#2D331F] font-bold text-base px-9 py-4 rounded-[18px] shadow-[0_8px_30px_rgba(234,179,8,0.35)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-[#2D331F]" />
                <span>এখনই কিনুন</span>
              </motion.button>
            </Link>

            <Link href="/marketplace" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto bg-[#3f472f]/90 hover:bg-[#4a5438] text-white border border-white/15 font-semibold text-base px-9 py-4 rounded-[18px] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>সব পণ্য দেখুন</span>
                <ArrowRight className="w-5 h-5 text-gray-300" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Highlights Row (Glassmorphic Cards) */}
          <motion.div variants={fadeInUp} className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
            {highlights.map((h, idx) => {
              const Icon = h.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#3f472f]/70 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3 backdrop-blur-xs text-left shadow-md"
                >
                  <div className={`w-10 h-10 rounded-xl ${h.bg} ${h.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">{h.title}</div>
                    <div className="text-[10px] sm:text-xs text-gray-300">{h.subtitle}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Small Trust Badges */}
          <motion.div variants={fadeInUp} className="w-full pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 bg-[#3f472f]/60 border border-white/10 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-200 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
              <span>সরাসরি কৃষকের কাছ থেকে</span>
            </div>

            <div className="flex items-center gap-2 bg-[#3f472f]/60 border border-white/10 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-200 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
              <span>সতেজতার নিশ্চয়তা</span>
            </div>

            <div className="flex items-center gap-2 bg-[#3f472f]/60 border border-white/10 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-200 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
              <span>দ্রুত হোম ডেলিভারি</span>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
}