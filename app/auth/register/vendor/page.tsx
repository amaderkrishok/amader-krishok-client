'use client';

import { RegisterForm } from '@/components/auth/register-form';

export default function Page() {
	return (
		<div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
			<div className='w-full max-w-xl'>
				<h1 className='text-2xl font-bold text-center mb-6'>
					বিক্রেতা হিসেবে নিবন্ধন করুন
				</h1>
				<p className='text-gray-600 text-center mb-8'>
					আমাদের কৃষক প্ল্যাটফর্মে আপনার পণ্য বিক্রয় করতে একাউন্ট খুলুন এবং
					কৃষকদের সাথে সরাসরি যোগাযোগ করুন।
				</p>
				<RegisterForm role='vendor' showImageUpload={true} />
			</div>
		</div>
	);
}
