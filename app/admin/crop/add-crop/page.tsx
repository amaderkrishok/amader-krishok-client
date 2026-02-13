'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Loader2 } from 'lucide-react';

// Import the Plate editor components
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plate, TPlateEditor } from '@udecode/plate-common/react';
import { useCreateEditor } from '@/components/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { getAxiosErrorMessage } from '@/lib/utils';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTheme } from 'next-themes';

// Updated schema to match backend expectations - using arrays now
const cropFormSchema = z.object({
	name: z.string().min(2, {
		message: 'Crop name must be at least 2 characters.',
	}),
	cultivations: z
		.array(
			z.object({
				name: z.string().min(2, {
					message: 'Cultivation name must be at least 2 characters.',
				}),
				method: z.any(),
			})
		)
		.min(1, 'At least one cultivation method is required'),
	diseases: z
		.array(
			z.object({
				diseaseName: z.string().min(2, {
					message: 'Disease name must be at least 2 characters.',
				}),
				description: z.any(),
			})
		)
		.optional()
		.default([]),
});

type CropFormValues = z.infer<typeof cropFormSchema>;

export default function CropForm() {
	const [addDisease, setAddDisease] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { theme } = useTheme();

	// Create separate editors for each field
	const cultivationMethodEditor = useCreateEditor({});
	const diseaseDescriptionEditor = useCreateEditor({});

	const form = useForm<CropFormValues>({
		resolver: zodResolver(cropFormSchema),
		defaultValues: {
			name: '',
			cultivations: [
				{
					name: '',
					method: {},
				},
			],
			diseases: [],
		},
	});

	const onSubmit = async (data: CropFormValues) => {
		setLoading(true);
		setError(null);

		try {
			// Clone the data to avoid mutations to the form data
			const payload = JSON.parse(JSON.stringify(data));

			// If disease checkbox is not checked, ensure diseases is an empty array
			if (!addDisease) {
				payload.diseases = [];
			}

			// Log the payload for debugging
			console.log('Submitting payload:', JSON.stringify(payload, null, 2));

			const response = await api.post('/crops', payload);

			toast.success('Crop added successfully!');

			// Redirect after a short delay
			setTimeout(() => {
				router.push('/admin/crop');
			}, 1500);
		} catch (error) {
			console.error('Error submitting data:', error);

			// Extract detailed error message
			if (error.response?.data) {
				console.error(
					'Server error details:',
					JSON.stringify(error.response.data, null, 2)
				);
			}
			setError(getAxiosErrorMessage(error));

			toast.error(getAxiosErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	const handleMethodInputChange = debounce(
		(options: { editor: TPlateEditor; value: any }) => {
			const serializedValue = options.value;
			form.setValue('cultivations.0.method', serializedValue);
		},
		600
	);

	const handleDiseaseInputChange = debounce(
		(options: { editor: TPlateEditor; value: any }) => {
			const serializedValue = options.value;

			// Handle disease data
			if (addDisease) {
				// Make sure we have a diseases array with at least one item
				const currentDiseases = form.getValues('diseases');
				if (currentDiseases.length === 0) {
					form.setValue('diseases', [{ diseaseName: '', description: {} }]);
				}
				form.setValue('diseases.0.description', serializedValue);
			}
		},
		600
	);

	return (
		<div className='container mx-auto p-4 md:p-8'>
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Add New Crop</CardTitle>
					<CardDescription>
						Create a new crop and add its cultivation method and diseases.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert variant='destructive' className='mb-6'>
							<AlertCircle className='h-4 w-4' />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Crop Name</FormLabel>
										<FormControl>
											<Input placeholder='Enter crop name' {...field} />
										</FormControl>
										<FormDescription>
											This is the name of the crop.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='space-y-4'>
								<h3 className='text-lg font-medium'>Cultivation Details</h3>
								<FormField
									control={form.control}
									name='cultivations.0.name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cultivation Name</FormLabel>
											<FormControl>
												<Input
													placeholder='Enter cultivation name'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='cultivations.0.method'
									render={() => (
										<FormItem>
											<FormLabel>Cultivation Method</FormLabel>
											<FormControl>
												<div
													data-registry='plate'
													className={`${
														theme === 'dark' ? 'dark' : ''
													} border border-gray-300 rounded-md`}
												>
													<DndProvider backend={HTML5Backend}>
														<Plate
															editor={cultivationMethodEditor}
															onChange={handleMethodInputChange}
														>
															<EditorContainer>
																<Editor variant='fullWidth' />
															</EditorContainer>
														</Plate>
													</DndProvider>
												</div>
											</FormControl>
											<FormDescription>
												Describe the cultivation method in detail.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className='items-top flex space-x-2'>
								<Checkbox
									id='addDisease'
									checked={addDisease}
									onCheckedChange={(checked) => {
										const isChecked = Boolean(checked);
										setAddDisease(isChecked);

										if (isChecked) {
											form.setValue('diseases', [
												{
													diseaseName: '',
													description: {},
												},
											]);
										} else {
											form.setValue('diseases', []);
										}
									}}
								/>
								<div className='grid gap-1.5 leading-none'>
									<label
										htmlFor='addDisease'
										className='font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
									>
										Do you want to add disease details?
									</label>
								</div>
							</div>

							{addDisease && (
								<div className='space-y-4 border-t pt-6'>
									<h3 className='text-lg font-medium'>Disease Details</h3>
									<FormField
										control={form.control}
										name='diseases.0.diseaseName'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Disease Name</FormLabel>
												<FormControl>
													<Input placeholder='Enter disease name' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='diseases.0.description'
										render={() => (
											<FormItem>
												<FormLabel>Disease Description</FormLabel>
												<FormControl>
													<div
														data-registry='plate'
														className={`${
															theme === 'dark' ? 'dark' : ''
														} border border-gray-300 rounded-md`}
													>
														<DndProvider backend={HTML5Backend}>
															<Plate
																editor={diseaseDescriptionEditor}
																onChange={handleDiseaseInputChange}
															>
																<EditorContainer>
																	<Editor variant='fullWidth' />
																</EditorContainer>
															</Plate>
														</DndProvider>
													</div>
												</FormControl>
												<FormDescription>
													Describe the disease treatment and prevention methods.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}

							<CardFooter className='px-0 flex justify-between'>
								<Button
									type='button'
									variant='outline'
									onClick={() => router.push('/crops')}
								>
									Cancel
								</Button>
								<Button
									type='submit'
									disabled={loading}
									className='cursor-pointer'
								>
									{loading ? (
										<>
											<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											Saving...
										</>
									) : (
										'Save Crop'
									)}
								</Button>
							</CardFooter>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
