import { useState } from 'react';
import { Order } from '@/types/order';
import { OrderService } from '@/services/order-service';
import { OrderStatusBadge } from './order-status-badge';
import { OrderStatusUpdate } from './order-status-update';
import { Button } from '@/components/ui/button';
import { Eye, ChevronDown, ChevronUp, FileDown } from 'lucide-react';
import { OrderInvoice } from '@/components/orders/order-invoice';

interface OrderListItemProps {
	order: Order;
	onViewDetails: (order: Order) => void;
	onOrderUpdated?: (updatedOrder: Order) => void;
}

export function OrderListItem({
	order,
	onViewDetails,
	onOrderUpdated,
}: OrderListItemProps) {
	const [expanded, setExpanded] = useState(false);
	const [currentOrder, setCurrentOrder] = useState<Order>(order);

	console.log(currentOrder);

	const toggleExpand = () => {
		setExpanded((prev) => !prev);
	};

	const handleStatusUpdated = (updatedOrder: Order) => {
		setCurrentOrder(updatedOrder);
		if (onOrderUpdated) {
			onOrderUpdated(updatedOrder);
		}
	};

	// Check if order ID exists before accessing it
	const orderIdDisplay = currentOrder?.id
		? `#${currentOrder.id.substring(0, 8)}`
		: 'ID Not Available';

	return (
		<div className='border-b dark:border-gray-700'>
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 gap-3 dark:bg-gray-800'>
				<div className='flex-1 mb-3 md:mb-0'>
					<div className='flex items-center gap-2'>
						<p className='font-medium dark:text-white'>{orderIdDisplay}</p>
						{currentOrder?.orderStatus && (
							<OrderStatusBadge status={currentOrder.orderStatus} />
						)}
					</div>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						{currentOrder?.orderDate
							? OrderService.formatOrderDate(currentOrder.orderDate)
							: 'Date not available'}
					</p>
				</div>

				<div className='flex-1'>
					<p className='font-medium dark:text-white break-words'>
						{currentOrder?.name || 'Unknown'}
					</p>
					<p className='text-sm text-gray-500 dark:text-gray-400 break-words'>
						{currentOrder?.phoneNumber || 'No phone number'}
					</p>
				</div>

				<div className='flex-1'>
					<p className='font-medium dark:text-white'>
						{currentOrder?.totalAmount || '0'} ৳
					</p>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						{currentOrder?.orderItems?.length || 0} আইটেম
					</p>
				</div>

				<div className='flex gap-2 flex-wrap md:flex-nowrap w-full md:w-auto justify-start md:justify-end'>
					{/* Invoice Download */}
					<OrderInvoice order={currentOrder} />

					<Button
						variant='ghost'
						size='sm'
						onClick={() => onViewDetails(currentOrder)}
						className='dark:hover:bg-gray-700 shrink-0'
					>
						<Eye className='h-4 w-4 mr-1' /> বিস্তারিত
					</Button>

					<Button
						variant='outline'
						size='sm'
						onClick={toggleExpand}
						className='px-2 dark:border-gray-600 dark:hover:bg-gray-700 shrink-0'
					>
						{expanded ? (
							<ChevronUp className='h-4 w-4' />
						) : (
							<ChevronDown className='h-4 w-4' />
						)}
					</Button>
				</div>
			</div>

			{expanded && currentOrder && (
				<div className='px-4 pb-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700'>
					<OrderStatusUpdate
						order={currentOrder}
						onStatusUpdated={handleStatusUpdated}
					/>
				</div>
			)}
		</div>
	);
}
