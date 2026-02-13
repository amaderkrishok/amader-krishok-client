'use client';

import { useState, useEffect } from 'react';
import { useStoreManagement } from './store-management-context';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X } from 'lucide-react';
import { StoreImageDisplay } from './store-image-display';
import { UpdateStoreDTO } from '@/types/store';
import { toast } from 'sonner';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import bdDistricts from '@/data/bd-districts.json';

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

// Interface for District from JSON
interface District {
	id: string;
	division_id: string;
	name: string;
	bn_name: string;
	lat: string;
	long: string;
}

export function StoreEditForm() {
	const { store, updateStore, setEditMode, canEdit, isUpdating } =
		useStoreManagement();

	const [formData, setFormData] = useState<UpdateStoreDTO>({
		name: store?.name || '',
		description: store?.description || '',
		address: store?.address || '',
		division: store?.division || '',
		district: store?.district || '',
	});

	// State for filtered districts based on selected division
	const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

	// Initialize filtered districts on component mount
	useEffect(() => {
		if (store?.division) {
			const divisionId = getDivisionId(store.division);
			if (divisionId) {
				const districtsInDivision = (
					bdDistricts.districts as District[]
				).filter((district) => district.division_id === divisionId);
				setFilteredDistricts(districtsInDivision);
			}
		}
	}, [store?.division]);

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

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle select change
	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));

		// If division changed, reset district
		if (name === 'division') {
			setFormData((prev) => ({ ...prev, district: '' }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate form data
		if (!formData.name?.trim()) {
			toast.error('স্টোরের নাম প্রয়োজন');
			return;
		}

		await updateStore(formData);
	};

	if (!store) return null;

	return (
		<form onSubmit={handleSubmit}>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Form Fields - Left 2/3 */}
				<div className='lg:col-span-2'>
					<Card>
						<CardHeader>
							<CardTitle className='text-xl'>স্টোরের তথ্য আপডেট করুন</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							{/* Store Name Field */}
							<div className='space-y-1.5'>
								<Label htmlFor='name' className='flex items-center gap-1'>
									স্টোরের নাম
									<span className='text-red-500'>*</span>
								</Label>
								<Input
									id='name'
									name='name'
									value={formData.name}
									onChange={handleChange}
									disabled={!canEdit('name') || isUpdating}
								/>
							</div>

							{/* Store Slug - Read-only for vendor */}
							<div className='space-y-1.5'>
								<Label htmlFor='slug' className='flex items-center gap-1'>
									স্টোরের স্লাগ
									<InfoTooltip content='এই ফিল্ডটি পরিবর্তন করা যাবে না। সাপোর্টের সাথে যোগাযোগ করুন।' />
								</Label>
								<Input
									id='slug'
									value={store.slug}
									disabled={true}
									className='bg-gray-50'
								/>
								<p className='text-xs text-gray-500'>
									যোগাযোগ করুন: support@amaderkrishok.com
								</p>
							</div>

							{/* Division and District Fields (Editable) */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-1.5'>
									<Label htmlFor='division'>বিভাগ</Label>
									<Select
										value={formData.division}
										onValueChange={(value) =>
											handleSelectChange('division', value)
										}
										disabled={!canEdit('division') || isUpdating}
									>
										<SelectTrigger className='w-full'>
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
								</div>
								<div className='space-y-1.5'>
									<Label htmlFor='district'>জেলা</Label>
									<Select
										value={formData.district}
										onValueChange={(value) =>
											handleSelectChange('district', value)
										}
										disabled={
											!canEdit('district') || isUpdating || !formData.division
										}
									>
										<SelectTrigger className='w-full'>
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
								</div>
							</div>

							{/* Address Field */}
							<div className='space-y-1.5'>
								<Label htmlFor='address'>ঠিকানা</Label>
								<Textarea
									id='address'
									name='address'
									value={formData.address}
									onChange={handleChange}
									rows={3}
									disabled={!canEdit('address') || isUpdating}
								/>
							</div>

							{/* Description Field */}
							<div className='space-y-1.5'>
								<Label htmlFor='description'>স্টোর বিবরণ</Label>
								<Textarea
									id='description'
									name='description'
									value={formData.description}
									onChange={handleChange}
									rows={5}
									placeholder='আপনার স্টোর সম্পর্কে বিস্তারিত লিখুন...'
									disabled={!canEdit('description') || isUpdating}
								/>
							</div>
						</CardContent>
						<CardFooter className='flex justify-between'>
							<Button
								type='button'
								variant='outline'
								onClick={() => setEditMode(false)}
								disabled={isUpdating}
							>
								<X className='h-4 w-4 mr-2' />
								বাতিল করুন
							</Button>
							<Button type='submit' disabled={isUpdating}>
								{isUpdating ? (
									<>
										<Loader2 className='h-4 w-4 mr-2 animate-spin' />
										অপেক্ষা করুন...
									</>
								) : (
									<>
										<Save className='h-4 w-4 mr-2' />
										সংরক্ষণ করুন
									</>
								)}
							</Button>
						</CardFooter>
					</Card>
				</div>

				{/* Store Images - Right 1/3 */}
				<div className='lg:col-span-1 space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle className='text-lg'>স্টোরের ছবি</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Store Logo/Profile Image */}
							<div>
								<h4 className='font-medium text-sm mb-2'>প্রোফাইল ইমেজ</h4>
								<StoreImageDisplay
									type='storeImage'
									url={store.storeImage}
									alt={`${store.name} Profile Image`}
									className='aspect-square w-full'
									label='প্রোফাইল ইমেজ'
								/>
								<p className='text-xs text-gray-500 mt-2'>
									সর্বোচ্চ আকার: 2MB, সুপারিশকৃত আকার: 400x400px
								</p>
							</div>

							{/* Store Cover Image */}
							<div>
								<h4 className='font-medium text-sm mb-2'>কভার ইমেজ</h4>
								<StoreImageDisplay
									type='storeCoverImage'
									url={store.storeCoverImage}
									alt={`${store.name} Cover Image`}
									className='aspect-[16/6] w-full'
									label='কভার ইমেজ'
								/>
								<p className='text-xs text-gray-500 mt-2'>
									সর্বোচ্চ আকার: 2MB, সুপারিশকৃত আকার: 1200x400px
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</form>
	);
}
