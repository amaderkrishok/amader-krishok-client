'use client';

import { useStoreManagement } from './store-management-context';
import { Loader2 } from 'lucide-react';
import { StoreHeader } from './store-header';
import { StoreEditForm } from './store-edit-form';
import { StoreDetails } from './store-details';

export function StoreManagementDashboard() {
	const { store, isLoading, isEditMode, setEditMode } =
		useStoreManagement();

	if (isLoading) {
		return (
			<div className='w-full min-h-[60vh] bg-[#F7F6F0] p-8 flex flex-col items-center justify-center space-y-3'>
				<Loader2 className='h-10 w-10 text-[#26351B] animate-spin mb-2' />
				<p className='text-xs text-[#64748B] font-bold'>স্টোরের তথ্য লোড হচ্ছে...</p>
			</div>
		);
	}

	if (!store) {
		return (
			<div className='w-full min-h-[60vh] bg-[#F7F6F0] p-8 text-center flex flex-col items-center justify-center space-y-3'>
				<h1 className='text-xl font-extrabold text-[#172033]'>কোন স্টোর পাওয়া যায়নি</h1>
				<p className='text-xs text-[#64748B] font-medium'>
					স্টোর সম্পর্কিত তথ্য পাওয়া যায়নি।
				</p>
			</div>
		);
	}

	return (
		<div className='p-4 sm:p-6 lg:p-8 space-y-6 w-full min-h-screen bg-[#F7F6F0] selection:bg-[#F5B800] selection:text-[#172033]'>
			<StoreHeader
				name={store.name}
				status={store.status}
				isEditMode={isEditMode}
				onEditClick={() => setEditMode(true)}
				onCancelClick={() => setEditMode(false)}
			/>

			<div className='mt-6'>
				{isEditMode ? <StoreEditForm /> : <StoreDetails />}
			</div>
		</div>
	);
}
