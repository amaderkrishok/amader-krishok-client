import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

export function EmptyCartMessage() {
  const router = useRouter();
  
  return (
    <div className='container mx-auto px-4 py-12 max-w-4xl'>
      <div className='text-center py-10'>
        <h1 className='text-2xl font-bold mb-4'>আপনার কার্টে কোন পণ্য নেই</h1>
        <p className='text-gray-600 mb-6'>
          অর্ডার করার জন্য অনুগ্রহ করে পণ্য যোগ করুন
        </p>
        <Button onClick={() => router.push('/marketplace')}>
          কৃষকের বাজারে যান
        </Button>
      </div>
    </div>
  );
}