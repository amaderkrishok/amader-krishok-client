'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Facebook, Linkedin, Mail, Phone, Youtube, MapPin, Clock, ChevronUp, Heart, Leaf, ArrowUp } from 'lucide-react';
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
        { icon: Facebook, href: 'https://www.facebook.com/amaderkrishok', label: 'Facebook', color: '#1877f2' },
        { icon: Youtube, href: 'https://www.youtube.com/@ConsortiumAnalytics', label: 'YouTube', color: '#ff0000' },
        { icon: Linkedin, href: '#', label: 'LinkedIn', color: '#0a66c2' },
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
            <footer ref={footerRef} className="relative bg-gradient-to-b from-emerald-900 to-emerald-950 text-emerald-100 overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '30px 30px',
                    }} />
                </div>
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, -80, 0], y: [0, 50, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl"
                />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16 relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-60"
                    >
                        <motion.div variants={itemVariants} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Leaf className="w-6 h-6 text-emerald-400" />
                                <h3 className="text-2xl font-bold text-white tracking-tight">
                                    আমাদের কৃষক
                                </h3>
                            </div>
                            <p className="text-emerald-200/80 text-sm leading-relaxed">
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
                                            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
                                        >
                                            <Icon className="w-4 h-4 text-emerald-200 group-hover:text-white transition-colors" />
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h4 className="text-lg font-semibold text-white relative inline-block">
                                দ্রুত লিংক
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={isInView ? { width: '100%' } : {}}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="absolute -bottom-1 left-0 h-0.5 bg-emerald-400 rounded-full"
                                />
                            </h4>
                            <ul className="space-y-2">
                                {quickLinks.map((link, idx) => (
                                    <motion.li
                                        key={link.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.4 + idx * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="text-emerald-200/70 hover:text-emerald-300 transition-colors duration-300 text-sm flex items-center gap-2 group"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-emerald-400/50 group-hover:bg-emerald-400 transition-all" />
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h4 className="text-lg font-semibold text-white relative inline-block">
                                যোগাযোগ করুন
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={isInView ? { width: '100%' } : {}}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="absolute -bottom-1 left-0 h-0.5 bg-emerald-400 rounded-full"
                                />
                            </h4>
                            <div className="space-y-3">
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-3 text-emerald-200/70 text-sm group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                        <Mail className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <a href="mailto:post.consortium@gmail.com" className="hover:text-emerald-300 transition-colors">
                                        post.consortium@gmail.com
                                    </a>
                                </motion.div>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-3 text-emerald-200/70 text-sm group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                        <Phone className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <a href="tel:+8801311848915" className="hover:text-emerald-300 transition-colors">
                                        +880 1311-848915
                                    </a>
                                </motion.div>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-start gap-3 text-emerald-200/70 text-sm group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                        <MapPin className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="leading-relaxed">
                                        ঢাকা, বাংলাদেশ
                                    </span>
                                </motion.div>
                            </div>
                        </motion.div>

                     
                    </motion.div>

               
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="mt-12 pt-6 border-t border-emerald-800/50"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                          
                            <div className="text-emerald-300/60 text-xs">
                                <p>&copy; ২০২৬ আমাদের কৃষক. সর্বস্বত্ব সংরক্ষিত।</p>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-300/60 text-xs">
                                <span>Made with</span>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 2 }}
                                >
                                    <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                                </motion.div>
                                <span>by</span>
                                <Link
                                    href="https://www.consortiumanalytics.eu/"
                                    className="text-emerald-300 hover:text-emerald-200 font-medium transition-colors"
                                >
                                    Consortium Analytics
                                </Link>
                            </div>
                            <div className="flex gap-4">
                                <Link
                                    href="/terms-and-conditions"
                                    className="text-emerald-300/60 hover:text-emerald-300 text-xs transition-colors"
                                >
                                    ব্যবহারের শর্তাবলী
                                </Link>
                                <span className="text-emerald-700/50 text-xs">|</span>
                                <Link
                                    href="/privacy-policy"
                                    className="text-emerald-300/60 hover:text-emerald-300 text-xs transition-colors"
                                >
                                    গোপনীয়তা নীতি
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </footer>

        
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
            >
                <ChevronUp className="w-5 h-5" />
            </motion.button>
        </>
    );
}