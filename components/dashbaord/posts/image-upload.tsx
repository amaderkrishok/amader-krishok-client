'use client';

import type React from 'react';

import { useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadService } from '@/services/upload-service';

interface ImageUploadProps {
	value: string | undefined;
	onChange: (file: File) => void;
	onRemove: () => void;
	disabled?: boolean;
}

export function ImageUpload({
	value,
	onChange,
	onRemove,
	disabled,
}: ImageUploadProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!UploadService.isValidImage(file, 5)) {
			alert('Please select a valid image file (JPEG, PNG, WebP) under 5MB');
			return;
		}

		setIsUploading(true);
		setUploadProgress(0);

		// Start a progress simulation
		const simulateProgress = () => {
			// We'll simulate progress up to 90% and leave the last 10% for actual completion
			setUploadProgress((prev) => {
				// Gradually slow down the progress as it gets higher
				const increment = Math.max(1, 10 - Math.floor(prev / 10));
				const nextProgress = Math.min(90, prev + increment);

				// If we've reached our simulated threshold, stop the interval
				if (nextProgress >= 90) {
					clearInterval(progressInterval);
				}

				return nextProgress;
			});
		};

		// Update progress every 200ms
		const progressInterval = setInterval(simulateProgress, 200);

		try {
			// Pass the file to the parent component
			onChange(file);

			// Set to 100% when complete
			clearInterval(progressInterval);
			setUploadProgress(100);

			// Reset after showing 100% complete
			setTimeout(() => {
				if (!value) {
					// Only reset if no value was set by parent
					setUploadProgress(0);
					setIsUploading(false);
				}
			}, 500);
		} catch (error) {
			console.error('Upload error:', error);
			clearInterval(progressInterval);
			setUploadProgress(0);
			setIsUploading(false);
		}
	};

	return (
		<div className='flex flex-col items-center justify-center gap-4'>
			{value ? (
				<div className='relative w-full h-[300px] rounded-md overflow-hidden'>
					<Image
						src={value || '/placeholder.svg'}
						alt='Uploaded image'
						fill
						className='object-cover'
						sizes='(max-width: 768px) 100vw, 600px'
					/>
					<Button
						type='button'
						variant='destructive'
						size='icon'
						className='absolute top-2 right-2'
						onClick={onRemove}
						disabled={disabled}
					>
						<X className='h-4 w-4 cursor-pointer' />
					</Button>
				</div>
			) : (
				<div className='border-2 border-dashed border-muted-foreground/25 rounded-md p-12 w-full flex flex-col items-center justify-center'>
					{isUploading ? (
						<div className='w-full flex flex-col items-center gap-4'>
							<Loader2 className='h-8 w-8 text-primary animate-spin' />
							<p className='text-sm text-muted-foreground mb-2'>
								Uploading your image...
							</p>
							<div className='w-full max-w-xs'>
								<div className='flex items-center justify-between mb-1 text-xs text-muted-foreground'>
									<span>Progress</span>
									<span>{uploadProgress}%</span>
								</div>
								<Progress value={uploadProgress} className='w-full' />
							</div>
						</div>
					) : (
						<>
							<Upload className='h-8 w-8 text-muted-foreground mb-2' />
							<p className='text-sm text-muted-foreground mb-4'>
								Drag and drop or click to upload
							</p>
							<Button
								type='button'
								variant='secondary'
								disabled={disabled || isUploading}
								className='relative overflow-hidden'
							>
								Upload Image
								<input
									type='file'
									className='absolute inset-0 opacity-0 cursor-pointer'
									onChange={handleFileChange}
									accept='image/jpeg,image/png,image/webp'
									disabled={disabled || isUploading}
								/>
							</Button>
						</>
					)}
				</div>
			)}
		</div>
	);
}
