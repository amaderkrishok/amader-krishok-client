'use client';

import { useState } from 'react';
import { Order } from '@/types/order';
import { OrderService } from '@/services/order-service';
import { OrderStatusBadge } from './order-status-badge';
import { OrderStatusUpdate } from './order-status-update';
import { Button } from '@/components/ui/button';
import { Eye, ChevronDown, ChevronUp, Truck } from 'lucide-react';
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

	const toggleExpand = () => {
		setExpanded((prev) => !prev);
	};

	const handleStatusUpdated = (updatedOrder: Order) => {
		setCurrentOrder(updatedOrder);
		if (onOrderUpdated) {
			onOrderUpdated(updatedOrder);
		}
	};

	const orderIdDisplay = currentOrder?.id
		? `#${currentOrder.id.substring(0, 8)}`
		: '#N/A';

	// Calculate unified Delivery Charge & Grand Total via OrderService
	const deliveryCharge = OrderService.getOrderDeliveryCharge(currentOrder);
	const grandTotal = OrderService.getOrderGrandTotal(currentOrder);

	return (
		<div className='border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#FFF9E8] transition-colors duration-200 group'>
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 sm:p-5 gap-4 bg-white group-hover:bg-[#FFF9E8] transition-colors'>
				{/* ORDER ID & STATUS & DATE */}
				<div className='flex-1 min-w-0 space-y-1'>
					<div className='flex items-center gap-2 flex-wrap'>
						<span className='font-black text-sm text-[#172033] tracking-tight'>
							{orderIdDisplay}
						</span>
						{currentOrder?.orderStatus && (
							<OrderStatusBadge status={currentOrder.orderStatus} size='sm' />
						)}
					</div>
					<p className='text-xs text-[#64748B] font-medium'>
						{currentOrder?.orderDate
							? OrderService.formatOrderDate(currentOrder.orderDate)
							: 'তারিখ পাওয়া যায়নি'}
					</p>
				</div>

				{/* CUSTOMER COLUMN */}
				<div className='flex-1 min-w-0 space-y-0.5'>
					<p className='font-bold text-xs sm:text-sm text-[#172033] truncate'>
						{currentOrder?.name || 'অজানা গ্রাহক'}
					</p>
					<p className='text-xs text-[#64748B] font-medium truncate'>
						{currentOrder?.phoneNumber || 'ফোন নম্বর নেই'}
					</p>
				</div>

				{/* TOTAL & DELIVERY CHARGE COLUMN */}
				<div className='flex-1 min-w-0 space-y-0.5'>
					<p className='font-black text-base text-[#26351B] tracking-tight'>
						৳{grandTotal.toFixed(2)}
					</p>
					<div className='flex items-center gap-1.5 text-xs text-[#64748B] font-semibold flex-wrap'>
						<span>{currentOrder?.orderItems?.length || 0}টি আইটেম</span>
						{deliveryCharge > 0 ? (
							<span className='text-[10px] font-extrabold bg-[#FFF9E8] text-[#26351B] px-2 py-0.5 rounded-full border border-[#F5B800]/40 flex items-center gap-1 shadow-2xs'>
								<Truck className='w-3 h-3 text-[#26351B]' /> +৳{deliveryCharge} ডেলিভারি
							</span>
						) : (
							<span className='text-[10px] font-extrabold bg-[#ECFDF5] text-[#16A34A] px-2 py-0.5 rounded-full border border-[#A7F3D0] shadow-2xs'>
								ফ্রি ডেলিভারি
							</span>
						)}
					</div>
				</div>

				{/* ACTION AREA */}
				<div className='flex items-center gap-2 flex-wrap sm:flex-nowrap w-full md:w-auto justify-start md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E7EB]'>
					<OrderInvoice order={currentOrder} />

					<Button
						variant='outline'
						size='sm'
						onClick={() => onViewDetails(currentOrder)}
						className='rounded-xl border-[#E5E7EB] hover:bg-white text-xs font-extrabold h-9 px-3 shrink-0'
					>
						<Eye className='h-3.5 w-3.5 mr-1.5 text-[#26351B]' />
						বিস্তারিত
					</Button>

					<Button
						variant='ghost'
						size='sm'
						onClick={toggleExpand}
						className='h-9 w-9 p-0 rounded-xl hover:bg-black/5 shrink-0 border border-[#E5E7EB]'
						title='স্ট্যাটাস আপডেট করুন'
					>
						{expanded ? (
							<ChevronUp className='h-4 w-4 text-[#172033]' />
						) : (
							<ChevronDown className='h-4 w-4 text-[#172033]' />
						)}
					</Button>
				</div>
			</div>

			{expanded && currentOrder && (
				<div className='px-5 py-4 bg-[#FAFAF6] border-t border-[#E5E7EB]'>
					<OrderStatusUpdate
						order={currentOrder}
						onStatusUpdated={handleStatusUpdated}
					/>
				</div>
			)}
		</div>
	);
}
