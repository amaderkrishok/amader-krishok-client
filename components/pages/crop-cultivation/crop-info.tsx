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
		<Card className='border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden'>
			<CardHeader className='bg-gradient-to-r from-green-500/10 to-emerald-500/5 pb-8 border-b border-green-100/50'>
				<CardTitle className='text-3xl font-extrabold text-gray-900'>{selectedCrop.name} <span className='text-green-600 font-semibold text-2xl'>চাষাবাদ পদ্ধতি</span></CardTitle>
				<CardDescription className='text-base text-gray-600 mt-2'>চাষ পদ্ধতি এবং রোগ-বালাই সম্পর্কে বিস্তারিত তথ্য</CardDescription>
			</CardHeader>
			<CardContent className='p-6 md:p-8'>
				<Tabs defaultValue='cultivation' className='w-full'>
					<TabsList className='bg-gray-100/80 p-1 rounded-xl mb-8 flex flex-wrap h-auto'>
						<TabsTrigger value='cultivation' className='rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm text-base font-semibold flex-1'>
							🌱 চাষ প্রক্রিয়া
						</TabsTrigger>
						{selectedCrop.diseases && selectedCrop.diseases.length > 0 && (
							<TabsTrigger value='diseases' className='rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm text-base font-semibold flex-1'>
								🦠 রোগ বালাই ও প্রতিকার
							</TabsTrigger>
						)}
					</TabsList>
					<TabsContent value='cultivation' className='animate-in fade-in duration-500'>
						<div className='space-y-6'>
							{selectedCrop.cultivations.map((cultivation) => (
								<div key={cultivation.id} className='bg-green-50/40 border border-green-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300'>
									<h4 className='text-xl font-bold text-green-800 mb-4 pb-2 border-b border-green-200/60 flex items-center gap-2'>
										<span className='w-2 h-6 bg-green-500 rounded-full inline-block'></span>
										{cultivation.name}
									</h4>
									<div
										className='mt-4 prose prose-green max-w-none text-gray-700 leading-relaxed prose-headings:text-green-800 prose-a:text-green-600 prose-strong:text-green-900 prose-li:marker:text-green-500'
										dangerouslySetInnerHTML={{
											__html: cultivationHtml[cultivation.id as string] || '',
										}}
									/>
								</div>
							))}
						</div>
					</TabsContent>
					{selectedCrop.diseases && selectedCrop.diseases.length > 0 && (
						<TabsContent value='diseases' className='animate-in fade-in duration-500'>
							<div className='space-y-6'>
								{selectedCrop.diseases.map((disease) => (
									<div key={disease.id} className='bg-rose-50/40 border border-rose-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300'>
										<h4 className='text-xl font-bold text-rose-800 mb-4 pb-2 border-b border-rose-200/60 flex items-center gap-2'>
											<span className='w-2 h-6 bg-rose-500 rounded-full inline-block'></span>
											{disease.diseaseName}
										</h4>
										<div
											className='mt-4 prose prose-rose max-w-none text-gray-700 leading-relaxed prose-headings:text-rose-800 prose-a:text-rose-600 prose-strong:text-rose-900 prose-li:marker:text-rose-500'
											dangerouslySetInnerHTML={{
												__html: diseaseHtml[disease.id as string] || '',
											}}
										/>
									</div>
								))}
							</div>
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
