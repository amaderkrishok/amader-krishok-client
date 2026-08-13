import React from 'react';
import { CheckCircle2, Leaf, Hash } from 'lucide-react';

interface OrderHeaderProps {
  orderId: string;
}

export function OrderHeader({ orderId }: OrderHeaderProps) {
  return (
    <div className='bg-white p-8 sm:p-10 rounded-[24px] border border-[#E5E7EB] shadow-xs text-center relative overflow-hidden mb-8 bg-gradient-to-b from-[#F0FDF4]/60 via-white to-white'>
      <div className='w-16 h-16 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto mb-4 shadow-sm'>
        <CheckCircle2 className='w-9 h-9 text-[#16A34A]' />
      </div>

      <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] text-xs font-bold mb-2 border border-[#DCFCE7]'>
        <Leaf className='w-3.5 h-3.5' />
        <span>অর্ডার কনফার্মেশন</span>
      </div>

      <h1 className='text-2xl sm:text-3xl font-black text-[#28321A] tracking-tight'>
        অর্ডার সফলভাবে গ্রহণ করা হয়েছে!
      </h1>

      <p className='text-sm text-[#64748B] mt-1.5 max-w-md mx-auto'>
        আপনার অর্ডারটি সফলভাবে স্থানান্তরিত ও গ্রহণ করা হয়েছে। শীঘ্রই প্রসেসিং শুরু হবে।
      </p>

      <div className='mt-4 inline-flex items-center gap-1.5 bg-[#FFF4CC] border border-[#F4B400]/40 text-[#28321A] text-xs font-mono font-bold px-4 py-1.5 rounded-full shadow-2xs'>
        <Hash className='w-3.5 h-3.5 text-[#28321A]' />
        <span>অর্ডার নম্বর: #{orderId}</span>
      </div>
    </div>
  );
}