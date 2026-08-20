'use client';

import type React from 'react';
import { Sprout } from 'lucide-react';
import { useSession } from '@/components/providers/session-provider';

interface DashboardHeaderProps {
	heading?: string;
	text?: string;
	children?: React.ReactNode;
}

export function DashboardHeader({
	heading,
	text,
	children,
}: DashboardHeaderProps) {
	const { data: session } = useSession();
	const userName = session?.user?.name || 'গ্রাহক';

	return (
		<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
			{/* Decorative subtle background pattern */}
			<div className='absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#FFF9E8] to-transparent pointer-events-none opacity-60' />
			
			<div className='space-y-1.5 z-10'>
				<div className='flex items-center gap-2.5 flex-wrap'>
					<span className='inline-flex items-center justify-center p-2 rounded-xl bg-[#FFF9E8] border border-[#F4B400]/30 text-[#28321A]'>
						<Sprout className='w-5 h-5 text-[#28321A]' />
					</span>
					<h1 className='text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight'>
						{heading || `শুভেচ্ছা, ${userName} 👋`}
					</h1>
				</div>
				<p className='text-sm sm:text-base text-[#667085] font-medium pl-0 sm:pl-10'>
					{text || 'আপনার অর্ডার, কেনাকাটা এবং সংরক্ষিত পণ্যের সারাংশ এখানে দেখুন।'}
				</p>
			</div>

			{children && <div className='z-10 flex-shrink-0'>{children}</div>}
		</div>
	);
}
