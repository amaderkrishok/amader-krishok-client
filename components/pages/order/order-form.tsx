import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import React from 'react';
import { ArrowRight, MapPin, Phone, User } from 'lucide-react';

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
    <div className='bg-white p-6 sm:p-8 rounded-[20px] border border-[#E5E7EB] shadow-xs'>
      <div className='border-b border-[#E5E7EB] pb-5 mb-6'>
        <h2 className='text-xl font-extrabold text-[#28321A] flex items-center gap-2'>
          <span>🌿</span> ডেলিভারি তথ্য
        </h2>
        <p className='text-xs text-[#667085] mt-1'>
          আপনার পণ্য পৌঁছে দেওয়ার জন্য সঠিক তথ্য দিন।
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        {/* Name Field */}
        <div>
          <label htmlFor='name' className='block text-sm font-bold text-[#172033] mb-1.5 flex items-center gap-1.5'>
            <User className='w-4 h-4 text-[#28321A]' />
            <span>আপনার নাম</span>
          </label>
          <Input
            id='name'
            placeholder='আপনার পূর্ণ নাম লিখুন'
            {...register('name')}
            className={`bg-white border-[#E5E7EB] rounded-[14px] h-12 px-4 text-[#172033] text-sm focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/20 transition-all ${
              errors.name ? 'border-red-500 ring-1 ring-red-500' : ''
            }`}
          />
          {errors.name && (
            <p className='text-red-500 text-xs mt-1 font-medium'>{errors.name.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor='phoneNumber' className='block text-sm font-bold text-[#172033] mb-1.5 flex items-center gap-1.5'>
            <Phone className='w-4 h-4 text-[#28321A]' />
            <span>মোবাইল নম্বর</span>
          </label>
          <Input
            id='phoneNumber'
            placeholder='01XXXXXXXXX'
            {...register('phoneNumber')}
            className={`bg-white border-[#E5E7EB] rounded-[14px] h-12 px-4 text-[#172033] text-sm focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/20 transition-all ${
              errors.phoneNumber ? 'border-red-500 ring-1 ring-red-500' : ''
            }`}
          />
          {errors.phoneNumber && (
            <p className='text-red-500 text-xs mt-1 font-medium'>
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label htmlFor='address' className='block text-sm font-bold text-[#172033] mb-1.5 flex items-center gap-1.5'>
            <MapPin className='w-4 h-4 text-[#28321A]' />
            <span>ডেলিভারি ঠিকানা</span>
          </label>
          <Textarea
            id='address'
            placeholder='আপনার সম্পূর্ণ ঠিকানা লিখুন (যেমন: বাড়ি নং, রোড নং, এলাকা, থানা, জেলা)'
            {...register('address')}
            rows={3}
            className={`bg-white border-[#E5E7EB] rounded-[14px] p-4 text-[#172033] text-sm focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/20 transition-all min-h-[110px] ${
              errors.address ? 'border-red-500 ring-1 ring-red-500' : ''
            }`}
          />
          {errors.address && (
            <p className='text-red-500 text-xs mt-1 font-medium'>{errors.address.message}</p>
          )}
        </div>

        {/* Primary CTA Button */}
        <Button
          type='submit'
          className='w-full mt-6 bg-[#F4B400] hover:bg-[#E5A800] text-[#172033] font-bold h-13 rounded-[14px] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-base border-0'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>অর্ডার প্রসেস হচ্ছে...</span>
          ) : (
            <>
              <span>অর্ডার নিশ্চিত করুন</span>
              <ArrowRight className='w-5 h-5' />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}