import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

interface OrderErrorStateProps {
  error: string | null;
}

export function OrderErrorState({ error }: OrderErrorStateProps) {
  return (
    <div className='bg-white rounded-lg shadow-sm border p-8 text-center'>
      <h1 className='text-2xl font-bold text-gray-900 mb-4'>
        অর্ডার পাওয়া যায়নি
      </h1>
      <p className='text-gray-600 mb-6'>
        {error || 'অর্ডার খুঁজে পাওয়া যায়নি'}
      </p>
      <div className='flex gap-4 justify-center'>
        <Button asChild>
          <Link href='/marketplace'>কৃষকের বাজার</Link>
        </Button>
        <Button variant='outline' asChild>
          <Link href='/account/orders'>আমার অর্ডারসমূহ</Link>
        </Button>
      </div>
    </div>
  );
}