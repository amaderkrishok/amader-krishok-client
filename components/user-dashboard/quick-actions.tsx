'use client';

import Link from 'next/link';
import { ShoppingBag, Package, Bookmark, MessageSquare, ArrowRight } from 'lucide-react';

export function QuickActions() {
	const actions = [
		{
			title: '🛍 পণ্য দেখুন',
			subtitle: 'মার্কেটপ্লেসের তাজা পণ্য',
			href: '/marketplace',
			icon: ShoppingBag,
			primary: true,
		},
		{
			title: '📦 আমার অর্ডার',
			subtitle: 'অর্ডার ট্র্যাকিং ও ইতিহাস',
			href: '/user/orders',
			icon: Package,
			primary: false,
		},
		{
			title: '♡ সংরক্ষিত পণ্য',
			subtitle: 'পছন্দের পণ্যের তালিকা',
			href: '/user/saved-products',
			icon: Bookmark,
			primary: false,
		},
		{
			title: '💬 বিক্রেতার সাথে চ্যাট',
			subtitle: 'সরাসরি বিক্রেতাকে বার্তা',
			href: '/user/chat',
			icon: MessageSquare,
			primary: false,
		},
	];

	return (
		<div className='space-y-3'>
			<h2 className='text-lg font-bold text-[#172033] flex items-center gap-2'>
				দ্রুত কাজ
			</h2>

			<div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4'>
				{actions.map((action) => (
					<Link
						key={action.title}
						href={action.href}
						className={`group flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 shadow-xs hover:shadow-md ${
							action.primary
								? 'bg-[#F4B400] text-[#172033] border-[#F4B400] hover:bg-[#E5A700]'
								: 'bg-white text-[#28321A] border-[#28321A]/20 hover:border-[#28321A] hover:bg-[#FFF9E8]/50'
						}`}
					>
						<div className='flex items-center justify-between mb-2'>
							<div
								className={`p-2 rounded-xl ${
									action.primary
										? 'bg-[#172033] text-[#F4B400]'
										: 'bg-[#28321A]/10 text-[#28321A]'
								}`}
							>
								<action.icon className='w-4 h-4' />
							</div>
							<ArrowRight className='w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all' />
						</div>

						<div>
							<h3 className='font-extrabold text-sm leading-tight'>
								{action.title}
							</h3>
							<p
								className={`text-[11px] font-medium mt-0.5 ${
									action.primary ? 'text-[#172033]/80' : 'text-[#667085]'
								}`}
							>
								{action.subtitle}
							</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
