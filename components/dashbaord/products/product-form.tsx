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
import { Card, CardContent } from '@/components/ui/card';
import { CategorySelector } from './category-selector';
import { toast } from 'sonner';
import { SimpleProductForm } from './simple-product-form';
import { SupplyCalendarForm } from './supply-calendar-form';
import { VariableProductForm } from './variable-product-form';
import { useSession } from '@/components/providers/session-provider';
import { getAxiosErrorMessage, generateSlug } from '@/lib/utils';
import { Package, Tag, Calendar, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

const productSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'পণ্যের নাম কমপক্ষে ৩ অক্ষরের হতে হবে' }),
	slug: z.string().optional(),
	description: z
		.string()
		.min(10, { message: 'বিবরণ কমপক্ষে ১০ অক্ষরের হতে হবে' }),
	unit: z
		.string()
		.trim()
		.min(1, { message: 'অনুগ্রহ করে পরিমাপের একক লিখুন (কেজি, পিস বা গ্রাম)' })
		.max(32),
	deliveryCharge: z.coerce
		.number()
		.min(0, { message: 'ডেলিভারি চার্জ নেতিবাচক হতে পারবে না' }),
	productType: z.enum([ProductType.SIMPLE, ProductType.VARIABLE]),
	storeId: z.string().min(1, { message: 'অনুগ্রহ করে স্টোর আইডি নিশ্চিত করুন' }),
	categoryIds: z
		.array(z.number())
		.min(1, { message: 'কমপক্ষে একটি বিভাগ নির্বাচন করুন' }),
	supplyCalendar: z
		.object({
			months: z.array(z.number()),
			description: z.string().optional(),
		})
		.optional(),
});

export function ProductForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [productType, setProductType] = useState<ProductType>(
		ProductType.SIMPLE
	);
	const { user } = useSession();

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

	const [simpleProductData, setSimpleProductData] = useState<{
		price: number;
		discountPrice?: number;
		images: { imageUrl: string; isPrimary?: boolean }[];
	}>({
		price: 0,
		discountPrice: undefined,
		images: [],
	});

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

	useEffect(() => {
		const subscription = form.watch((value, { name }) => {
			if (name === 'name' && value.name && value.name.length > 0) {
				const generatedSlug = generateSlug(value.name);
				form.setValue('slug', generatedSlug);
			}
		});

		return () => subscription.unsubscribe();
	}, [form]);

	useEffect(() => {
		if (user?.storeId) {
			const cleanStoreId = user.storeId.trim();
			form.setValue('storeId', cleanStoreId);
		}
	}, [user, form]);

	const handleProductTypeChange = (newType: ProductType) => {
		setProductType(newType);
		form.setValue('productType', newType);
	};

	const onSubmit = async (values: z.infer<typeof productSchema>) => {
		try {
			setIsLoading(true);

			const productData = {
				...values,
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
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				{/* 12. SECTION NAVIGATION BAR */}
				<div className='flex items-center gap-2 overflow-x-auto bg-white p-2.5 rounded-[18px] border border-[#E5E7EB] shadow-xs scrollbar-hide text-xs font-extrabold'>
					<span className='px-3 py-1.5 rounded-xl bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/40 flex items-center gap-1.5 whitespace-nowrap shadow-xs'>
						<span className='w-2 h-2 rounded-full bg-[#F5B800]' /> 01 পণ্যের তথ্য
					</span>
					<span className='px-3 py-1.5 rounded-xl bg-[#FAFAF6] text-[#64748B] flex items-center gap-1.5 whitespace-nowrap'>
						02 মূল্য ও বিক্রয়
					</span>
					<span className='px-3 py-1.5 rounded-xl bg-[#FAFAF6] text-[#64748B] flex items-center gap-1.5 whitespace-nowrap'>
						03 বিভাগ
					</span>
					<span className='px-3 py-1.5 rounded-xl bg-[#FAFAF6] text-[#64748B] flex items-center gap-1.5 whitespace-nowrap'>
						04 ছবি
					</span>
					<span className='px-3 py-1.5 rounded-xl bg-[#FAFAF6] text-[#64748B] flex items-center gap-1.5 whitespace-nowrap'>
						05 সরবরাহ
					</span>
				</div>

				{/* 2. TWO-COLUMN DESKTOP GRID LAYOUT */}
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
					{/* LEFT COLUMN: MAIN PRODUCT INFORMATION (7 cols) */}
					<div className='lg:col-span-7 space-y-6'>
						{/* 3. BASIC INFORMATION CARD */}
						<Card className='rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs overflow-hidden'>
							<CardContent className='p-6 space-y-5'>
								<div className='flex items-center gap-2 border-b border-[#E5E7EB] pb-3.5'>
									<Package className='w-5 h-5 text-[#26351B]' />
									<h3 className='text-base font-extrabold text-[#172033] tracking-tight'>
										📦 পণ্যের তথ্য
									</h3>
								</div>

								<div className='grid gap-4 sm:grid-cols-2'>
									<div className='sm:col-span-2'>
										<FormField
											control={form.control}
											name='name'
											render={({ field }) => (
												<FormItem>
													<FormLabel className='text-xs font-bold text-[#172033]'>
														পণ্যের নাম *
													</FormLabel>
													<FormControl>
														<Input
															placeholder='যেমন: দেশি লাল টমেটো'
															className='h-11 rounded-xl border-[#E5E7EB] text-sm font-semibold focus-visible:ring-1 focus-visible:ring-[#F5B800] bg-[#FAFAF6] focus:bg-white'
															{...field}
														/>
													</FormControl>
													<FormMessage className='text-xs' />
												</FormItem>
											)}
										/>
									</div>

									<div className='sm:col-span-2'>
										<FormField
											control={form.control}
											name='slug'
											render={({ field }) => (
												<FormItem>
													<FormLabel className='text-xs font-bold text-[#64748B]'>
														স্লাগ (Auto Generated)
													</FormLabel>
													<FormControl>
														<Input
															placeholder='auto-generated-slug'
															{...field}
															disabled
															className='h-10 rounded-xl border-[#E5E7EB] bg-[#FAFAF6] text-xs font-medium text-[#64748B]'
														/>
													</FormControl>
													<FormDescription className='text-[11px] text-[#64748B]'>
														পণ্যের নাম থেকে স্বয়ংক্রিয়ভাবে স্লাগ তৈরি হয়
													</FormDescription>
													<FormMessage className='text-xs' />
												</FormItem>
											)}
										/>
									</div>

									{/* 4. DESCRIPTION TEXTAREA */}
									<div className='sm:col-span-2'>
										<FormField
											control={form.control}
											name='description'
											render={({ field }) => (
												<FormItem>
													<FormLabel className='text-xs font-bold text-[#172033]'>
														পণ্যের বিবরণ *
													</FormLabel>
													<FormControl>
														<Textarea
															placeholder='পণ্যের বিস্তারিত বিবরণ, পুষ্টিগুণ বা গুণমান লিখুন...'
															className='min-h-[130px] rounded-xl border-[#E5E7EB] text-xs font-medium focus-visible:ring-1 focus-visible:ring-[#F5B800] bg-[#FAFAF6] focus:bg-white'
															{...field}
														/>
													</FormControl>
													<FormMessage className='text-xs' />
												</FormItem>
											)}
										/>
									</div>

									<div>
										<FormField
											control={form.control}
											name='unit'
											render={({ field }) => (
												<FormItem>
													<FormLabel className='text-xs font-bold text-[#172033]'>
														পরিমাপের একক *
													</FormLabel>
													<FormControl>
														<Input
															placeholder='যেমন: কেজি, গ্রাম, পিস'
															className='h-11 rounded-xl border-[#E5E7EB] text-xs font-semibold bg-[#FAFAF6] focus:bg-white focus-visible:ring-1 focus-visible:ring-[#F5B800]'
															{...field}
														/>
													</FormControl>
													<FormDescription className='text-[11px] text-[#64748B]'>
														পণ্য যে এককে বিক্রি হবে
													</FormDescription>
													<FormMessage className='text-xs' />
												</FormItem>
											)}
										/>
									</div>

									<div>
										<FormField
											control={form.control}
											name='deliveryCharge'
											render={({ field }) => (
												<FormItem>
													<FormLabel className='text-xs font-bold text-[#172033]'>
														ডেলিভারি চার্জ (৳)
													</FormLabel>
													<FormControl>
														<Input
															type='number'
															min='0'
															step='0.01'
															placeholder='০'
															className='h-11 rounded-xl border-[#E5E7EB] text-xs font-semibold bg-[#FAFAF6] focus:bg-white focus-visible:ring-1 focus-visible:ring-[#F5B800]'
															{...field}
														/>
													</FormControl>
													<FormDescription className='text-[11px] text-[#64748B]'>
														ডেলিভারি চার্জ না থাকলে ০ লিখুন
													</FormDescription>
													<FormMessage className='text-xs' />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* 5. PRODUCT TYPE SEGMENTED SELECTOR */}
						<Card className='rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs overflow-hidden'>
							<CardContent className='p-6 space-y-4'>
								<div className='flex items-center gap-2 border-b border-[#E5E7EB] pb-3'>
									<Layers className='w-4 h-4 text-[#26351B]' />
									<h3 className='text-sm font-extrabold text-[#172033]'>
										🏷️ পণ্যের ধরন
									</h3>
								</div>

								<FormField
									control={form.control}
									name='productType'
									render={({ field }) => (
										<FormItem className='space-y-3'>
											{/* Segmented Button Selection */}
											<div className='grid grid-cols-2 gap-3 p-1.5 bg-[#FAFAF6] rounded-2xl border border-[#E5E7EB]'>
												<button
													type='button'
													onClick={() => handleProductTypeChange(ProductType.SIMPLE)}
													className={`py-3 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
														field.value === ProductType.SIMPLE
															? 'bg-[#F5B800] text-[#172033] shadow-xs'
															: 'bg-transparent text-[#64748B] hover:text-[#172033]'
													}`}
												>
													<span>সাধারণ পণ্য</span>
													{field.value === ProductType.SIMPLE && (
														<CheckCircle2 className='w-4 h-4 text-[#172033]' />
													)}
												</button>

												<button
													type='button'
													onClick={() => handleProductTypeChange(ProductType.VARIABLE)}
													className={`py-3 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
														field.value === ProductType.VARIABLE
															? 'bg-[#F5B800] text-[#172033] shadow-xs'
															: 'bg-transparent text-[#64748B] hover:text-[#172033]'
													}`}
												>
													<span>ভেরিয়েবল পণ্য</span>
													{field.value === ProductType.VARIABLE && (
														<CheckCircle2 className='w-4 h-4 text-[#172033]' />
													)}
												</button>
											</div>

											<p className='text-xs text-[#64748B] font-medium leading-relaxed bg-[#FFF9E8]/60 p-3 rounded-xl border border-[#F5B800]/25'>
												{field.value === ProductType.SIMPLE
													? 'সাধারণ পণ্যের একটি নির্দিষ্ট মূল্য এবং ইনভেন্টরি থাকে।'
													: 'ভেরিয়েন্ট পণ্যের একাধিক সাইজ, ওজন বা কালারের ভিন্ন ভিন্ন মূল্য থাকে।'}
											</p>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* 8. CATEGORY SECTION */}
						<Card className='rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs overflow-hidden'>
							<CardContent className='p-6 space-y-4'>
								<div className='flex items-center gap-2 border-b border-[#E5E7EB] pb-3'>
									<Tag className='w-4 h-4 text-[#26351B]' />
									<h3 className='text-sm font-extrabold text-[#172033]'>
										🏪 বিক্রয়কেন্দ্র এবং বিভাগ
									</h3>
								</div>

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
											<FormLabel className='text-xs font-bold text-[#172033]'>
												বিভাগ নির্বাচন করুন *
											</FormLabel>
											<FormControl>
												<CategorySelector
													selectedCategories={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
											<FormDescription className='text-xs text-[#64748B] font-medium'>
												এই পণ্যের জন্য এক বা একাধিক বিভাগ নির্বাচন করুন
											</FormDescription>
											<FormMessage className='text-xs' />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* 9 & 10. SUPPLY CALENDAR & SEASONAL DESCRIPTION */}
						<Card className='rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs overflow-hidden'>
							<CardContent className='p-6'>
								<SupplyCalendarForm
									value={form.watch('supplyCalendar') || undefined}
									onChange={(value) => {
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

					{/* RIGHT COLUMN: PRICING & IMAGE PREVIEWS (5 cols) */}
					<div className='lg:col-span-5 space-y-6'>
						{productType === ProductType.SIMPLE ? (
							<Card className='rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs overflow-hidden sticky top-20'>
								<CardContent className='p-6'>
									<SimpleProductForm
										value={simpleProductData}
										onChange={setSimpleProductData}
									/>
								</CardContent>
							</Card>
						) : (
							<Card className='rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs overflow-hidden sticky top-20'>
								<CardContent className='p-6'>
									<h3 className='text-sm font-extrabold text-[#172033] mb-4 flex items-center gap-2'>
										<Layers className='w-4 h-4 text-[#F5B800]' />
										ভেরিয়েবল পণ্যের ভেরিয়েন্ট
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

				{/* 11. FORM ACTION FOOTER */}
				<div className='flex items-center justify-between gap-4 p-5 bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs sticky bottom-4 z-30'>
					<Button
						type='button'
						variant='outline'
						onClick={() => router.back()}
						disabled={isLoading}
						className='rounded-xl border-[#E5E7EB] font-extrabold text-xs px-5 hover:bg-[#FAFAF6]'
					>
						বাতিল
					</Button>

					{/* Primary Gold CTA */}
					<Button
						type='submit'
						disabled={isLoading}
						className='bg-[#F5B800] hover:bg-[#E0A800] text-[#172033] font-black rounded-xl px-7 py-2.5 shadow-xs border-0 transition-all hover:-translate-y-0.5 cursor-pointer text-xs sm:text-sm'
					>
						{isLoading ? (
							'তৈরি করা হচ্ছে...'
						) : (
							<span className='flex items-center gap-2'>
								+ পণ্য তৈরি করুন <ArrowRight className='w-4 h-4 text-[#172033]' />
							</span>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
