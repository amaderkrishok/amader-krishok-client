import { StoreStatus } from '@/types/store';
import { Button } from '@/components/ui/button';
import { X, PencilIcon, CheckCircle2 } from 'lucide-react';
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
		<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-7 rounded-[18px] border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
			<div className='space-y-1.5 z-10'>
				<div className='flex items-center gap-3 flex-wrap'>
					<h1 className='text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight'>
						{name}
					</h1>
					<span
						className={`inline-flex items-center gap-1.5 ${color} ${textColor} text-xs font-bold px-3 py-1 rounded-full uppercase border shadow-xs`}
					>
						<CheckCircle2 className='w-3.5 h-3.5' />
						{label}
					</span>
				</div>
				<p className='text-sm text-[#64748B] font-medium'>
					আপনার স্টোরের মৌলিক তথ্য, অবস্থান ও ছবি পরিচালনা করুন।
				</p>
			</div>

			{isEditMode ? (
				<div className='flex gap-2 z-10'>
					<Button
						variant='outline'
						size='sm'
						onClick={onCancelClick}
						className='rounded-xl border-[#E5E7EB] font-bold text-xs hover:bg-[#F7F6F0]'
					>
						<X className='h-4 w-4 mr-1.5 text-red-500' />
						বাতিল করুন
					</Button>
				</div>
			) : (
				<Button
					onClick={onEditClick}
					className='bg-[#F5B800] hover:bg-[#E0A800] text-[#172033] font-extrabold rounded-xl px-5 py-2.5 shadow-xs border-0 transition-all hover:-translate-y-0.5 z-10'
				>
					<PencilIcon className='h-4 w-4 mr-2 text-[#172033]' />
					আপডেট করুন
				</Button>
			)}
		</div>
	);
}
