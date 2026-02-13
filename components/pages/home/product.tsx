import { Button } from '@/components/ui/button';
import { CalculatorIcon, Cloud, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function Product() {
	return (
		<section className='py-16 px-4 md:px-8 lg:px-12 '>
			<div className='max-w-5xl mx-auto text-center'>
				<h2 className='text-4xl md:text-5xl font-light text-gray-900 mb-4'>
					আমাদের তৈরি করা টুল সমূহ
				</h2>
				<p className='text-gray-600 max-w-2xl mx-auto'>
					আমাদের টুলগুলি আধুনিক প্রযুক্তি ব্যবহার করে কৃষিকাজের প্রতিটি দিককে
					সঠিকভাবে পরিচালনা করতে সহায়তা করে, যেমন ফসলের বৃদ্ধি পর্যবেক্ষণ,
					মাটির অবস্থা বিশ্লেষণ, পানি ব্যবহারের নিয়ন্ত্রণ এবং আবাদি জমির
					সর্বোত্তম ব্যবহার।
				</p>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
					<div className='bg-opacity-10 p-8 rounded-lg backdrop-blur-md'>
						<Cloud className='w-16 h-16 mx-auto mb-4' />
						<h3 className='text-2xl font-semibold mb-4'>আবহাওয়া আপডেট</h3>
						<p className='mb-6'>
							আপনার খামারের জন্য উপযুক্ত কৃষি অন্তর্দৃষ্টি এবং সঠিক আবহাওয়ার
							পূর্বাভাস পান।
						</p>
						<Link href={`/weather`}>
							<Button size='lg' className='w-full'>
								ঘুরে আসুন
							</Button>
						</Link>
					</div>
					<div className='bg-opacity-10 p-8 rounded-lg backdrop-blur-md'>
						<CalculatorIcon className='w-16 h-16 mx-auto mb-4' />
						<h3 className='text-2xl font-semibold mb-4'>সার ক্যালকুলেটর</h3>
						<p className='mb-6'>
							আপনার খামারের জন্য সঠিক সার পরিমাণ নির্ধারণ করুন এবং ফলন বৃদ্ধি
							করতে সহায়ক উপকরণ পান।
						</p>
						<Link href={`/crop-calculator`}>
							<Button size='lg' className='w-full'>
								ঘুরে আসুন
							</Button>
						</Link>
					</div>
					<div className='bg-opacity-10 p-8 rounded-lg backdrop-blur-md'>
						<ShoppingCart className='w-16 h-16 mx-auto mb-4' />
						<h3 className='text-2xl font-semibold mb-4'>অনলাইন বাজার </h3>
						<p className='mb-6'>
							আমাদের ডিজিটাল প্ল্যাটফর্মে আপনি সহজেই ফসল ক্রয় এবং বিক্রয়ের
							কার্যক্রম পরিচালনা করতে পারেন।
						</p>
						<Link href={`/marketplace`}>
							<Button size='lg' className='w-full'>
								ঘুরে আসুন
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
