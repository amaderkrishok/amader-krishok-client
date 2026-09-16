'use client';

import { motion } from 'framer-motion';
import { Sprout, ShieldCheck, Truck, MessageSquare, CheckCircle2, Leaf, ArrowRight } from 'lucide-react';

const valuePillars = [
  {
    id: 'pillar-1',
    icon: Sprout,
    title: 'সরাসরি কৃষকের মাঠ থেকে',
    titleEn: 'Direct Farm Sourcing',
    description: 'কোনো দালালি বা মধ্যস্বত্বভোগী ছাড়াই সরাসরি কৃষকের খামার থেকে তাজা শাক-সবজি, ফল ও শস্য সংগৃহীত হয়।',
    tag: '০% কমিশন ফি',
    iconBg: 'bg-[#2D331F] text-[#EAB308]',
    borderHover: 'hover:border-[#EAB308]',
  },
  {
    id: 'pillar-2',
    icon: ShieldCheck,
    title: '১০০% ফিল্ড ভেরিফাইড খামারি',
    titleEn: 'Verified Farm Partners',
    description: 'দেশের ৪২টি জেলার ফিল্ড ভেরিফাইড কৃষক ও খামার। আমাদের টিম সরেজমিনে পণ্যের মান ও বিশুদ্ধতা যাচাই করে।',
    tag: 'যাচাইকৃত খামার',
    iconBg: 'bg-emerald-800 text-emerald-300',
    borderHover: 'hover:border-emerald-500',
  },
  {
    id: 'pillar-3',
    icon: Truck,
    title: 'দ্রুত ও সতেজ ডেলিভারি',
    titleEn: 'Fresh & Fast Delivery',
    description: 'ক্ষেত থেকে কাটার পরই কোল্ড-চেইন ও বিশেষ সতর্কতায় প্যাকিং করে দ্রুততম সময়ে সরাসরি আপনার দোরগোড়ায়।',
    tag: 'সতেজতার গ্যারান্টি',
    iconBg: 'bg-[#EAB308] text-[#2D331F]',
    borderHover: 'hover:border-[#EAB308]',
  },
  {
    id: 'pillar-4',
    icon: MessageSquare,
    title: 'সরাসরি দরদাম ও চ্যাট',
    titleEn: 'Direct Chat & Fair Price',
    description: 'কৃষকের সাথে সরাসরি বার্তা আদান-প্রদান করুন, নিজেই পণ্যের সঠিক দরদাম করুন এবং ক্যাশ অন ডেলিভারিতে কিনুন।',
    tag: 'ন্যায্য মূল্য',
    iconBg: 'bg-[#2D331F] text-white',
    borderHover: 'hover:border-[#2D331F]',
  },
];

export function TextRotatorSection() {
  return (
    <section className="bg-[#FDFBF7] py-16 sm:py-20 lg:py-24 border-y border-gray-200/80 relative overflow-hidden selection:bg-[#EAB308] selection:text-[#2D331F]">

      {/* Background Soft Lighting Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#EAB308]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#2D331F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* --- MAIN SECTION HEADER --- */}
        <div className="text-left mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3F6212]/10 border border-[#3F6212]/20 mb-3 text-[#3F6212] text-xs font-bold uppercase tracking-wider"
          >
            <Leaf className="w-4 h-4 text-[#F5B800]" />
            <span>কেন আমাদের বিশ্বাস করবেন?</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-[#172033] tracking-tight leading-tight"
          >
            মাঠ থেকে সোজা আপনার ঘরে, <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#2D331F] via-[#4F5938] to-[#EAB308] bg-clip-text text-transparent">
              ন্যায্য মূল্যে খাঁটি ফসল
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-[#64748B] text-sm sm:text-base mt-2 max-w-2xl font-medium"
          >
            আমাদের প্ল্যাটফর্মের প্রতিটি ধাপ কৃষক এবং গ্রাহকের স্বার্থ রক্ষায় নিবেদিত।
          </motion.p>
        </div>

        {/* --- 4 CORE VALUE PILLARS GRID (WHITE CARDS) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valuePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className={`bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${pillar.borderHover}`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${pillar.iconBg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-black px-3 py-1 rounded-full bg-gray-100 text-[#2D331F] border border-gray-200">
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-[#2D331F] mb-2 leading-snug group-hover:text-[#4F5938] transition-colors">
                    {pillar.title}
                  </h3>

                  {/* Subtitle / English Label */}
                  <div className="text-[11px] font-bold text-[#EAB308] uppercase tracking-wider mb-3">
                    {pillar.titleEn}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom Card Action Accent */}
                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#2D331F] group-hover:text-[#EAB308] transition-colors">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>যাচাইকৃত সেবামান</span>
                  </span>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
