'use client';

import type React from 'react';

import { useState } from 'react';
import Image from 'next/image';
import { X, Upload, Check, Star } from 'lucide-react';

import { UploadService } from '@/services/upload-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { getAxiosErrorMessage } from '@/lib/utils';

interface SimpleProductFormProps {
	value: {
		price: number;
		discountPrice?: number;
		images: { imageUrl: string; isPrimary?: boolean }[];
	};
	onChange: (value: {
		price: number;
		discountPrice?: number;
		images: { imageUrl: string; isPrimary?: boolean }[];
	}) => void;
}

export function SimpleProductForm({ value, onChange }: SimpleProductFormProps) {
	const [isUploading, setIsUploading] = useState(false);

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const price = Number.parseFloat(e.target.value) || 0;

		if (price > 10000) {
			toast.error('ত্রুটি', {
				description: 'পণ্যের মূল্য সর্বোচ্চ ১০,০০০ টাকা হতে পারে',
			});
			return;
		}

		if (value.discountPrice && value.discountPrice >= price) {
			onChange({ ...value, price, discountPrice: undefined });
			toast.warning('সতর্কতা', {
				description:
					'ছাড়ের মূল্য পণ্যের মূল্যের চেয়ে কম হওয়ায় তা সরিয়ে দেওয়া হয়েছে',
			});
		} else {
			onChange({ ...value, price });
		}
	};

	const handleDiscountPriceChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const discountPrice = e.target.value
			? Number.parseFloat(e.target.value)
			: undefined;

		if (discountPrice && discountPrice >= value.price) {
			toast.error('ত্রুটি', {
				description: 'ছাড়ের মূল্য অবশ্যই পণ্যের মূল্যের চেয়ে কম হতে হবে',
			});
			return;
		}

		onChange({ ...value, discountPrice });
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const fileArray = Array.from(files);
		const oversizedFiles = fileArray.filter(
			(file) => file.size > 2 * 1024 * 1024
		);

		if (oversizedFiles.length > 0) {
			toast.error('ফাইল অনেক বড়', {
				description: 'ছবির সাইজ 2MB এর কম হতে হবে',
			});
			return;
		}

		const invalidFiles = fileArray.filter(
			(file) =>
				!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
		);

		if (invalidFiles.length > 0) {
			toast.error('Invalid image format', {
				description: 'শুধু JPEG, PNG, WebP allowed',
			});
			return;
		}

		try {
			setIsUploading(true);

			const storeId = 'store1';
			const uploadedImages = await UploadService.uploadProductImages(
				fileArray,
				storeId
			);

			const newImages = uploadedImages.map((img) => ({
				imageUrl: img.url,
				isPrimary: false,
			}));

			if (value.images.length === 0 && newImages.length > 0) {
				newImages[0].isPrimary = true;
			}

			onChange({
				...value,
				images: [...value.images, ...newImages],
			});

			toast.success('Success', {
				description: `${uploadedImages.length} image(s) uploaded successfully`,
			});
		} catch (error) {
			console.error('Error uploading images:', error);
			toast.error('Upload failed', {
				description: getAxiosErrorMessage(error) || 'Failed to upload images',
			});
		} finally {
			setIsUploading(false);
			e.target.value = '';
		}
	};

	const handleRemoveImage = async (index: number) => {
		const imageToRemove = value.images[index];
		const newImages = [...value.images];
		newImages.splice(index, 1);

		if (imageToRemove.isPrimary && newImages.length > 0) {
			newImages[0].isPrimary = true;
		}

		onChange({ ...value, images: newImages });

		try {
			await UploadService.deleteFile(imageToRemove.imageUrl);
		} catch (error) {
			console.error('Error deleting image:', error);
		}
	};

	const handleSetPrimary = (index: number) => {
		const newImages = value.images.map((img, i) => ({
			...img,
			isPrimary: i === index,
		}));

		onChange({ ...value, images: newImages });
	};

	return (
		<div className='space-y-6'>
			{/* 6. PRICING SECTION */}
			<div className='bg-[#FFF9E8]/60 p-4 sm:p-5 rounded-2xl border border-[#F5B800]/30 space-y-4'>
				<div className='flex items-center gap-2'>
					<span className='text-base font-extrabold text-[#26351B]'>💰</span>
					<h4 className='text-xs font-extrabold text-[#172033] uppercase tracking-wider'>
						মূল্য ও বিক্রয় তথ্য
					</h4>
				</div>

				<div className='grid gap-4 sm:grid-cols-2'>
					<div>
						<Label htmlFor='price' className='text-xs font-bold text-[#172033] mb-1.5 block'>
							মূল্য *
						</Label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-sm font-extrabold text-[#26351B]'>
								৳
							</div>
							<Input
								id='price'
								type='number'
								min='0'
								max='10000'
								step='0.01'
								className='pl-9 h-11 rounded-xl border-[#E5E7EB] font-bold text-sm bg-white focus-visible:ring-1 focus-visible:ring-[#F5B800]'
								value={value.price || ''}
								onChange={handlePriceChange}
							/>
						</div>
						<p className='text-[11px] text-[#64748B] font-medium mt-1'>
							পণ্যের মূল মূল্য (সর্বোচ্চ ১০,০০০ টাকা)
						</p>
					</div>

					<div>
						<Label htmlFor='discountPrice' className='text-xs font-bold text-[#172033] mb-1.5 block'>
							ছাড়ের মূল্য (ঐচ্ছিক)
						</Label>
						<div className='relative'>
							<div className='absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-sm font-extrabold text-[#26351B]'>
								৳
							</div>
							<Input
								id='discountPrice'
								type='number'
								min='0'
								max={value.price ? String(value.price - 0.01) : '9999.99'}
								step='0.01'
								className='pl-9 h-11 rounded-xl border-[#E5E7EB] font-bold text-sm bg-white focus-visible:ring-1 focus-visible:ring-[#F5B800]'
								value={value.discountPrice || ''}
								onChange={handleDiscountPriceChange}
							/>
						</div>
						<p className='text-[11px] text-[#64748B] font-medium mt-1'>
							পণ্য ছাড় থাকলে বিক্রয় মূল্য (মূল্যের চেয়ে কম হতে হবে)
						</p>
					</div>
				</div>
			</div>

			{/* 7. DRAG & DROP IMAGE UPLOADER */}
			<div className='space-y-3 pt-2 border-t border-[#E5E7EB]'>
				<div className='flex items-center justify-between'>
					<Label className='text-xs font-extrabold text-[#172033] uppercase tracking-wider flex items-center gap-1.5'>
						📸 পণ্যের ছবি
					</Label>
					<span className='text-[11px] text-[#64748B] font-semibold'>
						{value.images.length}/5টি ছবি
					</span>
				</div>

				<div className='flex items-center justify-center w-full'>
					<label
						htmlFor='image-upload'
						className='flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-[#F5B800]/50 rounded-2xl cursor-pointer bg-[#FFF9E8]/30 hover:bg-[#FFF9E8]/70 transition-colors p-5 text-center group'
					>
						<div className='flex flex-col items-center justify-center space-y-2'>
							<div className='w-10 h-10 rounded-full bg-[#FFF9E8] border border-[#F5B800]/40 flex items-center justify-center text-[#26351B] group-hover:scale-110 transition-transform'>
								<Upload className='w-5 h-5 text-[#26351B]' />
							</div>
							<p className='text-xs text-[#172033] font-bold'>
								<span className='text-[#26351B] underline decoration-[#F5B800] underline-offset-4'>
									ছবি আপলোড করতে ক্লিক করুন
								</span>{' '}
								অথবা টেনে আনুন
							</p>
							<p className='text-[11px] text-[#64748B] font-medium'>
								JPEG, PNG অথবা WebP (সর্বোচ্চ 2MB)
							</p>
						</div>
						<Input
							id='image-upload'
							type='file'
							accept='image/jpeg,image/png,image/webp'
							multiple
							className='hidden'
							onChange={handleImageUpload}
							disabled={isUploading}
						/>
					</label>
				</div>

				{isUploading && (
					<div className='text-center py-2'>
						<p className='text-xs text-[#26351B] font-bold animate-pulse'>
							ছবি আপলোড হচ্ছে...
						</p>
					</div>
				)}

				{/* 3-Column Image Previews */}
				{value.images.length > 0 && (
					<div className='grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3'>
						{value.images.map((image, index) => (
							<div key={index} className='relative group rounded-xl overflow-hidden border border-[#E5E7EB] shadow-xs bg-white'>
								<div className='aspect-square relative w-full h-full'>
									<Image
										src={image.imageUrl || '/placeholder.svg'}
										alt={`পণ্যের ছবি ${index + 1}`}
										fill
										sizes='150px'
										className='object-cover'
									/>
								</div>
								<div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1'>
									<Button
										type='button'
										size='icon'
										variant='destructive'
										className='h-7 w-7 rounded-lg'
										onClick={() => handleRemoveImage(index)}
									>
										<X className='h-3.5 w-3.5' />
										<span className='sr-only'>সরান</span>
									</Button>
									<Button
										type='button'
										size='icon'
										variant={image.isPrimary ? 'default' : 'secondary'}
										className='h-7 w-7 rounded-lg bg-[#F5B800] hover:bg-[#E0A800] text-[#172033]'
										onClick={() => handleSetPrimary(index)}
										disabled={image.isPrimary}
									>
										<Check className='h-3.5 w-3.5 text-[#172033]' />
										<span className='sr-only'>প্রধান ছবি</span>
									</Button>
								</div>
								{image.isPrimary && (
									<div className='absolute top-1.5 left-1.5 bg-[#F5B800] text-[#172033] text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs border border-white'>
										প্রধান ছবি
									</div>
								)}
							</div>
						))}
					</div>
				)}
				<p className='text-[11px] text-[#64748B] font-medium'>
					সর্বাধিক ৫টি ছবি আপলোড করুন। প্রথম ছবিটি প্রধান ছবি হিসেবে ব্যবহার হবে।
				</p>
			</div>
		</div>
	);
}
