'use client';

import { Order } from '@/types/order';
import { OrderService } from '@/services/order-service';
import { OrderStatusBadge } from './order-status-badge';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { OrderItemList } from './order-item-list';
import { Truck, Receipt, ShoppingBag, User, Phone, MapPin, Calendar, Clock } from 'lucide-react';

interface OrderDetailsModalProps {
	order: Order;
	isOpen: boolean;
	onClose: () => void;
}

export function OrderDetailsModal({
	order,
	isOpen,
	onClose,
}: OrderDetailsModalProps) {
	// Calculate totals & delivery charge via OrderService
	const deliveryCharge = OrderService.getOrderDeliveryCharge(order);
	const grandTotal = OrderService.getOrderGrandTotal(order);
	const itemsTotal = (order.orderItems || []).reduce(
		(sum, item) =>
			sum + (Number(item.total) || Number(item.price) * Number(item.quantity)),
		0
	);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto rounded-[24px] p-6 sm:p-7 border-[#E5E7EB] bg-white shadow-2xl'>
				<DialogHeader className='border-b border-[#E5E7EB] pb-4'>
					<div className='flex items-center justify-between'>
						<DialogTitle className='text-xl font-extrabold text-[#172033] flex items-center gap-2.5 tracking-tight'>
							<div className='w-9 h-9 rounded-xl bg-[#FFF9E8] border border-[#F5B800]/40 flex items-center justify-center text-[#26351B]'>
								<ShoppingBag className='w-5 h-5 text-[#26351B]' />
							</div>
							<span>অর্ডার বিস্তারিত</span>
						</DialogTitle>
					</div>
					<DialogDescription className='text-xs font-bold text-[#64748B] pt-1'>
						অর্ডার আইডি: <span className='text-[#172033] font-extrabold'>#{order.id?.substring(0, 8)}</span>
					</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue='details' className='mt-2 space-y-4'>
					<TabsList className='grid w-full grid-cols-2 bg-[#FAFAF6] p-1.5 rounded-2xl border border-[#E5E7EB]'>
						<TabsTrigger
							value='details'
							className='rounded-xl text-xs font-extrabold py-2.5 transition-all data-[state=active]:bg-white data-[state=active]:text-[#172033] data-[state=active]:shadow-xs'
						>
							📋 বিস্তারিত তথ্য
						</TabsTrigger>
						<TabsTrigger
							value='products'
							className='rounded-xl text-xs font-extrabold py-2.5 transition-all data-[state=active]:bg-white data-[state=active]:text-[#172033] data-[state=active]:shadow-xs'
						>
							📦 পণ্য সমূহ ({order.orderItems?.length || 0})
						</TabsTrigger>
					</TabsList>

					{/* Details Tab */}
					<TabsContent value='details' className='space-y-6 pt-1 focus-visible:outline-none'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
							{/* Order Info Card */}
							<div className='bg-[#FAFAF6] p-5 rounded-2xl border border-[#E5E7EB] space-y-3.5 shadow-2xs'>
								<h3 className='font-extrabold text-xs text-[#172033] uppercase tracking-wider border-b border-[#E5E7EB] pb-2 flex items-center gap-1.5'>
									<Clock className='w-3.5 h-3.5 text-[#F5B800]' />
									অর্ডার তথ্য
								</h3>

								<div className='space-y-3 text-xs font-semibold'>
									<div className='flex justify-between items-center'>
										<span className='text-[#64748B] flex items-center gap-1'>
											<Calendar className='w-3.5 h-3.5 text-[#64748B]' /> তারিখ:
										</span>
										<span className='text-[#172033] font-bold'>
											{OrderService.formatOrderDate(order.orderDate)}
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<span className='text-[#64748B]'>আপডেট:</span>
										<span className='text-[#172033] font-bold'>
											{OrderService.formatOrderDate(order.updatedAt)}
										</span>
									</div>

									<div className='flex justify-between items-center pt-1 border-t border-dashed border-[#E5E7EB]'>
										<span className='text-[#64748B]'>অর্ডার স্ট্যাটাস:</span>
										<OrderStatusBadge status={order.orderStatus} size='sm' />
									</div>

									<div className='flex justify-between items-center'>
										<span className='text-[#64748B]'>স্টোর সংখ্যা:</span>
										<span className='text-[#172033] font-extrabold bg-white px-2 py-0.5 rounded border border-[#E5E7EB]'>
											{order.storeCount}টি স্টোর
										</span>
									</div>
								</div>
							</div>

							{/* Customer Info Card */}
							<div className='bg-[#FAFAF6] p-5 rounded-2xl border border-[#E5E7EB] space-y-3.5 shadow-2xs'>
								<h3 className='font-extrabold text-xs text-[#172033] uppercase tracking-wider border-b border-[#E5E7EB] pb-2 flex items-center gap-1.5'>
									<User className='w-3.5 h-3.5 text-[#F5B800]' />
									গ্রাহক তথ্য
								</h3>

								<div className='space-y-3 text-xs font-semibold'>
									<div className='flex justify-between items-center'>
										<span className='text-[#64748B]'>নাম:</span>
										<span className='text-[#172033] font-extrabold'>{order.name}</span>
									</div>

									<div className='flex justify-between items-center'>
										<span className='text-[#64748B] flex items-center gap-1'>
											<Phone className='w-3.5 h-3.5 text-[#64748B]' /> ফোন:
										</span>
										<span className='text-[#172033] font-bold'>{order.phoneNumber}</span>
									</div>

									<div className='space-y-1.5 pt-1 border-t border-dashed border-[#E5E7EB]'>
										<span className='text-[#64748B] flex items-center gap-1'>
											<MapPin className='w-3.5 h-3.5 text-[#64748B]' /> ঠিকানা:
										</span>
										<p className='text-[#172033] font-medium leading-relaxed bg-white p-2.5 rounded-xl border border-[#E5E7EB] shadow-2xs'>
											{order.address}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Order Summary Box */}
						<div className='bg-[#FFF9E8] p-5 rounded-2xl border border-[#F5B800]/40 space-y-3.5 shadow-xs'>
							<h3 className='font-extrabold text-xs text-[#26351B] uppercase tracking-wider flex items-center gap-2 border-b border-[#F5B800]/30 pb-2'>
								<Receipt className='w-4 h-4 text-[#26351B]' />
								অর্ডার সারাংশ (ORDER SUMMARY)
							</h3>

							<div className='space-y-2.5 text-xs font-semibold pt-1'>
								<div className='flex justify-between items-center text-[#64748B]'>
									<span>পণ্যের মোট মূল্য (Subtotal):</span>
									<span className='text-[#172033] font-bold'>৳{itemsTotal.toFixed(2)}</span>
								</div>

								<div className='flex justify-between items-center text-[#26351B]'>
									<span className='flex items-center gap-1.5'>
										<Truck className='w-3.5 h-3.5 text-[#26351B]' />
										ডেলিভারি চার্জ (Delivery Charge):
									</span>
									<span className='font-extrabold bg-white px-2.5 py-0.5 rounded-md border border-[#F5B800]/40 text-xs text-[#26351B] shadow-2xs'>
										{deliveryCharge > 0 ? `৳${deliveryCharge.toFixed(2)}` : 'ফ্রি'}
									</span>
								</div>

								<Separator className='my-2 bg-[#F5B800]/30' />

								<div className='flex justify-between items-center text-sm font-black text-[#172033] pt-1'>
									<span className='text-base'>সর্বমোট (Grand Total):</span>
									<span className='text-2xl text-[#26351B] tracking-tight'>৳{grandTotal.toFixed(2)}</span>
								</div>
							</div>
						</div>
					</TabsContent>

					{/* Products Tab */}
					<TabsContent value='products' className='pt-2 space-y-4 focus-visible:outline-none'>
						<OrderItemList items={order.orderItems} totalAmount={grandTotal} />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}