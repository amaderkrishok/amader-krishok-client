'use client';

import type React from 'react';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash, Upload, RefreshCw } from 'lucide-react';

import { UploadService } from '@/services/upload-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';

interface VariableProductEditFormProps {
	value: {
		variants: {
			id?: number;
			variantName: string;
			price: number;
			discountPrice?: number;
			images?: { imageUrl: string }[];
		}[];
	};
	onChange: (value: {
		variants: {
			id?: number;
			variantName: string;
			price: number;
			discountPrice?: number;
			images?: { imageUrl: string }[];
		}[];
	}) => void;
	storeId: string;
}

export function VariableProductEditForm({
	value,
	onChange,
	storeId,
}: VariableProductEditFormProps) {
	const [expandedVariant, setExpandedVariant] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState<{ [key: number]: boolean }>(
		{}
	);
	const [isReplacing, setIsReplacing] = useState<{ [key: string]: boolean }>(
		{}
	);

	const addVariant = () => {
		const newVariant = {
			variantName: `ভেরিয়েন্ট ${value.variants.length + 1}`,
			price: 0,
			images: [],
		};

		const newVariants = [...value.variants, newVariant];
		onChange({ variants: newVariants });

		// Expand the newly added variant
		setExpandedVariant(`variant-${newVariants.length - 1}`);
	};

	const removeVariant = (index: number) => {
		const newVariants = [...value.variants];
		newVariants.splice(index, 1);
		onChange({ variants: newVariants });
	};

	const updateVariant = (index: number, updatedVariant: any) => {
		// Validate price if it's being updated
		if (updatedVariant.price !== undefined && updatedVariant.price > 10000) {
			toast.error('ত্রুটি', {
				description: 'পণ্যের মূল্য সর্বোচ্চ ১০,০০০ টাকা হতে পারে',
			});
			return;
		}

		// Validate discount price if it's being updated
		if (updatedVariant.discountPrice !== undefined) {
			const currentVariant = value.variants[index];
			const price =
				updatedVariant.price !== undefined
					? updatedVariant.price
					: currentVariant.price;

			if (updatedVariant.discountPrice >= price) {
				toast.error('ত্রুটি', {
					description: 'ছাড়ের মূল্য অবশ্যই পণ্যের মূল্যের চেয়ে কম হতে হবে',
				});
				return;
			}
		}

		// If price is being updated and there's a discount price, validate it
		if (updatedVariant.price !== undefined) {
			const currentVariant = value.variants[index];
			if (
				currentVariant.discountPrice &&
				currentVariant.discountPrice >= updatedVariant.price
			) {
				// Reset discount price if it's now invalid
				updatedVariant.discountPrice = undefined;
				toast.warning('সতর্কতা', {
					description:
						'ছাড়ের মূল্য পণ্যের মূল্যের চেয়ে কম হওয়ায় তা সরিয়ে দেওয়া হয়েছে',
				});
			}
		}

		const newVariants = [...value.variants];
		newVariants[index] = { ...newVariants[index], ...updatedVariant };
		onChange({ variants: newVariants });
	};

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		variantIndex: number
	) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		// Convert FileList to array and validate each file
		const fileArray = Array.from(files);
		const invalidFiles = fileArray.filter(
			(file) => !UploadService.isValidImage(file, 5)
		);

		if (invalidFiles.length > 0) {
			toast.error('অবৈধ ফাইল', {
				description:
					'অনুগ্রহ করে বৈধ ছবি ফাইল (JPEG, PNG, WebP) নির্বাচন করুন যা 5MB এর কম',
			});
			return;
		}

		try {
			setIsUploading({ ...isUploading, [variantIndex]: true });

			// Upload one image at a time for variants
			const uploadPromises = fileArray.map((file) =>
				UploadService.uploadVariantImage(file, storeId)
			);

			const uploadedImages = await Promise.all(uploadPromises);

			// Add the new images to the existing ones
			const currentVariant = value.variants[variantIndex];
			const currentImages = currentVariant.images || [];

			const newImages = uploadedImages.map((img) => ({
				imageUrl: img.url,
			}));

			updateVariant(variantIndex, {
				images: [...currentImages, ...newImages],
			});

			toast.success('ছবি আপলোড হয়েছে ', {
				description: `${uploadedImages.length}টি ছবি সফলভাবে আপলোড করা হয়েছে`,
			});
		} catch (error) {
			console.error('Error uploading images:', error);
			toast.error('ছবি আপলোড ব্যর্থ হয়েছে', {
				description:
					error instanceof Error
						? error.message
						: 'ছবি আপলোড করতে ব্যর্থ হয়েছে',
			});
		} finally {
			setIsUploading({ ...isUploading, [variantIndex]: false });
			// Reset the input
			e.target.value = '';
		}
	};

	const handleReplaceImage = async (
		e: React.ChangeEvent<HTMLInputElement>,
		variantIndex: number,
		imageIndex: number
	) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const file = files[0];
		if (!UploadService.isValidImage(file, 5)) {
			toast.error('ছবিটি গ্রহণযোগ্য নয়', {
				description:
					'অনুগ্রহ করে অন্য ছবি (JPEG, PNG, WebP) নির্বাচন করুন যা 5MB এর কম',
			});
			return;
		}

		const replaceKey = `${variantIndex}-${imageIndex}`;

		try {
			setIsReplacing({ ...isReplacing, [replaceKey]: true });

			const variant = value.variants[variantIndex];
			const images = variant.images || [];
			const oldUrl = images[imageIndex].imageUrl;

			const result = await UploadService.replaceImage(file, oldUrl, storeId);

			// Update the image URL in the state
			const newImages = [...images];
			newImages[imageIndex] = {
				...newImages[imageIndex],
				imageUrl: result.image.url,
			};

			updateVariant(variantIndex, { images: newImages });

			toast.success('সফল', {
				description: 'ছবি সফলভাবে প্রতিস্থাপন করা হয়েছে',
			});
		} catch (error) {
			console.error('Error replacing image:', error);
			toast.error('প্রতিস্থাপন ব্যর্থ হয়েছে', {
				description:
					error instanceof Error
						? error.message
						: 'ছবি প্রতিস্থাপন করতে ব্যর্থ হয়েছে',
			});
		} finally {
			setIsReplacing({ ...isReplacing, [replaceKey]: false });
			// Reset the input
			e.target.value = '';
		}
	};

	const handleRemoveImage = async (
		variantIndex: number,
		imageIndex: number
	) => {
		const variant = value.variants[variantIndex];
		const images = variant.images || [];
		const imageToRemove = images[imageIndex];

		const newImages = [...images];
		newImages.splice(imageIndex, 1);

		updateVariant(variantIndex, { images: newImages });

		// Delete the image from the server
		try {
			await UploadService.deleteFile(imageToRemove.imageUrl);
			toast.warning('সফল', {
				description: 'ছবি সফলভাবে মুছে ফেলা হয়েছে',
			});
		} catch (error) {
			console.error('Error deleting image:', error);
			toast.error('মুছে ফেলা ব্যর্থ হয়েছে', {
				description:
					error instanceof Error
						? error.message
						: 'ছবি মুছে ফেলতে ব্যর্থ হয়েছে',
			});
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-end'>
				<Button type='button' onClick={addVariant} className='mb-4'>
					<Plus className='h-4 w-4 mr-2' />
					ভেরিয়েন্ট যোগ করুন
				</Button>
			</div>

			{value.variants.length === 0 ? (
				<div className='text-center py-8 border rounded-lg bg-muted/20'>
					<p className='text-muted-foreground'>
						এখনও কোন ভেরিয়েন্ট যোগ করা হয়নি। একটি তৈরি করতে "ভেরিয়েন্ট যোগ
						করুন&quot; ক্লিক করুন।
					</p>
				</div>
			) : (
				<Accordion
					type='single'
					collapsible
					value={expandedVariant || undefined}
					onValueChange={setExpandedVariant}
					className='space-y-4'
				>
					{value.variants.map((variant, index) => (
						<Card key={index} className='overflow-hidden'>
							<AccordionItem value={`variant-${index}`} className='border-0'>
								<AccordionTrigger className='px-4 py-2 hover:no-underline'>
									<div className='flex items-center justify-between w-full'>
										<div className='font-medium'>{variant.variantName}</div>
										<div className='text-sm text-muted-foreground mr-4'>
											৳{variant.price}
											{variant.discountPrice && (
												<span className='ml-2 line-through'>
													৳{variant.discountPrice}
												</span>
											)}
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent className='px-4 pb-4 pt-0'>
									<div className='grid gap-4 sm:grid-cols-2'>
										<div>
											<Label htmlFor={`variant-name-${index}`}>
												ভেরিয়েন্টের নাম
											</Label>
											<Input
												id={`variant-name-${index}`}
												value={variant.variantName}
												onChange={(e) =>
													updateVariant(index, { variantName: e.target.value })
												}
												className='mt-1'
											/>
										</div>

										<div className='flex gap-4'>
											<div className='flex-1'>
												<Label htmlFor={`variant-price-${index}`}>মূল্য</Label>
												<div className='relative mt-1'>
													<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
														৳
													</div>
													<Input
														id={`variant-price-${index}`}
														type='number'
														min='0'
														max='10000'
														step='0.01'
														className='pl-8'
														value={variant.price || ''}
														onChange={(e) => {
															const price =
																Number.parseFloat(e.target.value) || 0;
															updateVariant(index, { price });
														}}
													/>
												</div>
												<p className='text-xs text-muted-foreground mt-1'>
													সর্বোচ্চ ১০,০০০ টাকা
												</p>
											</div>

											<div className='flex-1'>
												<Label htmlFor={`variant-discount-${index}`}>
													ছাড় (ঐচ্ছিক)
												</Label>
												<div className='relative mt-1'>
													<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
														৳
													</div>
													<Input
														id={`variant-discount-${index}`}
														type='number'
														min='0'
														max={
															variant.price
																? String(variant.price - 0.01)
																: '9999.99'
														}
														step='0.01'
														className='pl-8'
														value={variant.discountPrice || ''}
														onChange={(e) => {
															const discountPrice = e.target.value
																? Number.parseFloat(e.target.value)
																: undefined;
															updateVariant(index, { discountPrice });
														}}
													/>
												</div>
												<p className='text-xs text-muted-foreground mt-1'>
													মূল মূল্যের চেয়ে কম
												</p>
											</div>
										</div>
									</div>

									<div className='mt-4'>
										<Label>ভেরিয়েন্টের ছবি</Label>
										<div className='mt-2'>
											<Card>
												<CardContent className='p-4'>
													<div className='flex items-center justify-center w-full'>
														<label
															htmlFor={`variant-image-upload-${index}`}
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
																	JPEG, PNG বা WebP (সর্বোচ্চ 5MB)
																</p>
															</div>
															<Input
																id={`variant-image-upload-${index}`}
																type='file'
																accept='image/jpeg,image/png,image/webp'
																multiple
																className='hidden'
																onChange={(e) => handleImageUpload(e, index)}
																disabled={isUploading[index]}
															/>
														</label>
													</div>
												</CardContent>
											</Card>

											{isUploading[index] && (
												<div className='text-center py-2'>
													<p className='text-sm text-muted-foreground'>
														ছবি আপলোড হচ্ছে...
													</p>
												</div>
											)}

											{variant.images && variant.images.length > 0 && (
												<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4'>
													{variant.images.map((image, imageIndex) => {
														const replaceKey = `${index}-${imageIndex}`;
														return (
															<div key={imageIndex} className='relative group'>
																<div className='aspect-square rounded-md overflow-hidden border bg-muted/20'>
																	<Image
																		src={image.imageUrl || '/placeholder.svg'}
																		alt={`ভেরিয়েন্টের ছবি ${imageIndex + 1}`}
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
																		onClick={() =>
																			handleRemoveImage(index, imageIndex)
																		}
																	>
																		<Trash className='h-4 w-4' />
																		<span className='sr-only'>সরান</span>
																	</Button>
																	<div className='relative'>
																		<Button
																			type='button'
																			size='icon'
																			variant='outline'
																			className='h-8 w-8 bg-white'
																		>
																			<label
																				htmlFor={`replace-variant-image-${index}-${imageIndex}`}
																				className='absolute inset-0 flex items-center justify-center cursor-pointer'
																			>
																				<RefreshCw className='h-4 w-4' />
																				<span className='sr-only'>
																					প্রতিস্থাপন করুন
																				</span>
																			</label>
																		</Button>
																		<Input
																			id={`replace-variant-image-${index}-${imageIndex}`}
																			type='file'
																			accept='image/jpeg,image/png,image/webp'
																			className='hidden'
																			onChange={(e) =>
																				handleReplaceImage(e, index, imageIndex)
																			}
																			disabled={isReplacing[replaceKey]}
																		/>
																	</div>
																</div>
																{isReplacing[replaceKey] && (
																	<div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
																		<p className='text-white text-sm'>
																			প্রতিস্থাপন হচ্ছে...
																		</p>
																	</div>
																)}
															</div>
														);
													})}
												</div>
											)}
										</div>
									</div>

									<div className='mt-6 flex justify-end'>
										<Button
											type='button'
											variant='destructive'
											size='sm'
											onClick={() => removeVariant(index)}
										>
											<Trash className='h-4 w-4 mr-2' />
											ভেরিয়েন্ট সরান
										</Button>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Card>
					))}
				</Accordion>
			)}
		</div>
	);
}
