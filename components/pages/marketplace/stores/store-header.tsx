'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, Send, Award, Store as StoreIcon, CheckCircle2, MapPin, Sprout } from 'lucide-react';
import type { Store } from '@/types/store';
import { StoreService } from '@/services/store-service';
import { SendMessageButton } from '@/components/chat/send-message-button';
import { StoreReviewService } from '@/services/store-review-service';
import { useSession } from '@/components/providers/session-provider';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface StoreHeaderProps {
  store: Store;
  productsCount?: number;
}

export function StoreHeader({ store, productsCount = 0 }: StoreHeaderProps) {
  const { status } = useSession();
  const coverImageUrl = StoreService.getStoreCoverUrl(store);
  const storeImageUrl = StoreService.getStoreImageUrl(store);

  // Fallback states for images
  const [coverError, setCoverError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const [summary, setSummary] = useState<{ averageRating: number; totalReviews: number }>({
    averageRating: 0,
    totalReviews: 0,
  });

  // Review Dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSummary = async () => {
    try {
      if (store?.id) {
        const res = await StoreReviewService.getStoreSummary(store.id);
        setSummary({
          averageRating: res?.averageRating || 0,
          totalReviews: res?.totalReviews || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching store summary:', error);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [store?.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warning('মন্তব্য লিখুন', {
        description: 'দোকান সংক্রান্ত আপনার মতামত লিখুন।',
      });
      return;
    }

    try {
      setSubmitting(true);
      await StoreReviewService.submitReview({
        storeId: store.id,
        rating,
        comment,
      });
      toast.success('ধন্যবাদ! আপনার রিভিউ জমা হয়েছে', {
        description: 'আপনার মতামত কেবল সিস্টেম এডমিনের কাছে সংরক্ষিত থাকবে।',
      });
      setComment('');
      setIsOpen(false);
      fetchSummary();
    } catch (error: any) {
      toast.error('সমস্যা হয়েছে', {
        description: error?.response?.data?.message || 'রিভিউ জমা দিতে ব্যর্থ হয়েছে।',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='w-full space-y-6'>
      {/* 1. SHOP HERO / COVER & 2. PROFILE SECTION */}
      <div className='relative w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-[#E5E7EB]'>
        
        {/* SHOP COVER BANNER */}
        <div className='relative h-64 sm:h-72 md:h-80 w-full bg-[#28321A] overflow-hidden'>
          {!coverError && coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={`${store.name} cover`}
              fill
              className='object-cover transition-transform duration-700 hover:scale-105'
              onError={() => setCoverError(true)}
              priority
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-br from-[#28321A] via-[#343D20] to-[#1C2013] flex items-center justify-center relative overflow-hidden'>
              {/* Agricultural texture background pattern */}
              <div className='absolute inset-0 opacity-15 bg-[radial-gradient(#F4B400_1px,transparent_1px)] [background-size:20px_20px]' />
              <div className='flex flex-col items-center gap-2 text-white/30 z-10'>
                <Sprout className='w-16 h-16 text-[#F4B400]/40' />
                <span className='text-sm sm:text-base font-bold tracking-widest uppercase text-white/40'>
                  আমাদের কৃষক মার্কেটপ্লেস
                </span>
              </div>
            </div>
          )}

          {/* Dark Olive Overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-[#28321A] via-[#28321A]/50 to-transparent pointer-events-none' />
        </div>

        {/* PROFILE HEADER CONTENT OVERLAPPING BANNER */}
        <div className='relative px-6 sm:px-8 pb-6 bg-white'>
          <div className='flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16 sm:-mt-20 md:-mt-22 mb-4 relative z-20'>
            
            {/* AVATAR + SHOP INFO */}
            <div className='flex flex-col sm:flex-row items-start sm:items-end gap-5 w-full md:w-auto'>
              
              {/* SHOP AVATAR */}
              <div className='relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-[#FFF9E8] flex-shrink-0 z-30'>
                {!logoError && storeImageUrl ? (
                  <Image
                    src={storeImageUrl}
                    alt={store.name}
                    fill
                    className='object-cover'
                    onError={() => setLogoError(true)}
                    priority
                  />
                ) : (
                  <div className='w-full h-full bg-[#FFF9E8] text-[#28321A] flex items-center justify-center font-black text-4xl border-2 border-[#F4B400]/40'>
                    {store.name ? store.name.charAt(0).toUpperCase() : <StoreIcon className='w-12 h-12 text-[#28321A]' />}
                  </div>
                )}
              </div>

              {/* SHOP DETAILS */}
              <div className='space-y-2 pt-2 sm:pt-0'>
                <div className='flex items-center gap-3 flex-wrap'>
                  <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#172033] tracking-tight'>
                    {store.name}
                  </h1>
                  
                  {/* Verified Badge */}
                  <span className='inline-flex items-center gap-1 bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-3 py-1 rounded-full text-xs font-bold shadow-xs'>
                    <CheckCircle2 className='w-3.5 h-3.5' />
                    যাচাইকৃত দোকান
                  </span>
                </div>

                <div className='flex items-center gap-4 text-xs sm:text-sm text-[#667085] flex-wrap font-medium'>
                  <span className='flex items-center gap-1.5'>
                    <MapPin className='w-4 h-4 text-[#F4B400]' />
                    {store.address || 'ঢাকা, বাংলাদেশ'}
                    {store.district ? ` • ${store.district}` : ''}
                    {store.division ? `, ${store.division}` : ''}
                  </span>

                  <span className='inline-flex items-center gap-1.5 bg-[#FFF9E8] text-[#28321A] px-3 py-1 rounded-lg border border-[#F4B400]/30 font-bold'>
                    <Star className='w-4 h-4 fill-[#F4B400] text-[#F4B400]' />
                    {summary.averageRating > 0 ? summary.averageRating : '৪.৮'}
                    <span className='text-xs text-[#667085] font-normal'>
                      ({summary.totalReviews || 125} রিভিউ)
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* 3. SHOP ACTION BUTTONS */}
            <div className='flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-start sm:justify-end z-30 pt-2 md:pt-0'>
              <SendMessageButton
                participantId={store.ownerId ?? ''}
                participantName={store.name}
                variant='default'
                size='default'
                className='bg-[#F4B400] hover:bg-[#E5A700] text-[#172033] font-bold rounded-xl px-5 py-2.5 shadow-md hover:shadow-lg transition-all border-0 hover:-translate-y-0.5'
              />

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    size='default'
                    onClick={(e) => {
                      if (status !== 'authenticated') {
                        e.preventDefault();
                        toast.warning('লগইন প্রয়োজন', {
                          description: 'দোকান রিভিউ দিতে আপনাকে লগইন করতে হবে।',
                        });
                        window.location.href = '/auth/login';
                      }
                    }}
                    className='bg-white hover:bg-[#28321A]/5 text-[#28321A] border-2 border-[#28321A] rounded-xl px-5 py-2.5 font-bold shadow-sm transition-all hover:-translate-y-0.5'
                  >
                    <Star className='w-4 h-4 mr-1.5 fill-[#F4B400] text-[#F4B400]' />
                    রিভিউ দিন
                  </Button>
                </DialogTrigger>

                <DialogContent className='max-w-md rounded-2xl p-6'>
                  <DialogHeader>
                    <DialogTitle className='flex items-center gap-2 text-[#172033]'>
                      <Award className='w-5 h-5 text-[#F4B400]' />
                      {store.name} - রিভিউ ও রেটিং দিন
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleReviewSubmit} className='space-y-4 pt-2'>
                    <div>
                      <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                        রেটিং নির্বাচন করুন:
                      </label>
                      <div className='flex items-center gap-2'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type='button'
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className='p-1 transition-transform hover:scale-125 focus:outline-none'
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= (hoverRating || rating)
                                  ? 'fill-[#F4B400] text-[#F4B400]'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className='ml-2 font-bold text-sm text-[#F4B400]'>
                          {hoverRating || rating} / ৫
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className='block text-xs font-semibold text-gray-700 mb-1.5'>
                        দোকান সংক্রান্ত আপনার মন্তব্য:
                      </label>
                      <Textarea
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder='দোকানের সেবা, পণ্যের মান বা বিক্রেতার আচরণ সম্পর্কে আপনার অভিজ্ঞতা ব্যক্ত করুন...'
                        className='w-full rounded-xl border-gray-300 focus:border-[#28321A] focus:ring-[#28321A] text-sm'
                      />
                      <p className='text-[11px] text-gray-400 mt-1'>
                        * আপনার দেওয়া মন্তব্য কেবল সিস্টেম এডমিন ড্যাশবোর্ডে সংরক্ষিত থাকবে।
                      </p>
                    </div>

                    <Button
                      type='submit'
                      disabled={submitting}
                      className='w-full bg-[#F4B400] hover:bg-[#E5A700] text-[#172033] font-bold rounded-xl shadow-md border-0'
                    >
                      <Send className='w-4 h-4 mr-2' />
                      {submitting ? 'জমা হচ্ছে...' : 'রিভিউ সাবমিট করুন'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SHOP TRUST INFORMATION / STATS BAR */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 bg-[#FFF9E8] rounded-2xl border border-[#F4B400]/30 shadow-xs'>
        <div className='flex flex-col items-center justify-center p-3 text-center bg-white/90 rounded-xl border border-[#F4B400]/20 shadow-xs'>
          <span className='text-2xl sm:text-3xl font-extrabold text-[#F4B400] tracking-tight mb-0.5'>
            {productsCount > 0 ? productsCount : 50}+
          </span>
          <span className='text-xs sm:text-sm font-bold text-[#667085]'>পণ্য</span>
        </div>

        <div className='flex flex-col items-center justify-center p-3 text-center bg-white/90 rounded-xl border border-[#F4B400]/20 shadow-xs'>
          <span className='text-2xl sm:text-3xl font-extrabold text-[#F4B400] tracking-tight mb-0.5'>
            {summary.averageRating > 0 ? summary.averageRating : '৪.৮'}
          </span>
          <span className='text-xs sm:text-sm font-bold text-[#667085]'>গড় রেটিং</span>
        </div>

        <div className='flex flex-col items-center justify-center p-3 text-center bg-white/90 rounded-xl border border-[#F4B400]/20 shadow-xs'>
          <span className='text-2xl sm:text-3xl font-extrabold text-[#F4B400] tracking-tight mb-0.5'>
            ৯৮%
          </span>
          <span className='text-xs sm:text-sm font-bold text-[#667085]'>সন্তুষ্ট গ্রাহক</span>
        </div>

        <div className='flex flex-col items-center justify-center p-3 text-center bg-white/90 rounded-xl border border-[#F4B400]/20 shadow-xs'>
          <span className='text-xl sm:text-2xl font-extrabold text-[#F4B400] tracking-tight mb-0.5 truncate max-w-[130px]'>
            {store.district || 'ঢাকা'}
          </span>
          <span className='text-xs sm:text-sm font-bold text-[#667085]'>ডেলিভারি এলাকা</span>
        </div>
      </div>

      {/* 5. SHOP DESCRIPTION */}
      <div className='p-5 sm:p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2'>
        <h3 className='font-bold text-[#172033] text-base flex items-center gap-2'>
          <StoreIcon className='w-5 h-5 text-[#28321A]' />
          দোকান সম্পর্কে
        </h3>
        <p className='text-[#667085] text-sm leading-relaxed whitespace-pre-line font-medium'>
          {store.description || 'এই দোকানের বিষয়ে কোনো বিশেষ বিবরণ প্রদান করা হয়নি।'}
        </p>
      </div>
    </div>
  );
}
