import React from 'react';

interface OrderHeaderProps {
  orderId: string;
}

export function OrderHeader({ orderId }: OrderHeaderProps) {
  return (
    <div className='bg-green-50 p-6 border-b border-green-100'>
      <div className='flex items-center gap-3'>
        <div className='h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
            />
          </svg>
        </div>
        <div>
          <h1 className='text-2xl font-bold text-green-800'>
            অর্ডার সফলভাবে গ্রহণ করা হয়েছে!
          </h1>
          <p className='text-green-700 mt-1'>
            আপনার অর্ডার নম্বরঃ <span className='font-medium'>{orderId}</span>
          </p>
        </div>
      </div>
    </div>
  );
}