import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export function OrderLoadingState() {
  return (
    <div className='bg-white rounded-lg shadow-sm border p-6'>
      <Skeleton className='h-8 w-2/3 mb-6' />
      <div className='space-y-4'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
      </div>
      <div className='border-t my-6 pt-6'>
        <Skeleton className='h-6 w-48 mb-4' />
        <div className='space-y-4'>
          <div className='flex gap-4'>
            <Skeleton className='h-20 w-20' />
            <div className='w-full'>
              <Skeleton className='h-4 w-3/4 mb-2' />
              <Skeleton className='h-4 w-1/2 mb-2' />
              <Skeleton className='h-4 w-1/4' />
            </div>
          </div>
          <div className='flex gap-4'>
            <Skeleton className='h-20 w-20' />
            <div className='w-full'>
              <Skeleton className='h-4 w-3/4 mb-2' />
              <Skeleton className='h-4 w-1/2 mb-2' />
              <Skeleton className='h-4 w-1/4' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}