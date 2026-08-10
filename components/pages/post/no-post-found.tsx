'use client';

import { Button } from '@/components/ui/button';
import { Sprout, RotateCcw } from 'lucide-react';

interface NoPostsFoundProps {
	clearAllFilters: () => void;
}

export function NoPostsFound({ clearAllFilters }: NoPostsFoundProps) {
	return (
		<div className='py-16 px-4 text-center bg-white rounded-3xl border border-[#E5E7EB] shadow-sm my-6 flex flex-col items-center justify-center space-y-4'>
			{/* Icon with subtle yellow/green glow */}
			<div className='w-20 h-20 rounded-full bg-[#1E2817]/5 border border-[#1E2817]/10 flex items-center justify-center shadow-inner relative'>
				<Sprout className='w-10 h-10 text-[#2E7D32]' />
				<div className='absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FBBF24] flex items-center justify-center text-xs font-bold shadow'>
					🌱
				</div>
			</div>

			<div className='space-y-1.5 max-w-sm mx-auto'>
				<h3 className='text-xl font-bold text-[#172018]'>
					কোনো পোস্ট পাওয়া যায়নি
				</h3>
				<p className='text-sm text-[#6B7280] font-normal leading-relaxed'>
					অন্য কোনো বিষয় বা শব্দ দিয়ে আবার চেষ্টা করুন।
				</p>
			</div>

			<Button
				onClick={clearAllFilters}
				className='bg-[#1E2817] hover:bg-[#2A351F] text-white font-bold rounded-2xl px-6 py-2.5 h-auto inline-flex items-center gap-2 shadow-md transition-all'
			>
				<RotateCcw className='w-4 h-4 text-[#FBBF24]' />
				<span>সব পোস্ট দেখুন</span>
			</Button>
		</div>
	);
}

