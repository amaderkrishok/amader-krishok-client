'use client';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Building2, 
  ShoppingCart, 
  TrendingUp, 
  Leaf,
  Shield,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function Mission() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

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

    const cards = [
        {
            title: 'কৃষক',
            icon: Users,
            description: 'মুনাফা বাড়ানোর জন্য একজন কৃষকের যা যা প্রয়োজন তা আমরা একত্রিত করি: অর্থায়ন, খামার ইনপুট এবং পরামর্শ, বীমা এবং বাজারে প্রবেশাধিকার।',
            color: 'from-emerald-600 to-teal-600',
            delay: 0,
        },
        {
            title: 'কৃষি কোম্পানি',
            icon: Building2,
            description: 'আমরা কৃষি ইনপুট কোম্পানি এবং পরিষেবা প্রদানকারীদের সাথে কাজ করি, কৃষকদের মানসম্পন্ন কৃষি ইনপুট এবং উপদেষ্টা পরিষেবা প্রদান করি',
            color: 'from-emerald-700 to-green-700',
            delay: 0.1,
        },
        {
            title: 'ক্রেতাদের',
            icon: ShoppingCart,
            description: 'আমরা কৃষকদের কাছ থেকে সরাসরি উৎস এবং বৃহৎ উদ্যোগ, আধুনিক বাণিজ্য খুচরা বিক্রেতা এবং পাইকারি বাজারে প্রচুর পরিমাণে কৃষি পণ্য সরবরাহ করি।',
            color: 'from-teal-600 to-emerald-600',
            delay: 0.2,
        },
    ];

    return (
        <section ref={sectionRef} className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
         
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px',
                }} />
            </div>

          
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-float-delayed"></div>

           
            <div className="absolute top-20 right-10 opacity-10 animate-spin-slow">
                <Leaf className="w-32 h-32" />
            </div>
            <div className="absolute bottom-20 left-10 opacity-10 animate-spin-reverse">
                <Leaf className="w-24 h-24" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
               
                <div className={`text-center mb-16 transition-all duration-700 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        
                        <span className="text-sm font-medium tracking-wide">আমাদের পরিচয়</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                        আমরা কারা
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full"></div>
                    <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto mt-6">
                        আমাদের কৃষি হল একটি প্রযুক্তি কোম্পানি যা ক্ষুদ্র আকারের কৃষক এবং
                        কৃষি ব্যবসাকে তাদের লাভ সর্বাধিক করতে সক্ষম করে।
                    </p>
                </div>

              
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {cards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={idx}
                                className={`group transition-all duration-700 transform ${
                                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                                }`}
                                style={{ transitionDelay: `${card.delay}s` }}
                            >
                                <div className="relative h-full bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden">
                                  
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-500"></div>
                                    
                                    
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                                        <div className="relative inline-flex p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:scale-110 transition-transform duration-300">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                                        {card.title}
                                    </h2>

                                    
                                    <p className="text-white/80 leading-relaxed mb-6">
                                        {card.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                        
                                        
                                    </div>

                                    {/* Decorative Line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            
                <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-white/10 transition-all duration-700 delay-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                    {[
                        { label: 'সক্রিয় কৃষক', value: '১০,০০০+', icon: Users },
                        { label: 'সফল প্রকল্প', value: '৫০০+', icon: TrendingUp },
                        { label: 'বিশ্বস্ত অংশীদার', value: '১২০+', icon: Building2 },
                        { label: 'সন্তুষ্ট ক্রেতা', value: '২০০+', icon: ShoppingCart },
                    ].map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div key={idx} className="text-center group">
                                <div className="flex justify-center mb-3">
                                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-emerald-500/20 transition-all duration-300 group-hover:scale-110">
                                        <Icon className="w-5 h-5 text-emerald-400" />
                                    </div>
                                </div>
                                <div className="text-2xl md:text-3xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(20px, -20px) rotate(5deg); }
                    75% { transform: translate(-20px, 20px) rotate(-5deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-20px, 20px) rotate(-5deg); }
                    75% { transform: translate(20px, -20px) rotate(5deg); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-float-slow {
                    animation: float-slow 15s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 18s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 30s linear infinite;
                }
                .animate-spin-reverse {
                    animation: spin-reverse 25s linear infinite;
                }
            `}</style>
        </section>
    );
}