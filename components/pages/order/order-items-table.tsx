import { OrderItem } from '@/types/order';
import Image from 'next/image';
import React from 'react';
import { ShoppingBag, Truck, Receipt } from 'lucide-react';
import { formatPrice } from '../marketplace/cart/cart-drawer';

interface OrderItemsTableProps {
	items: OrderItem[];
	totalAmount: string;
}

export function OrderItemsTable({ items, totalAmount }: OrderItemsTableProps) {
	// Calculate Subtotal from items
	const itemsSubtotal = items.reduce(
		(acc, item) => acc + (Number(item.total) || Number(item.price) * item.quantity),
		0
	);

	// Calculate Delivery Charge from item details if available, or default
	let calculatedDeliveryCharge = 0;
	let hasExplicitDeliveryCharge = false;

	items.forEach((item) => {
		if (item.productDetails?.deliveryCharge != null) {
			calculatedDeliveryCharge += Number(item.productDetails.deliveryCharge);
			hasExplicitDeliveryCharge = true;
		}
	});

	if (!hasExplicitDeliveryCharge && itemsSubtotal > 0) {
		calculatedDeliveryCharge = 90; // Default standard delivery fee
	}

	const grandTotal = itemsSubtotal + calculatedDeliveryCharge;

	return (
		<div className='bg-white p-6 sm:p-8 rounded-[24px] border border-[#E5E7EB] shadow-xs mb-8 space-y-6'>
			<div className='border-b border-[#E5E7EB] pb-4 flex items-center justify-between'>
				<h2 className='text-lg font-extrabold text-[#28321A] flex items-center gap-2'>
					<ShoppingBag className='w-5 h-5 text-[#28321A]' />
					<span>আপনার অর্ডারের পণ্যসমূহ</span>
				</h2>
				<span className='text-xs font-bold px-3 py-1 rounded-full bg-[#FFF4CC] text-[#28321A] border border-[#F4B400]/30'>
					{items.length} টি পণ্য
				</span>
			</div>

			{/* Desktop Table View */}
			<div className='hidden md:block overflow-hidden border border-[#E5E7EB] rounded-[18px]'>
				<table className='w-full text-left border-collapse'>
					<thead className='bg-[#F7F9F5] border-b border-[#E5E7EB] text-xs font-bold text-[#64748B] uppercase tracking-wider'>
						<tr>
							<th scope='col' className='py-3.5 px-5'>পণ্য</th>
							<th scope='col' className='py-3.5 px-4 text-center'>পরিমাণ</th>
							<th scope='col' className='py-3.5 px-5 text-right'>একক মূল্য</th>
							<th scope='col' className='py-3.5 px-5 text-right'>মোট মূল্য</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-100 bg-white text-sm'>
						{items.map((item) => {
							const unitPrice = Number(item.price);
							const itemTotal = Number(item.total) || unitPrice * item.quantity;

							return (
								<tr key={item.id} className='hover:bg-[#F7F9F5]/60 transition-colors group'>
									<td className='py-4 px-5'>
										<div className='flex items-center gap-4'>
											<div className='w-14 h-14 rounded-[14px] overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300'>
												<Image
													src={item.productImage || '/images/product-placeholder.png'}
													alt={item.productName}
													fill
													sizes='56px'
													className='object-cover'
												/>
											</div>
											<div>
												<h4 className='font-bold text-[#172033] text-sm group-hover:text-[#28321A] transition-colors'>
													{item.productName}
												</h4>
												{item.variantName && (
													<p className='text-xs text-[#64748B] mt-0.5'>
														ভেরিয়েন্ট: {item.variantName}
													</p>
												)}
											</div>
										</div>
									</td>
									<td className='py-4 px-4 text-center font-bold text-[#172033]'>
										{item.quantity}
									</td>
									<td className='py-4 px-5 text-right text-[#64748B]'>
										{formatPrice(unitPrice)}
									</td>
									<td className='py-4 px-5 text-right font-extrabold text-[#28321A]'>
										{formatPrice(itemTotal)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Mobile List View */}
			<div className='md:hidden space-y-3'>
				{items.map((item) => {
					const unitPrice = Number(item.price);
					const itemTotal = Number(item.total) || unitPrice * item.quantity;

					return (
						<div key={item.id} className='p-4 rounded-[16px] border border-[#E5E7EB] bg-white space-y-3'>
							<div className='flex gap-3.5 items-center'>
								<div className='w-14 h-14 rounded-[14px] overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 relative'>
									<Image
										src={item.productImage || '/images/product-placeholder.png'}
										alt={item.productName}
										fill
										sizes='56px'
										className='object-cover'
									/>
								</div>
								<div className='flex-1 min-w-0'>
									<h4 className='font-bold text-sm text-[#172033] truncate'>
										{item.productName}
									</h4>
									{item.variantName && (
										<p className='text-xs text-[#64748B] mt-0.5'>
											ভেরিয়েন্ট: {item.variantName}
										</p>
									)}
								</div>
							</div>

							<div className='flex items-center justify-between text-xs pt-2 border-t border-dashed border-gray-100'>
								<div className='text-[#64748B]'>
									{formatPrice(unitPrice)} × {item.quantity}
								</div>
								<div className='font-bold text-sm text-[#28321A]'>
									{formatPrice(itemTotal)}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Price Breakdown / Order Summary Box */}
			<div className='bg-[#FFF9E8] border border-[#F4B400]/30 rounded-[20px] p-5 sm:p-6 space-y-3.5'>
				<div className='flex items-center gap-2 border-b border-[#F4B400]/20 pb-2 text-xs font-bold text-[#28321A] uppercase tracking-wide'>
					<Receipt className='w-4 h-4 text-[#28321A]' />
					<span>মূল্য হিসেব</span>
				</div>

				<div className='space-y-2.5 text-xs text-[#64748B]'>
					<div className='flex justify-between items-center'>
						<span>পণ্যের মূল্য</span>
						<span className='font-bold text-[#172033]'>{formatPrice(itemsSubtotal)}</span>
					</div>

					<div className='flex justify-between items-center'>
						<span className='flex items-center gap-1.5'>
							<Truck className='w-3.5 h-3.5 text-[#28321A]' />
							ডেলিভারি চার্জ
						</span>
						<span className='font-bold text-[#28321A]'>
							{calculatedDeliveryCharge > 0 ? formatPrice(calculatedDeliveryCharge) : 'ফ্রি'}
						</span>
					</div>

					<div className='h-px bg-[#F4B400]/20 my-2'></div>

					<div className='flex justify-between items-center text-sm pt-1'>
						<span className='font-extrabold text-[#172033] text-base'>সর্বমোট</span>
						<span className='font-black text-2xl text-[#28321A]'>{formatPrice(grandTotal)}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
