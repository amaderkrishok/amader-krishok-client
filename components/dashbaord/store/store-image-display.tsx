'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useStoreManagement } from './store-management-context';
import { Button } from '@/components/ui/button';
import { ImagePlus, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StoreImageDisplayProps {
	type: 'storeImage' | 'storeCoverImage';
	url?: string;
	alt: string;
	className?: string;
	label: string;
}

export function StoreImageDisplay({
	type,
	url,
	alt,
	className,
	label,
}: StoreImageDisplayProps) {
	const { store, isEditMode, replaceStoreImage, canEdit } =
		useStoreManagement();
	const [isUploading, setIsUploading] = useState(false);

	// Get placeholder image based on type
	const placeholderImage =
		type === 'storeImage'
			? '/images/store-placeholder.png'
			: '/images/store-cover-placeholder.png';

	const imageUrl = url || placeholderImage;
	const canEditImage = canEdit(type) && isEditMode;

	// Handle file selection
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !store) return;

		setIsUploading(true);
		try {
			await replaceStoreImage(file, type);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<Card className='overflow-hidden'>
			<CardContent className='p-0 relative'>
				<div className={`relative ${className}`}>
					<Image src={imageUrl} alt={alt} fill className='object-cover' />

					{canEditImage && (
						<div className='absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white'>
							{isUploading ? (
								<div className='flex flex-col items-center'>
									<Loader2 className='h-6 w-6 animate-spin mb-2' />
									<p className='text-sm'>আপলোড হচ্ছে...</p>
								</div>
							) : (
								<>
									<ImagePlus className='h-8 w-8 mb-2' />
									<p className='text-sm mb-2'>{label} পরিবর্তন করুন</p>
									<Button
										variant='secondary'
										size='sm'
										className='relative'
										disabled={isUploading}
									>
										ছবি আপলোড করুন
										<input
											type='file'
											className='absolute inset-0 opacity-0 cursor-pointer'
											accept='image/jpeg,image/png,image/webp'
											onChange={handleFileChange}
											disabled={isUploading}
										/>
									</Button>
								</>
							)}
						</div>
					)}
				</div>

				<div className='absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded'>
					{label}
				</div>
			</CardContent>
		</Card>
	);
}
