import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function VendorBanner() {
	return (
		<div className='bg-green-100/50 border border-green-200 rounded-lg p-6 mb-8 mt-10'>
			<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
				<div>
					<h2 className='text-xl font-bold text-gray-900 mb-2'>
						সেলার হিসেবে আমাদের সাথে যুক্ত হন
					</h2>
					<p className='text-gray-600'>
						আপনার পৌঁছানোর পরিধি বাড়ান এবং হাজার হাজার গ্রাহকের কাছে আপনার কৃষি
						পণ্য বিক্রি করুন। আজই নিবন্ধন করুন এবং আমাদের প্ল্যাটফর্মে যাচাইকৃত
						সেলার হন।
					</p>
				</div>
				<Button
					asChild
					className='bg-green-600 hover:bg-green-700 text-white whitespace-nowrap'
				>
					<Link href='/auth/register/vendor'>
						রেজিষ্ট্রেশন করুন
						<ArrowRight className='ml-2 h-4 w-4' />
					</Link>
				</Button>
			</div>
		</div>
	);
}