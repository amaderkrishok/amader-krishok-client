import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import React from 'react';

export interface OrderFormValues {
    name: string;
    phoneNumber: string;
    address: string;
  }

interface OrderFormProps {
  form: UseFormReturn<OrderFormValues>;
  onSubmit: (data: OrderFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function OrderForm({ form, onSubmit, isSubmitting }: OrderFormProps) {
  const { register, handleSubmit, formState: { errors } } = form;
  
  return (
    <div className='bg-white p-6 rounded-lg border mb-6'>
      <h2 className='text-xl font-semibold mb-6'>ডেলিভারি তথ্য</h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium mb-1'>
            আপনার নাম
          </label>
          <Input
            id='name'
            placeholder='আপনার পূর্ণ নাম লিখুন'
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='phoneNumber' className='block text-sm font-medium mb-1'>
            মোবাইল নম্বর
          </label>
          <Input
            id='phoneNumber'
            placeholder='01XXXXXXXXX'
            {...register('phoneNumber')}
            className={errors.phoneNumber ? 'border-red-500' : ''}
          />
          {errors.phoneNumber && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor='address' className='block text-sm font-medium mb-1'>
            ডেলিভারি ঠিকানা
          </label>
          <Textarea
            id='address'
            placeholder='আপনার সম্পূর্ণ ঠিকানা লিখুন'
            {...register('address')}
            rows={3}
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && (
            <p className='text-red-500 text-sm mt-1'>{errors.address.message}</p>
          )}
        </div>

        <Button
          type='submit'
          className='w-full mt-6 bg-green-600 hover:bg-green-700'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার করুন'}
        </Button>
      </form>
    </div>
  );
}