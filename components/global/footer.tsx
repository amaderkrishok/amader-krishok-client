'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Facebook, Linkedin, Mail, Phone, Youtube, MapPin, ChevronUp, Heart, Leaf } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const footerRef = useRef<HTMLElement>(null);
    const isInView = useInView(footerRef, { once: true, amount: 0.1 });

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    };

    const socialLinks = [
        { icon: Facebook, href: 'https://www.facebook.com/amaderkrishok', label: 'Facebook' },
        { icon: Youtube, href: 'https://www.youtube.com/@ConsortiumAnalytics', label: 'YouTube' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
    ];

    const quickLinks = [
        { name: 'হোম', href: '/' },
        { name: 'আমাদের সম্পর্কে', href: '/about' },
        { name: 'সেবাসমূহ', href: '/services' },
        { name: 'ব্লগ', href: '/blog' },
        { name: 'যোগাযোগ', href: '/contact' },
    ];

    return (
        <>
            <footer ref={footerRef} className="relative bg-[#2D331F] text-white border-t border-white/10 overflow-hidden selection:bg-[#EAB308] selection:text-[#2D331F]">
                
                {/* Background Decorations (Matching Banner Pattern) */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.12)_0%,transparent_60%)]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.1)_0%,transparent_60%)]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-24 xl:px-40 2xl:px-12 py-12 lg:py-16 relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-32"
                    >
                        {/* Brand Column */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-[#4ADE80]/20">
                                    <Leaf className="w-6 h-6 text-[#4ADE80]" />
                                </div>
                                <h3 className="text-2xl font-extrabold text-[#EAB308] tracking-tight">
                                    আমাদের কৃষক
                                </h3>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed font-medium">
                                কৃষকদের প্রযুক্তি এবং টেকসই চর্চার মাধ্যমে ক্ষমতায়ন করা।
                            </p>
                            <div className="flex space-x-3 pt-2">
                                {socialLinks.map((social, idx) => {
                                    const Icon = social.icon;
                                    return (
                                        <motion.a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ y: -3, scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                            transition={{ delay: 0.1 + idx * 0.1 }}
                                            className="w-9 h-9 rounded-full bg-[#3f472f]/80 border border-white/10 flex items-center justify-center hover:bg-[#EAB308] hover:text-[#2D331F] text-gray-300 transition-all duration-300 group shadow-md"
                                        >
                                            <Icon className="w-4 h-4 text-gray-300 group-hover:text-[#2D331F] transition-colors" />
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Quick Links Column */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h4 className="text-lg font-bold text-white relative inline-block">
                                দ্রুত লিংক
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={isInView ? { width: '100%' } : {}}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="absolute -bottom-1 left-0 h-0.5 bg-[#EAB308] rounded-full"
                                />
                            </h4>
                            <ul className="space-y-2.5">
                                {quickLinks.map((link, idx) => (
                                    <motion.li
                                        key={link.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.4 + idx * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-[#EAB308] transition-colors duration-300 text-sm flex items-center gap-2 group font-medium"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]/60 group-hover:bg-[#EAB308] transition-all" />
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Contact Column */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h4 className="text-lg font-bold text-white relative inline-block">
                                যোগাযোগ করুন
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={isInView ? { width: '100%' } : {}}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="absolute -bottom-1 left-0 h-0.5 bg-[#EAB308] rounded-full"
                                />
                            </h4>
                            <div className="space-y-3.5">
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-3 text-gray-300 text-sm group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#3f472f]/80 border border-white/10 flex items-center justify-center group-hover:bg-[#EAB308] transition-colors">
                                        <Mail className="w-4 h-4 text-[#4ADE80] group-hover:text-[#2D331F] transition-colors" />
                                    </div>
                                    <a href="mailto:post.consortium@gmail.com" className="hover:text-[#EAB308] transition-colors font-medium">
                                        post.consortium@gmail.com
                                    </a>
                                </motion.div>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-3 text-gray-300 text-sm group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#3f472f]/80 border border-white/10 flex items-center justify-center group-hover:bg-[#EAB308] transition-colors">
                                        <Phone className="w-4 h-4 text-[#4ADE80] group-hover:text-[#2D331F] transition-colors" />
                                    </div>
                                    <a href="tel:+8801311848915" className="hover:text-[#EAB308] transition-colors font-medium">
                                        +880 1311-848915
                                    </a>
                                </motion.div>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-start gap-3 text-gray-300 text-sm group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#3f472f]/80 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#EAB308] transition-colors">
                                        <MapPin className="w-4 h-4 text-[#4ADE80] group-hover:text-[#2D331F] transition-colors" />
                                    </div>
                                    <span className="leading-relaxed font-medium">
                                        ঢাকা, বাংলাদেশ
                                    </span>
                                </motion.div>
                            </div>
                        </motion.div>

                    </motion.div>

                    {/* Bottom Copyright Line */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="mt-12 pt-6 border-t border-white/10"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                            
                            <div className="text-gray-400 text-xs font-medium">
                                <p>&copy; ২০২৬ আমাদের কৃষক. সর্বস্বত্ব সংরক্ষিত।</p>
                            </div>

                            <div className="flex gap-4">
                                <Link
                                    href="/terms-and-conditions"
                                    className="text-gray-400 hover:text-[#EAB308] text-xs transition-colors font-medium"
                                >
                                    ব্যবহারের শর্তাবলী
                                </Link>
                                <span className="text-gray-600 text-xs">|</span>
                                <Link
                                    href="/privacy-policy"
                                    className="text-gray-400 hover:text-[#EAB308] text-xs transition-colors font-medium"
                                >
                                    গোপনীয়তা নীতি
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </footer>

            {/* Scroll to top floating button */}
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#EAB308] hover:bg-[#FCD34D] text-[#2D331F] shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 font-bold border border-white/20"
            >
                <ChevronUp className="w-6 h-6" />
            </motion.button>
        </>
    );
}