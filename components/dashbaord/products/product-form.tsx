'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ProductService } from '@/services/product-service';
import {
	CreateSimpleProductDTO,
	CreateVariableProductDTO,
	ProductType,
	StoreStatus,
} from '@/types/product';
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
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CategorySelector } from './category-selector';
import { toast } from 'sonner';
import { SimpleProductForm } from './simple-product-form';
import { SupplyCalendarForm } from './supply-calendar-form';
import { VariableProductForm } from './variable-product-form';
import { useSession } from '@/components/providers/session-provider';
import { getAxiosErrorMessage, generateSlug } from '@/lib/utils';

// Base product schema
const productSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Product name must be at least 3 characters' }),
	slug: z.string().optional(),
	description: z
		.string()
		.min(10, { message: 'Description must be at least 10 characters' }),
	productType: z.enum([ProductType.SIMPLE, ProductType.VARIABLE]),
	storeId: z.string().min(1, { message: 'Please select a store' }),
	categoryIds: z
		.array(z.number())
		.min(1, { message: 'Please select at least one category' }),
	supplyCalendar: z
		.object({
			months: z.array(z.number()),
			description: z.string().optional(),
		})
		.optional(),
});

// We'll extend this schema in the component based on the product type
export function ProductForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [productType, setProductType] = useState<ProductType>(
		ProductType.SIMPLE
	);
	const { user } = useSession();

	// Initialize the form with the base schema
	const form = useForm<z.infer<typeof productSchema>>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			name: '',
			slug: '',
			description: '',
			productType: ProductType.SIMPLE,
			storeId: '',
			categoryIds: [],
			supplyCalendar: undefined,
		},
	});

	// Simple product data state
	const [simpleProductData, setSimpleProductData] = useState<{
		price: number;
		discountPrice?: number;
		images: { imageUrl: string; isPrimary?: boolean }[];
	}>({
		price: 0,
		discountPrice: undefined,
		images: [],
	});

	// Variable product data state
	const [variableProductData, setVariableProductData] = useState<{
		variants: {
			variantName: string;
			price: number;
			discountPrice?: number;
			images?: { imageUrl: string }[];
		}[];
	}>({
		variants: [],
	});

	// Add this after your other useEffect hooks
	useEffect(() => {
		// Watch the name field and generate slug automatically
		const subscription = form.watch((value, { name }) => {
			if (name === 'name' && value.name && value.name.length > 0) {
				const generatedSlug = generateSlug(value.name);
				form.setValue('slug', generatedSlug);
			}
		});

		return () => subscription.unsubscribe();
	}, [form]);

	useEffect(() => {
		// Set store ID from user session when component loads
		if (user?.storeId) {
			console.log('Setting store ID:', user.storeId);

			// Make sure storeId is correctly formatted before setting
			// Remove any extra characters that might have been added
			const cleanStoreId = user.storeId.trim();

			form.setValue('storeId', cleanStoreId);

			// Verify the value was set correctly
			setTimeout(() => {
				console.log('Current form storeId:', form.getValues('storeId'));
			}, 100);
		}
	}, [user, form]);

	// Handle product type change
	const handleProductTypeChange = (value: string) => {
		const newType = value as ProductType;
		setProductType(newType);
		form.setValue('productType', newType);
	};

	// Handle form submission
	const onSubmit = async (values: z.infer<typeof productSchema>) => {
		try {
			setIsLoading(true);

			// Prepare the product data based on the product type
			const productData = {
				...values,
				// Remove supplyCalendar if it's undefined or empty
				supplyCalendar:
					values.supplyCalendar &&
					(values.supplyCalendar.months?.length > 0 ||
						values.supplyCalendar.description?.trim())
						? values.supplyCalendar
						: undefined,
			};

			if (productType === ProductType.SIMPLE) {
				if (simpleProductData.images.length === 0) {
					toast.error('ত্রুটি', {
						description: 'অনুগ্রহ করে পণ্যের জন্য কমপক্ষে একটি ছবি যোগ করুন',
					});
					setIsLoading(false);
					return;
				}

				if (simpleProductData.price <= 0) {
					toast.error('ত্রুটি', {
						description: 'পণ্যের মূল্য অবশ্যই শূন্যের চেয়ে বেশি হতে হবে',
					});
					setIsLoading(false);
					return;
				}

				if (simpleProductData.price > 10000) {
					toast.error('ত্রুটি', {
						description: 'পণ্যের মূল্য সর্বোচ্চ ১০,০০০ টাকা হতে পারে',
					});
					setIsLoading(false);
					return;
				}

				if (
					simpleProductData.discountPrice &&
					simpleProductData.discountPrice >= simpleProductData.price
				) {
					toast.error('ত্রুটি', {
						description: 'ছাড়ের মূল্য অবশ্যই পণ্যের মূল্যের চেয়ে কম হতে হবে',
					});
					setIsLoading(false);
					return;
				}

				const createData = {
					...productData,
					productType: ProductType.SIMPLE,
					simpleProductData,
				};
				console.log(createData);

				await ProductService.createProduct(
					createData as CreateSimpleProductDTO
				);
			} else {
				if (variableProductData.variants.length === 0) {
					toast.error('ত্রুটি', {
						description:
							'অনুগ্রহ করে পণ্যের জন্য কমপক্ষে একটি ভেরিয়েন্ট যোগ করুন',
					});
					setIsLoading(false);
					return;
				}

				// Validate variants
				for (const variant of variableProductData.variants) {
					if (variant.price <= 0) {
						toast.error('ত্রুটি', {
							description: `ভেরিয়েন্ট "${variant.variantName}" এর মূল্য অবশ্যই শূন্যের চেয়ে বেশি হতে হবে`,
						});
						setIsLoading(false);
						return;
					}

					if (variant.price > 10000) {
						toast.error('ত্রুটি', {
							description: `ভেরিয়েন্ট "${variant.variantName}" এর মূল্য সর্বোচ্চ ১০,০০০ টাকা হতে পারে`,
						});
						setIsLoading(false);
						return;
					}

					if (variant.discountPrice && variant.discountPrice >= variant.price) {
						toast.error('ত্রুটি', {
							description: `ভেরিয়েন্ট "${variant.variantName}" এর ছাড়ের মূল্য অবশ্যই পণ্যের মূল্যের চেয়ে কম হতে হবে`,
						});
						setIsLoading(false);
						return;
					}
				}

				const createData: CreateVariableProductDTO = {
					...productData,
					productType: ProductType.VARIABLE,
					variableProductData,
				};

				await ProductService.createProduct(
					createData as CreateVariableProductDTO
				);
			}

			toast.success('সফল', {
				description: 'পণ্য সফলভাবে তৈরি করা হয়েছে',
			});

			// Redirect to products list
			router.push('/vendor/products');
		} catch (error) {
			console.error('Error creating product:', error);
			toast.error('ত্রুটি', {
				description:
					getAxiosErrorMessage(error) || 'পণ্য তৈরি করতে সমস্যা হয়েছে।',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<Card>
					<CardContent className='pt-6'>
						<h3 className='text-lg font-medium mb-4'>বিবরণ</h3>
						<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
							<div className='col-span-full lg:col-span-2'>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>পণ্যের নাম</FormLabel>
											<FormControl>
												<Input placeholder='পণ্যের নাম লিখুন' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className='col-span-full lg:col-span-1'>
								<FormField
									control={form.control}
									name='slug'
									render={({ field }) => (
										<FormItem>
											<FormLabel>স্লাগ</FormLabel>
											<FormControl>
												<Input
													placeholder='auto-generated-slug'
													{...field}
													disabled
													className='bg-muted/50 text-muted-foreground'
												/>
											</FormControl>
											<FormDescription>
												নাম থেকে স্বয়ংক্রিয়ভাবে তৈরি হচ্ছে
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className='col-span-full'>
								<FormField
									control={form.control}
									name='description'
									render={({ field }) => (
										<FormItem>
											<FormLabel>বিবরণ</FormLabel>
											<FormControl>
												<Textarea
													placeholder='পণ্যের বিবরণ লিখুন'
													className='min-h-[120px]'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className='grid gap-8 md:grid-cols-2'>
					<div className='space-y-8'>
						<Card>
							<CardContent className='pt-6'>
								<h3 className='text-lg font-medium mb-4'>পণ্যের ধরন</h3>
								<FormField
									control={form.control}
									name='productType'
									render={({ field }) => (
										<FormItem>
											<FormLabel>পণ্যের ধরন নির্বাচন করুন</FormLabel>
											<Select
												onValueChange={handleProductTypeChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='পণ্যের ধরন নির্বাচন করুন' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value={ProductType.SIMPLE}>
														সাধারণ পণ্য
													</SelectItem>
													<SelectItem value={ProductType.VARIABLE}>
														ভেরিয়েবল পণ্য
													</SelectItem>
												</SelectContent>
											</Select>
											<FormDescription>
												সাধারণ পণ্যের একটি মূল্য এবং ইনভেন্টরি থাকে। ভেরিয়েবল
												পণ্যের একাধিক ভেরিয়েন্ট থাকে।
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						<Card>
							<CardContent className='pt-6'>
								<h3 className='text-lg font-medium mb-4'>
									বিক্রয়কেন্দ্র এবং বিভাগ
								</h3>
								<div className='space-y-6'>
									{/* Hidden field to set storeId from session */}
									<FormField
										control={form.control}
										name='storeId'
										render={({ field }) => (
											<FormItem className='hidden'>
												<FormControl>
													<Input
														type='hidden'
														{...field}
														// Don't override field value with direct binding
														// Let form's setValue handle it instead
													/>
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='categoryIds'
										render={({ field }) => (
											<FormItem>
												<FormLabel>বিভাগ</FormLabel>
												<FormControl>
													<CategorySelector
														selectedCategories={field.value}
														onChange={field.onChange}
													/>
												</FormControl>
												<FormDescription>
													এই পণ্যের জন্য এক বা একাধিক বিভাগ নির্বাচন করুন
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className='pt-6'>
								<h3 className='text-lg font-medium mb-4'>
									সরবরাহ ক্যালেন্ডার (ঐচ্ছিক)
								</h3>
								<SupplyCalendarForm
									value={form.watch('supplyCalendar') || undefined}
									onChange={(value) => {
										// If no months are selected and no description, set to undefined
										if (
											(!value.months || value.months.length === 0) &&
											!value.description?.trim()
										) {
											form.setValue('supplyCalendar', undefined);
										} else {
											form.setValue('supplyCalendar', value);
										}
									}}
								/>
							</CardContent>
						</Card>
					</div>

					<div className='space-y-8'>
						{productType === ProductType.SIMPLE ? (
							<Card>
								<CardContent className='pt-6'>
									<h3 className='text-lg font-medium mb-4'>
										সাধারণ পণ্যের বিবরণ
									</h3>
									<SimpleProductForm
										value={simpleProductData}
										onChange={setSimpleProductData}
									/>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardContent className='pt-6'>
									<h3 className='text-lg font-medium mb-4'>
										ভেরিয়েবল পণ্যের বিবরণ
									</h3>
									<VariableProductForm
										value={variableProductData}
										onChange={setVariableProductData}
									/>
								</CardContent>
							</Card>
						)}
					</div>
				</div>

				<div className='flex justify-end gap-4'>
					<Button
						type='button'
						variant='outline'
						onClick={() => router.back()}
						disabled={isLoading}
					>
						বাতিল
					</Button>
					<Button type='submit' disabled={isLoading}>
						{isLoading ? 'তৈরি করা হচ্ছে...' : 'পণ্য তৈরি করুন'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
