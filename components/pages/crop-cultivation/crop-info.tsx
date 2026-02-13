'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import {
	CropCultivationService,
	type CropDto,
} from '@/services/crop-cultivation-service';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useEditorToHtml } from '@/hooks/use-editor-to-html';

interface CropInfoProps {
	cropId: string;
}

export function CropInfo({ cropId }: CropInfoProps) {
	const convertToHtml = useEditorToHtml();
	const [selectedCrop, setSelectedCrop] = useState<CropDto | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [cultivationHtml, setCultivationHtml] = useState<{
		[key: string]: string;
	}>({});
	const [diseaseHtml, setDiseaseHtml] = useState<{ [key: string]: string }>({});

	// Normalize various possible shapes of editor content into a Plate node array
	const normalizeEditorValue = (input: any): any[] => {
		if (!input) return [];
		// If coming as { value: [...] }
		if (Array.isArray(input?.value)) return input.value;
		// If already an array of nodes
		if (Array.isArray(input)) return input;
		// If a single node object
		if (typeof input === 'object') return [input];
		return [];
	};

	// Fetch crop data
	useEffect(() => {
		const fetchCropDetails = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await CropCultivationService.getCropById(cropId);
				console.log('Fetched crop details:', response.data);
				// The API returns { data: { data: CropDto } } structure
				setSelectedCrop(response.data);
			} catch (err) {
				console.error(`Failed to fetch crop details for ID ${cropId}:`, err);
				setError('Failed to load crop information. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		if (cropId) {
			fetchCropDetails();
		}
	}, [cropId]);

	// Convert rich text content to HTML
	useEffect(() => {
		const loadContent = async () => {
			if (!selectedCrop) return;

			// Convert cultivation methods
			const cultivationResults: { [key: string]: string } = {};
			for (const cultivation of selectedCrop.cultivations) {
				const nodes = normalizeEditorValue(cultivation.method);
				if (nodes.length) {
					const html = await convertToHtml(nodes as []);
					cultivationResults[cultivation.id as string] = html;
				} else {
					cultivationResults[cultivation.id as string] = '';
				}
			}
			setCultivationHtml(cultivationResults);

			// Convert disease descriptions
			if (selectedCrop.diseases?.length) {
				const diseaseResults: { [key: string]: string } = {};
				for (const disease of selectedCrop.diseases) {
					const nodes = normalizeEditorValue(disease.description);
					if (nodes.length) {
						const html = await convertToHtml(nodes as []);
						diseaseResults[disease.id as string] = html;
					} else {
						diseaseResults[disease.id as string] = '';
					}
				}
				setDiseaseHtml(diseaseResults);
			}
		};

		loadContent();
	}, [selectedCrop, convertToHtml]);

	if (loading) {
		return <CropInfoSkeleton />;
	}

	if (error) {
		return (
			<Alert variant='destructive'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	if (!selectedCrop) {
		return (
			<Card className='mt-10'>
				<CardContent>
					<p className='p-10'>তথ্য দেখতে একটি ফসল নির্বাচন করুন।</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{selectedCrop.name} চাষাবাদ এর সকল তথ্য</CardTitle>
				<CardDescription>চাষ এবং রোগ সম্পর্কে বিস্তারিত</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue='cultivation'>
					<TabsList>
						<TabsTrigger value='cultivation'>চাষ প্রক্রিয়া</TabsTrigger>
						{selectedCrop.diseases && selectedCrop.diseases.length > 0 && (
							<TabsTrigger value='diseases'>রোগ বালাই ও প্রতিকার</TabsTrigger>
						)}
					</TabsList>
					<TabsContent value='cultivation'>
						<h3 className='text-lg font-semibold mb-2'>চাষ প্রক্রিয়া</h3>
						{selectedCrop.cultivations.map((cultivation) => (
							<div key={cultivation.id} className='mb-4'>
								<h4 className='text-md font-semibold'>{cultivation.name}</h4>
								<div
									className='mt-2 prose max-w-none'
									dangerouslySetInnerHTML={{
										__html: cultivationHtml[cultivation.id as string] || '',
									}}
								/>
							</div>
						))}
					</TabsContent>
					{selectedCrop.diseases && selectedCrop.diseases.length > 0 && (
						<TabsContent value='diseases'>
							<h3 className='text-lg font-semibold mb-2'>
								রোগ বালাই ও প্রতিকার
							</h3>
							{selectedCrop.diseases.map((disease) => (
								<div key={disease.id} className='mb-4'>
									<h4 className='text-md font-semibold'>
										{disease.diseaseName}
									</h4>
									<div
										className='mt-2 prose max-w-none'
										dangerouslySetInnerHTML={{
											__html: diseaseHtml[disease.id as string] || '',
										}}
									/>
								</div>
							))}
						</TabsContent>
					)}
				</Tabs>
			</CardContent>
		</Card>
	);
}

function CropInfoSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className='h-8 w-3/4 mb-2' />
				<Skeleton className='h-4 w-1/2' />
			</CardHeader>
			<CardContent>
				<div className='mb-4'>
					<Skeleton className='h-10 w-48 mb-6' />
					<Skeleton className='h-6 w-1/3 mb-3' />

					<div className='space-y-6'>
						<div>
							<Skeleton className='h-5 w-1/4 mb-2' />
							<Skeleton className='h-20 w-full' />
						</div>
						<div>
							<Skeleton className='h-5 w-1/4 mb-2' />
							<Skeleton className='h-20 w-full' />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
