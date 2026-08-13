import { useSession } from '@/components/providers/session-provider';
import { getStaticDashboardPrefixByRole } from '@/config/dashboard-navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { CheckCircle2, Clock, Truck, Package, Store, ArrowRight, ClipboardList } from 'lucide-react';

interface OrderNextStepsProps {
	orderId: string;
}

export function OrderNextSteps({ orderId }: OrderNextStepsProps) {
	const { isAuthenticated, user } = useSession();

	const timelineSteps = [
		{ label: 'অর্ডার নিশ্চিত', completed: true, active: true },
		{ label: 'প্রস্তুত করা হচ্ছে', completed: false, active: false },
		{ label: 'ডেলিভারির পথে', completed: false, active: false },
		{ label: 'ডেলিভারি সম্পন্ন', completed: false, active: false },
	];

	const nextSteps = [
		{
			num: '01',
			title: 'দোকানদার নিশ্চিত করবেন',
			desc: 'বিক্রেতা আপনার অর্ডার পাবেন এবং সেটি গ্রহণ করবেন।',
			icon: Store,
		},
		{
			num: '02',
			title: 'পণ্য প্রস্তুতকরণ',
			desc: 'তাজা ও পুষ্টিকর কৃষিপণ্য ভালোমতো প্যাকেজিং করা হবে।',
			icon: Package,
		},
		{
			num: '03',
			title: 'ডেলিভারি পাঠানো',
			desc: 'আমাদের ডেলিভারি পার্টনার পণ্য গন্তব্যে নিয়ে রওনা হবেন।',
			icon: Truck,
		},
		{
			num: '04',
			title: 'অর্ডার সম্পন্ন',
			desc: 'পণ্য হাতে পেয়ে মূল্য পরিশোধ করে অর্ডার সম্পন্ন করবেন।',
			icon: CheckCircle2,
		},
	];

	return (
		<div className='space-y-8'>
			{/* Order Status Timeline Section */}
			<div className='bg-white p-6 sm:p-8 rounded-[24px] border border-[#E5E7EB] shadow-xs space-y-6'>
				<div className='border-b border-[#E5E7EB] pb-4 flex items-center justify-between'>
					<h3 className='text-lg font-extrabold text-[#28321A] flex items-center gap-2'>
						<Clock className='w-5 h-5 text-[#28321A]' />
						<span>অর্ডারের বর্তমান অবস্থা</span>
					</h3>
					<span className='text-xs font-bold px-3 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]'>
						প্রসেসিং এ আছে
					</span>
				</div>

				{/* Desktop Horizontal Timeline */}
				<div className='hidden sm:grid grid-cols-4 gap-4 relative py-2'>
					{timelineSteps.map((step, idx) => (
						<div key={idx} className='flex flex-col items-center text-center relative z-10 space-y-2'>
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs transition-all ${
									step.completed
										? 'bg-[#28321A] text-[#FFF4CC] ring-4 ring-[#28321A]/10'
										: 'bg-gray-100 text-gray-400 border border-gray-200'
								}`}
							>
								{step.completed ? <CheckCircle2 className='w-5 h-5' /> : idx + 1}
							</div>
							<span
								className={`text-xs font-bold ${
									step.completed ? 'text-[#28321A]' : 'text-gray-400'
								}`}
							>
								{step.label}
							</span>
						</div>
					))}
				</div>

				{/* Mobile Vertical Timeline */}
				<div className='sm:hidden space-y-4 pl-2 relative'>
					{timelineSteps.map((step, idx) => (
						<div key={idx} className='flex items-center gap-3 relative z-10'>
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
									step.completed
										? 'bg-[#28321A] text-[#FFF4CC]'
										: 'bg-gray-100 text-gray-400 border border-gray-200'
								}`}
							>
								{step.completed ? <CheckCircle2 className='w-4 h-4' /> : idx + 1}
							</div>
							<span
								className={`text-xs font-bold ${
									step.completed ? 'text-[#28321A]' : 'text-gray-400'
								}`}
							>
								{step.label}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* How Your Order Works Section */}
			<div className='bg-white p-6 sm:p-8 rounded-[24px] border border-[#E5E7EB] shadow-xs space-y-6'>
				<div className='border-b border-[#E5E7EB] pb-4'>
					<h3 className='text-lg font-extrabold text-[#28321A] flex items-center gap-2'>
						<span>💡</span>
						<span>এরপর কী হবে?</span>
					</h3>
					<p className='text-xs text-[#64748B] mt-1'>
						আপনার অর্ডারটি যেভাবে আপনার কাছে পৌঁছাবে
					</p>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					{nextSteps.map((step, idx) => {
						const IconComp = step.icon;

						return (
							<div
								key={idx}
								className='p-4 rounded-[18px] border border-[#E5E7EB] bg-[#F7F9F5]/40 hover:bg-[#F7F9F5] transition-all space-y-2 group'
							>
								<div className='flex items-center justify-between'>
									<span className='text-xs font-mono font-black text-[#28321A]/60 bg-white px-2 py-0.5 rounded-md border border-gray-100'>
										{step.num}
									</span>
									<div className='w-8 h-8 rounded-full bg-[#FFF4CC] text-[#28321A] flex items-center justify-center border border-[#F4B400]/30 group-hover:scale-110 transition-transform'>
										<IconComp className='w-4 h-4' />
									</div>
								</div>
								<h4 className='font-bold text-sm text-[#172033] pt-1'>{step.title}</h4>
								<p className='text-xs text-[#64748B] leading-relaxed'>{step.desc}</p>
							</div>
						);
					})}
				</div>
			</div>

			{/* Action CTA Buttons */}
			<div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-2'>
				<Button
					asChild
					className='w-full sm:w-auto bg-[#28321A] hover:bg-[#1A2210] text-[#FFF4CC] font-extrabold h-13 px-8 rounded-[14px] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm border-0'
				>
					<Link href='/marketplace'>
						<span>🛍️ আরও পণ্য কিনুন</span>
						<ArrowRight className='w-4 h-4' />
					</Link>
				</Button>

				{isAuthenticated && (
					<Button
						variant='outline'
						asChild
						className='w-full sm:w-auto bg-white border-[#28321A] text-[#28321A] hover:bg-gray-50 font-bold h-13 px-8 rounded-[14px] shadow-2xs transition-all flex items-center justify-center gap-2 text-sm'
					>
						<Link
							href={`${getStaticDashboardPrefixByRole(
								user?.role
							)}/account/orders/${orderId}`}
						>
							<ClipboardList className='w-4 h-4' />
							<span>📋 অর্ডার ট্র্যাক করুন</span>
						</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
