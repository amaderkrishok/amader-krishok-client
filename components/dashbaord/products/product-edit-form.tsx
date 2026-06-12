'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';

import { ProductService } from '@/services/product-service';
import { type Product, ProductType } from '@/types/product';
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
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { SimpleProductEditForm } from './simple-product-edit-form';
import { VariableProductEditForm } from './variable-product-edit-form';
import { SupplyCalendarForm } from './supply-calendar-form';
import { CategorySelector } from './category-selector';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useSession } from '@/components/providers/session-provider';
import { generateSlug } from '@/lib/utils';

// Base product schema
const productSchema = z.object({
	name: z.string().min(3, { message: 'পণ্যের নাম কমপক্ষে ৩ অক্ষর হতে হবে' }),
	slug: z.string().optional(),
	description: z
		.string()
		.min(10, { message: 'বিবরণ কমপক্ষে ১০ অক্ষর হতে হবে' }),
	unit: z.string().trim().min(1, { message: 'পরিমাপের একক লিখুন' }).max(32),
	deliveryCharge: z.coerce
		.number()
		.min(0, { message: 'ডেলিভারি চার্জ ঋণাত্মক হতে পারবে না' }),
	productType: z.enum([ProductType.SIMPLE, ProductType.VARIABLE]),
	storeId: z
		.string()
		.min(1, { message: 'অনুগ্রহ করে একটি স্টোর নির্বাচন করুন' }),
	categoryIds: z
		.array(z.number())
		.min(1, { message: 'অনুগ্রহ করে কমপক্ষে একটি বিভাগ নির্বাচন করুন' }),
	supplyCalendar: z
		.object({
			months: z.array(z.number()),
			description: z.string().optional(),
		})
		.optional(),
});

interface ProductEditFormProps {
	productId: number;
	initialProduct: Product;
}

export function ProductEditForm({
	productId,
	initialProduct,
}: ProductEditFormProps) {
	const router = useRouter();
	const { user } = useSession();
	const [isLoading, setIsLoading] = useState(false);
	const [isDataReady, setIsDataReady] = useState(false);
	const [productType, setProductType] = useState<ProductType | null>(null);
	const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

	// Initialize the form with empty values first
	const form = useForm<z.infer<typeof productSchema>>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			name: '',
			slug: '',
			description: '',
			unit: '',
			deliveryCharge: 0,
			productType: ProductType.SIMPLE,
			storeId: '',
			categoryIds: [],
			supplyCalendar: undefined,
		},
	});

	// Initialize state for simple product data
	const [simpleProductData, setSimpleProductData] = useState<{
		price: number;
		discountPrice?: number;
		images: { imageUrl: string; isPrimary?: boolean }[];
	}>({
		price: 0,
		discountPrice: undefined,
		images: [],
	});

	// Initialize state for variable product data
	const [variableProductData, setVariableProductData] = useState<{
		variants: {
			id?: number;
			variantName: string;
			price: number;
			discountPrice?: number;
			images?: { imageUrl: string }[];
		}[];
	}>({
		variants: [],
	});

	// Load data client-side only
	useEffect(() => {
		if (typeof window === 'undefined') return;

		// Add a small delay to ensure initialization
		setTimeout(() => {
			try {
				// Debug what we actually have at this point
				console.log(
					'Initial product value:',
					JSON.stringify(initialProduct || {}, null, 2)
				);

				// The problem is likely here - initialProduct might be an empty object or not match expected structure
				// Let's add better logging and looser validation

				if (!initialProduct) {
					console.error('Product data is missing or undefined');
					toast.error('পণ্যের তথ্য লোড করতে সমস্যা হয়েছে।');
					return;
				}

				// Check properties individually for better debugging
				if (!initialProduct.store) {
					console.error('Product store is missing', initialProduct);
					toast.error('পণ্যের স্টোরের তথ্য লোড করতে সমস্যা হয়েছে।');
					return;
				}

				if (!initialProduct.store.id) {
					console.error('Product store id is missing', initialProduct.store);
					toast.error('পণ্যের স্টোর আইডি লোড করতে সমস্যা হয়েছে।');
					return;
				}

				console.log('Product validation passed, setting up form data...');

				// Convert string months to numbers for the form
				const convertedMonths =
					initialProduct.supplyCalendar?.[0]?.months?.map((month) =>
						typeof month === 'string' ? parseInt(month, 10) : month
					) || [];

				// Reset form with product data
				form.reset({
					name: initialProduct.name || '',
					slug: initialProduct.slug || '',
					description: initialProduct.description || '',
					unit: initialProduct.unit || '',
					deliveryCharge: Number(initialProduct.deliveryCharge || 0),
					productType: initialProduct.productType,
					storeId: initialProduct.store.id,
					categoryIds: (initialProduct.productCategories || []).map(
						(cat) => cat.id
					),
					supplyCalendar:
						initialProduct.supplyCalendar?.[0] &&
						(initialProduct.supplyCalendar[0].months?.length > 0 ||
							initialProduct.supplyCalendar[0].description?.trim())
							? {
									months: convertedMonths,
									description:
										initialProduct.supplyCalendar[0].description || '',
							  }
							: undefined,
				});

				// Set product type
				setProductType(initialProduct.productType);

				// Initialize simple product data if applicable
				if (
					initialProduct.productType === ProductType.SIMPLE &&
					initialProduct.simpleProduct
				) {
					setSimpleProductData({
						price:
							typeof initialProduct.simpleProduct.price === 'string'
								? parseFloat(initialProduct.simpleProduct.price)
								: initialProduct.simpleProduct.price || 0,
						discountPrice: initialProduct.simpleProduct.discountPrice
							? typeof initialProduct.simpleProduct.discountPrice === 'string'
								? parseFloat(initialProduct.simpleProduct.discountPrice)
								: initialProduct.simpleProduct.discountPrice
							: undefined,
						images: initialProduct.simpleProduct.images || [],
					});
				}

				// Initialize variable product data if applicable
				if (
					initialProduct.productType === ProductType.VARIABLE &&
					initialProduct.variableProduct
				) {
					const processedVariants =
						initialProduct.variableProduct.variants?.map((variant) => ({
							...variant,
							price:
								typeof variant.price === 'string'
									? parseFloat(variant.price)
									: variant.price || 0,
							discountPrice: variant.discountPrice
								? typeof variant.discountPrice === 'string'
									? parseFloat(variant.discountPrice)
									: variant.discountPrice
								: undefined,
						})) || [];

					setVariableProductData({
						variants: processedVariants,
					});
				}

				// Data is now ready to use
				setIsDataReady(true);
				console.log('Product data successfully loaded and formatted');
			} catch (error) {
				console.error('Error in data initialization:', error);
				toast.error('পণ্যের তথ্য প্রক্রিয়াকরণে সমস্যা হয়েছে।');
			}
		}, 100); // Small delay to ensure all API data is available
	}, [initialProduct, form]);

	// Auto-generate slug when name changes
	useEffect(() => {
		const subscription = form.watch((value, { name }) => {
			if (name === 'name' && value.name && value.name.length > 0) {
				const generatedSlug = generateSlug(value.name);
				form.setValue('slug', generatedSlug);
			}
		});

		return () => subscription.unsubscribe();
	}, [form]);

	// Verify user has permission to edit this product
	useEffect(() => {
		if (!user) return;
		// Admins/moderators can access any product
		if (isAdmin) return;
		if (!user.storeId) return;

		const cleanStoreId = user.storeId.trim();
		if (cleanStoreId !== initialProduct.store.id) {
			toast.error('অননুমোদিত অ্যাকসেস', {
				description: 'আপনি এই পণ্যটি সম্পাদনা করতে পারবেন না।',
			});
			if (isAdmin) {
				router.push('/admin/shops');
			} else {
				router.push('/vendor/products');
			}
		}
	}, [user, isAdmin, initialProduct?.store?.id, router]);

	// Handle form submission
	// Replace your existing onSubmit function with this:

	const onSubmit = async (values: z.infer<typeof productSchema>) => {
		try {
			setIsLoading(true);

			if (!productType) {
				toast.error('ত্রুটি', {
					description: 'পণ্যের ধরন নির্বাচন করুন।',
				});
				setIsLoading(false);
				return;
			}

			// Ensure storeId is set: prefer user's storeId, fallback to product's store for admins
			if (user?.storeId) {
				values.storeId = user.storeId.trim();
			} else if (isAdmin && initialProduct?.store?.id) {
				values.storeId = initialProduct.store.id;
			}

			// Prepare the product data with locked product type
			const productData = {
				...values,
				productType: initialProduct.productType, // Prevent type changes
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

				// Clean simple product data by removing IDs
				const cleanSimpleProductData = {
					price: simpleProductData.price,
					discountPrice: simpleProductData.discountPrice,
					images: simpleProductData.images.map((img) => ({
						imageUrl: img.imageUrl,
						isPrimary: img.isPrimary,
					})),
				};

				const updateData = {
					...productData,
					productType: ProductType.SIMPLE,
					simpleProductData: cleanSimpleProductData,
				};

				await toast.promise(
					ProductService.updateProduct(productId, updateData),
					{
						loading: 'পণ্য আপডেট হচ্ছে...',
						success: 'পণ্য সফলভাবে আপডেট করা হয়েছে',
						error: 'পণ্য আপডেট করতে ব্যর্থ হয়েছে',
					}
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

				// Clean variant data by removing id properties
				const cleanVariableProductData = {
					variants: variableProductData.variants.map((variant) => ({
						variantName: variant.variantName,
						price: variant.price,
						discountPrice: variant.discountPrice,
						images: variant.images
							? variant.images.map((img) => ({
									imageUrl: img.imageUrl,
									// Remove id property from images
							  }))
							: [],
						// Remove id property from variant
					})),
				};

				console.log(
					'Cleaned data for API submission:',
					cleanVariableProductData
				);

				const updateData = {
					...productData,
					productType: ProductType.VARIABLE,
					variableProductData: cleanVariableProductData,
				};

				await toast.promise(
					ProductService.updateProduct(productId, updateData),
					{
						loading: 'পণ্য আপডেট হচ্ছে...',
						success: 'পণ্য সফলভাবে আপডেট করা হয়েছে',
						error: (err) => {
							console.error('Update error details:', err);
							return 'পণ্য আপডেট করতে ব্যর্থ হয়েছে';
						},
					}
				);
			}

			router.push('/vendor/products');
		} catch (error) {
			console.error('Error updating product:', error);
		} finally {
			setIsLoading(false);
		}
	};
	// Show access denied if no user or store ID
	if (!user || (!user.storeId && !isAdmin)) {
		return (
			<Alert variant='destructive' className='mb-8'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>অ্যাকসেস প্রত্যাখ্যাত</AlertTitle>
				<AlertDescription>
					আপনি এই পণ্যটি সম্পাদনা করতে অনুমতিপ্রাপ্ত নন।
					<Button
						variant='link'
						asChild
						className='p-0 h-auto font-medium ml-2'
					>
						<Link href='/vendor/products'>পণ্য তালিকায় ফিরে যান</Link>
					</Button>
				</AlertDescription>
			</Alert>
		);
	}

	// Show loading state while data is being prepared
	if (!isDataReady || !productType) {
		return (
			<div className='p-8 flex flex-col items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin mb-2' />
				<p>পণ্যের তথ্য লোড হচ্ছে...</p>
			</div>
		);
	}

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

							<div className='col-span-full grid gap-6 sm:grid-cols-2'>
								<FormField
									control={form.control}
									name='unit'
									render={({ field }) => (
										<FormItem>
											<FormLabel>পরিমাপের একক</FormLabel>
											<FormControl>
												<Input placeholder='যেমন: কেজি, গ্রাম, পিস' {...field} />
											</FormControl>
											<FormDescription>পণ্যটি যে এককে বিক্রি হবে</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='deliveryCharge'
									render={({ field }) => (
										<FormItem>
											<FormLabel>ডেলিভারি চার্জ</FormLabel>
											<FormControl>
												<Input type='number' min='0' step='0.01' placeholder='০' {...field} />
											</FormControl>
											<FormDescription>ডেলিভারি চার্জ না থাকলে ০ লিখুন</FormDescription>
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
								<Alert className='mb-4'>
									<AlertCircle className='h-4 w-4' />
									<AlertTitle>সতর্কতা</AlertTitle>
									<AlertDescription>
										পণ্য তৈরি করার পর পণ্যের ধরন পরিবর্তন করা যাবে না।
									</AlertDescription>
								</Alert>
								<FormField
									control={form.control}
									name='productType'
									render={({ field }) => (
										<FormItem>
											<FormLabel>পণ্যের ধরন</FormLabel>
											<FormControl>
												<div className='p-2 border rounded-md bg-muted/20'>
													{productType === ProductType.SIMPLE
														? 'সাধারণ পণ্য'
														: 'ভেরিয়েবল পণ্য'}
												</div>
											</FormControl>
											<FormDescription>
												পণ্য তৈরি করার পর পণ্যের ধরন পরিবর্তন করা যাবে না।
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
									{/* Display store info instead of selector */}
									<div className='space-y-2 mb-4'>
										<FormLabel className='block'>বিক্রয়কেন্দ্র</FormLabel>
										<div className='p-2 border rounded-md bg-muted/20'>
											<div className='text-sm'>
												{initialProduct?.store?.name || 'Unknown Store'}
												<p className='text-xs text-muted-foreground mt-0.5'>
													আপনার স্টোর{' '}
													{initialProduct?.store?.id &&
														`(ID: ${initialProduct.store.id.substring(
															0,
															8
														)}...)`}
												</p>
											</div>
										</div>
									</div>

									{/* Hidden field for store ID */}
									<FormField
										control={form.control}
										name='storeId'
										render={({ field }) => (
											<FormItem className='hidden'>
												<FormControl>
													<Input type='hidden' {...field} />
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
									<SimpleProductEditForm
										value={simpleProductData}
										onChange={setSimpleProductData}
										storeId={user.storeId || initialProduct.store.id}
									/>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardContent className='pt-6'>
									<h3 className='text-lg font-medium mb-4'>
										ভেরিয়েবল পণ্যের বিবরণ
									</h3>
									<VariableProductEditForm
										value={variableProductData}
										onChange={setVariableProductData}
										storeId={user.storeId || initialProduct.store.id}
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
						{isLoading ? 'আপডেট করা হচ্ছে...' : 'পণ্য আপডেট করুন'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
