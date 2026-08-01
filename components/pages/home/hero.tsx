'use client';
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function Hero() {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');

    const statsData = [
        { target: 10000, suffix: '+', label: 'সক্রিয় কৃষক', isComma: true },
        { target: 42, suffix: '', label: 'জেলা কভারেজ', isComma: false },
        { target: 50, suffix: '+', label: 'রিটেইল পার্টনার', isComma: false },
        { target: 98, suffix: '%', label: 'সন্তুষ্ট গ্রাহক', isComma: false },
    ];

    const tabs = ['সব পণ্য', 'সবজি', 'ফল', 'শস্য', 'মাছ', 'সার ও উপকরণ'];

    const handleSearch = () => {
        if (searchInput.trim()) {
            router.push(`/marketplace?term=${encodeURIComponent(searchInput.trim())}`);
        } else {
            router.push('/marketplace');
        }
    };

    // Count-up animation state
    const statsRef = useRef<HTMLDivElement>(null);
    const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });
    const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

    useEffect(() => {
        if (isStatsInView) {
            const duration = 1800; // ms
            const steps = 40;
            const stepTime = duration / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                const progress = Math.min(currentStep / steps, 1);
                // Ease out quad
                const easeProgress = 1 - Math.pow(1 - progress, 3);

                setCounts(statsData.map(stat => Math.floor(stat.target * easeProgress)));

                if (currentStep >= steps) {
                    clearInterval(timer);
                }
            }, stepTime);

            return () => clearInterval(timer);
        }
    }, [isStatsInView]);

    const toBengaliNumber = (num: number, isComma: boolean): string => {
        const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        let str = isComma ? num.toLocaleString('en-US') : num.toString();
        return str.replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
    };

    // Animation Variants
    const fadeUp = {
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#2D331F] overflow-hidden pt-16 pb-32 lg:pb-40 selection:bg-[#EAB308] selection:text-[#2D331F]">
            
            {/* --- Clean Static Background Gradient Pattern (No Floating Animations) --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.15)_0%,transparent_60%)]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.1)_0%,transparent_60%)]"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-10">
                
                {/* --- HERO TITLE & SUBTITLE SECTION --- */}
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center w-full max-w-4xl text-center pt-4"
                >
                    {/* Main Impactful Headline (Single Line & Slightly Smaller Text) */}
                    <motion.div variants={fadeUp} className="mb-4 w-full">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight tracking-tight text-[#EAB308] whitespace-nowrap">
                            কোনো মধ্যস্বত্বভোগী নেই।
                        </h1>
                    </motion.div>

                    {/* Subtitle Description */}
                    <motion.p 
                        variants={fadeUp} 
                        className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl font-medium tracking-wide"
                    >
                        বাংলাদেশের ৪২টি জেলার যাচাইকৃত কৃষকদের প্রোফাইল ঘুরে দেখুন, সরাসরি কথা বলুন এবং নিজেই দরদাম করে কিনুন।
                    </motion.p>
                </motion.div>

                {/* --- SEARCH CARD & STATS SECTION (Increased Width & Bottom Spacing) --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                    className="relative z-40 w-full max-w-5xl"
                >
                    <div className="bg-[#FDFBF7] rounded-[2.25rem] shadow-2xl overflow-hidden border border-white/60">
                        
                        {/* Category Tabs */}
                        <div className="flex flex-wrap items-center justify-center border-b border-gray-200/80 p-3.5 gap-2 bg-white/60">
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
                                    className="px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 relative text-gray-600 hover:text-[#2D331F] hover:bg-[#EAB308]/20"
                                >
                                    <span className="relative z-10">{tab}</span>
                                </button>
                            ))}
                        </div>

                        {/* Search Input Box */}
                        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 border-b border-gray-200/80 bg-white">
                            <div className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-2.5 sm:py-3.5 flex flex-col items-start text-left justify-center focus-within:ring-2 focus-within:ring-[#EAB308]/50 focus-within:border-[#EAB308]/50 transition-all duration-300 shadow-inner group">
                                <label className="text-[11px] text-gray-500 font-bold mb-0.5 uppercase tracking-wider group-focus-within:text-[#2D331F] transition-colors text-left w-full">কি খুঁজছেন?</label>
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
                                    className="w-full outline-none text-[#2D331F] placeholder-gray-400 font-medium bg-transparent text-sm sm:text-base text-left"
                                />
                            </div>

                            {/* Search Button */}
                            <motion.button 
                                onClick={handleSearch}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto h-full min-h-[58px] sm:min-h-[64px] px-10 bg-gradient-to-r from-[#2D331F] to-[#40492F] hover:from-[#40492F] hover:to-[#2D331F] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-[#2D331F]/20"
                            >
                                <Search className="w-4 h-4 text-[#EAB308]" />
                                <span className="text-base font-bold">খুঁজুন</span>
                            </motion.button>
                        </div>

                        {/* Stats Counter Bar */}
                        <div ref={statsRef} className="p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 bg-gradient-to-b from-[#FDFBF7] to-[#F3EFE0]">
                            {statsData.map((stat, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 + 0.4 }}
                                    className={`text-center flex flex-col justify-center relative group ${idx !== statsData.length - 1 ? 'md:after:content-[""] md:after:absolute md:after:right-0 md:after:top-1/4 md:after:h-1/2 md:after:w-px md:after:bg-gray-300' : ''}`}
                                >
                                    <motion.div 
                                        className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2D331F] mb-1 tracking-tighter"
                                        whileHover={{ scale: 1.08, color: "#EAB308" }}
                                    >
                                        {toBengaliNumber(counts[idx], stat.isComma)}{stat.suffix}
                                    </motion.div>
                                    <div className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wide group-hover:text-[#2D331F] transition-colors">
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