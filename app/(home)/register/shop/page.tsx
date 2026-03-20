'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Upload,
	AlertCircle,
	Loader2,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import api from '@/lib/axios';
import { UploadService } from '@/services/upload-service';
import { toast } from 'sonner';
import { generateSlug, getAxiosErrorMessage } from '@/lib/utils';
import bdDistricts from '@/data/bd-districts.json';

// Form steps
const steps = [
	'ব্যবসায়িক তথ্য',
	'অবস্থান ও বিবরণ',
	'ডকুমেন্ট আপলোড',
	'পর্যালোচনা ও জমা দিন',
];

// Bangladesh divisions
const divisions = [
	'ঢাকা',
	'চট্টগ্রাম',
	'রাজশাহী',
	'খুলনা',
	'বরিশাল',
	'সিলেট',
	'রংপুর',
	'ময়মনসিংহ',
];

// Get division ID for district filtering
const getDivisionId = (divisionName: string): string | null => {
	switch (divisionName) {
		case 'ঢাকা':
			return '3';
		case 'চট্টগ্রাম':
			return '2';
		case 'রাজশাহী':
			return '5';
		case 'খুলনা':
			return '4';
		case 'বরিশাল':
			return '1';
		case 'সিলেট':
			return '7';
		case 'রংপুর':
			return '6';
		case 'ময়মনসিংহ':
			return '8';
		default:
			return null;
	}
};

// Interface for Store Category from API
interface StoreCategory {
	id: number;
	name: string;
	slug: string;
}

// Interface for District from JSON
interface District {
	id: string;
	division_id: string;
	name: string;
	bn_name: string;
	lat: string;
	long: string;
}

export default function VendorRegistration() {
	const { data: session, refreshSession } = useSession();
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// State for store categories from API
	const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
	const [isLoadingCategories, setIsLoadingCategories] = useState(true);

	// State for filtered districts based on selected division
	const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

	// Image upload progress states
	const [nidFrontUploadProgress, setNidFrontUploadProgress] = useState(0);
	const [nidBackUploadProgress, setNidBackUploadProgress] = useState(0);
	const [licenseUploadProgress, setLicenseUploadProgress] = useState(0);



	const [formData, setFormData] = useState({
		// Store data matching DTO
		name: '',
		slug: '',
		address: '',
		division: '',
		district: '',
		description: '',
		nidImageFront: '',
		nidImageBack: '',
		tradeLicenseImage: '',
		storeImage: '',
		storeCoverImage: '',
		storeCategoryIds: [] as number[],

		// Files for upload
		nidFrontFile: null as File | null,
		nidBackFile: null as File | null,
		businessLicenseFile: null as File | null,

		// Terms
		agreeTerms: false,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [nidFrontPreview, setNidFrontPreview] = useState<string | null>(null);
	const [nidBackPreview, setNidBackPreview] = useState<string | null>(null);
	const [businessLicensePreview, setBusinessLicensePreview] = useState<
		string | null
	>(null);

	// Fetch store categories on component mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await api.get('/store-categories');
				// setStoreCategories(response.data.data);
				setStoreCategories(response.data?.data || response.data || []);
				console.log('Fetched store categories:', storeCategories);
			} catch (error) {
				console.error('Failed to fetch store categories:', error);
				toast.error('Error', {
					description:
						'Failed to load product categories. Please try refreshing the page.',
				});
			} finally {
				setIsLoadingCategories(false);
			}
		};

		fetchCategories();
	}, []);

	// Update filtered districts when division changes
	useEffect(() => {
		if (formData.division) {
			const divisionId = getDivisionId(formData.division);
			if (divisionId) {
				const districtsInDivision = (
					bdDistricts.districts as District[]
				).filter((district) => district.division_id === divisionId);
				setFilteredDistricts(districtsInDivision);
			}
		} else {
			setFilteredDistricts([]);
		}
	}, [formData.division]);

	// Handle input change
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		// Auto-generate slug when shop name changes
		if (name === 'name') {
			setFormData((prev) => ({
				...prev,
				[name]: value,
				slug: generateSlug(value),
			}));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}

		// Clear error when field is edited
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	// Handle select change
	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Clear error when field is edited
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}

		// If division changed, reset district
		if (name === 'division') {
			setFormData((prev) => ({ ...prev, district: '' }));
		}
	};

	// Handle checkbox change
	const handleCheckboxChange = (name: string, checked: boolean) => {
		setFormData((prev) => ({ ...prev, [name]: checked }));

		// Clear error when field is edited
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	// Handle category selection
	const handleCategoryChange = (categoryId: number, checked: boolean) => {
		setFormData((prev) => {
			const updatedCategories = checked
				? [...prev.storeCategoryIds, categoryId]
				: prev.storeCategoryIds.filter((id) => id !== categoryId);

			return { ...prev, storeCategoryIds: updatedCategories };
		});

		// Clear error when field is edited
		if (errors.storeCategoryIds) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors.storeCategoryIds;
				return newErrors;
			});
		}
	};

	// Handle file upload with progress tracking
	const handleFileUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		fieldName: 'nidFrontFile' | 'nidBackFile' | 'businessLicenseFile'
	) => {
		const file = e.target.files?.[0] || null;

		if (!file) return;

		// Update form data with file
		setFormData((prev) => ({ ...prev, [fieldName]: file }));

		// Create preview URL
		const reader = new FileReader();
		reader.onloadend = () => {
			if (fieldName === 'nidFrontFile') {
				setNidFrontPreview(reader.result as string);
				setNidFrontUploadProgress(0);
			} else if (fieldName === 'nidBackFile') {
				setNidBackPreview(reader.result as string);
				setNidBackUploadProgress(0);
			} else if (fieldName === 'businessLicenseFile') {
				setBusinessLicensePreview(reader.result as string);
				setLicenseUploadProgress(0);
			}
		};
		reader.readAsDataURL(file);

		// Clear error when field is edited
		if (errors[fieldName.replace('File', '')]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[fieldName.replace('File', '')];
				return newErrors;
			});
		}
	};

	// Validate current step
	const validateStep = () => {
		const newErrors: Record<string, string> = {};

		if (currentStep === 0) {
			// Validate Store Information
			if (!formData.name.trim()) newErrors.name = 'দোকানের নাম আবশ্যক';
			if (!formData.slug.trim()) newErrors.slug = 'স্লাগ আবশ্যক';
			if (formData.storeCategoryIds.length === 0)
				newErrors.storeCategoryIds = 'কমপক্ষে একটি বিভাগ নির্বাচন করুন';
		} else if (currentStep === 1) {
			// Validate Address & Description
			if (!formData.division) newErrors.division = 'বিভাগ আবশ্যক';
			if (!formData.district) newErrors.district = 'জেলা আবশ্যক';
			if (!formData.address.trim()) newErrors.address = 'ঠিকানা আবশ্যক';
			if (!formData.description.trim()) newErrors.description = 'বিবরণ আবশ্যক';
		} else if (currentStep === 2) {
			// Validate Document Upload
			if (!formData.nidFrontFile && !formData.nidImageFront)
				newErrors.nidImageFront = 'এনআইডি কার্ড (সামনের) ছবি আবশ্যক';
			if (!formData.nidBackFile && !formData.nidImageBack)
				newErrors.nidImageBack = 'এনআইডি কার্ড (পিছনের) ছবি আবশ্যক';
		} else if (currentStep === 3) {
			// Validate Terms
			if (!formData.agreeTerms) newErrors.agreeTerms = 'শর্তাবলী মেনে নিতে হবে';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Upload images using the UploadService
	const uploadImages = async () => {
		try {
			// Upload NID front image if not already uploaded
			if (formData.nidFrontFile && !formData.nidImageFront) {
				setNidFrontUploadProgress(10);
				const result = await UploadService.uploadSingleFile(
					formData.nidFrontFile,
					'vendor-documents',
					`nid-front-${Date.now()}`
				);
				setNidFrontUploadProgress(100);
				setFormData((prev) => ({ ...prev, nidImageFront: result.url }));
			}

			// Upload NID back image if not already uploaded
			if (formData.nidBackFile && !formData.nidImageBack) {
				setNidBackUploadProgress(10);
				const result = await UploadService.uploadSingleFile(
					formData.nidBackFile,
					'vendor-documents',
					`nid-back-${Date.now()}`
				);
				setNidBackUploadProgress(100);
				setFormData((prev) => ({ ...prev, nidImageBack: result.url }));
			}

			// Upload business license if available
			if (formData.businessLicenseFile && !formData.tradeLicenseImage) {
				setLicenseUploadProgress(10);
				const result = await UploadService.uploadSingleFile(
					formData.businessLicenseFile,
					'vendor-documents',
					`license-${Date.now()}`
				);
				setLicenseUploadProgress(100);
				setFormData((prev) => ({ ...prev, tradeLicenseImage: result.url }));
			}

			return true;
		} catch (error) {
			console.error('Error uploading images:', error);
			toast.error('Upload Error', {
				description: getAxiosErrorMessage(error),
			});
			return false;
		}
	};

	// Handle next step
	const handleNext = async () => {
		if (validateStep()) {
			if (currentStep === 2) {
				// Upload images before proceeding to review step
				const uploaded = await uploadImages();
				if (!uploaded) return;
			}

			if (currentStep < steps.length - 1) {
				setCurrentStep((prev) => prev + 1);
				window.scrollTo(0, 0);
			} else {
				handleSubmit();
			}
		}
	};

	// Handle previous step
	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
			window.scrollTo(0, 0);
		}
	};

	// Handle form submission
	const handleSubmit = async () => {
		if (!session?.user?.id) {
			toast.error('Authentication Error', {
				description: 'You must be logged in to register a store.',
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Prepare the payload according to CreateStoreDto
			const payload = {
				name: formData.name,
				slug: formData.slug,
				address: formData.address,
				division: formData.division,
				district: formData.district,
				description: formData.description,
				nidImageFront: formData.nidImageFront,
				nidImageBack: formData.nidImageBack,
				tradeLicenseImage: formData.tradeLicenseImage || undefined,
				storeImage: formData.storeImage || undefined,
				storeCoverImage: formData.storeCoverImage || undefined,
				ownerId: session.user.id,
				status: 'approved',
				storeCategoryIds: formData.storeCategoryIds,
			};

			// Send the data to the backend
			const response = await api.post('/stores', payload);

			if ([200, 201].includes(response.data.statusCode)) {
				await refreshSession();
				console.log('Store registration successful:', response.data);

				// Redirect to success page
				toast.success('Registration Successful', {
					description:
						'Your store registration has been submitted and is pending approval.',
				});

				router.push('/vendor/register/success');
			}
		} catch (error) {
			console.error('Store registration failed:', error);
			toast.error('Registration Failed', {
				description: getAxiosErrorMessage(error),
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Helper to get category name by ID
	const getCategoryNameById = (id: number): string => {
		const category = storeCategories.find((cat) => cat.id === id);
		return category ? category.name : '';
	};

	const InfoRow = ({ label, value }: { label: string; value: string }) => (
		<div className='flex justify-between text-sm'>
			<span className='font-medium text-muted-foreground'>{label}:</span>
			<span className='text-foreground'>{value}</span>
		</div>
	);

	return (
		<div className='max-w-3xl mx-auto p-8 md:py-8'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold mb-2'>বিক্রেতা নিবন্ধন</h1>
				<p className='text-muted-foreground'>
					আমাদের প্ল্যাটফর্মে বিক্রেতা হিসেবে নিবন্ধন করতে নিচের ফর্মটি পূরণ
					করুন।
				</p>
			</div>

			{/* Progress Steps */}
			<div className='mb-8'>
				<div className='flex justify-between'>
					{steps.map((step, index) => (
						<div key={index} className='flex flex-col items-center'>
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${index < currentStep
									? 'bg-accent text-accent-foreground'
									: index === currentStep
										? 'bg-primary text-primary-foreground'
										: 'bg-muted text-muted-foreground'
									}`}
							>
								{index < currentStep ? (
									<Check className='w-4 h-4' />
								) : (
									<span>{index + 1}</span>
								)}
							</div>
							<span
								className={`text-xs text-center hidden md:block ${index === currentStep
									? 'text-primary font-medium'
									: 'text-muted-foreground'
									}`}
							>
								{step}
							</span>
						</div>
					))}
				</div>
				<div className='relative mt-2'>
					<div className='absolute top-0 left-4 right-4 h-1 bg-muted' />
					<div
						className='absolute top-0 left-4 h-1 bg-primary transition-all duration-300'
						style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
					/>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{steps[currentStep]}</CardTitle>
					<CardDescription>
						{currentStep === 0 && 'আপনার ব্যবসা সম্পর্কে তথ্য প্রদান করুন'}
						{currentStep === 1 && 'আপনার ব্যবসার অবস্থান এবং বিবরণ প্রদান করুন'}
						{currentStep === 2 &&
							'যাচাইকরণের জন্য প্রয়োজনীয় ডকুমেন্ট আপলোড করুন'}
						{currentStep === 3 && 'আপনার তথ্য পর্যালোচনা করুন এবং জমা দিন'}
					</CardDescription>
				</CardHeader>

				<CardContent>
					{/* Step 1: Business Information */}
					{currentStep === 0 && (
						<div className='space-y-4'>
							<div>
								<Label htmlFor='name'>দোকান/ব্যবসার নাম</Label>
								<Input
									id='name'
									name='name'
									value={formData.name}
									onChange={handleChange}
									placeholder='আপনার দোকান বা ব্যবসার নাম লিখুন'
									className={errors.name ? 'border-destructive' : ''}
									maxLength={32}
								/>
								{errors.name && (
									<p className='text-destructive text-sm mt-1'>{errors.name}</p>
								)}
							</div>

							<div>
								<Label htmlFor='slug'>স্লাগ (URL-friendly name)</Label>
								<Input
									id='slug'
									name='slug'
									value={formData.slug}
									onChange={handleChange}
									placeholder='url-friendly-name'
									className={errors.slug ? 'border-destructive' : ''}
									maxLength={32}
								/>
								<p className='text-muted-foreground text-xs mt-1'>
									এটি সয়ংক্রিয়ভাবে তৈরি হয়, কিন্তু আপনি চাইলে এটি পরিবর্তন
									করতে পারেন।
								</p>
								{errors.slug && (
									<p className='text-destructive text-sm mt-1'>{errors.slug}</p>
								)}
							</div>

							<div>
								<Label>পণ্যের বিভাগ</Label>
								{isLoadingCategories ? (
									<div className='flex items-center space-x-2 mt-2'>
										<Loader2 className='h-4 w-4 animate-spin' />
										<span className='text-sm'>Loading categories...</span>
									</div>
								) : (
									<div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2'>
										{storeCategories.map((category) => (
											<div
												key={category.id}
												className='flex items-center space-x-2'
											>
												<Checkbox
													id={`category-${category.id}`}
													checked={formData.storeCategoryIds.includes(
														category.id
													)}
													onCheckedChange={(checked) =>
														handleCategoryChange(
															category.id,
															checked as boolean
														)
													}
												/>
												<label
													htmlFor={`category-${category.id}`}
													className='text-sm cursor-pointer'
												>
													{category.name}
												</label>
											</div>
										))}
									</div>
								)}
								{errors.storeCategoryIds && (
									<p className='text-destructive text-sm mt-1'>
										{errors.storeCategoryIds}
									</p>
								)}
							</div>
						</div>
					)}

					{/* Step 2: Location & Description */}
					{currentStep === 1 && (
						<div className='space-y-4'>
							<div>
								<Label htmlFor='division'>বিভাগ</Label>
								<Select
									value={formData.division}
									onValueChange={(value) =>
										handleSelectChange('division', value)
									}
								>
									<SelectTrigger
										className={`w-full ${errors.division ? 'border-destructive' : ''
											}`}
									>
										<SelectValue placeholder='আপনার বিভাগ নির্বাচন করুন' />
									</SelectTrigger>
									<SelectContent>
										{divisions.map((division) => (
											<SelectItem key={division} value={division}>
												{division}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.division && (
									<p className='text-destructive text-sm mt-1'>
										{errors.division}
									</p>
								)}
							</div>

							<div>
								<Label htmlFor='district'>জেলা</Label>
								<Select
									value={formData.district}
									onValueChange={(value) =>
										handleSelectChange('district', value)
									}
									disabled={!formData.division}
								>
									<SelectTrigger
										className={`w-full ${errors.district ? 'border-destructive' : ''
											}`}
									>
										<SelectValue placeholder='আপনার জেলা নির্বাচন করুন' />
									</SelectTrigger>
									<SelectContent>
										{filteredDistricts.map((district) => (
											<SelectItem key={district.id} value={district.bn_name}>
												{district.bn_name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.district && (
									<p className='text-destructive text-sm mt-1'>
										{errors.district}
									</p>
								)}
							</div>

							<div>
								<Label htmlFor='address'>ঠিকানা</Label>
								<Textarea
									id='address'
									name='address'
									value={formData.address}
									onChange={handleChange}
									placeholder='আপনার দোকান/ব্যবসার বিস্তারিত ঠিকানা লিখুন'
									rows={2}
									className={errors.address ? 'border-destructive' : ''}
									maxLength={96}
								/>
								{errors.address && (
									<p className='text-destructive text-sm mt-1'>
										{errors.address}
									</p>
								)}
							</div>

							<div>
								<Label htmlFor='description'>ব্যবসার বিবরণ</Label>
								<Textarea
									id='description'
									name='description'
									value={formData.description}
									onChange={handleChange}
									placeholder='আপনার ব্যবসা এবং পণ্য সম্পর্কে বিস্তারিত বর্ণনা করুন'
									rows={4}
									className={errors.description ? 'border-destructive' : ''}
								/>
								{errors.description && (
									<p className='text-destructive text-sm mt-1'>
										{errors.description}
									</p>
								)}
							</div>
						</div>
					)}

					{/* Step 3: Document Upload */}
					{currentStep === 2 && (
						<div className='space-y-6'>
							<Alert>
								<AlertCircle className='h-4 w-4' />
								<AlertTitle>গুরুত্বপূর্ণ</AlertTitle>
								<AlertDescription>
									দয়া করে আপনার ডকুমেন্টগুলির স্পষ্ট ছবি আপলোড করুন। সমস্ত
									আপলোড নিরাপদ এবং শুধুমাত্র যাচাইকরণের জন্য ব্যবহৃত হবে।
								</AlertDescription>
							</Alert>

							<div>
								<Label htmlFor='nidFrontFile'>এনআইডি কার্ড (সামনের)</Label>
								<div className='mt-2'>
									<div className='flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors'>
										<label
											htmlFor='nidFrontFile'
											className='w-full cursor-pointer'
										>
											<div className='flex flex-col items-center'>
												{nidFrontPreview ? (
													<div className='relative w-full h-40 mb-4'>
														<Image
															src={nidFrontPreview || '/placeholder.svg'}
															alt='NID সামনের প্রিভিউ'
															fill
															className='object-contain'
														/>
													</div>
												) : (
													<Upload className='h-10 w-10 text-muted-foreground mb-2' />
												)}
												<span className='text-sm text-muted-foreground'>
													{nidFrontPreview
														? 'ছবি পরিবর্তন করুন'
														: 'এনআইডি সামনের ছবি আপলোড করতে ক্লিক করুন'}
												</span>
											</div>
											<input
												id='nidFrontFile'
												type='file'
												accept='image/*'
												className='hidden'
												onChange={(e) => handleFileUpload(e, 'nidFrontFile')}
												disabled={formData.nidImageFront !== ''}
											/>
										</label>
									</div>
									{nidFrontUploadProgress > 0 &&
										nidFrontUploadProgress < 100 && (
											<div className='mt-2'>
												<div className='flex items-center justify-between mb-1'>
													<span className='text-xs'>Uploading...</span>
													<span className='text-xs'>
														{nidFrontUploadProgress}%
													</span>
												</div>
												<Progress
													value={nidFrontUploadProgress}
													className='w-full'
												/>
											</div>
										)}
									{formData.nidImageFront && (
										<p className='text-xs text-green-600 mt-1'>
											Uploaded successfully!
										</p>
									)}
									{errors.nidImageFront && (
										<p className='text-destructive text-sm mt-1'>
											{errors.nidImageFront}
										</p>
									)}
								</div>
							</div>

							<div>
								<Label htmlFor='nidBackFile'>এনআইডি কার্ড (পিছনের)</Label>
								<div className='mt-2'>
									<div className='flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors'>
										<label
											htmlFor='nidBackFile'
											className='w-full cursor-pointer'
										>
											<div className='flex flex-col items-center'>
												{nidBackPreview ? (
													<div className='relative w-full h-40 mb-4'>
														<Image
															src={nidBackPreview || '/placeholder.svg'}
															alt='NID পিছনের প্রিভিউ'
															fill
															className='object-contain'
														/>
													</div>
												) : (
													<Upload className='h-10 w-10 text-muted-foreground mb-2' />
												)}
												<span className='text-sm text-muted-foreground'>
													{nidBackPreview
														? 'ছবি পরিবর্তন করুন'
														: 'এনআইডি পিছনের ছবি আপলোড করতে ক্লিক করুন'}
												</span>
											</div>
											<input
												id='nidBackFile'
												type='file'
												accept='image/*'
												className='hidden'
												onChange={(e) => handleFileUpload(e, 'nidBackFile')}
												disabled={formData.nidImageBack !== ''}
											/>
										</label>
									</div>
									{nidBackUploadProgress > 0 && nidBackUploadProgress < 100 && (
										<div className='mt-2'>
											<div className='flex items-center justify-between mb-1'>
												<span className='text-xs'>Uploading...</span>
												<span className='text-xs'>
													{nidBackUploadProgress}%
												</span>
											</div>
											<Progress
												value={nidBackUploadProgress}
												className='w-full'
											/>
										</div>
									)}
									{formData.nidImageBack && (
										<p className='text-xs text-green-600 mt-1'>
											Uploaded successfully!
										</p>
									)}
									{errors.nidImageBack && (
										<p className='text-destructive text-sm mt-1'>
											{errors.nidImageBack}
										</p>
									)}
								</div>
							</div>

							<div>
								<Label htmlFor='businessLicenseFile'>
									ব্যবসার লাইসেন্স (অপশনাল)
								</Label>
								<div className='mt-2'>
									<div className='flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors'>
										<label
											htmlFor='businessLicenseFile'
											className='w-full cursor-pointer'
										>
											<div className='flex flex-col items-center'>
												{businessLicensePreview ? (
													<div className='relative w-full h-40 mb-4'>
														<Image
															src={businessLicensePreview || '/placeholder.svg'}
															alt='ব্যবসার লাইসেন্স প্রিভিউ'
															fill
															className='object-contain'
														/>
													</div>
												) : (
													<Upload className='h-10 w-10 text-muted-foreground mb-2' />
												)}
												<span className='text-sm text-muted-foreground'>
													{businessLicensePreview
														? 'ডকুমেন্ট পরিবর্তন করুন'
														: 'ব্যবসার লাইসেন্স আপলোড করতে ক্লিক করুন'}
												</span>
											</div>
											<input
												id='businessLicenseFile'
												type='file'
												accept='image/*,.pdf'
												className='hidden'
												onChange={(e) =>
													handleFileUpload(e, 'businessLicenseFile')
												}
												disabled={formData.tradeLicenseImage !== ''}
											/>
										</label>
									</div>
									{licenseUploadProgress > 0 && licenseUploadProgress < 100 && (
										<div className='mt-2'>
											<div className='flex items-center justify-between mb-1'>
												<span className='text-xs'>Uploading...</span>
												<span className='text-xs'>
													{licenseUploadProgress}%
												</span>
											</div>
											<Progress
												value={licenseUploadProgress}
												className='w-full'
											/>
										</div>
									)}
									{formData.tradeLicenseImage && (
										<p className='text-xs text-green-600 mt-1'>
											Uploaded successfully!
										</p>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Step 4: Review & Submit */}
					{currentStep === 3 && (
						<div className='space-y-6'>
							{/* ব্যবসার তথ্য */}
							<div>
								<h3 className='text-lg font-semibold text-primary'>
									📦 ব্যবসার তথ্য
								</h3>
								<div className='bg-background border p-4 rounded-xl space-y-2 shadow-sm mt-3'>
									<InfoRow label='দোকানের নাম' value={formData.name} />
									<InfoRow
										label='দোকানের লিংক'
										value={`amaderkrishok/shop/${formData.slug}`}
									/>
									<InfoRow
										label='বিভাগ (Categories)'
										value={formData.storeCategoryIds
											.map((id) => getCategoryNameById(id))
											.join(', ')}
									/>
								</div>
							</div>

							{/* অবস্থান ও বিবরণ */}
							<div>
								<h3 className='text-lg font-semibold text-primary'>
									📍 অবস্থান ও বিবরণ
								</h3>
								<div className='bg-background border p-4 rounded-xl space-y-2 shadow-sm mt-3'>
									<InfoRow label='বিভাগ' value={formData.division} />
									<InfoRow label='জেলা' value={formData.district} />
									<InfoRow label='ঠিকানা' value={formData.address} />
									<InfoRow label='বিবরণ' value={formData.description} />
								</div>
							</div>

							{/* ডকুমেন্ট */}
							<div>
								<h3 className='text-lg font-semibold text-primary'>
									📄 আপলোডকৃত ডকুমেন্ট
								</h3>
								<div className='bg-background border p-4 rounded-xl space-y-2 shadow-sm mt-3'>
									<InfoRow
										label='এনআইডি সামনের'
										value={
											formData.nidImageFront
												? 'আপলোড করা হয়েছে'
												: 'আপলোড করা হয়নি'
										}
									/>
									<InfoRow
										label='এনআইডি পিছনের'
										value={
											formData.nidImageBack
												? 'আপলোড করা হয়েছে'
												: 'আপলোড করা হয়নি'
										}
									/>
									<InfoRow
										label='ব্যবসার লাইসেন্স'
										value={
											formData.tradeLicenseImage
												? 'আপলোড করা হয়েছে'
												: 'আপলোড করা হয়নি'
										}
									/>
								</div>
							</div>

							{/* Terms Agreement */}
							<div className='flex items-start space-x-3 border p-4 rounded-lg bg-muted/30'>
								<Checkbox
									id='agreeTerms'
									checked={formData.agreeTerms}
									onCheckedChange={(checked) =>
										handleCheckboxChange('agreeTerms', checked as boolean)
									}
								/>
								<div className='space-y-1.5'>
									<label
										htmlFor='agreeTerms'
										className='text-sm font-medium cursor-pointer'
									>
										আমি শর্তাবলী মেনে নিচ্ছি
									</label>
									<p className='text-xs text-muted-foreground'>
										এই ফর্ম জমা দিয়ে, আমি নিশ্চিত করছি যে প্রদত্ত সমস্ত তথ্য
										সঠিক এবং সম্পূর্ণ।
									</p>
									{errors.agreeTerms && (
										<p className='text-sm text-destructive'>
											{errors.agreeTerms}
										</p>
									)}
								</div>
							</div>
						</div>
					)}
				</CardContent>

				<CardFooter className='flex justify-between'>
					<Button
						variant='outline'
						onClick={handlePrevious}
						disabled={currentStep === 0 || isSubmitting}
					>
						<ArrowLeft className='mr-2 h-4 w-4' />
						পূর্ববর্তী
					</Button>

					<Button onClick={handleNext} disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Processing...
							</>
						) : currentStep < steps.length - 1 ? (
							<>
								পরবর্তী
								<ArrowRight className='ml-2 h-4 w-4' />
							</>
						) : (
							'নিবন্ধন জমা দিন'
						)}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
