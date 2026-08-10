import React from 'react';
import { Truck } from 'lucide-react';
import { formatPrice } from '../marketplace/cart/cart-drawer';

interface OrderSummaryProps {
  subtotal: number;
  deliveryCharge?: number;
  total?: number;
}

export function OrderSummary({ subtotal, deliveryCharge = 0, total }: OrderSummaryProps) {
  const finalTotal = total ?? (subtotal + deliveryCharge);

  return (
    <div className='bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4'>
      <h3 className='text-lg font-semibold text-gray-800 border-b pb-3'>অর্ডার সারাংশ</h3>

      {/* Delivery Charge Banner (matching banner color pattern) */}
      <div className='flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs'>
        <div className='flex items-center gap-2.5'>
          <div className='w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0'>
            <Truck className='w-3.5 h-3.5 text-orange-600' />
          </div>
          <div>
            <p className='font-medium text-orange-500 uppercase text-[10px] tracking-wide'>ডেলিভারি চার্জ</p>
            <p className='text-orange-700 font-semibold'>
              {deliveryCharge > 0 ? 'শিপিং ফি যুক্ত' : 'ফ্রি ডেলিভারি'}
            </p>
          </div>
        </div>
        <span className='font-bold text-orange-700 bg-white/90 px-2 py-0.5 rounded-md border border-orange-200'>
          {deliveryCharge > 0 ? formatPrice(deliveryCharge) : 'ফ্রি'}
        </span>
      </div>

      <div className='space-y-3 text-sm pt-1'>
        <div className='flex justify-between text-gray-600'>
          <span>মোট পণ্যমূল্য</span>
          <span className='font-medium'>{formatPrice(subtotal)}</span>
        </div>

        <div className='flex justify-between text-gray-600'>
          <span className='flex items-center gap-1.5'>
            <Truck className='w-4 h-4 text-orange-500' />
            ডেলিভারি চার্জ
          </span>
          <span className='font-medium text-orange-600'>
            {deliveryCharge > 0 ? formatPrice(deliveryCharge) : 'ফ্রি'}
          </span>
        </div>
        
        <div className='h-px bg-gray-200 my-2'></div>

        <div className='flex justify-between font-bold text-base text-gray-900'>
          <span>সর্বমোট</span>
          <span className='text-green-700 text-lg'>{formatPrice(finalTotal)}</span>
        </div>
      </div>
    </div>
  );
}