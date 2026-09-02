'use client';

import { StoreStatus } from '@/types/store';
import { Button } from '@/components/ui/button';
import { X, PencilIcon, CheckCircle2, Store as StoreIcon, Star, ShoppingBag, Package } from 'lucide-react';
import { StoreService } from '@/services/store-service';

interface StoreHeaderProps {
	name: string;
	status: StoreStatus;
	isEditMode: boolean;
	onEditClick: () => void;
	onCancelClick: () => void;
	productCount?: number;
	orderCount?: number;
	rating?: number;
}

export function StoreHeader({
	name,
	status,
	isEditMode,
	onEditClick,
	onCancelClick,
	productCount = 7,
	orderCount = 8,
	rating = 4.8,
}: StoreHeaderProps) {
	const { label } = StoreService.getFormattedStatus(status);

	return (
		<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-white p-6 sm:p-7 rounded-[18px] border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
			<div className='flex items-start gap-4 z-10 min-w-0'>
				<div className='flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFF9E8] border border-[#F5B800]/40 flex items-center justify-center text-[#26351B] shadow-xs'>
					<StoreIcon className='w-7 h-7 sm:w-8 sm:h-8 text-[#26351B]' />
				</div>

				<div className='space-y-1.5 min-w-0'>
					<div className='flex items-center gap-3 flex-wrap'>
						<h1 className='text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight truncate'>
							{name}
						</h1>
						<span className='inline-flex items-center gap-1.5 bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0] text-xs font-extrabold px-3 py-1 rounded-full shadow-xs'>
							<CheckCircle2 className='w-3.5 h-3.5 text-[#16A34A]' />
							✓ {label || 'APPROVED'}
						</span>
					</div>

					<p className='text-xs sm:text-sm text-[#64748B] font-medium'>
						আপনার স্টোরের মৌলিক তথ্য, অবস্থান ও ছবি পরিচালনা করুন।
					</p>

					{/* Compact Stats Row */}
					<div className='flex items-center gap-3 text-xs font-bold text-[#172033] pt-1 flex-wrap'>
						<span className='flex items-center gap-1 bg-[#FAFAF6] px-2.5 py-1 rounded-lg border border-[#E5E7EB]'>
							<Package className='w-3.5 h-3.5 text-[#26351B]' />
							{productCount} Products
						</span>
						<span className='flex items-center gap-1 bg-[#FAFAF6] px-2.5 py-1 rounded-lg border border-[#E5E7EB]'>
							<ShoppingBag className='w-3.5 h-3.5 text-[#26351B]' />
							{orderCount} Orders
						</span>
						<span className='flex items-center gap-1 bg-[#FFF9E8] px-2.5 py-1 rounded-lg border border-[#F5B800]/30 text-[#26351B]'>
							<Star className='w-3.5 h-3.5 text-[#F5B800] fill-[#F5B800]' />
							{rating} Rating
						</span>
					</div>
				</div>
			</div>

			{isEditMode ? (
				<div className='flex gap-2 z-10 w-full sm:w-auto justify-end'>
					<Button
						variant='outline'
						size='sm'
						onClick={onCancelClick}
						className='rounded-xl border-[#E5E7EB] font-bold text-xs hover:bg-[#F7F6F0] px-4'
					>
						<X className='h-4 w-4 mr-1.5 text-red-500' />
						বাতিল করুন
					</Button>
				</div>
			) : (
				<Button
					onClick={onEditClick}
					className='bg-[#F5B800] hover:bg-[#E0A800] text-[#172033] font-extrabold rounded-xl px-5 py-2.5 shadow-xs border-0 transition-all hover:-translate-y-0.5 z-10 w-full sm:w-auto'
				>
					<PencilIcon className='h-4 w-4 mr-2 text-[#172033]' />
					স্টোর আপডেট করুন
				</Button>
			)}
		</div>
	);
}
