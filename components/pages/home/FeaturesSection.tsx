'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Leaf, TrendingUp, Droplets, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const sliderContent = [
    {
        title: 'টেকসই কৃষি উন্নয়নে আপনার নির্ভরযোগ্য অংশীদার',
        description: 'পরিবেশবান্ধব চর্চা ও আধুনিক প্রযুক্তির মাধ্যমে কৃষিতে বিপ্লব ঘটাচ্ছে।',
        motto: 'সবুজ ভবিষ্যৎ গড়ি',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
        color: 'from-emerald-600 to-teal-600',
    },
    {
        title: 'সুনির্দিষ্ট চাষাবাদে সর্বোচ্চ উৎপাদন',
        description: 'ডেটা-ভিত্তিক বিশ্লেষণ ব্যবহার করে আপনার ফসল উৎপাদন দক্ষতার সাথে বৃদ্ধি করুন।',
        motto: 'বুদ্ধিমত্তার সাথে চাষ',
        image: 'https://images.unsplash.com/photo-1589923188651-268a9765e432',
        color: 'from-green-600 to-emerald-600',
    },
    {
        title: 'নবপ্রবর্তিত সেচ ব্যবস্থা',
        description: 'জল সংরক্ষণ করুন এবং আমাদের স্মার্ট সেচ পদ্ধতির মাধ্যমে ফসলের স্বাস্থ্যের উন্নতি করুন।',
        motto: 'জল বাঁচান, ফল বাড়ান',
        image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b',
        color: 'from-teal-600 to-cyan-600',
    },
    {
        title: 'জৈব কীটনাশক ব্যবস্থাপনা',
        description: 'পরিবেশবান্ধব পদ্ধতিতে আপনার ফসলকে প্রাকৃতিকভাবে রক্ষা করুন।',
        motto: 'প্রকৃতির ছোঁয়ায় সুরক্ষা',
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d',
        color: 'from-emerald-600 to-green-600',
    },
];

const features = [
    {
        title: 'সুনির্দিষ্ট কৃষি',
        description: 'স্মার্ট প্রযুক্তি নির্ভর উন্নত ও কার্যকর চাষাবাদ',
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d',
        icon: TrendingUp,
        delay: 0,
    },
    {
        title: 'মাছ চাষ',
        description: 'উন্নত প্রযুক্তিতে লাভজনক ও টেকসই মাছ চাষ',
        image: 'https://images.unsplash.com/photo-1568727349458-1bb59fb3fb63',
        icon: Droplets,
        delay: 0.1,
    },
    {
        title: 'ছাদ কৃষি',
        description: 'শহরে টেকসই ও স্বাস্থ্যকর সবুজ চাষাবাদ',
        image: 'https://images.unsplash.com/photo-1615671524827-c1fe3973b648',
        icon: Leaf,
        delay: 0.2,
    },
];

export default function FeaturesSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderContent.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isAutoPlaying]);

    const nextSlide = () => {
        setIsAutoPlaying(false);
        setCurrentSlide((prev) => (prev + 1) % sliderContent.length);
        setTimeout(() => setIsAutoPlaying(true), 8000);
    };

    const prevSlide = () => {
        setIsAutoPlaying(false);
        setCurrentSlide((prev) => (prev - 1 + sliderContent.length) % sliderContent.length);
        setTimeout(() => setIsAutoPlaying(true), 8000);
    };

    return (
        <section ref={sectionRef} className="py-24 px-4 md:px-8 lg:px-24 xl:px-40 2xl:px-12 bg-[#2D331F] text-white relative overflow-hidden selection:bg-[#EAB308] selection:text-[#2D331F]">
            
            {/* Background Decorations (Matching Banner Pattern) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.12)_0%,transparent_60%)]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.1)_0%,transparent_60%)]"></div>
                
                {/* Floating Leaves */}
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-[#4ADE80]/20 animate-pulse"
                        style={{
                            left: `${15 + (i * 25)}%`,
                            top: `${20 + (i * 18 + (i % 2) * 15)}%`,
                            transform: `scale(${0.8 + (i % 3) * 0.2}) rotate(${i * 45}deg)`,
                        }}
                    >
                        <Leaf className="w-8 h-8" />
                    </div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-[#3f472f]/80 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 shadow-lg">
                        <span className="text-lg">🌱</span>
                        <span className="text-sm font-semibold text-[#EAB308] tracking-wide uppercase">আমাদের বিশ্বাস</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#EAB308] mb-4 tracking-tight">
                        আমাদের কাজের ক্ষেত্র
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-[#EAB308] to-[#4ADE80] mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                        আমরা বিশ্বাস করি যে একটি ছোট কিন্তু প্রতিজ্ঞাবদ্ধ ও লক্ষ্যনিষ্ঠ দল
                        টেকসই কৃষিতে দীর্ঘস্থায়ী প্রভাব রাখতে পারে।
                    </p>
                </motion.div>

                {/* Main Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px] lg:auto-rows-[320px]">
                    
                    {/* Feature 1 - Large Slider Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="relative overflow-hidden rounded-3xl lg:col-span-2 row-span-2 group border border-white/10 shadow-2xl"
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.1, opacity: 0 }}
                                transition={{ duration: 0.7 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={sliderContent[currentSlide].image}
                                    alt={sliderContent[currentSlide].title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2D331F]/90 via-black/40 to-black/20" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Top Controls */}
                        <div className="relative h-full p-6 md:p-8 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-[#EAB308] font-bold font-mono">0{currentSlide + 1}</span>
                                    <div className="h-px w-8 bg-[#EAB308]/50" />
                                    <span className="text-sm text-gray-200 font-medium">{sliderContent[currentSlide].motto}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevSlide}
                                        className="w-9 h-9 rounded-full bg-[#3f472f]/80 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-[#EAB308] hover:text-[#2D331F] text-white transition-all shadow-md"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="w-9 h-9 rounded-full bg-[#3f472f]/80 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-[#EAB308] hover:text-[#2D331F] text-white transition-all shadow-md"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Slide Content */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                                        {sliderContent[currentSlide].title}
                                    </h3>
                                    <p className="text-gray-300 text-base md:text-lg max-w-lg">
                                        {sliderContent[currentSlide].description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {sliderContent.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setIsAutoPlaying(false);
                                        setCurrentSlide(idx);
                                        setTimeout(() => setIsAutoPlaying(true), 8000);
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        currentSlide === idx
                                            ? 'w-8 bg-[#EAB308]'
                                            : 'w-4 bg-white/40 hover:bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Feature 2 - Eco Marketplace Card */}
                    <Link href="/marketplace">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{ scale: 1.02 }}
                            className="relative rounded-3xl overflow-hidden group cursor-pointer h-full border border-white/10 shadow-xl"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1632776350300-11016768b521"
                                alt="Marketplace"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2D331F]/90 via-black/40 to-black/20" />
                            <div className="relative h-full p-6 flex flex-col justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-[#3f472f]/80 border border-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
                                        <span className="text-xs text-[#EAB308] font-semibold">Eco Marketplace</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Find and sell eco produce easily</h3>
                                    <div className="flex items-center gap-2 text-[#EAB308] group-hover:gap-3 transition-all font-semibold">
                                        <span className="text-sm">Explore</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Feature 3 - Sustainable Impact Card (Banner Color Pattern) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="bg-[#3f472f]/90 border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                                <Leaf className="w-3.5 h-3.5 text-[#4ADE80]" />
                                <span className="text-xs text-[#EAB308] font-semibold">Sustainable Impact</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#EAB308]/20 flex items-center justify-center border border-[#EAB308]/30">
                                <Shield className="w-5 h-5 text-[#EAB308]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div>
                                <p className="text-3xl md:text-4xl font-black text-[#EAB308]">40%</p>
                                <p className="text-sm text-gray-300 mt-1 font-medium">পানি সাশ্রয়</p>
                                <div className="w-full h-1.5 bg-black/30 rounded-full mt-2 overflow-hidden">
                                    <div className="w-[40%] h-full bg-[#4ADE80] rounded-full"></div>
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-black text-[#EAB308]">2.5M</p>
                                <p className="text-sm text-gray-300 mt-1 font-medium">গাছ রোপণ</p>
                                <div className="w-full h-1.5 bg-black/30 rounded-full mt-2 overflow-hidden">
                                    <div className="w-[75%] h-full bg-[#4ADE80] rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-sm text-gray-200 font-medium">
                                <span>CO₂ হ্রাস</span>
                                <span className="font-bold text-[#4ADE80]">+32%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/30 rounded-full mt-1.5 overflow-hidden">
                                <div className="w-[32%] h-full bg-[#4ADE80] rounded-full"></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom 3 Feature Cards */}
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.4 + feature.delay }}
                                whileHover={{ y: -5 }}
                                onMouseEnter={() => setHoveredCard(idx)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className="relative overflow-hidden rounded-3xl group cursor-pointer border border-white/10 shadow-xl"
                                style={{ minHeight: '280px' }}
                            >
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2D331F]/90 via-black/40 to-black/20" />
                                
                                <div className={`absolute inset-0 bg-gradient-to-r from-[#2D331F]/80 to-transparent transition-opacity duration-500 ${hoveredCard === idx ? 'opacity-100' : 'opacity-0'}`} />

                                <div className="relative h-full p-6 flex flex-col justify-end">
                                    <div className="mb-3 transform transition-transform duration-300 group-hover:scale-110">
                                        <div className="w-10 h-10 rounded-full bg-[#3f472f]/80 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-[#EAB308]" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{feature.title}</h3>
                                    <p className="text-gray-300 text-sm font-medium">{feature.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}