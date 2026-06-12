'use client';

import {  useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cloud, Calculator, ShoppingCart, ArrowRight, Sparkles, TrendingUp, Droplets, ThermometerSun } from 'lucide-react';
import Link from 'next/link';

const tools = [
    {
        title: 'আবহাওয়া আপডেট',
        description: 'আপনার খামারের জন্য উপযুক্ত কৃষি অন্তর্দৃষ্টি এবং সঠিক আবহাওয়ার পূর্বাভাস পান।',
        icon: Cloud,
        iconBg: 'from-sky-500 to-blue-600',
        color: '#0284c7',
        gradient: 'from-sky-50 to-blue-50',
        border: 'hover:border-sky-200',
        link: '/weather',
        features: ['সঠিক পূর্বাভাস', 'রিয়েল টাইম ডাটা', 'স্থানীয় আবহাওয়া'],
        delay: 0,
    },
    {
        title: 'সার ক্যালকুলেটর',
        description: 'আপনার খামারের জন্য সঠিক সার পরিমাণ নির্ধারণ করুন এবং ফলন বৃদ্ধি করতে সহায়ক উপকরণ পান।',
        icon: Calculator,
        iconBg: 'from-emerald-500 to-green-600',
        color: '#059669',
        gradient: 'from-emerald-50 to-green-50',
        border: 'hover:border-emerald-200',
        link: '/crop-calculator',
        features: ['সঠিক পরিমাণ', 'ফলন বিশ্লেষণ', 'খরচ হিসাব'],
        delay: 0.1,
    },
    {
        title: 'অনলাইন বাজার',
        description: 'আমাদের ডিজিটাল প্ল্যাটফর্মে আপনি সহজেই ফসল ক্রয় এবং বিক্রয়ের কার্যক্রম পরিচালনা করতে পারেন।',
        icon: ShoppingCart,
        iconBg: 'from-amber-500 to-orange-600',
        color: '#d97706',
        gradient: 'from-amber-50 to-orange-50',
        border: 'hover:border-amber-200',
        link: '/marketplace',
        features: ['সরাসরি ক্রয়', 'নিরাপদ লেনদেন', 'হোম ডেলিভারি'],
        delay: 0.2,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
    },
};

export default function Product() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
            {/* Animated Background Elements */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-40" />
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-40" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-30" />
                </div>
            </motion.div>

            {/* Floating Particles */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -40, 0],
                        x: [0, i % 2 === 0 ? 20 : -20, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                    }}
                    className="absolute pointer-events-none"
                    style={{
                        left: `${5 + i * 12}%`,
                        top: `${15 + (i * 7) % 70}%`,
                    }}
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? 'bg-sky-300' : i % 3 === 1 ? 'bg-emerald-300' : 'bg-amber-300'}`} />
                </motion.div>
            ))}

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-sky-100 to-emerald-100 text-gray-700 text-sm font-medium mb-5"
                        >
                            
                            <span>আমাদের তৈরি করা টুল সমূহ</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4"
                        >
                            ডিজিটাল টুলস
                        </motion.h2>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: 80 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-20 h-0.5 bg-gradient-to-r from-sky-500 to-emerald-500 mx-auto mb-6 rounded-full"
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-gray-500 text-lg leading-relaxed"
                        >
                            আমাদের টুলগুলি আধুনিক প্রযুক্তি ব্যবহার করে কৃষিকাজের প্রতিটি দিককে
                            সঠিকভাবে পরিচালনা করতে সহায়তা করে, যেমন ফসলের বৃদ্ধি পর্যবেক্ষণ,
                            মাটির অবস্থা বিশ্লেষণ, পানি ব্যবহারের নিয়ন্ত্রণ এবং আবাদি জমির
                            সর্বোত্তম ব্যবহার।
                        </motion.p>
                    </motion.div>
                </div>

                {/* Tools Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                >
                    {tools.map((tool, index) => {
                        const Icon = tool.icon;
                        const isHovered = hoveredIndex === index;

                        return (
                            <motion.div
                                key={tool.title}
                                variants={cardVariants}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="group relative"
                            >
                                <div
                                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                                />
                                
                                <div className={`relative bg-white rounded-2xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col ${tool.border}`}>
                                    {/* Animated Icon */}
                                    <motion.div
                                        className="relative mb-6"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-r ${tool.iconBg} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                                        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-r ${tool.iconBg} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        
                                        {/* Floating badge */}
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={isHovered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                                        >
                                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                                        </motion.div>
                                    </motion.div>

                                    {/* Title */}
                                    <motion.h3
                                        className="text-2xl font-bold mb-3 text-gray-900"
                                        animate={{ x: isHovered ? 4 : 0 }}
                                    >
                                        {tool.title}
                                    </motion.h3>

                                    {/* Description */}
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                                        {tool.description}
                                    </p>

                                    {/* Features List */}
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={isHovered ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden mb-6"
                                    >
                                        <div className="flex flex-wrap gap-2">
                                            {tool.features.map((feature, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* CTA Button */}
                                    <Link href={tool.link}>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                className={`w-full group/btn bg-gray-900 hover:bg-gray-800 transition-all duration-300 ${isHovered ? 'shadow-lg' : ''}`}
                                                size="lg"
                                            >
                                                <span className="flex items-center gap-2">
                                                    ঘুরে আসুন
                                                    <motion.div
                                                        animate={isHovered ? { x: [0, 4, 0] } : {}}
                                                        transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
                                                    >
                                                        <ArrowRight className="w-4 h-4" />
                                                    </motion.div>
                                                </span>
                                            </Button>
                                        </motion.div>
                                    </Link>

                                    {/* Animated Border Line */}
                                    <motion.div
                                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                                        style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Bottom Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-16 pt-8 border-t border-gray-100"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { icon: ThermometerSun, value: '৯৫%', label: 'সঠিক পূর্বাভাস', color: '#0284c7' },
                            { icon: Droplets, value: '৪০%', label: 'পানি সাশ্রয়', color: '#059669' },
                            { icon: TrendingUp, value: '২৫০%', label: 'ফলন বৃদ্ধি', color: '#d97706' },
                            { icon: ShoppingCart, value: '১০,০০০+', label: 'সক্রিয় ক্রেতা', color: '#7c3aed' },
                        ].map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.4, delay: 0.9 + idx * 0.1 }}
                                    whileHover={{ y: -3 }}
                                    className="group cursor-pointer"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                        </motion.div>
                                        <span className="text-xl font-bold text-gray-800">
                                            {stat.value}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}