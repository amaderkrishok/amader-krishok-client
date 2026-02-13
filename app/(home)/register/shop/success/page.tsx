'use client';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegistrationSuccess() {
    return (
        <div className='max-w-md mx-auto py-16 px-4 text-center'>
            <div className='flex justify-center mb-6'>
                <CheckCircle className='h-16 w-16 text-emerald-700' />
            </div>

            <h1 className='text-2xl font-bold mb-4 text-black'>
                রেজিস্ট্রেশন সফলভাবে জমা দেওয়া হয়েছে!
            </h1>

            <p className='text-muted-foreground mb-8'>
                ভেন্ডর হিসেবে নিবন্ধনের জন্য ধন্যবাদ। আমরা আপনার আবেদন পেয়েছি এবং
                শীঘ্রই এটি পর্যালোচনা করব। আপনার অ্যাকাউন্ট অনুমোদিত হলে, আপনি একটি ইমেল
                বিজ্ঞপ্তি পাবেন।
            </p>

            <div className='space-y-4'>
                <Button asChild className='w-full'>
                    <Link href='/'>হোমপেজে ফিরে যান</Link>
                </Button>

                <p className='text-sm text-muted-foreground'>
                    কোনো প্রশ্ন আছে? আমাদের সহায়তা দলের সাথে যোগাযোগ করুন{' '}
                    <a
                        href='mailto:support@farmstead.com'
                        className='text-accent hover:underline'
                    >
                        support@farmstead.com
                    </a>
                </p>
            </div>
        </div>
    );
}
