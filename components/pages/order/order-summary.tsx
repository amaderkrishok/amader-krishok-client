import React from 'react';

interface OrderSummaryProps {
  subtotal: number;
}

export function OrderSummary({ subtotal }: OrderSummaryProps) {
  return (
    <div className='bg-gray-50 p-6 rounded-lg border'>
      <h3 className='text-lg font-semibold mb-4'>অর্ডার সারাংশ</h3>

      <div className='space-y-3 text-sm'>
        <div className='flex justify-between'>
          <span>মোট পণ্যমূল্য</span>
          <span>{subtotal.toFixed(2)} টাকা</span>
        </div>
        
        <div className='h-px bg-gray-200 my-2'></div>

        <div className='flex justify-between font-semibold text-base'>
          <span>সর্বমোট</span>
          <span>{subtotal.toFixed(2)} টাকা</span>
        </div>
      </div>
    </div>
  );
}