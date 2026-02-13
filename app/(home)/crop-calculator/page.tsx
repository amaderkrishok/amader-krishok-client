'use client';

import { FertilizerCalculator } from '@/components/pages/crop-calculator/fertilizer-calculator';

export default function CropCalculatorPage() {
	// Bengali is now hardcoded as the only language
	const language = 'bn';

	return (
		<div className='container mx-auto py-10 px-4'>
			<div className='max-w-3xl mx-auto'>
				<div className='mb-8'>
					<div className='flex flex-col items-center gap-3 text-center'>
						<h1 className='text-3xl font-bold tracking-tight '>
							সারের হিসাব ক্যালকুলেটর
						</h1>

						<p className=' max-w-md'>
							আপনার ফসলের জন্য সঠিক পরিমাণ সার হিসাব করুন
						</p>
					</div>
				</div>

				<FertilizerCalculator language={language} />

				<div className='mt-8 text-center text-sm text-muted-foreground'>
					এই ক্যালকুলেটরটি সাধারণ নির্দেশিকা অনুযায়ী অনুমান প্রদান করে। প্রকৃত
					প্রয়োজন ভিন্ন হতে পারে।
				</div>
			</div>
		</div>
	);
}
