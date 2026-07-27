'use client';
import { useState } from 'react';
import { 
  PlayCircle,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  ShoppingBag,
  Search,
  ChevronDown
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import TextType from '@/components/global/TextType';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Hero() {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');

    const features = [
        "১০০% Fresh",
        "Chemical Free",
        "Fast Delivery",
        "Trusted Farmers"
    ];

    const stats = [
        { value: '১০,০০০+', label: 'সক্রিয় কৃষক' },
        { value: '৪২', label: 'জেলা কভারেজ' },
        { value: '৫০+', label: 'রিটেইল পার্টনার' },
        { value: '৯৮%', label: 'সন্তুষ্ট গ্রাহক' },
    ];

    const tabs = ['সব পণ্য', 'সবজি', 'ফল', 'শস্য', 'মাছ', 'সার ও উপকরণ'];

    const handleSearch = () => {
        if (searchInput.trim()) {
            router.push(`/marketplace?term=${encodeURIComponent(searchInput.trim())}`);
        } else {
            router.push('/marketplace');
        }
    };

    // Animation Variants
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center bg-[#2D331F] overflow-hidden pt-10 pb-20 selection:bg-[#EAB308] selection:text-[#2D331F]">
            
            {/* --- Background Decorations (Optimized) --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Glows (Using radial gradients instead of heavy blurs) */}
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.15)_0%,transparent_60%)]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.1)_0%,transparent_60%)]"></div>
                
                {/* Floating Leaves (Optimized: Static position, simple pulse) */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-[#4ADE80]/20 animate-pulse"
                        style={{
                            left: `${20 + (i * 15)}%`,
                            top: `${15 + (i * 12 + (i % 2) * 20)}%`,
                            transform: `scale(${0.8 + (i % 3) * 0.2}) rotate(${i * 45}deg)`,
                        }}
                    >
                        <Leaf className="w-8 h-8" />
                    </div>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-24 xl:px-40 2xl:px-12 flex flex-col gap-16">
                
                {/* --- HERO TOP SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center mt-12">
                    
                    {/* --- LEFT SIDE (Content) --- */}
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-start max-w-2xl"
                    >
                        {/* Small Badge */}
                        <motion.div variants={fadeUp} className="mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3f472f]/80 border border-white/10 shadow-lg">
                                <span className="text-lg">🌱</span>
                                <span className="text-[#EAB308] text-sm font-semibold tracking-wide uppercase">Fresh From Farm</span>
                            </div>
                        </motion.div>

                        {/* Main Heading with TextType Component */}
                        <motion.div variants={fadeUp} className="mb-6 min-h-[160px] lg:min-h-[220px]">
                            <TextType 
                                as="h1"
                                text={"আজ সকালের তাজা ফসল,\nআগামীকাল আপনার রান্না ঘরে।"}
                                typingSpeed={50}
                                loop={false}
                                showCursor={true}
                                textColors={['#FFFFFF']}
                                className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold leading-[1.2] tracking-tight"
                            />
                        </motion.div>
                        {/* Description */}
                        <motion.p variants={fadeUp} className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
                            আমরা বাংলাদেশের বিশ্বস্ত কৃষকদের কাছ থেকে সরাসরি তাজা শাকসবজি, ফলমূল ও কৃষিপণ্য সংগ্রহ করি এবং নিরাপদ প্যাকেজিংয়ের মাধ্যমে দ্রুত আপনার দরজায় পৌঁছে দিই।
                        </motion.p>

                        {/* Buttons */}
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mb-12">
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#EAB308] to-[#D97706] hover:from-[#FCD34D] hover:to-[#EAB308] rounded-2xl text-[#2D331F] font-bold text-lg transition-all shadow-[0_8px_30px_rgb(234,179,8,0.3)]"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                <Link href="/marketplace" className="text-[#2D331F] group-hover:text-[#1A1C0B] transition-colors"><span>সবজি কিনুন</span></Link>
                            </motion.button>
                            
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255,255,255,0.1)" }}
                                whileTap={{ scale: 0.95 }}
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#3f472f]/80 border border-white/10 rounded-2xl text-white font-semibold text-lg transition-all shadow-lg"
                            >
                                <PlayCircle className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                                <span>কিভাবে কাজ করে</span>
                            </motion.button>
                        </motion.div>

                        {/* Features */}
                        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-y-4 gap-x-8">
                            {features.map((feature, idx) => (
                                <motion.div 
                                    key={idx} 
                                    className="flex items-center gap-3 group cursor-default"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4ADE80]/20 group-hover:bg-[#4ADE80]/40 transition-colors">
                                        <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                                    </div>
                                    <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{feature}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* --- RIGHT SIDE (Visual Collage) --- */}
                    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center mt-10 lg:mt-0">
                        
                        {/* Main Central Image */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-[320px] lg:max-w-[350px] xl:max-w-[400px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl z-10 ring-1 ring-white/10"
                        >
                            <Image
                                src="/images/main_image.jpeg"
                                alt="Farmer Harvesting"
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        {/* Floating Card: Top Right (Veggie Basket) */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50, y: -50 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="absolute top-4 -right-2 lg:-right-4 xl:-right-8 w-36 lg:w-40 xl:w-48 aspect-square rounded-[24px] overflow-hidden p-2 bg-[#3f472f]/90 border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] z-20"
                        >
                            <div className="relative w-full h-full rounded-[16px] overflow-hidden">
                                <Image
                                    src="/images/Delivery.png"
                                    alt="Delivery"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* Floating Card: Bottom Right (Delivery) */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50, y: 50 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="absolute bottom-10 lg:bottom-16 xl:bottom-20 -right-2 lg:-right-2 xl:-right-0 w-32 lg:w-36 xl:w-40 aspect-[4/3] rounded-[20px] overflow-hidden p-1.5 bg-[#3f472f]/90 border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] z-20"
                        >
                            <div className="relative w-full h-full rounded-[14px] overflow-hidden">
                                <Image
                                    src="/images/cooking.png"
                                    alt="Cooking Family"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* Floating Card: Bottom Left (Family Cooking) */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50, y: 50 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="absolute bottom-4 lg:bottom-10 left-2 lg:-left-2 xl:-left-6 w-40 lg:w-48 xl:w-52 aspect-video rounded-[24px] overflow-hidden p-2 bg-[#3f472f]/90 border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] z-20"
                        >
                            <div className="relative w-full h-full rounded-[16px] overflow-hidden">
                                <Image
                                    src="/images/Farmers.png"
                                    alt="Family Cooking"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* Floating Card: Top Left (Organic Badge UI) */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50, y: -50 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="absolute top-12 lg:top-16 xl:top-20 left-4 lg:left-0 xl:-left-4 flex items-center gap-2 lg:gap-3 xl:gap-4 p-2 lg:p-3 xl:p-4 rounded-[20px] bg-[#3f472f]/90 border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] z-20"
                        >
                            <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-[#4ADE80] to-[#16A34A] shadow-inner">
                                <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-xs lg:text-sm">Organic Certified</p>
                                <p className="text-gray-300 text-[10px] lg:text-xs">100% Safe Foods</p>
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* --- BOTTOM SECTION: Search & Stats (Preserved Functionality) --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                    className="relative z-40 w-full"
                >
                    <div className="bg-[#FDFBF7] rounded-[2rem] shadow-2xl overflow-hidden border border-white/60">
                        
                    
                        <div className="flex flex-wrap items-center border-b border-gray-200/80 p-3 gap-2 bg-white/50">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        if (tab === 'সব পণ্য') {
                                            router.push('/marketplace');
                                        } else {
                                            router.push(`/marketplace?category=${encodeURIComponent(tab)}`);
                                        }
                                    }}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative text-gray-500 hover:text-[#2D331F] hover:bg-[#EAB308]/20"
                                >
                                    <span className="relative z-10">{tab}</span>
                                </button>
                            ))}
                        </div>

                    
                        <div className="p-5 md:p-6 flex flex-col md:flex-row items-center gap-4 border-b border-gray-200/80 bg-white">
                            <div className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-4 flex flex-col justify-center focus-within:ring-2 focus-within:ring-[#EAB308]/50 focus-within:border-[#EAB308]/50 transition-all duration-300 shadow-inner group">
                                <label className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider group-focus-within:text-[#2D331F] transition-colors">কি খুঁজছেন?</label>
                                <input 
                                    type="text" 
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                    placeholder="যেমন: দেশি টমেটো, কাটারিভোগ চাল..." 
                                    className="w-full outline-none text-[#2D331F] placeholder-gray-400 font-medium bg-transparent text-lg"
                                />
                            </div>
                            
                            {/* <div className="w-full md:w-64 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 md:py-4 flex flex-col justify-center cursor-pointer relative group transition-all duration-300 hover:border-[#EAB308]/50 shadow-inner">
                                <label className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">জেলা</label>
                                <div className="flex items-center justify-between">
                                    <span className="text-[#2D331F] font-medium text-lg">ঢাকা</span>
                                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#EAB308] transition-colors" />
                                </div>
                            </div> */}

                            <motion.button 
                                onClick={handleSearch}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full md:w-auto h-full min-h-[76px] px-10 bg-gradient-to-r from-[#2D331F] to-[#40492F] hover:from-[#40492F] hover:to-[#2D331F] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-[#2D331F]/20"
                            >
                                <Search className="w-5 h-5" />
                                <span className="text-lg">খুঁজুন</span>
                            </motion.button>
                        </div>
                        <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 bg-gradient-to-b from-[#FDFBF7] to-[#F3EFE0]">
                            {stats.map((stat, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 + 0.8 }}
                                    className={`text-center flex flex-col justify-center relative group ${idx !== stats.length - 1 ? 'md:after:content-[""] md:after:absolute md:after:right-0 md:after:top-1/4 md:after:h-1/2 md:after:w-px md:after:bg-gray-300' : ''}`}
                                >
                                    <motion.div 
                                        className="text-4xl md:text-5xl font-black text-[#2D331F] mb-2 tracking-tighter"
                                        whileHover={{ scale: 1.1, color: "#EAB308" }}
                                    >
                                        {stat.value}
                                    </motion.div>
                                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wide group-hover:text-[#2D331F] transition-colors">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}