import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function VendorBanner() {
	return (
		<div className='relative overflow-hidden bg-gradient-to-r from-[#2D331F] via-[#2D331F]/90 to-[#2D331F] rounded-2xl p-8 mb-10 mt-6 shadow-xl group'>
			{/* Decorative elements */}
			<div className='absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 group-hover:scale-110 transition-transform duration-700 ease-in-out'></div>
			<div className='absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-[#EAB308] opacity-10 group-hover:scale-110 transition-transform duration-700 ease-in-out'></div>
			
			<div className='relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10'>
				<div className='max-w-2xl'>
					<h2 className='text-2xl md:text-3xl font-extrabold text-white mb-3 flex items-center gap-2'>
						
						সেলার হিসেবে আমাদের সাথে যুক্ত হন
					</h2>
					<p className='text-gray-200 text-lg leading-relaxed'>
						আপনার পৌঁছানোর পরিধি বাড়ান এবং হাজার হাজার গ্রাহকের কাছে আপনার কৃষি
						পণ্য বিক্রি করুন। আজই নিবন্ধন করুন এবং আমাদের প্ল্যাটফর্মে যাচাইকৃত
						সেলার হন।
					</p>
				</div>
				<Button
					asChild
					className='bg-white text-[#2D331F] hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 transform hover:-translate-y-1 rounded-xl px-8 py-6 text-lg font-bold border-none whitespace-nowrap group/btn'
				>
					<Link href='/auth/register/vendor'>
						রেজিষ্ট্রেশন করুন
						<ArrowRight className='ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform' />
					</Link>
				</Button>
			</div>
		</div>
	);
}