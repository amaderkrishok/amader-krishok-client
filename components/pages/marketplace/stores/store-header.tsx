'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Send, Award, MessageSquare } from 'lucide-react';
import type { Store } from '@/types/store';
import { StoreService } from '@/services/store-service';
import { SendMessageButton } from '@/components/chat/send-message-button';
import { StoreReviewService } from '@/services/store-review-service';
import { useSession } from '@/components/providers/session-provider';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface StoreHeaderProps {
	store: Store;
}

export function StoreHeader({ store }: StoreHeaderProps) {
	const { user, status } = useSession();
	const coverImageUrl = StoreService.getStoreCoverUrl(store);
	const storeImageUrl = StoreService.getStoreImageUrl(store);

	const [summary, setSummary] = useState<{ averageRating: number; totalReviews: number }>({
		averageRating: 0,
		totalReviews: 0,
	});

	// Review Dialog state
	const [isOpen, setIsOpen] = useState(false);
	const [rating, setRating] = useState<number>(5);
	const [hoverRating, setHoverRating] = useState<number>(0);
	const [comment, setComment] = useState<string>('');
	const [submitting, setSubmitting] = useState(false);

	const fetchSummary = async () => {
		try {
			if (store?.id) {
				const res = await StoreReviewService.getStoreSummary(store.id);
				setSummary({
					averageRating: res?.averageRating || 0,
					totalReviews: res?.totalReviews || 0,
				});
			}
		} catch (error) {
			console.error('Error fetching store summary:', error);
		}
	};

	useEffect(() => {
		fetchSummary();
	}, [store?.id]);

	const handleReviewSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!comment.trim()) {
			toast.warning('মন্তব্য লিখুন', {
				description: 'দোকান সংক্রান্ত আপনার মতামত লিখুন।',
			});
			return;
		}

		try {
			setSubmitting(true);
			await StoreReviewService.submitReview({
				storeId: store.id,
				rating,
				comment,
			});
			toast.success('ধন্যবাদ! আপনার রিভিউ জমা হয়েছে', {
				description: 'আপনার মতামত কেবল সিস্টেম এডমিনের কাছে সংরক্ষিত থাকবে।',
			});
			setComment('');
			setIsOpen(false);
			fetchSummary();
		} catch (error: any) {
			toast.error('সমস্যা হয়েছে', {
				description: error?.response?.data?.message || 'রিভিউ জমা দিতে ব্যর্থ হয়েছে।',
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Card className='overflow-hidden border border-gray-100 shadow-md rounded-2xl'>
			<div className='relative h-48 md:h-64 w-full bg-emerald-950/20'>
				<Image
					src={coverImageUrl}
					alt={`${store.name} cover`}
					fill
					className='object-cover'
					priority
				/>
			</div>

			<CardContent className='p-6 bg-white'>
				<div className='flex flex-col md:flex-row gap-6 items-start'>
					<div className='relative h-28 w-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg -mt-20 bg-white flex-shrink-0'>
						<Image
							src={storeImageUrl}
							alt={store.name}
							fill
							className='object-cover'
							priority
						/>
					</div>

					<div className='flex-1 w-full'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
							<div>
								<div className='flex items-center gap-3 flex-wrap'>
									<h1 className='text-2xl md:text-3xl font-bold text-gray-900'>{store.name}</h1>
									
									{/* Average Rating Badge */}
									<div className='flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full shadow-sm'>
										<Star className='w-4 h-4 fill-amber-400 text-amber-400' />
										<span className='font-extrabold text-sm text-amber-800'>
											{summary.averageRating > 0 ? summary.averageRating : '০.০'}
										</span>
										<span className='text-xs text-amber-600 font-medium'>
											({summary.totalReviews} রিভিউ)
										</span>
									</div>
								</div>

								<p className='text-gray-500 text-sm mt-1'>
									{store.address || 'ঠিকানা নেই'} {store.district ? `• ${store.district}` : ''}{' '}
									{store.division ? `, ${store.division}` : ''}
								</p>
							</div>

							<div className='flex items-center gap-2 flex-wrap'>
								<SendMessageButton
									participantId={store.ownerId ?? ''}
									participantName={store.name}
									variant='outline'
									size='sm'
									className='rounded-xl'
								/>

								{/* Rate Store Button Dialog */}
								<Dialog open={isOpen} onOpenChange={setIsOpen}>
									<DialogTrigger asChild>
										<Button
											variant='default'
											size='sm'
											onClick={(e) => {
												if (status !== 'authenticated') {
													e.preventDefault();
													toast.warning('লগইন প্রয়োজন', {
														description: 'দোকান রিভিউ দিতে আপনাকে লগইন করতে হবে।',
													});
													window.location.href = '/auth/login';
												}
											}}
											className='bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm'
										>
											<Star className='w-4 h-4 mr-1.5 fill-amber-300 text-amber-300' />
											দোকান রিভিউ দিন
										</Button>
									</DialogTrigger>
									<DialogContent className='max-w-md rounded-2xl p-6'>
										<DialogHeader>
											<DialogTitle className='flex items-center gap-2 text-gray-900'>
												<Award className='w-5 h-5 text-emerald-600' />
												{store.name} - রিভিউ ও রেটিং দিন
											</DialogTitle>
										</DialogHeader>

										<form onSubmit={handleReviewSubmit} className='space-y-4 pt-2'>
											<div>
												<label className='block text-xs font-semibold text-gray-700 mb-1.5'>
													রেটিং নির্বাচন করুন:
												</label>
												<div className='flex items-center gap-2'>
													{[1, 2, 3, 4, 5].map((star) => (
														<button
															key={star}
															type='button'
															onClick={() => setRating(star)}
															onMouseEnter={() => setHoverRating(star)}
															onMouseLeave={() => setHoverRating(0)}
															className='p-1 transition-transform hover:scale-125 focus:outline-none'
														>
															<Star
																className={`w-8 h-8 ${
																	star <= (hoverRating || rating)
																		? 'fill-amber-400 text-amber-400'
																		: 'text-gray-300'
																}`}
															/>
														</button>
													))}
													<span className='ml-2 font-bold text-sm text-amber-600'>
														{hoverRating || rating} / ৫
													</span>
												</div>
											</div>

											<div>
												<label className='block text-xs font-semibold text-gray-700 mb-1.5'>
													দোকান সংক্রান্ত আপনার মন্তব্য:
												</label>
												<Textarea
													rows={4}
													value={comment}
													onChange={(e) => setComment(e.target.value)}
													placeholder='দোকানের সেবা, পণ্যের মান বা বিক্রেতার আচরণ সম্পর্কে আপনার অভিজ্ঞতা ব্যক্ত করুন...'
													className='w-full rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm'
												/>
												<p className='text-[11px] text-gray-400 mt-1'>
													* আপনার দেওয়া মন্তব্য কেবল সিস্টেম এডমিন ড্যাশবোর্ডে সংরক্ষিত থাকবে।
												</p>
											</div>

											<Button
												type='submit'
												disabled={submitting}
												className='w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md'
											>
												<Send className='w-4 h-4 mr-2' />
												{submitting ? 'জমা হচ্ছে...' : 'রিভিউ সাবমিট করুন'}
											</Button>
										</form>
									</DialogContent>
								</Dialog>
							</div>
						</div>

						<div className='mt-5 pt-4 border-t border-gray-100'>
							<h2 className='font-bold text-gray-900 text-base mb-1 flex items-center gap-1.5'>
								<MessageSquare className='w-4 h-4 text-emerald-600' />
								দোকান সম্পর্কে
							</h2>
							<p className='text-gray-600 text-sm leading-relaxed whitespace-pre-line'>
								{store.description || 'কোন বিবরণ প্রদান করা হয়নি।'}
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
