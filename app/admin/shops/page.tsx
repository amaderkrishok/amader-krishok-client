import { AdminShopsList } from '@/components/dashbaord/shops/admin-shops-list';
import { Store, ShieldCheck } from 'lucide-react';

export default function Page() {
	return (
		<div className='space-y-6 w-full mx-auto pb-6'>
			{/* HERO HEADER */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#FFF9E8] via-white to-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
				<div className='space-y-1.5 z-10'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 rounded-xl bg-[#26351B] flex items-center justify-center text-[#F5B800] shadow-2xs'>
							<Store className='w-4 h-4 text-[#F5B800]' />
						</div>
						<h1 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
							সকল দোকান (All Shops / Stores)
						</h1>
					</div>
					<p className='text-xs sm:text-sm text-[#64748B] font-medium'>
						প্ল্যাটফর্মের নিবন্ধিত সকল ভেন্ডর স্টোর অনুমোদন, ফিল্টার ও পরিচালনা করুন
					</p>
				</div>
			</div>

			<AdminShopsList />
		</div>
	);
}
