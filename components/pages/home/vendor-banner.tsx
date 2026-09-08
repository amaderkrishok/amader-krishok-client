import { ArrowRight, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function VendorBanner() {
	return (
		<div className='relative overflow-hidden bg-gradient-to-r from-[#4A5E3A] via-[#3D4F2E] to-[#4A5E3A] rounded-2xl p-6 sm:p-8 my-10 shadow-lg text-white border border-white/15'>
			<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10'>
				<div className='max-w-2xl'>
					<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F5B800] text-xs font-bold mb-2.5 backdrop-blur-sm'>
						<Store className='w-3.5 h-3.5' />
						<span>খামারি ও বিক্রেতাদের জন্য</span>
					</div>
					<h2 className='text-xl sm:text-2xl font-extrabold text-white mb-2'>
						বিক্রেতা হিসেবে আমাদের সাথে যুক্ত হন
					</h2>
					<p className='text-gray-200 text-sm sm:text-base leading-relaxed font-normal'>
						আপনার পৌঁছানোর পরিধি বাড়ান এবং দেশের হাজার হাজার গ্রাহকের কাছে সরাসরি আপনার কৃষি পণ্য বিক্রি করুন। আজই নিবন্ধন করে আমাদের প্ল্যাটফর্মে যাচাইকৃত সেলার হন।
					</p>
				</div>

				<Button
					asChild
					className='bg-[#F5B800] hover:bg-[#e0a800] text-[#172033] font-bold px-6 py-3 h-auto rounded-xl text-sm sm:text-base whitespace-nowrap shadow-md border-none transition-transform hover:scale-105'
				>
					<Link href='/auth/register/vendor' className='flex items-center gap-2'>
						<span>রেজিষ্ট্রেশন করুন</span>
						<ArrowRight className='h-4 w-4' />
					</Link>
				</Button>
			</div>
		</div>
	);
}
