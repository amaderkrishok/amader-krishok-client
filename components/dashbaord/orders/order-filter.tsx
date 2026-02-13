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
import { X, Filter, Search } from 'lucide-react';
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
	// Instead of storing full filters state, just store the UI state
	// and call onChange directly when needed
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

		// Update parent component with new filters
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
		<div className='flex flex-col md:flex-row gap-3 mb-4'>
			{/* Status Select */}
			<div className='flex-1'>
				<Select value={statusFilter} onValueChange={handleStatusChange}>
					<SelectTrigger>
						<SelectValue placeholder='স্ট্যাটাস ফিল্টার করুন' />
					</SelectTrigger>
					<SelectContent>
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
			<form onSubmit={handlePhoneSearch} className='flex-1 flex gap-2'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
					<Input
						placeholder='ফোন নম্বর দিয়ে সার্চ করুন'
						className='pl-9'
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
					/>
				</div>
				<Button type='submit' variant='secondary'>
					সার্চ
				</Button>
			</form>

			{/* Advanced Filter Button */}
			{showStoreFilter && (
				<Popover open={isOpen} onOpenChange={setIsOpen}>
					<PopoverTrigger asChild>
						<Button variant='outline'>
							<Filter className='h-4 w-4 mr-2' />
							এডভান্সড ফিল্টার
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-80' align='end'>
						<div className='space-y-4'>
							<h3 className='font-medium'>অতিরিক্ত ফিল্টার</h3>

							{/* Store ID Filter (admin only) */}
							<div className='space-y-2'>
								<Label htmlFor='storeId'>স্টোরের আইডি</Label>
								<Input
									id='storeId'
									value={storeIdFilter}
									onChange={(e) => handleStoreIdChange(e.target.value)}
									placeholder='স্টোরের আইডি দিন'
								/>
							</div>

							{/* Buyer ID Filter (admin only) */}
							<div className='space-y-2'>
								<Label htmlFor='buyerId'>ক্রেতার আইডি</Label>
								<Input
									id='buyerId'
									value={buyerId}
									onChange={(e) => handleBuyerIdChange(e.target.value)}
									placeholder='ক্রেতার আইডি দিন'
								/>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			)}

			{/* Clear Filters Button */}
			{hasFilters && (
				<Button variant='ghost' onClick={handleClearFilters}>
					<X className='h-4 w-4 mr-2' />
					ফিল্টার পরিষ্কার করুন
				</Button>
			)}
		</div>
	);
}
