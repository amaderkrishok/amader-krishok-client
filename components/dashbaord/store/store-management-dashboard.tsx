'use client';

import { useStoreManagement } from './store-management-context';

import { Button } from '@/components/ui/button';
import { Loader2, PencilIcon } from 'lucide-react';
import { StoreHeader } from './store-header';
import { StoreEditForm } from './store-edit-form';
import { StoreDetails } from './store-details';

export function StoreManagementDashboard() {
	const { store, isLoading, isEditMode, setEditMode, viewMode } =
		useStoreManagement();

	if (isLoading) {
		return (
			<div className='container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]'>
				<Loader2 className='h-10 w-10 text-green-600 animate-spin mb-4' />
				<p className='text-gray-600'>স্টোরের তথ্য লোড হচ্ছে...</p>
			</div>
		);
	}

	if (!store) {
		return (
			<div className='container mx-auto px-4 py-12 text-center'>
				<h1 className='text-2xl font-bold mb-4'>কোন স্টোর পাওয়া যায়নি</h1>
				<p className='text-gray-600 mb-6'>
					স্টোর সম্পর্কিত তথ্য পাওয়া যায়নি।
				</p>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-7xl'>
			<StoreHeader
				name={store.name}
				status={store.status}
				isEditMode={isEditMode}
				onEditClick={() => setEditMode(true)}
				onCancelClick={() => setEditMode(false)}
			/>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8'>
				<div className='lg:col-span-2'>
					{isEditMode ? <StoreEditForm /> : <StoreDetails />}
				</div>
		
			</div>
		</div>
	);
}
