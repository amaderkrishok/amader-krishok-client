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
import { Loader2 } from 'lucide-react';
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

			// Extract the actual order data from the response
			const updatedOrder = response.data;

			console.log('Updated order:', updatedOrder);

			onStatusUpdated(updatedOrder);
			toast.success('অর্ডার স্ট্যাটাস আপডেট করা হয়েছে।');
		} catch (error) {
			console.error('Error updating order status:', error);
			toast.error('অর্ডার স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।');
		} finally {
			setIsUpdating(false);
		}
	};

	// If no valid next statuses, don't render the component
	if (validNextStatuses.length === 0) {
		return null;
	}

	return (
		<div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4'>
			<h3 className='font-medium dark:text-white'>
				অর্ডার স্ট্যাটাস আপডেট করুন
			</h3>

			<div className='flex flex-col md:flex-row gap-4'>
				<div className='w-full md:w-2/3'>
					<Select
						value={status}
						onValueChange={(value) => setStatus(value as OrderStatus)}
					>
						<SelectTrigger className='dark:border-gray-700 dark:bg-gray-800 dark:text-white'>
							<SelectValue placeholder='স্ট্যাটাস নির্বাচন করুন' />
						</SelectTrigger>
						<SelectContent className='dark:border-gray-700 dark:bg-gray-800'>
							{validNextStatuses.map((nextStatus) => (
								<SelectItem
									key={nextStatus}
									value={nextStatus}
									className='dark:text-white dark:focus:bg-gray-700'
								>
									{OrderService.getOrderStatusInfo(nextStatus).label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Button
					onClick={handleStatusChange}
					disabled={isUpdating || status === order.orderStatus}
					className='w-full md:w-1/3 dark:bg-primary dark:hover:bg-primary/90'
				>
					{isUpdating ? (
						<>
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							আপডেট হচ্ছে
						</>
					) : (
						'আপডেট করুন'
					)}
				</Button>
			</div>
		</div>
	);
}
