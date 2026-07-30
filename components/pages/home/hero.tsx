'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, Leaf } from 'lucide-react';
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
        hidden: { opacity: 0, y: 35 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.15 }
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#2D331F] overflow-hidden pt-12 pb-20 selection:bg-[#EAB308] selection:text-[#2D331F]">
            
            {/* --- Background Layers (Depth & Vignette) --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Radial Gradient for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3f472f]/80 via-[#2D331F] to-[#181c11]"></div>
                
                {/* Soft Vignette Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.5)_100%)]"></div>

                {/* Subtle Organic Pattern Overlays */}
                <div 
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '36px 36px',
                    }}
                />

                {/* Glow Spheres */}
                <div className="absolute top-[-15%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.18)_0%,transparent_65%)] blur-2xl"></div>
                <div className="absolute bottom-[-15%] right-[15%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.14)_0%,transparent_65%)] blur-2xl"></div>
                
                {/* Floating Leaves (Micro Animations) */}
                {[
                    { left: '12%', top: '22%', scale: 1.1, duration: 7, delay: 0 },
                    { left: '84%', top: '18%', scale: 0.9, duration: 9, delay: 1 },
                    { left: '22%', top: '72%', scale: 0.8, duration: 8, delay: 0.5 },
                    { left: '78%', top: '68%', scale: 1.2, duration: 10, delay: 1.5 },
                    { left: '48%', top: '12%', scale: 0.75, duration: 6, delay: 0.8 },
                ].map((leaf, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-[#4ADE80]/20"
                        style={{ left: leaf.left, top: leaf.top }}
                        animate={{
                            y: [-12, 12, -12],
                            rotate: [0, 15, -15, 0],
                            scale: [leaf.scale, leaf.scale * 1.08, leaf.scale],
                        }}
                        transition={{
                            duration: leaf.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: leaf.delay,
                        }}
                    >
                        <Leaf className="w-9 h-9" />
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center gap-12">
                
                {/* --- HERO TITLE & SUBTITLE SECTION --- */}
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center max-w-3xl text-center pt-6 relative"
                >
                    {/* Soft Yellow Glow Behind Title */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-[#EAB308]/20 blur-3xl rounded-full pointer-events-none"></div>

                    {/* Main Impactful Headline */}
                    <motion.div variants={fadeUp} className="mb-5 relative">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.15] tracking-tight text-[#EAB308] drop-shadow-[0_0_35px_rgba(234,179,8,0.35)]">
                            কোনো মধ্যস্বত্বভোগী নেই।
                        </h1>
                    </motion.div>

                    {/* Subtitle Description */}
                    <motion.p 
                        variants={fadeUp} 
                        className="text-amber-50/90 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl font-medium tracking-wide"
                    >
                        বাংলাদেশের ৪২টি জেলার যাচাইকৃত কৃষকদের প্রোফাইল ঘুরে দেখুন, সরাসরি কথা বলুন এবং নিজেই দরদাম করে কিনুন।
                    </motion.p>
                </motion.div>

                {/* --- SEARCH CARD & STATS SECTION --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-40 w-full max-w-4xl group"
                >
                    {/* Soft Spotlight Glow Behind Search Card */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#EAB308]/25 via-[#4ADE80]/15 to-[#EAB308]/25 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none"></div>

                    {/* Main Glassmorphic Search Card */}
                    <div className="relative bg-[#FDFBF7]/95 backdrop-blur-md rounded-[2.25rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-white/80 transition-all duration-500 hover:shadow-[0_35px_70px_-15px_rgba(0,0,0,0.6)]">
                        
                        {/* Category Tabs */}
                        <div className="flex flex-wrap items-center justify-center border-b border-gray-200/80 p-3.5 gap-2 bg-white/60 backdrop-blur-sm">
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
                                    className="px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 relative text-gray-600 hover:text-[#2D331F] hover:bg-[#EAB308]/15 hover:shadow-sm"
                                >
                                    <span className="relative z-10">{tab}</span>
                                </button>
                            ))}
                        </div>

                        {/* Search Input Box */}
                        <div className="p-5 sm:p-7 flex flex-col sm:flex-row items-center gap-4 border-b border-gray-200/80 bg-white">
                            <div className="flex-1 w-full bg-gray-50/90 border border-gray-200/90 rounded-2xl px-6 py-3.5 sm:py-4.5 flex flex-col items-start text-left justify-center focus-within:ring-2 focus-within:ring-[#EAB308]/60 focus-within:border-[#EAB308]/60 focus-within:bg-white transition-all duration-300 shadow-inner group/input">
                                <label className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider group-focus-within/input:text-[#2D331F] transition-colors text-left w-full">কি খুঁজছেন?</label>
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
                                    className="w-full outline-none text-[#2D331F] placeholder-gray-400 font-semibold bg-transparent text-lg sm:text-xl text-left"
                                />
                            </div>

                            {/* Search Button with Premium Gradient */}
                            <motion.button 
                                onClick={handleSearch}
                                whileHover={{ scale: 1.025, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto h-full min-h-[68px] sm:min-h-[76px] px-10 bg-gradient-to-r from-[#2D331F] via-[#3d452a] to-[#2D331F] hover:from-[#3d452a] hover:to-[#2D331F] text-white rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl shadow-[#2D331F]/30 hover:shadow-[#EAB308]/20 ring-1 ring-white/10"
                            >
                                <Search className="w-5 h-5 text-[#EAB308]" />
                                <span className="text-lg tracking-wide">খুঁজুন</span>
                            </motion.button>
                        </div>

                        {/* Stats Counter Bar with Count-Up Animation */}
                        <div ref={statsRef} className="p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 bg-gradient-to-b from-[#FDFBF7] to-[#F5F1E5]">
                            {statsData.map((stat, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 + 0.5 }}
                                    className={`text-center flex flex-col justify-center relative group ${idx !== statsData.length - 1 ? 'md:after:content-[""] md:after:absolute md:after:right-0 md:after:top-1/4 md:after:h-1/2 md:after:w-px md:after:bg-gray-300/80' : ''}`}
                                >
                                    <motion.div 
                                        className="text-4xl sm:text-5xl md:text-5xl font-black text-[#2D331F] mb-1 tracking-tighter"
                                        whileHover={{ scale: 1.08, color: "#EAB308" }}
                                        transition={{ type: "spring", stiffness: 400 }}
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