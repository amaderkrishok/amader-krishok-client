'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Leaf, Lightbulb, Users, Award, ChevronRight, TrendingUp, Shield, Heart, Sparkles } from 'lucide-react';

const values = [
    {
        title: 'টেকসইতা',
        description: 'আমরা বিশ্বাস করি এমন কৃষি সমাধান তৈরি করতে যা আমাদের গ্রহের সম্পদকে ভবিষ্যৎ প্রজন্মের জন্য সম্মান এবং সংরক্ষণ করবে।',
        icon: Leaf,
        stat: '৪০%',
        statLabel: 'পানি সাশ্রয়',
        color: '#059669',
        bgLight: '#ecfdf5',
        delay: 0,
    },
    {
        title: 'উদ্ভাবন',
        description: 'আমরা ধারাবাহিকভাবে নতুন প্রযুক্তি এবং পদ্ধতি অনুসন্ধান করি যাতে প্রথাগত কৃষি অনুশীলনকে বিপ্লবিত করা যায়।',
        icon: Lightbulb,
        stat: '১৫+',
        statLabel: 'পেটেন্ট প্রযুক্তি',
        color: '#d97706',
        bgLight: '#fffbeb',
        delay: 0.1,
    },
    {
        title: 'কমিউনিটি',
        description: 'আমরা একটি সহযোগিতামূলক ইকোসিস্টেম তৈরি করি যেখানে কৃষক, বিশেষজ্ঞ এবং প্রযুক্তি একসাথে সুসমঞ্জসে কাজ করে।',
        icon: Users,
        stat: '১০,০০০+',
        statLabel: 'সক্রিয় সদস্য',
        color: '#2563eb',
        bgLight: '#eff6ff',
        delay: 0.2,
    },
    {
        title: 'বিশেষত্ব',
        description: 'আমাদের সমাধান এবং সেবায় সর্বোচ্চ মান বজায় রাখি যাতে আমাদের কৃষকদের জন্য সর্বোত্তম ফলাফল নিশ্চিত করা যায়।',
        icon: Award,
        stat: '৯৮%',
        statLabel: 'সন্তুষ্টি হার',
        color: '#7c3aed',
        bgLight: '#f5f3ff',
        delay: 0.3,
    },
];

const stats = [
    { value: '২৫০%', label: 'উৎপাদন বৃদ্ধি', icon: TrendingUp, color: '#059669', delay: 0 },
    { value: '৫০০+', label: 'বিশ্বস্ত অংশীদার', icon: Shield, color: '#d97706', delay: 0.1 },
    { value: '২.৫M', label: 'গাছ রোপণ', icon: Leaf, color: '#2563eb', delay: 0.2 },
    { value: '৪২টি', label: 'জেলা কভারেজ', icon: Users, color: '#7c3aed', delay: 0.3 },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
    },
};

export default function Goal() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [counters, setCounters] = useState<number[]>([0, 0, 0, 0]);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.3]);

    useEffect(() => {
        if (isInView) {
            const targets = [250, 500, 2.5, 42];
            const duration = 2000;
            const interval = 20;
            const steps = duration / interval;
            let current = [0, 0, 0, 0];

            const timer = setInterval(() => {
                let allComplete = true;
                for (let i = 0; i < targets.length; i++) {
                    if (current[i] < targets[i]) {
                        allComplete = false;
                        const increment = targets[i] / steps;
                        current[i] = Math.min(current[i] + increment, targets[i]);
                    }
                }
                setCounters([...current]);
                if (allComplete) clearInterval(timer);
            }, interval);

            return () => clearInterval(timer);
        }
    }, [isInView]);

    return (
        <section
            ref={sectionRef}
            className="relative py-28 md:py-36 bg-white overflow-hidden"
        >
            
            <motion.div
                style={{ y: backgroundY, opacity }}
                className="absolute inset-0 bg-[linear-gradient(45deg,#f9fafb_1px,transparent_1px),linear-gradient(-45deg,#f9fafb_1px,transparent_1px)] bg-[length:24px_24px]"
            />

           
            <motion.div
                animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-10 w-72 h-72 bg-emerald-50 rounded-full blur-3xl opacity-60"
            />
            <motion.div
                animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-10 w-80 h-80 bg-amber-50 rounded-full blur-3xl opacity-60"
            />
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30"
            />

            
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, i % 2 === 0 ? 20 : -20, 0],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 5 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5,
                    }}
                    className="absolute pointer-events-none"
                    style={{ left: `${10 + i * 15}%`, top: `${20 + i * 12}%` }}
                >
                    
                </motion.div>
            ))}

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                {/* Animated Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-5"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            >
                                <Heart className="w-3.5 h-3.5 text-emerald-600" />
                            </motion.div>
                            <span>আমরা কী নিয়ে কাজ করছি</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4"
                        >
                            আমাদের লক্ষ্য
                        </motion.h2>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: 80 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-20 h-0.5 bg-emerald-500 mx-auto mb-6 rounded-full"
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-gray-500 text-lg leading-relaxed"
                        >
                            আমরা বিশ্বাস করি যে একটি ছোট, তবে অত্যন্ত উৎসাহী এবং লক্ষ্যভ্রষ্ট দল
                            টেকসই কৃষিতে দীর্ঘস্থায়ী প্রভাব সৃষ্টিতে সক্ষম।
                        </motion.p>
                    </motion.div>
                </div>

                {/* Values Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        const isActive = activeIndex === index;

                        return (
                            <motion.div
                                key={value.title}
                                variants={itemVariants}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                                className="group relative"
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <motion.div
                                    className="absolute inset-0 rounded-2xl transition-all duration-500"
                                    style={{
                                        opacity: isActive ? 0.08 : 0,
                                        backgroundColor: value.color,
                                    }}
                                    initial={false}
                                    animate={{ opacity: isActive ? 0.08 : 0 }}
                                />
                                
                                <div className="relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
                                    {/* Icon with animation */}
                                    <motion.div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                                        style={{
                                            backgroundColor: `${value.color}10`,
                                            color: value.color,
                                        }}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <motion.div
                                            animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </motion.div>
                                    </motion.div>

                                
                                    <motion.h3
                                        className="text-xl font-semibold mb-3 transition-colors duration-300"
                                        style={{ color: isActive ? value.color : '#111827' }}
                                        animate={{ x: isActive ? 4 : 0 }}
                                    >
                                        {value.title}
                                    </motion.h3>

                                    
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                                        {value.description}
                                    </p>

                                    {/* Stat Indicator */}
                                    <motion.div
                                        className="pt-4 border-t border-gray-100"
                                        style={{ borderColor: isActive ? `${value.color}20` : '#f3f4f6' }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <motion.div
                                                    className="text-xl font-bold transition-colors duration-300"
                                                    style={{ color: isActive ? value.color : '#374151' }}
                                                >
                                                    {value.stat}
                                                </motion.div>
                                                <div className="text-xs text-gray-400 mt-0.5">
                                                    {value.statLabel}
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </motion.div>

                                   
                                    <motion.div
                                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                                        style={{ backgroundColor: value.color }}
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

              
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-20 pt-8 border-t border-gray-100"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.5, delay: 0.9 + idx * 0.1 }}
                                    whileHover={{ y: -5, scale: 1.05 }}
                                    className="group cursor-pointer"
                                >
                                    <motion.div
                                        className="flex items-center justify-center gap-2 mb-2"
                                        whileHover={{ gap: 4 }}
                                    >
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Icon className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                                        </motion.div>
                                        <span className="text-2xl font-bold text-gray-900">
                                            {stat.label === 'গাছ রোপণ' 
                                                ? `${counters[2].toFixed(1)}M` 
                                                : stat.label === 'জেলা কভারেজ' 
                                                    ? `${Math.floor(counters[3])}টি`
                                                    : stat.label === 'উৎপাদন বৃদ্ধি'
                                                        ? `${Math.floor(counters[0])}%`
                                                        : `${Math.floor(counters[1])}+`}
                                        </span>
                                    </motion.div>
                                    <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                                        {stat.label}
                                    </p>
                                    <motion.div
                                        className="w-0 h-0.5 bg-emerald-400 mx-auto mt-2 rounded-full"
                                        whileHover={{ width: 40 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

               
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="mt-16 text-center"
                >
                    
                </motion.div>
            </div>
        </section>
    );
}