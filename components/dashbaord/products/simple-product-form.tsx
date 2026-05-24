'use client';

import type React from 'react';

import { useState } from 'react';
import Image from 'next/image';
import { X, Upload, Check } from 'lucide-react';

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

		// Validate price should not exceed 10,000
		if (price > 10000) {
			toast.error('ত্রুটি', {
				description: 'পণ্যের মূল্য সর্বোচ্চ ১০,০০০ টাকা হতে পারে',
			});
			return;
		}

		// If there's a discount price, make sure it's still less than the new price
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

		// Validate discount price should be less than regular price
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

		if (invalidFiles.length > 0) {
			toast.error('Invalid files', {
				description:
					'Please select valid image files (JPEG, PNG, WebP) under 5MB',
			});
			return;
		}

		try {
			setIsUploading(true);

			// In a real app, you would use the actual store ID
			const storeId = 'store1';
			const uploadedImages = await UploadService.uploadProductImages(
				fileArray,
				storeId
			);

			// Add the new images to the existing ones
			const newImages = uploadedImages.map((img) => ({
				imageUrl: img.url,
				isPrimary: false,
			}));

			// If this is the first image, make it primary
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
			// Reset the input
			e.target.value = '';
		}
	};

	const handleRemoveImage = async (index: number) => {
		const imageToRemove = value.images[index];
		const newImages = [...value.images];
		newImages.splice(index, 1);

		// If we're removing the primary image and there are other images,
		// make the first remaining image primary
		if (imageToRemove.isPrimary && newImages.length > 0) {
			newImages[0].isPrimary = true;
		}

		onChange({ ...value, images: newImages });

		// In a real app, you would delete the image from the server
		try {
			await UploadService.deleteFile(imageToRemove.imageUrl);
		} catch (error) {
			console.error('Error deleting image:', error);
			// We don't show an error toast here as the image is already removed from the UI
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
			<div className='grid gap-6 sm:grid-cols-2'>
				<div>
					<Label htmlFor='price'>মূল্য</Label>
					<div className='relative mt-1'>
						<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
							৳
						</div>
						<Input
							id='price'
							type='number'
							min='0'
							max='10000'
							step='0.01'
							className='pl-8'
							value={value.price || ''}
							onChange={handlePriceChange}
						/>
					</div>
					<p className='text-sm text-muted-foreground mt-1'>
						পণ্যের মূল মূল্য (সর্বোচ্চ ১০,০০০ টাকা)
					</p>
				</div>

				<div>
					<Label htmlFor='discountPrice'>ছাড়ের মূল্য (ঐচ্ছিক)</Label>
					<div className='relative mt-1'>
						<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
							৳
						</div>
						<Input
							id='discountPrice'
							type='number'
							min='0'
							max={value.price ? String(value.price - 0.01) : '9999.99'}
							step='0.01'
							className='pl-8'
							value={value.discountPrice || ''}
							onChange={handleDiscountPriceChange}
						/>
					</div>
					<p className='text-sm text-muted-foreground mt-1'>
						পণ্য ছাড়ে থাকলে বিক্রয় মূল্য (মূল মূল্যের চেয়ে কম হতে হবে)
					</p>
				</div>
			</div>

			<div>
				<Label>পণ্যের ছবি</Label>
				<div className='mt-2 grid grid-cols-1 gap-4'>
					<Card>
						<CardContent className='p-4'>
							<div className='flex items-center justify-center w-full'>
								<label
									htmlFor='image-upload'
									className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60'
								>
									<div className='flex flex-col items-center justify-center pt-5 pb-6'>
										<Upload className='w-8 h-8 mb-2 text-muted-foreground' />
										<p className='mb-2 text-sm text-muted-foreground'>
											<span className='font-semibold'>
												আপলোড করতে ক্লিক করুন
											</span>{' '}
											অথবা টেনে আনুন
										</p>
										<p className='text-xs text-muted-foreground'>
											JPEG, PNG বা WebP (সর্বোচ্চ 2MB)
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
						</CardContent>
					</Card>

					{isUploading && (
						<div className='text-center py-2'>
							<p className='text-sm text-muted-foreground'>
								ছবি আপলোড হচ্ছে...
							</p>
						</div>
					)}

					{value.images.length > 0 && (
						<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4'>
							{value.images.map((image, index) => (
								<div key={index} className='relative group'>
									<div className='aspect-square rounded-md overflow-hidden border bg-muted/20'>
										<Image
											src={image.imageUrl || '/placeholder.svg'}
											alt={`পণ্যের ছবি ${index + 1}`}
											width={200}
											height={200}
											className='w-full h-full object-cover'
										/>
									</div>
									<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
										<Button
											type='button'
											size='icon'
											variant='destructive'
											className='h-8 w-8'
											onClick={() => handleRemoveImage(index)}
										>
											<X className='h-4 w-4' />
											<span className='sr-only'>সরান</span>
										</Button>
										<Button
											type='button'
											size='icon'
											variant={image.isPrimary ? 'default' : 'secondary'}
											className='h-8 w-8'
											onClick={() => handleSetPrimary(index)}
											disabled={image.isPrimary}
										>
											<Check className='h-4 w-4' />
											<span className='sr-only'>প্রাথমিক হিসেবে সেট করুন</span>
										</Button>
									</div>
									{image.isPrimary && (
										<div className='absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md'>
											প্রাথমিক
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
				<p className='text-sm text-muted-foreground mt-2'>
					সর্বাধিক ৫টি ছবি আপলোড করুন। প্রথম ছবিটি প্রাথমিক ছবি হিসেবে ব্যবহার
					করা হবে।
				</p>
			</div>
		</div>
	);
}
