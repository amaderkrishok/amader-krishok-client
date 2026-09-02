'use client';

import { useStoreManagement } from './store-management-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Tag, Info, Store as StoreIcon, Calendar, Clock, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, isValid } from 'date-fns';
import { StoreImageDisplay } from './store-image-display';

export function StoreDetails() {
	const { store } = useStoreManagement();

	if (!store) return null;

	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
			{/* Store Information - Left 2/3 */}
			<div className='lg:col-span-2 space-y-6'>
				<Card className='rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs overflow-hidden'>
					<CardHeader className='border-b border-[#E5E7EB] bg-[#FAFAF6] px-6 py-4'>
						<CardTitle className='text-lg font-extrabold text-[#172033] flex items-center gap-2'>
							<StoreIcon className='w-5 h-5 text-[#26351B]' />
							স্টোর তথ্য
						</CardTitle>
					</CardHeader>

					<CardContent className='p-6 space-y-6'>
						{/* Basic Info */}
						<div className='space-y-3'>
							<h3 className='text-xs font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5'>
								<Info className='w-3.5 h-3.5 text-[#F5B800]' />
								মৌলিক তথ্য
							</h3>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold bg-[#FAFAF6] p-4 rounded-2xl border border-[#E5E7EB]'>
								<div className='space-y-1'>
									<p className='text-[#64748B] font-medium'>স্টোরের নাম</p>
									<p className='font-black text-[#172033] text-sm'>{store.name}</p>
								</div>
								<div className='space-y-1'>
									<p className='text-[#64748B] font-medium'>স্লাগ</p>
									<p className='font-bold text-[#26351B] bg-white px-2.5 py-0.5 rounded-md inline-block border border-[#E5E7EB]'>
										{store.slug}
									</p>
								</div>
								<div className='space-y-1'>
									<p className='text-[#64748B] font-medium flex items-center gap-1'>
										<Calendar className='w-3 h-3 text-[#64748B]' /> তৈরি হয়েছে
									</p>
									<p className='font-bold text-[#172033]'>
										{store.createdAt && isValid(new Date(store.createdAt))
											? format(new Date(store.createdAt), 'PPP')
											: 'অজানা তারিখ'}
									</p>
								</div>
								<div className='space-y-1'>
									<p className='text-[#64748B] font-medium flex items-center gap-1'>
										<Clock className='w-3 h-3 text-[#64748B]' /> সর্বশেষ আপডেট
									</p>
									<p className='font-bold text-[#172033]'>
										{store.updatedAt && isValid(new Date(store.updatedAt))
											? format(new Date(store.updatedAt), 'PPP')
											: 'অজানা তারিখ'}
									</p>
								</div>
							</div>
						</div>

						{/* Location */}
						<div className='space-y-3 pt-2'>
							<h3 className='text-xs font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5'>
								<MapPin className='w-3.5 h-3.5 text-[#F5B800]' />
								অবস্থান
							</h3>
							<div className='bg-[#FAFAF6] p-4 rounded-2xl border border-[#E5E7EB] space-y-3 text-xs font-semibold'>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<div className='space-y-1'>
										<p className='text-[#64748B] font-medium'>বিভাগ</p>
										<p className='font-bold text-[#172033]'>{store.division}</p>
									</div>
									<div className='space-y-1'>
										<p className='text-[#64748B] font-medium'>জেলা</p>
										<p className='font-bold text-[#172033]'>{store.district}</p>
									</div>
								</div>
								<div className='pt-2 border-t border-[#E5E7EB]'>
									<p className='text-[#64748B] font-medium'>ঠিকানা</p>
									<p className='font-bold text-[#172033] mt-0.5'>{store.address}</p>
								</div>
							</div>
						</div>

						{/* Categories */}
						<div className='space-y-3 pt-2'>
							<h3 className='text-xs font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5'>
								<Tag className='w-3.5 h-3.5 text-[#F5B800]' />
								বিভাগসমূহ
							</h3>
							<div className='flex flex-wrap gap-2 bg-[#FAFAF6] p-4 rounded-2xl border border-[#E5E7EB]'>
								{store.storeCategories?.length > 0 ? (
									store.storeCategories.map((category) => (
										<Badge
											key={category.id}
											className='bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/40 text-xs font-bold px-3 py-1 rounded-full'
										>
											{category.name}
										</Badge>
									))
								) : (
									<p className='text-xs text-[#64748B] font-medium'>কোনো বিভাগ নির্ধারিত নেই</p>
								)}
							</div>
						</div>

						{/* Description */}
						<div className='space-y-3 pt-2'>
							<h3 className='text-xs font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5'>
								<Globe className='w-3.5 h-3.5 text-[#F5B800]' />
								বিবরণ
							</h3>
							<div className='bg-[#FAFAF6] p-4 rounded-2xl border border-[#E5E7EB]'>
								<p className='whitespace-pre-wrap text-xs sm:text-sm font-medium text-[#172033] leading-relaxed'>
									{store.description || 'কোন বিবরণ নেই'}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Store Images - Right 1/3 */}
			<div className='lg:col-span-1 space-y-6'>
				<Card className='rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs overflow-hidden'>
					<CardHeader className='border-b border-[#E5E7EB] bg-[#FAFAF6] px-6 py-4'>
						<CardTitle className='text-lg font-extrabold text-[#172033]'>
							স্টোরের ছবি
						</CardTitle>
					</CardHeader>
					<CardContent className='p-6 space-y-6'>
						{/* Store Logo/Profile Image */}
						<div className='space-y-2'>
							<h4 className='font-extrabold text-xs text-[#172033] uppercase tracking-wider'>
								প্রোফাইল ইমেজ
							</h4>
							<div className='rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xs'>
								<StoreImageDisplay
									type='storeImage'
									url={store.storeImage}
									alt={`${store.name} Profile Image`}
									className='aspect-square w-full'
									label='প্রোফাইল ইমেজ'
								/>
							</div>
							<p className='text-[11px] text-[#64748B] font-medium leading-normal'>
								প্রোফাইল ইমেজ সকল গ্রাহকদের কাছে প্রদর্শিত হবে
							</p>
						</div>

						{/* Store Cover Image */}
						<div className='space-y-2 pt-2 border-t border-[#E5E7EB]'>
							<h4 className='font-extrabold text-xs text-[#172033] uppercase tracking-wider'>
								কভার ইমেজ
							</h4>
							<div className='rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xs'>
								<StoreImageDisplay
									type='storeCoverImage'
									url={store.storeCoverImage}
									alt={`${store.name} Cover Image`}
									className='aspect-[16/7] w-full'
									label='কভার ইমেজ'
								/>
							</div>
							<p className='text-[11px] text-[#64748B] font-medium leading-normal'>
								কভার ইমেজ স্টোর প্রোফাইলে প্রদর্শিত হবে
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
