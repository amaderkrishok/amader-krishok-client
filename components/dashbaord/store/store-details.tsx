'use client';

import { useStoreManagement } from './store-management-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Tag, Info } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { format, isValid } from 'date-fns';
import { StoreImageDisplay } from './store-image-display';

export function StoreDetails() {
	const { store } = useStoreManagement();

	if (!store) return null;

	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
			{/* Store Information - Left 2/3 */}
			<div className='lg:col-span-2'>
				<Card>
					<CardHeader>
						<CardTitle className='text-xl'>স্টোর তথ্য</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						{/* Basic Info */}
						<div>
							<h3 className='font-medium mb-2'>মৌলিক তথ্য</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
								<div className='space-y-1'>
									<p className='text-gray-500'>স্টোরের নাম</p>
									<p className='font-medium'>{store.name}</p>
								</div>
								<div className='space-y-1'>
									<p className='text-gray-500'>স্লাগ</p>
									<p className='font-medium'>{store.slug}</p>
								</div>
								{/* Creation date with validation */}
								<div className='space-y-1'>
									<p className='text-gray-500'>তৈরি হয়েছে</p>
									<p className='font-medium'>
										{store.createdAt && isValid(new Date(store.createdAt))
											? format(new Date(store.createdAt), 'PPP')
											: 'অজানা তারিখ'}
									</p>
								</div>

								{/* Last updated date with validation */}
								<div className='space-y-1'>
									<p className='text-gray-500'>সর্বশেষ আপডেট</p>
									<p className='font-medium'>
										{store.updatedAt && isValid(new Date(store.updatedAt))
											? format(new Date(store.updatedAt), 'PPP')
											: 'অজানা তারিখ'}
									</p>
								</div>
							</div>
						</div>

						<Separator />

						{/* Location */}
						<div>
							<h3 className='font-medium flex items-center gap-2 mb-2'>
								<MapPin className='h-4 w-4' />
								অবস্থান
							</h3>
							<div className='space-y-1'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
									<div className='space-y-1'>
										<p className='text-gray-500'>বিভাগ</p>
										<p className='font-medium'>{store.division}</p>
									</div>
									<div className='space-y-1'>
										<p className='text-gray-500'>জেলা</p>
										<p className='font-medium'>{store.district}</p>
									</div>
								</div>
								<div className='mt-2'>
									<p className='text-gray-500 text-sm'>ঠিকানা</p>
									<p className='mt-1'>{store.address}</p>
								</div>
							</div>
						</div>

						<Separator />

						{/* Categories */}
						<div>
							<h3 className='font-medium flex items-center gap-2 mb-2'>
								<Tag className='h-4 w-4' />
								বিভাগসমূহ
							</h3>
							<div className='flex flex-wrap gap-2'>
								{store.storeCategories?.length > 0 ? (
									store.storeCategories.map((category) => (
										<Badge key={category.id} variant='secondary'>
											{category.name}
										</Badge>
									))
								) : (
									<p className='text-gray-500'>কোনো বিভাগ নির্ধারিত নেই</p>
								)}
							</div>
						</div>

						<Separator />

						{/* Description */}
						<div>
							<h3 className='font-medium flex items-center gap-2 mb-2'>
								<Info className='h-4 w-4' />
								বিবরণ
							</h3>
							<p className='whitespace-pre-wrap text-gray-700'>
								{store.description || 'কোন বিবরণ নেই'}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Store Images - Right 1/3 */}
			<div className='lg:col-span-1 space-y-6'>
				<Card>
					<CardHeader>
						<CardTitle className='text-lg'>স্টোরের ছবি</CardTitle>
					</CardHeader>
					<CardContent className='space-y-6'>
						{/* Store Logo/Profile Image */}
						<div>
							<h4 className='font-medium text-sm mb-2'>প্রোফাইল ইমেজ</h4>
							<StoreImageDisplay
								type='storeImage'
								url={store.storeImage}
								alt={`${store.name} Profile Image`}
								className='aspect-square w-full mb-2'
								label='প্রোফাইল ইমেজ'
							/>
							<p className='text-xs text-gray-500 mt-2'>
								প্রোফাইল ইমেজ সকল গ্রাহকদের কাছে প্রদর্শিত হবে
							</p>
						</div>

						{/* Store Cover Image */}
						<div>
							<h4 className='font-medium text-sm mb-2'>কভার ইমেজ</h4>
							<StoreImageDisplay
								type='storeCoverImage'
								url={store.storeCoverImage}
								alt={`${store.name} Cover Image`}
								className='aspect-[16/6] w-full mb-2'
								label='কভার ইমেজ'
							/>
							<p className='text-xs text-gray-500 mt-2'>
								কভার ইমেজ স্টোর প্রোফাইলে প্রদর্শিত হবে
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
