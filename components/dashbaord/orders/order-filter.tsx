'use client';

import { useState } from 'react';
import { OrderStatus, OrderFilters } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { X, Filter, Search, RotateCcw } from 'lucide-react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

interface OrderFilterProps {
	onChange: (filters: OrderFilters) => void;
	initialFilters?: OrderFilters;
	showStoreFilter?: boolean;
}

export function OrderFilter({
	onChange,
	initialFilters = {},
	showStoreFilter = false,
}: OrderFilterProps) {
	const [statusFilter, setStatusFilter] = useState<string>(
		initialFilters.status || 'ALL'
	);
	const [phoneNumber, setPhoneNumber] = useState(
		initialFilters.phoneNumber || ''
	);
	const [buyerId, setBuyerId] = useState(initialFilters.buyerId || '');
	const [storeIdFilter, setStoreIdFilter] = useState(
		initialFilters.storeId || ''
	);
	const [isOpen, setIsOpen] = useState(false);

	const handleStatusChange = (status: string) => {
		setStatusFilter(status);
		const newFilters: OrderFilters = { ...initialFilters };

		if (status === 'ALL') {
			delete newFilters.status;
		} else {
			newFilters.status = status as OrderStatus;
		}

		onChange(newFilters);
	};

	const handlePhoneSearch = (e: React.FormEvent) => {
		e.preventDefault();

		const newFilters: OrderFilters = { ...initialFilters };
		if (phoneNumber) {
			newFilters.phoneNumber = phoneNumber;
		} else {
			delete newFilters.phoneNumber;
		}

		onChange(newFilters);
	};

	const handleStoreIdChange = (value: string) => {
		setStoreIdFilter(value);

		const newFilters: OrderFilters = { ...initialFilters };
		if (value) {
			newFilters.storeId = value;
		} else {
			delete newFilters.storeId;
		}

		onChange(newFilters);
	};

	const handleBuyerIdChange = (value: string) => {
		setBuyerId(value);

		const newFilters: OrderFilters = { ...initialFilters };
		if (value) {
			newFilters.buyerId = value;
		} else {
			delete newFilters.buyerId;
		}

		onChange(newFilters);
	};

	const handleClearFilters = () => {
		setStatusFilter('ALL');
		setPhoneNumber('');
		setBuyerId('');
		setStoreIdFilter('');

		onChange({});
	};

	const hasFilters =
		statusFilter !== 'ALL' || phoneNumber || buyerId || storeIdFilter;

	return (
		<div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-[18px] border border-[#E5E7EB] shadow-xs'>
			{/* Status Select */}
			<div className='w-full sm:w-[220px]'>
				<Select value={statusFilter} onValueChange={handleStatusChange}>
					<SelectTrigger className='h-10 rounded-xl border-[#E5E7EB] text-xs font-semibold bg-[#FAFAF6] focus:bg-white'>
						<SelectValue placeholder='সব স্ট্যাটাস' />
					</SelectTrigger>
					<SelectContent className='rounded-xl border-[#E5E7EB] text-xs font-semibold'>
						<SelectItem value='ALL'>সব স্ট্যাটাস</SelectItem>
						<SelectItem value={OrderStatus.PENDING}>অপেক্ষমান</SelectItem>
						<SelectItem value={OrderStatus.CONFIRMED}>
							নিশ্চিত করা হয়েছে
						</SelectItem>
						<SelectItem value={OrderStatus.DELIVERED}>
							ডেলিভারি হয়েছে
						</SelectItem>
						<SelectItem value={OrderStatus.CANCELLED}>বাতিল</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Phone Search */}
			<form onSubmit={handlePhoneSearch} className='flex-1 flex items-center gap-2 max-w-md'>
				<div className='relative flex-1'>
					<Search className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]' />
					<Input
						placeholder='🔍 ফোন নম্বর দিয়ে খুঁজুন...'
						className='pl-10 h-10 rounded-xl border-[#E5E7EB] text-xs font-semibold bg-[#FAFAF6] focus:bg-white'
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
					/>
				</div>
				<Button
					type='submit'
					className='bg-[#26351B] hover:bg-[#1F2A16] text-white font-extrabold rounded-xl text-xs h-10 px-4 shrink-0 shadow-xs'
				>
					সার্চ
				</Button>
			</form>

			{/* Advanced Filter Button (Admin only) */}
			{showStoreFilter && (
				<Popover open={isOpen} onOpenChange={setIsOpen}>
					<PopoverTrigger asChild>
						<Button variant='outline' className='h-10 rounded-xl border-[#E5E7EB] text-xs font-bold'>
							<Filter className='h-3.5 w-3.5 mr-2 text-[#26351B]' />
							এডভান্সড ফিল্টার
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-80 rounded-2xl border-[#E5E7EB] shadow-md p-4' align='end'>
						<div className='space-y-4'>
							<h3 className='font-extrabold text-xs text-[#172033] uppercase tracking-wider'>
								অতিরিক্ত ফিল্টার
							</h3>

							<div className='space-y-1.5'>
								<Label htmlFor='storeId' className='text-xs font-bold text-[#172033]'>
									স্টোরের আইডি
								</Label>
								<Input
									id='storeId'
									value={storeIdFilter}
									onChange={(e) => handleStoreIdChange(e.target.value)}
									placeholder='স্টোরের আইডি দিন'
									className='h-9 rounded-xl text-xs border-[#E5E7EB]'
								/>
							</div>

							<div className='space-y-1.5'>
								<Label htmlFor='buyerId' className='text-xs font-bold text-[#172033]'>
									ক্রেতার আইডি
								</Label>
								<Input
									id='buyerId'
									value={buyerId}
									onChange={(e) => handleBuyerIdChange(e.target.value)}
									placeholder='ক্রেতার আইডি দিন'
									className='h-9 rounded-xl text-xs border-[#E5E7EB]'
								/>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			)}

			{/* Clear Filters Button */}
			{hasFilters && (
				<Button
					variant='ghost'
					onClick={handleClearFilters}
					className='h-10 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0'
				>
					<RotateCcw className='h-3.5 w-3.5 mr-1.5' />
					ফিল্টার পরিষ্কার করুন
				</Button>
			)}
		</div>
	);
}
