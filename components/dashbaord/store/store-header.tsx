import { StoreStatus } from '@/types/store';
import { Button } from '@/components/ui/button';
import { X, PencilIcon } from 'lucide-react';
import { StoreService } from '@/services/store-service';

interface StoreHeaderProps {
	name: string;
	status: StoreStatus;
	isEditMode: boolean;
	onEditClick: () => void;
	onCancelClick: () => void;
}

export function StoreHeader({
	name,
	status,
	isEditMode,
	onEditClick,
	onCancelClick,
}: StoreHeaderProps) {
	const { label, color, textColor } = StoreService.getFormattedStatus(status);

	return (
		<div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
			<div>
				<h1 className='text-2xl md:text-3xl font-bold flex items-center gap-3'>
					{name}
					<span
						className={`${color} ${textColor} text-xs px-2 py-0.5 rounded-full uppercase`}
					>
						{label}
					</span>
				</h1>
				<p className='text-gray-600 mt-1'>স্টোর ম্যানেজমেন্ট ড্যাশবোর্ড</p>
			</div>

			{isEditMode ? (
				<div className='flex gap-2 mt-4 md:mt-0'>
					<Button variant='outline' size='sm' onClick={onCancelClick}>
						<X className='h-4 w-4 mr-1' />
						বাতিল করুন
					</Button>
				</div>
			) : (
				<Button
					variant='outline'
					size='sm'
					onClick={onEditClick}
					className='mt-4 md:mt-0'
				>
					<PencilIcon className='h-4 w-4 mr-2' />
					আপডেট করুন
				</Button>
			)}
		</div>
	);
}
