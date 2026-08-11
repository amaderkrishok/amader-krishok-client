import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';

export function EmptyCartMessage() {
  const router = useRouter();
  
  return (
    <div className='min-h-[70vh] bg-[#F7F6F0] flex items-center justify-center py-16 px-4'>
      <div className='bg-white p-8 sm:p-12 rounded-[24px] border border-[#E5E7EB] shadow-xs text-center max-w-md w-full space-y-4'>
        <div className='w-20 h-20 bg-[#FFF4CC] rounded-full flex items-center justify-center text-[#28321A] border border-[#F4B400]/40 mx-auto mb-2'>
          <ShoppingCart className='w-10 h-10' />
        </div>
        <h1 className='text-2xl font-extrabold text-[#28321A] tracking-tight'>
          আপনার কার্ট এখনো খালি
        </h1>
        <p className='text-sm text-[#667085] leading-relaxed'>
          অর্ডার করার জন্য অনুগ্রহ করে কৃষকের বাজার থেকে আপনার পছন্দের তাজা ও পুষ্টিকর পণ্য যোগ করুন।
        </p>
        <Button
          onClick={() => router.push('/marketplace')}
          className='w-full bg-[#F4B400] hover:bg-[#E5A800] text-[#172033] font-bold h-12 rounded-[14px] shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-2 border-0'
        >
          <span>কৃষকের বাজারে যান</span>
          <ArrowRight className='w-4 h-4' />
        </Button>
      </div>
    </div>
  );
}