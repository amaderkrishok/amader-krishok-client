'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FileText, X } from 'lucide-react';

import { StoreService } from '@/services/store-service';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface StoreNidInfo {
	id: string;
	nidImageFront: string | null;
	nidImageBack: string | null;
	tradeLicenseImage: string | null;
}

interface Props {
	storeId: string;
	storeName: string;
	trigger?: React.ReactNode;
}

export function StoreNidViewer({ storeId, storeName, trigger }: Props) {
	const [nidInfo, setNidInfo] = useState<StoreNidInfo | null>(null);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const fetchNidInfo = async () => {
		setLoading(true);
		try {
			const data = await StoreService.getStoreNidInfo(storeId);
			setNidInfo(data);
		} catch (error) {
			console.error('Error fetching NID info:', error);
			toast.error('NID তথ্য লোড করতে সমস্যা হয়েছে');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (open) {
			fetchNidInfo();
		}
	}, [open, storeId]);

	const getImageUrl = (imagePath: string | null): string => {
		if (!imagePath) return '/placeholder.svg';

		// If already an absolute URL, return as is
		if (imagePath.startsWith('http')) {
			return imagePath;
		}

		// Otherwise, prepend the API URL
		const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
		return `${API_URL}/${imagePath.replace(/^\//, '')}`;
	};

	const ImageCard = ({
		title,
		imagePath,
		icon,
	}: {
		title: string;
		imagePath: string | null;
		icon: React.ReactNode;
	}) => (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='text-lg flex items-center gap-2'>
					{icon}
					{title}
					{imagePath ? (
						<Badge variant='default' className='bg-green-100 text-green-800'>
							আছে
						</Badge>
					) : (
						<Badge variant='destructive' className='bg-red-100 text-red-800'>
							নেই
						</Badge>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{imagePath ? (
					<div className='relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden'>
						<Image
							src={getImageUrl(imagePath)}
							alt={title}
							fill
							className='object-contain'
							onError={(e) => {
								console.error('Image load error:', e);
								// Fallback to placeholder on error
								(e.target as HTMLImageElement).src = '/placeholder.svg';
							}}
						/>
					</div>
				) : (
					<div className='w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500'>
						<div className='text-center'>
							<FileText className='h-12 w-12 mx-auto mb-2 opacity-50' />
							<p>ছবি আপলোড করা হয়নি</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button variant='outline' size='sm'>
						<FileText className='h-4 w-4 mr-2' />
						NID দেখুন
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='flex items-center justify-between'>
						<span>NID ও ট্রেড লাইসেন্স - {storeName}</span>
						
					</DialogTitle>
				</DialogHeader>

				{loading ? (
					<div className='space-y-6'>
						{[1, 2, 3].map((i) => (
							<Card key={i}>
								<CardHeader>
									<div className='h-6 w-48 bg-muted animate-pulse rounded' />
								</CardHeader>
								<CardContent>
									<div className='w-full h-64 bg-muted animate-pulse rounded-lg' />
								</CardContent>
							</Card>
						))}
					</div>
				) : nidInfo ? (
					<div className='space-y-6'>
						<ImageCard
							title='NID সামনের দিক'
							imagePath={nidInfo.nidImageFront}
							icon={<FileText className='h-5 w-5' />}
						/>

						<ImageCard
							title='NID পিছনের দিক'
							imagePath={nidInfo.nidImageBack}
							icon={<FileText className='h-5 w-5' />}
						/>

						<ImageCard
							title='ট্রেড লাইসেন্স'
							imagePath={nidInfo.tradeLicenseImage}
							icon={<FileText className='h-5 w-5' />}
						/>
					</div>
				) : (
					<div className='text-center py-12'>
						<FileText className='h-12 w-12 mx-auto mb-4 text-gray-400' />
						<p className='text-gray-600'>NID তথ্য লোড করা যায়নি</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
