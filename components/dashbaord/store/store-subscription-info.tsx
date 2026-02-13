'use client';

import { useStoreManagement } from './store-management-context';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Calendar, AlertTriangle } from 'lucide-react';
import { StoreService } from '@/services/store-service';
import { format } from 'date-fns';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export function StoreSubscriptionInfo() {
	const { store, viewMode } = useStoreManagement();

	if (!store) return null;

	const subscriptionDetails = StoreService.getSubscriptionDetails(store);
	const remainingDays = subscriptionDetails.remainingDays;

	const isExpiringSoon =
		subscriptionDetails.isActive &&
		remainingDays !== null &&
		remainingDays <= 7;

	const progressValue =
		remainingDays === null
			? 100
			: Math.max(0, Math.min(100, (remainingDays / 30) * 100));

	return (
		<Card>
			<CardHeader className={isExpiringSoon ? 'bg-yellow-50' : ''}>
				<CardTitle className='flex items-center gap-2'>
					{subscriptionDetails.isActive ? (
						<BadgeCheck className='h-5 w-5 text-green-500' />
					) : (
						<AlertTriangle className='h-5 w-5 text-red-500' />
					)}
					সাবস্ক্রিপশন তথ্য
				</CardTitle>
			</CardHeader>
			<CardContent className='pt-6'>
				<div className='space-y-4'>
					<div>
						<p className='text-sm text-gray-500'>সাবস্ক্রিপশন প্ল্যান</p>
						<p className='font-medium'>{subscriptionDetails.planName}</p>
					</div>

					<div>
						<p className='text-sm text-gray-500'>স্ট্যাটাস</p>
						<div
							className={`text-sm font-medium ${
								subscriptionDetails.isActive ? 'text-green-600' : 'text-red-600'
							}`}
						>
							{subscriptionDetails.isActive ? 'সক্রিয়' : 'অসক্রিয়'}
						</div>
					</div>

					{subscriptionDetails.expiryDate && (
						<div>
							<p className='text-sm text-gray-500'>মেয়াদ শেষ তারিখ</p>
							<div className='flex items-center gap-2'>
								<Calendar className='h-4 w-4 text-gray-500' />
								<span>
									{format(new Date(subscriptionDetails.expiryDate), 'PPP')}
								</span>
							</div>
						</div>
					)}

					{subscriptionDetails.remainingDays !== null && (
						<div>
							<div className='flex justify-between items-center'>
								<p className='text-sm text-gray-500'>অবশিষ্ট দিন</p>
								<span
									className={`font-medium ${
										isExpiringSoon ? 'text-yellow-600' : 'text-green-600'
									}`}
								>
									{subscriptionDetails.remainingDays} দিন
								</span>
							</div>
							<Progress
								value={progressValue}
								className={`h-2 mt-2 ${isExpiringSoon ? 'bg-yellow-100' : ''}`}
							/>
						</div>
					)}

					<div className='space-y-2'>
						<div className='flex justify-between items-center'>
							<p className='text-sm'>ভেরিয়েবল প্রোডাক্ট</p>
							<span
								className={
									subscriptionDetails.hasVariableProductSupport
										? 'text-green-600'
										: 'text-red-600'
								}
							>
								{subscriptionDetails.hasVariableProductSupport ? 'আছে' : 'নেই'}
							</span>
						</div>

						<div className='flex justify-between items-center'>
							<p className='text-sm'>অ্যানালিটিক্স</p>
							<span
								className={
									subscriptionDetails.hasAnalyticsSupport
										? 'text-green-600'
										: 'text-red-600'
								}
							>
								{subscriptionDetails.hasAnalyticsSupport ? 'আছে' : 'নেই'}
							</span>
						</div>

						{subscriptionDetails.productLimit !== null && (
							<div className='flex justify-between items-center'>
								<p className='text-sm'>প্রোডাক্ট সীমা</p>
								<span>{subscriptionDetails.productLimit}</span>
							</div>
						)}
					</div>
				</div>
			</CardContent>

			{viewMode === 'vendor' && (
				<CardFooter className='flex flex-col space-y-2'>
					{isExpiringSoon && (
						<p className='text-amber-600 text-sm mb-2 flex items-center gap-1'>
							<AlertTriangle className='h-4 w-4' />
							আপনার সাবস্ক্রিপশন শেষ হয়ে যাচ্ছে
						</p>
					)}
					<Button asChild className='w-full bg-green-600 hover:bg-green-700'>
						<Link href='/vendor/subscription'>
							{subscriptionDetails.isActive
								? 'আপগ্রেড করুন'
								: 'সাবস্ক্রাইব করুন'}
						</Link>
					</Button>
				</CardFooter>
			)}
		</Card>
	);
}
