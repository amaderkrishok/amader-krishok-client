'use client';

import { OrderItem } from '@/types/order';
import { OrderService } from '@/services/order-service';
import { Truck, Package } from 'lucide-react';

interface OrderItemListProps {
	items: OrderItem[];
	totalAmount?: number | string;
}

export function OrderItemList({ items, totalAmount }: OrderItemListProps) {
	if (!items || items.length === 0) {
		return (
			<div className='text-center py-8 bg-[#FAFAF6] rounded-2xl border border-[#E5E7EB]'>
				<Package className='w-8 h-8 text-[#64748B]/40 mx-auto mb-2' />
				<p className='text-xs font-bold text-[#64748B]'>কোনো পণ্য পাওয়া যায়নি</p>
			</div>
		);
	}

	const itemsTotal = items.reduce(
		(sum, item) =>
			sum + (Number(item.total) || Number(item.price) * Number(item.quantity)),
		0
	);

	const grandTotal = totalAmount != null ? Number(totalAmount) : itemsTotal;
	const deliveryCharge = Math.max(0, grandTotal - itemsTotal);

	return (
		<div className='space-y-4'>
			<div className='divide-y divide-[#E5E7EB] bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs'>
				{items.map((item) => (
					<div
						key={item.id}
						className='flex items-center gap-3.5 p-4 hover:bg-[#FFF9E8]/40 transition-colors'
					>
						<div className='h-14 w-14 rounded-xl bg-gray-100 border border-[#E5E7EB] overflow-hidden flex-shrink-0 relative'>
							<img
								src={OrderService.getProductImageUrl(item.productImage)}
								alt={item.productName}
								className='h-full w-full object-cover'
							/>
						</div>

						<div className='flex-1 min-w-0 space-y-1'>
							<h4 className='font-extrabold text-xs sm:text-sm text-[#172033] truncate'>
								{item.productName}
							</h4>

							{item.variantName && (
								<span className='inline-block text-[11px] text-[#26351B] font-bold bg-[#FAFAF6] px-2 py-0.5 rounded-md border border-[#E5E7EB]'>
									ভেরিয়েন্ট: {item.variantName}
								</span>
							)}

							<div className='flex justify-between items-center text-xs pt-0.5'>
								<span className='text-[#64748B] font-medium'>
									৳{item.price} × {item.quantity}
								</span>
								<span className='font-black text-[#172033]'>
									৳{(Number(item.total) || Number(item.price) * item.quantity).toFixed(2)}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Subtotal & Delivery Charge Summary */}
			<div className='bg-[#FFF9E8] p-4 rounded-2xl border border-[#F5B800]/40 space-y-2 text-xs font-semibold shadow-xs'>
				<div className='flex justify-between items-center text-[#64748B]'>
					<span>পণ্যের বিবরণ মোট (Subtotal):</span>
					<span className='text-[#172033] font-bold'>৳{itemsTotal.toFixed(2)}</span>
				</div>

				<div className='flex justify-between items-center text-[#26351B]'>
					<span className='flex items-center gap-1.5'>
						<Truck className='w-3.5 h-3.5 text-[#26351B]' />
						ডেলিভারি চার্জ (Delivery Charge):
					</span>
					<span className='font-bold bg-white px-2 py-0.5 rounded-md border border-[#F5B800]/30 text-xs'>
						{deliveryCharge > 0 ? `৳${deliveryCharge.toFixed(2)}` : 'ফ্রি'}
					</span>
				</div>

				<div className='pt-2 border-t border-[#F5B800]/30 flex justify-between items-center text-sm font-black text-[#172033]'>
					<span>সর্বমোট (Total):</span>
					<span className='text-base text-[#26351B]'>৳{grandTotal.toFixed(2)}</span>
				</div>
			</div>
		</div>
	);
}