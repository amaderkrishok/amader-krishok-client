'use client';

import { useState, useEffect } from 'react';
import { Star, Trash2, Search, Store, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { StoreReviewService } from '@/services/store-review-service';
import type { StoreReview } from '@/types/store-review';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminShopReviewsPage() {
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await StoreReviewService.getAllForAdmin();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('দোকান রিভিউ লোড করতে সমস্যা হয়েছে');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই শপ রিভিউটি মুছে ফেলতে চান?')) return;
    try {
      await StoreReviewService.deleteReview(id);
      toast.success('রিভিউ মুছে ফেলা হয়েছে');
      setReviews((prev) => (Array.isArray(prev) ? prev.filter((r) => r.id !== id) : []));
    } catch (error) {
      toast.error('ডিলিট করতে সমস্যা হয়েছে');
    }
  };

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const filteredReviews = safeReviews.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.comment?.toLowerCase().includes(term) ||
      r.user?.name?.toLowerCase().includes(term) ||
      r.store?.name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 space-y-6 w-full mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-600" />
            দোকান রিভিউ ও মন্তব্য (Shop Reviews - Admin Only)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            ভেন্ডর বা দোকানের সকল রেটিং এবং মন্তব্য কেবল এডমিন প্যানেল থেকে দেখা ও নিয়ন্ত্রণ করা যাবে।
          </p>
        </div>

        <Button onClick={fetchReviews} variant="outline" size="sm" className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" />
          রিফ্রেশ
        </Button>
      </div>

      <Card className="border-gray-200 shadow-sm rounded-2xl">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-bold text-gray-800">
              মোট শপ রিভিউ: {safeReviews.length} টি
            </CardTitle>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="দোকানের নাম, ইউজার বা মন্তব্য..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-xl border-gray-300 text-sm"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-gray-500">লোডিং হচ্ছে...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-12 text-center text-gray-500">কোনো শপ রিভিউ পাওয়া যায়নি।</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
                  <tr>
                    <th className="p-4">আইডি</th>
                    <th className="p-4">দোকান (Store)</th>
                    <th className="p-4">ব্যবহারকারী</th>
                    <th className="p-4">রেটিং</th>
                    <th className="p-4">মন্তব্য (Comment)</th>
                    <th className="p-4">তারিখ</th>
                    <th className="p-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4 font-mono text-xs text-gray-400">#{rev.id}</td>
                      <td className="p-4">
                        {rev.store ? (
                          <Link
                            href={`/marketplace/stores/${rev.store.id}`}
                            target="_blank"
                            className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                          >
                            <Store className="w-3.5 h-3.5" />
                            {rev.store.name}
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </Link>
                        ) : (
                          <span className="text-gray-400">দোকান অপসারিত</span>
                        )}
                      </td>
                      <td className="p-4 font-medium text-gray-900">
                        {rev.user?.name || 'অজানা ইউজার'}
                      </td>
                      <td className="p-4">
                        <Badge className="bg-amber-50 text-amber-800 border-amber-200 gap-1 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {rev.rating} / ৫
                        </Badge>
                      </td>
                      <td className="p-4 max-w-sm text-gray-700 leading-relaxed">
                        {rev.comment}
                      </td>
                      <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(rev.createdAt).toLocaleDateString('bn-BD')}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(rev.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
