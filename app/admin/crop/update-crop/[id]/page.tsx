'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { AlertCircle, Loader2, Plus, Trash } from 'lucide-react';
import PlateEditor from '@/components/editor/update-editor';
import { toast } from 'sonner';
import { getAxiosErrorMessage } from '@/lib/utils';
import api from '@/lib/axios';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTheme } from 'next-themes';

// Updated schema to match backend DTO structure
const cultivationSchema = z.object({
	id: z.string().optional(), // Allow any string ID format from backend
	name: z.string().min(2, 'Cultivation name must be at least 2 characters.'),
	method: z.any(),
	isNew: z.boolean().optional(), // To track new items
});

const diseaseSchema = z.object({
	id: z.string().optional(), // Allow any string ID format from backend
	diseaseName: z.string().min(2, 'Disease name must be at least 2 characters.'),
	description: z.any(),
	isNew: z.boolean().optional(), // To track new items
});

const cropFormSchema = z.object({
	id: z.string(),
	name: z.string().min(2, 'Crop name must be at least 2 characters.'),
	cultivations: z
		.array(cultivationSchema)
		.min(1, 'At least one cultivation method is required'),
	diseases: z.array(diseaseSchema).default([]).optional(),
});

type CropFormValues = z.infer<typeof cropFormSchema>;

export default function UpdateCrop() {
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const params = useParams();
	const router = useRouter();
	const { theme } = useTheme();

	const form = useForm<CropFormValues>({
		resolver: zodResolver(cropFormSchema),
		defaultValues: {
			id: params.id as string,
			name: '',
			cultivations: [],
			diseases: [],
		},
	});

	const {
		fields: cultivationFields,
		append: appendCultivation,
		remove: removeCultivation,
	} = useFieldArray({
		control: form.control,
		name: 'cultivations',
	});

	const {
		fields: diseaseFields,
		append: appendDisease,
		remove: removeDisease,
	} = useFieldArray({
		control: form.control,
		name: 'diseases',
	});

	const handleRemoveDisease = (index: number) => {
		toast.warning('Are you sure?', {
			description: 'This action cannot be undone.',
			action: {
				label: 'Remove Disease',
				onClick: () => removeDisease(index),
			},
		});
	};

	const handleAddDisease = () => {
		// Mark new items with isNew flag, initialize description as empty array
		appendDisease({
			diseaseName: '',
			description: [], // Change from {} to []
			isNew: true,
		});

		toast.message('Disease added', {
			description: 'You have added a new disease field.',
		});
	};

	const handleAddCultivation = () => {
		// Mark new items with isNew flag
		appendCultivation({
			name: '',
			method: [], // Change from {} to []
			isNew: true,
		});

		toast.message('Cultivation added', {
			description: 'You have added a new cultivation method.',
		});
	};

	const handleRemoveCultivation = (index: number) => {
		// Don't allow removing if it's the last cultivation
		if (cultivationFields.length <= 1) {
			toast.error('Cannot remove', {
				description: 'At least one cultivation method is required.',
			});
			return;
		}

		toast.warning('Are you sure?', {
			description: 'This action cannot be undone.',
			action: {
				label: 'Remove Cultivation',
				onClick: () => removeCultivation(index),
			},
		});
	};

	useEffect(() => {
		const fetchCropData = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await api.get('/crops', {
					params: {
						id: params.id,
						includeRelations: true,
					},
				});

				const responseData = response.data;

				if (responseData?.statusCode === 200 && responseData?.data) {
					const {
						id,
						name,
						cultivations = [],
						diseases = [],
					} = responseData.data;

					form.reset({
						id: id || (params.id as string),
						name,
						cultivations: cultivations.map((c) => ({
							...c,
							method: c.method || {},
						})),
						diseases: diseases.map((d) => ({
							...d,
							description: d.description || {},
						})),
					});
				} else {
					throw new Error('Invalid data structure received from API');
				}
			} catch (error) {
				console.error('Error fetching crop data:', error);
				setError('Failed to load crop data. Please try again.');
				toast.error('Failed to fetch crop data');
			} finally {
				setLoading(false);
			}
		};

		fetchCropData();
	}, [params.id, form]);

	const onSubmit = async (data: CropFormValues) => {
		setSubmitting(true);
		setError(null);

		try {
			// Create a deep copy to avoid modifying the original data
			const formData = structuredClone(data);

			// Prepare the payload for the API call
			const payload = {
				name: formData.name,
				cultivations: formData.cultivations.map((cultivation) => {
					// If it's a new item, don't include an ID
					if (cultivation.isNew) {
						const { isNew, id, ...rest } = cultivation;
						return rest;
					}
					return {
						id: cultivation.id,
						name: cultivation.name,
						method: cultivation.method || {},
					};
				}),
				diseases: (formData.diseases || []).map((disease) => {
					// If it's a new item, don't include an ID
					if (disease.isNew) {
						const { isNew, id, ...rest } = disease;
						return rest;
					}
					return {
						id: disease.id,
						diseaseName: disease.diseaseName,
						description: disease.description || {},
					};
				}),
			};

			console.log('Sending update payload:', payload);

			// Send the PUT request
			const response = await api.put(`/crops/${data.id}`, payload);
			console.log('Response:', response.data);

			if (response.data?.statusCode === 200) {
				toast.success('Crop updated successfully!');
			} else {
				throw new Error(response.data?.message || 'Failed to update crop');
			}
		} catch (error) {
			console.error('Error updating crop:', error);

			setError(getAxiosErrorMessage(error));

			toast.error(getAxiosErrorMessage(error));
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	return (
		<div className='container mx-auto p-4 md:p-8'>
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Update Crop</CardTitle>
					<CardDescription>
						Update the crop details, cultivation methods, and diseases.
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
								<div className='flex justify-between items-center'>
									<h3 className='text-lg font-medium'>Cultivation Details</h3>
									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={handleAddCultivation}
									>
										<Plus className='h-4 w-4 mr-2' />
										Add Cultivation
									</Button>
								</div>

								{cultivationFields.map((field, index) => (
									<Card key={field.id} className='border border-muted'>
										<CardContent className='pt-6 space-y-4'>
											<FormField
												control={form.control}
												name={`cultivations.${index}.name`}
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
												name={`cultivations.${index}.method`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Cultivation Method</FormLabel>
														<FormControl>
															<div
																data-registry='plate'
																className={theme === 'dark' ? 'dark' : ''}
															>
																<PlateEditor
																	initialValue={
																		field.value?.value || field.value || []
																	}
																	onChange={(value) =>
																		form.setValue(
																			`cultivations.${index}.method`,
																			value
																		)
																	}
																/>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<div className='text-right'>
												<Button
													type='button'
													variant='destructive'
													size='sm'
													onClick={() => handleRemoveCultivation(index)}
													disabled={cultivationFields.length <= 1}
												>
													<Trash className='h-4 w-4 mr-2' />
													Remove
												</Button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>

							<div className='space-y-4'>
								<div className='flex justify-between items-center'>
									<h3 className='text-lg font-medium'>Disease Details</h3>
									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={handleAddDisease}
									>
										<Plus className='h-4 w-4 mr-2' />
										Add Disease
									</Button>
								</div>

								{diseaseFields.length === 0 ? (
									<div className='text-center p-4 bg-muted/20 rounded-md'>
										<p className='text-muted-foreground'>
											No diseases added yet. Add a disease using the button
											above.
										</p>
									</div>
								) : (
									diseaseFields.map((field, index) => (
										<Card key={field.id} className='border border-muted'>
											<CardContent className='pt-6 space-y-4'>
												<FormField
													control={form.control}
													name={`diseases.${index}.diseaseName`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Disease Name</FormLabel>
															<FormControl>
																<Input
																	placeholder='Enter disease name'
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`diseases.${index}.description`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Disease Description</FormLabel>
															<FormControl>
																<div
																	data-registry='plate'
																	className={theme === 'dark' ? 'dark' : ''}
																>
																	<PlateEditor
																		initialValue={
																			field.value?.value || field.value || []
																		}
																		onChange={(value) =>
																			form.setValue(
																				`diseases.${index}.description`,
																				value
																			)
																		}
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<div className='text-right'>
													<Button
														type='button'
														variant='destructive'
														size='sm'
														onClick={() => handleRemoveDisease(index)}
													>
														<Trash className='h-4 w-4 mr-2' />
														Remove
													</Button>
												</div>
											</CardContent>
										</Card>
									))
								)}
							</div>

							<CardFooter className='px-0 flex justify-between'>
								<Button
									type='button'
									variant='outline'
									onClick={() => router.back()}
								>
									Cancel
								</Button>
								<Button type='submit' disabled={submitting}>
									{submitting ? (
										<>
											<Loader2 className='mr-2 h-4 w-4 animate-spin' />
											Updating...
										</>
									) : (
										'Update Crop'
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
