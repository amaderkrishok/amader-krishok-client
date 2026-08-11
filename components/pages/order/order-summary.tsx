import React from 'react';
import { Truck, Receipt } from 'lucide-react';
import { formatPrice } from '../marketplace/cart/cart-drawer';

interface OrderSummaryProps {
  subtotal: number;
  deliveryCharge?: number;
  total?: number;
}

export function OrderSummary({ subtotal, deliveryCharge = 0, total }: OrderSummaryProps) {
  const finalTotal = total ?? (subtotal + deliveryCharge);

  return (
    <div className='bg-[#FFF9E8] p-6 rounded-[20px] border border-[#F4B400]/30 shadow-xs space-y-4'>
      <div className='flex items-center justify-between border-b border-[#F4B400]/20 pb-3'>
        <h3 className='text-lg font-extrabold text-[#28321A] flex items-center gap-2'>
          <Receipt className='w-4 h-4 text-[#28321A]' />
          <span>অর্ডার সারাংশ</span>
        </h3>
      </div>

      {/* Delivery Charge Highlight Box */}
      <div className='flex items-center justify-between bg-white border border-[#F4B400]/40 rounded-xl p-3 text-xs shadow-2xs'>
        <div className='flex items-center gap-2.5'>
          <div className='w-7 h-7 rounded-full bg-[#FFF4CC] flex items-center justify-center flex-shrink-0 text-[#28321A]'>
            <Truck className='w-3.5 h-3.5' />
          </div>
          <div>
            <p className='font-bold text-[#28321A] text-[11px] uppercase tracking-wide'>
              ডেলিভারি চার্জ
            </p>
            <p className='text-[11px] text-[#667085]'>
              আপনার অর্ডারের জন্য প্রযোজ্য
            </p>
          </div>
        </div>
        <span className='font-bold text-[#28321A] bg-[#FFF4CC] px-2.5 py-1 rounded-lg border border-[#F4B400]/30 text-xs'>
          {deliveryCharge > 0 ? formatPrice(deliveryCharge) : 'ফ্রি'}
        </span>
      </div>

      {/* Rows Breakdown */}
      <div className='space-y-3 text-xs text-[#667085] pt-1'>
        <div className='flex justify-between items-center'>
          <span>পণ্য মূল্য</span>
          <span className='font-bold text-[#172033]'>{formatPrice(subtotal)}</span>
        </div>

        <div className='flex justify-between items-center'>
          <span className='flex items-center gap-1.5'>
            <Truck className='w-3.5 h-3.5 text-[#28321A]' />
            ডেলিভারি চার্জ
          </span>
          <span className='font-bold text-[#28321A]'>
            {deliveryCharge > 0 ? formatPrice(deliveryCharge) : 'ফ্রি'}
          </span>
        </div>
        
        <div className='h-px bg-[#F4B400]/20 my-2'></div>

        <div className='flex justify-between items-center text-sm pt-0.5'>
          <span className='font-extrabold text-[#172033] text-base'>সর্বমোট</span>
          <span className='font-black text-xl text-[#28321A]'>{formatPrice(finalTotal)}</span>
        </div>
      </div>
    </div>
  );
}