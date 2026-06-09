'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Store, 
  MapPin, 
  ArrowRight, 
  ChevronDown,
  Sprout,
  TrendingUp,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export function Hero() {
    const messages = [
        'আমরা কৃষকদের সবচেয়ে বড় খুচরা চেইনের সাথে সংযুক্ত করি',
        'আমরা কৃষকদের জন্য সর্বোত্তম সুযোগ নিশ্চিত করি',
        'কৃষিক্ষেত্রে উন্নয়ন আনতে আমরা প্রতিশ্রুতিবদ্ধ',
        'টেকসই কৃষির জন্য আমরা কাজ করি',
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [showScrollHint, setShowScrollHint] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
                setIsVisible(true);
            }, 400);
        }, 4500);

        return () => clearInterval(interval);
    }, [messages.length]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setShowScrollHint(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    const stats = [
        { value: '১০০০+', label: 'কৃষক সংযুক্ত', icon: Users, delay: 0 },
        { value: '৫০+', label: 'খুচরা চেইন', icon: Store, delay: 0.1 },
        { value: '৪২', label: 'জেলা', icon: MapPin, delay: 0.2 },
    ];

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-105"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-wheat-field-under-cloudy-sky-40762-large.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/65"></div>
            </div>

           
            <div className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white/10 rounded-full"
                        style={{
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 10 + 6}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

     
            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Decorative Icon */}
                <div className="mb-4 animate-fadeUp">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#064E3B]/20 backdrop-blur-sm border border-[#064E3B]/30 group hover:bg-[#064E3B]/40 transition-all duration-300">
                        <Sprout className="w-6 h-6 text-emerald-400 animate-float-slow" />
                    </div>
                </div>

          
                <div className="mb-6 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-3 tracking-tight drop-shadow-2xl">
                        আমাদের কৃষক
                    </h1>
                    <div className="flex justify-center gap-1">
                        <div className="h-0.5 w-12 bg-[#064E3B]/60 rounded-full animate-pulse"></div>
                        <div className="h-0.5 w-6 bg-[#064E3B]/40 rounded-full"></div>
                        <div className="h-0.5 w-3 bg-[#064E3B]/30 rounded-full"></div>
                    </div>
                </div>

           
                <div className="mt-8 mb-12 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                    <div
                        className={`transition-all duration-500 ease-out ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                    >
                        <div className="backdrop-blur-md bg-white/5 rounded-2xl px-8 py-5 md:px-12 md:py-6 inline-flex items-center gap-3 border border-white/15 shadow-xl hover:border-[#064E3B]/30 transition-all duration-300">
                            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 flex-shrink-0" />
                            <p className="text-xl md:text-2xl lg:text-3xl font-medium text-white leading-relaxed">
                                {messages[currentIndex]}
                            </p>
                        </div>
                    </div>
                </div>

            
                <div className="grid grid-cols-3 gap-5 md:gap-8 max-w-lg mx-auto mt-8">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={idx}
                                className="text-center group animate-fadeUp"
                                style={{ animationDelay: `${stat.delay}s` }}
                            >
                                <div className="flex justify-center mb-2">
                                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#064E3B] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                                        <Icon className="w-5 h-5 text-emerald-400/80 group-hover:text-white" />
                                    </div>
                                </div>
                                <div className="text-xl md:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm text-white/60 mt-1 group-hover:text-white/80 transition-colors duration-300">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-10 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
                   <Link href="/about"> <button className="group inline-flex items-center gap-2 px-8 py-3 bg-[#064E3B] hover:bg-[#065F4B] rounded-full text-white font-medium text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        <span>আরও জানুন</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button></Link>
                </div>
                <div className="mt-8 flex items-center justify-center gap-2 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                    <Shield className="w-3 h-3 text-emerald-400/60" />
                    <span className="text-white/40 text-xs tracking-wide hover:text-emerald-400/60 transition-colors duration-300 cursor-default">বিশ্বস্ত কৃষি নেটওয়ার্ক</span>
                </div>
                <div
                    className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-700 ${
                        showScrollHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="flex flex-col items-center gap-2 text-white/40 hover:text-emerald-400/60 transition-colors cursor-pointer">
                        <span className="text-xs tracking-wider font-light">SCROLL</span>
                        <ChevronDown className="w-4 h-4 animate-bounce" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
                    25% { transform: translateY(-12px) translateX(6px); opacity: 0.5; }
                    50% { transform: translateY(6px) translateX(-4px); opacity: 0.3; }
                    75% { transform: translateY(-4px) translateX(2px); opacity: 0.4; }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
                .animate-float {
                    animation: float linear infinite;
                }
                .animate-float-slow {
                    animation: float-slow 3s ease-in-out infinite;
                }
                .animate-fadeUp {
                    animation: fadeUp 0.5s ease-out forwards;
                    opacity: 0;
                }
                .animate-bounce {
                    animation: bounce 1.5s ease-in-out infinite;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(4px); }
                }
            `}</style>
        </div>
    );
}