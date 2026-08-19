'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle2, AlertCircle, Send, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useSession } from '@/components/providers/session-provider';
import { ProductReviewService } from '@/services/product-review-service';
import type { ProductReview, ProductReviewSummary } from '@/types/product-review';

interface ProductReviewsSectionProps {
  productId: number;
}

export function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const { user, status } = useSession();
  const [summary, setSummary] = useState<ProductReviewSummary>({
    averageRating: 0,
    totalReviews: 0,
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState<{
    eligible: boolean;
    hasReviewed: boolean;
  }>({ eligible: false, hasReviewed: false });

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await ProductReviewService.getByProduct(productId);
      setSummary({
        averageRating: res?.averageRating || 0,
        totalReviews: res?.totalReviews || 0,
        reviews: Array.isArray(res?.reviews) ? res.reviews : [],
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserEligibility = async () => {
    if (status === 'authenticated' && user) {
      try {
        const res = await ProductReviewService.checkEligibility(productId);
        setEligibility({ eligible: !!res?.eligible, hasReviewed: !!res?.hasReviewed });
        if (res?.existingReview) {
          setRating(res.existingReview.rating);
          setComment(res.existingReview.comment);
        }
      } catch (error) {
        console.error('Error checking eligibility:', error);
      }
    }
  };

  useEffect(() => {
    fetchReviews();
    checkUserEligibility();
  }, [productId, status, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warning('মন্তব্য লিখুন', {
        description: 'অনুগ্রহ করে আপনার মূল্যবান মতামত বা মন্তব্য লিখুন।',
      });
      return;
    }

    try {
      setSubmitting(true);
      await ProductReviewService.submitReview({
        productId,
        rating,
        comment,
      });
      toast.success(
        eligibility.hasReviewed ? 'রিভিউ আপডেট হয়েছে!' : 'ধন্যবাদ! রিভিউ জমা হয়েছে',
        {
          description: 'আপনার রিভিউটি সফলভাবে সংরক্ষিত হয়েছে।',
        }
      );
      setComment('');
      fetchReviews();
      checkUserEligibility();
    } catch (error: any) {
      toast.error('সমস্যা হয়েছে', {
        description:
          error?.response?.data?.message ||
          'রিভিউ জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-emerald-100 shadow-sm text-center">
          <span className="text-5xl font-extrabold text-emerald-700">
            {summary.averageRating > 0 ? summary.averageRating : '০.০'}
          </span>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(summary.averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">
            সর্বমোট {summary.totalReviews} টি রিভিউ
          </span>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center space-y-3">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            গ্রাহকদের মতামত ও রেটিং
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            আমাদের কৃষকের প্রকৃত ক্রেতাদের দেওয়া অভিজ্ঞতা ও মতামত পড়ুন। পণ্য ক্রয়ের পরই যেকোনো নিবন্ধিত গ্রাহক তার সতস্ফূর্ত রিভিউ দিতে পারেন।
          </p>
        </div>
      </div>

      {/* Review Submission Form Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          আপনার মূল্যবান রিভিউ প্রদান করুন
        </h4>

        {status !== 'authenticated' ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>রিভিউ দিতে আপনাকে প্রথমে একাউন্টে লগইন করতে হবে।</span>
            </div>
            <Button
              size="sm"
              onClick={() => (window.location.href = '/auth/login')}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              লগইন করুন
            </Button>
          </div>
        ) : !eligibility.eligible ? (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold">পণ্য ক্রয়ের পর রিভিউ দিতে পারবেন</p>
              <p className="text-xs text-blue-600 mt-0.5">
                সঠিক ও নির্ভরযোগ্য রেটিং বজায় রাখতে কেবল এই পণ্যটি যারা ক্রয় করেছেন তাদের জন্য রিভিউ সুবিধা উন্মুক্ত।
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {eligibility.hasReviewed && (
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 mb-2">
                আপনি পূর্বে এই পণ্যটির রিভিউ দিয়েছেন। নিচের ফর্ম থেকে তা সংশোধন বা আপডেট করতে পারেন।
              </Badge>
            )}

            {/* Rating Stars Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                রেটিং সিলেক্ট করুন:
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-sm text-amber-600">
                  {hoverRating || rating} / ৫
                </span>
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                আপনার মন্তব্য / অভিজ্ঞতা লিখুন:
              </label>
              <Textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="পণ্যটি আপনার কেমন লেগেছে? গুণগত মান ও সুবিধা সম্পর্কে আপনার মন্তব্য শেয়ার করুন..."
                className="w-full rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting
                ? 'জমা হচ্ছে...'
                : eligibility.hasReviewed
                ? 'রিভিউ আপডেট করুন'
                : 'রিভিউ জমা দিন'}
            </Button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="text-md font-bold text-gray-900">
          সকল রিভিউ ({summary.totalReviews})
        </h4>

        {loading ? (
          <div className="text-center py-8 text-gray-500">রিভিউ লোড হচ্ছে...</div>
        ) : !summary.reviews || summary.reviews.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">এখনো কোনো রিভিউ প্রদান করা হয়নি</p>
            <p className="text-xs text-gray-400 mt-1">প্রথম ক্রেতা হিসেবে আপনি রিভিউ দিন!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {summary.reviews.map((rev: ProductReview) => (
              <Card key={rev.id} className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                        {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-gray-900">
                          {rev.user?.name || 'গ্রাহক'}
                        </h5>
                        <p className="text-[11px] text-gray-400">
                          {new Date(rev.createdAt).toLocaleDateString('bn-BD', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-amber-700">
                        {rev.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 pt-1 leading-relaxed whitespace-pre-line">
                    {rev.comment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
