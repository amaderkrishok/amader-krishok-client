'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Leaf, TrendingUp, Droplets, Users, Shield, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
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
        <section ref={sectionRef} className="py-24 px-4 md:px-8 bg-gradient-to-b from-white via-emerald-50/30 to-white relative overflow-hidden">
           
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-emerald-100/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                      
                        <span className="text-sm font-medium text-emerald-700 tracking-wide">আমাদের বিশ্বাস</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                        আমাদের কাজের ক্ষেত্র
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        আমরা বিশ্বাস করি যে একটি ছোট কিন্তু প্রতিজ্ঞাবদ্ধ ও লক্ষ্যনিষ্ঠ দল
                        টেকসই কৃষিতে দীর্ঘস্থায়ী প্রভাব রাখতে পারে।
                    </p>
                </motion.div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px] lg:auto-rows-[320px]">
                    {/* Feature 1 - Large Slider Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="relative overflow-hidden rounded-3xl lg:col-span-2 row-span-2 group"
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
                            </motion.div>
                        </AnimatePresence>

                       
                        <div className="relative h-full p-6 md:p-8 flex flex-col justify-between">
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-white/80 font-mono">0{currentSlide + 1}</span>
                                    <div className="h-px w-8 bg-white/40" />
                                    <span className="text-sm text-white/80">{sliderContent[currentSlide].motto}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevSlide}
                                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-white" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>

                          
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
                                    <p className="text-white/80 text-base md:text-lg max-w-lg">
                                        {sliderContent[currentSlide].description}
                                    </p>
                                    <div className="flex items-center gap-2 text-emerald-300 group-hover:gap-3 transition-all">
                                        
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                      
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {sliderContent.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setIsAutoPlaying(false);
                                        setCurrentSlide(idx);
                                        setTimeout(() => setIsAutoPlaying(true), 8000);
                                    }}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        currentSlide === idx
                                            ? 'w-8 bg-emerald-400'
                                            : 'w-4 bg-white/40 hover:bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>
                    </motion.div>

                  
                    <Link href="/marketplace">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{ scale: 1.02 }}
                            className="relative rounded-3xl overflow-hidden group cursor-pointer h-full"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1632776350300-11016768b521"
                                alt="Marketplace"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
                            <div className="relative h-full p-6 flex flex-col justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
                                        <span className="text-xs text-white">Eco Marketplace</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Find and sell eco produce easily</h3>
                                    <div className="flex items-center gap-2 text-emerald-300 group-hover:gap-3 transition-all">
                                        <span className="text-sm">Explore</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 flex flex-col justify-between shadow-xl"
                    >
                        <div className="flex justify-between items-start">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                                <Leaf className="w-3 h-3 text-emerald-200" />
                                <span className="text-xs text-white">Sustainable Impact</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div>
                                <p className="text-3xl md:text-4xl font-bold text-white">40%</p>
                                <p className="text-sm text-emerald-100 mt-1">পানি সাশ্রয়</p>
                                <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                                    <div className="w-[40%] h-full bg-emerald-300 rounded-full"></div>
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-bold text-white">2.5M</p>
                                <p className="text-sm text-emerald-100 mt-1">গাছ রোপণ</p>
                                <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                                    <div className="w-[75%] h-full bg-emerald-300 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/20">
                            <div className="flex justify-between text-sm text-emerald-100">
                                <span>CO₂ হ্রাস</span>
                                <span className="font-semibold">+32%</span>
                            </div>
                            <div className="w-full h-1 bg-white/20 rounded-full mt-1 overflow-hidden">
                                <div className="w-[32%] h-full bg-emerald-300 rounded-full"></div>
                            </div>
                        </div>
                    </motion.div>

                   
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
                                className="relative overflow-hidden rounded-3xl group cursor-pointer"
                                style={{ minHeight: '280px' }}
                            >
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
                                
                                
                                <div className={`absolute inset-0 bg-gradient-to-r ${feature.title === 'সুনির্দিষ্ট কৃষি' ? 'from-emerald-600/60' : feature.title === 'মাছ চাষ' ? 'from-teal-600/60' : 'from-green-600/60'} to-transparent transition-opacity duration-500 ${hoveredCard === idx ? 'opacity-100' : 'opacity-0'}`} />

                                <div className="relative h-full p-6 flex flex-col justify-end">
                                    <div className="mb-3 transform transition-transform duration-300 group-hover:scale-110">
                                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-emerald-300" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{feature.title}</h3>
                                    <p className="text-white/70 text-sm">{feature.description}</p>
                                   
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

               
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-center mt-16"
                >
                   
                </motion.div>
            </div>
        </section>
    );
}