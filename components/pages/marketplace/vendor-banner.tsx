import { ArrowRight, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function VendorBanner() {
	return (
		<div className='relative overflow-hidden bg-gradient-to-r from-[#26351B] via-[#1B2813] to-[#26351B] rounded-2xl p-6 sm:p-8 mb-10 mt-6 shadow-xl border border-[#3F6212]/30 group'>
			{/* Decorative elements */}
			<div className='absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 group-hover:scale-110 transition-transform duration-700 ease-in-out'></div>
			<div className='absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-[#F5B800] opacity-10 group-hover:scale-110 transition-transform duration-700 ease-in-out'></div>
			
			<div className='relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10'>
				<div className='max-w-2xl'>
					<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F5B800] text-xs font-bold mb-2.5 backdrop-blur-sm'>
						<Store className='w-3.5 h-3.5' />
						<span>খামারি ও বিক্রেতাদের জন্য</span>
					</div>
					<h2 className='text-xl sm:text-2xl font-extrabold text-white mb-2'>
						বিক্রেতা হিসেবে আমাদের সাথে যুক্ত হন
					</h2>
					<p className='text-gray-200 text-sm sm:text-base leading-relaxed font-normal'>
						আপনার পৌঁছানোর পরিধি বাড়ান এবং হাজার হাজার গ্রাহকের কাছে আপনার কৃষি
						পণ্য বিক্রি করুন। আজই নিবন্ধন করুন এবং আমাদের প্ল্যাটফর্মে যাচাইকৃত
						সেলার হন।
					</p>
				</div>
				<Button
					asChild
					className='bg-[#F5B800] text-[#172033] hover:bg-[#e0a800] shadow-md transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl px-6 py-3 h-auto text-base font-bold border-none whitespace-nowrap group/btn'
				>
					<Link href='/auth/register/vendor' className='flex items-center gap-2'>
						<span>রেজিষ্ট্রেশন করুন</span>
						<ArrowRight className='h-4 w-4 group-hover/btn:translate-x-1 transition-transform' />
					</Link>
				</Button>
			</div>
		</div>
	);
}