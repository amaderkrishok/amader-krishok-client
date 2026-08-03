'use client';

import { motion } from 'framer-motion';
import { Sprout, Sparkles } from 'lucide-react';

const rotatorMessages: readonly string[] = [
  'কৃষকের মাঠ থেকে আপনার ঘরে',
  'বাংলাদেশের কৃষকের ডিজিটাল বাজার',
  'তাজা কৃষিপণ্য, দ্রুত ডেলিভারি',
  'প্রকৃতির সতেজতা আপনার পরিবারের জন্য',
] as const;

export function TextRotatorSection() {
  // Multiply array to guarantee seamless horizontal infinite marquee scrolling
  const duplicatedMessages = [
    ...rotatorMessages,
    ...rotatorMessages,
    ...rotatorMessages,
    ...rotatorMessages,
  ];

  return (
    <section className="bg-white py-4 sm:py-5 border-y border-gray-200/80 shadow-xs relative overflow-hidden selection:bg-[#EAB308] selection:text-[#2D331F]">
      {/* Left & Right Soft Fading Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Continuous Horizontal Infinite Auto-Scrolling Marquee */}
      <div className="flex overflow-hidden whitespace-nowrap">
        <motion.div
          className="flex items-center gap-8 sm:gap-12 shrink-0 pr-8 sm:pr-12"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {duplicatedMessages.map((msg, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-3 sm:gap-4 text-[#2D331F] font-black text-lg sm:text-2xl md:text-2xl tracking-tight shrink-0"
            >
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-[#EAB308] shrink-0" />
              <span className="bg-gradient-to-r from-[#2D331F] via-[#3f472f] to-[#2D331F] bg-clip-text text-transparent">
                {msg}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
