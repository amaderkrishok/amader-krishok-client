'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { OrderService } from '@/services/order-service';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface OrderStatusUpdateProps {
	order: Order;
	onStatusUpdated: (updatedOrder: Order) => void;
}

export function OrderStatusUpdate({
	order,
	onStatusUpdated,
}: OrderStatusUpdateProps) {
	const [status, setStatus] = useState<OrderStatus>(order.orderStatus);
	const [isUpdating, setIsUpdating] = useState(false);

	const validNextStatuses = OrderService.getValidNextStatuses(
		order.orderStatus
	);

	const handleStatusChange = async () => {
		if (status === order.orderStatus) return;

		setIsUpdating(true);
		try {
			const response = await OrderService.updateOrderStatus(order.id, status);
			const updatedOrder = response.data;

			onStatusUpdated(updatedOrder);
			toast.success('সফল', {
				description: 'অর্ডার স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।',
			});
		} catch (error) {
			console.error('Error updating order status:', error);
			toast.error('ত্রুটি', {
				description: 'অর্ডার স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।',
			});
		} finally {
			setIsUpdating(false);
		}
	};

	if (validNextStatuses.length === 0) {
		return (
			<div className='p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs font-extrabold text-[#16A34A] flex items-center gap-2'>
				<CheckCircle className='w-4 h-4 text-[#16A34A]' />
				<span>এই অর্ডারের স্ট্যাটাস আর পরিবর্তন করা যাবে না (চুড়ান্ত স্ট্যাটাস)।</span>
			</div>
		);
	}

	return (
		<div className='p-4 sm:p-5 bg-[#FAFAF6] border border-[#E5E7EB] rounded-2xl space-y-3 shadow-xs'>
			<div className='flex items-center gap-2'>
				<RefreshCw className='w-4 h-4 text-[#F5B800]' />
				<h3 className='text-xs font-extrabold text-[#172033] uppercase tracking-wider'>
					অর্ডার স্ট্যাটাস আপডেট করুন
				</h3>
			</div>

			<div className='flex flex-col sm:flex-row items-center gap-3'>
				<div className='w-full sm:flex-1'>
					<Select
						value={status}
						onValueChange={(value) => setStatus(value as OrderStatus)}
					>
						<SelectTrigger className='h-11 rounded-xl border-[#E5E7EB] bg-white text-xs font-extrabold text-[#172033] focus:ring-1 focus:ring-[#F5B800] shadow-xs'>
							<SelectValue placeholder='পরবর্তী স্ট্যাটাস নির্বাচন করুন' />
						</SelectTrigger>
						<SelectContent className='rounded-xl border-[#E5E7EB] bg-white text-xs font-bold shadow-md'>
							{validNextStatuses.map((nextStatus) => {
								const info = OrderService.getOrderStatusInfo(nextStatus);
								return (
									<SelectItem
										key={nextStatus}
										value={nextStatus}
										className='cursor-pointer py-2.5 px-3 focus:bg-[#FFF9E8] font-bold'
									>
										<span>{info.label}</span>
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>

				<Button
					onClick={handleStatusChange}
					disabled={isUpdating || status === order.orderStatus}
					className={`w-full sm:w-auto h-11 px-6 rounded-xl font-extrabold text-xs transition-all duration-200 shadow-xs ${
						status !== order.orderStatus
							? 'bg-[#F5B800] hover:bg-[#E0A800] text-[#172033] border-0 cursor-pointer hover:-translate-y-0.5'
							: 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed'
					}`}
				>
					{isUpdating ? (
						<>
							<Loader2 className='mr-2 h-4 w-4 animate-spin text-[#172033]' />
							আপডেট হচ্ছে...
						</>
					) : (
						'স্ট্যাটাস আপডেট করুন'
					)}
				</Button>
			</div>
		</div>
	);
}
