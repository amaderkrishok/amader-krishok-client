'use client';

import { FertilizerCalculator } from '@/components/pages/crop-calculator/fertilizer-calculator';

export default function CropCalculatorPage() {
	// Bengali is now hardcoded as the only language
	const language = 'bn';

	return (
		<div className='min-h-screen bg-gradient-to-br from-green-50/50 via-white to-emerald-50/30 py-12 px-4'>
			<div className='max-w-4xl mx-auto'>
				<div className='mb-10'>
					<div className='flex flex-col items-center gap-4 text-center'>
						<div className='inline-flex items-center justify-center p-3 bg-green-100/50 rounded-2xl mb-2 shadow-sm'>
							<svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
							</svg>
						</div>
						<h1 className='text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-600 pb-2'>
							সারের হিসাব ক্যালকুলেটর
						</h1>

						<p className='text-lg text-gray-600 max-w-lg'>
							আপনার ফসলের জন্য সঠিক পরিমাণ সার হিসাব করুন
						</p>
					</div>
				</div>

				<div className='bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-4 md:p-8'>
					<FertilizerCalculator language={language} />
				</div>

				<div className='mt-10 text-center text-sm text-gray-500 bg-gray-50/50 py-3 px-6 rounded-xl border border-gray-100 max-w-2xl mx-auto'>
					এই ক্যালকুলেটরটি সাধারণ নির্দেশিকা অনুযায়ী অনুমান প্রদান করে। প্রকৃত
					প্রয়োজন ভিন্ন হতে পারে।
				</div>
			</div>
		</div>
	);
}
