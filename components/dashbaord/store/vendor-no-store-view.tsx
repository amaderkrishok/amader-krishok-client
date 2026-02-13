import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Store, ShoppingBag, Building } from 'lucide-react';
import Link from 'next/link';

export function VendorNoStoreView() {
	return (
		<div className='container mx-auto px-4 py-12 max-w-2xl'>
			<Card>
				<CardHeader className='text-center'>
					<div className='flex justify-center mb-4'>
						<Store className='h-12 w-12 text-green-600' />
					</div>
					<CardTitle className='text-2xl'>আপনার কোন স্টোর নেই</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4 text-center'>
					<p>
						আমাদের কৃষক প্লাটফর্মে আপনার নিজস্ব স্টোর তৈরি করুন এবং আপনার পণ্য
						বিক্রি শুরু করুন।
					</p>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
						<div className='p-4 border rounded-lg flex flex-col items-center'>
							<ShoppingBag className='h-8 w-8 text-green-600 mb-2' />
							<h3 className='font-medium'>পণ্য বিক্রি করুন</h3>
							<p className='text-sm text-gray-600 mt-1'>
								আপনার কৃষি পণ্য বা প্রসেসড ফুড সরাসরি ক্রেতাদের কাছে পৌঁছান
							</p>
						</div>

						<div className='p-4 border rounded-lg flex flex-col items-center'>
							<Building className='h-8 w-8 text-green-600 mb-2' />
							<h3 className='font-medium'>ব্র্যান্ড তৈরি করুন</h3>
							<p className='text-sm text-gray-600 mt-1'>
								আপনার ব্যবসার জন্য একটি অনলাইন উপস্থিতি তৈরি করুন
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter className='flex justify-center'>
					<Button asChild className='bg-green-600 hover:bg-green-700'>
						<Link href='/vendor/onboarding'>স্টোর তৈরি করুন</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
