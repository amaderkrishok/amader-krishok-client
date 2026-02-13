import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PrivacyContent } from '@/components/pages/privacy-policy/privacy-content';

export const metadata: Metadata = {
  title: 'গোপনীয়তা নীতি | আমাদের কৃষক',
  description: 'আমাদের কৃষক প্লাটফর্মের ব্যবহারকারীদের গোপনীয়তা নীতি সংক্রান্ত তথ্য।'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">গোপনীয়তা নীতি</h1>
          <Link href="/">
            <Button variant="outline" size="sm">
              হোম পেজে ফিরে যান
            </Button>
          </Link>
        </div>
        
        <PrivacyContent />
        
        <div className="mt-8 pt-6 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">
            সর্বশেষ আপডেট: মে ১৮, ২০২৫
          </p>
          <Link href="/contact">
            <Button variant="outline" size="sm">
              যোগাযোগ করুন
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}