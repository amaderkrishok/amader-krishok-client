'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/providers/session-provider';
import { OrderService } from '@/services/order-service';
import { Order, OrderStatus } from '@/types/order';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import {
	Package,
	ShoppingCart,
	Clock,
	CheckCircle,
	XCircle,
	Truck,
	ChevronDown,
	ChevronUp,
	MapPin,
	Phone,
	Calendar,
	AlertCircle,
	ShoppingBag,
	User,
	ArrowRight,
	Sprout,
} from 'lucide-react';

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('bn-BD', {
		style: 'currency',
		currency: 'BDT',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	})
		.format(amount)
		.replace('BDT', '৳')
		.trim();
};

const statusConfig: Record<
	OrderStatus,
	{ label: string; icon: typeof Clock; color: string; bgColor: string; borderColor: string }
> = {
	[OrderStatus.PENDING]: {
		label: 'অপেক্ষমান',
		icon: Clock,
		color: 'text-[#B45309]',
		bgColor: 'bg-[#FFF4CC]',
		borderColor: 'border-[#FDE68A]',
	},
	[OrderStatus.CONFIRMED]: {
		label: 'নিশ্চিত',
		icon: CheckCircle,
		color: 'text-blue-700',
		bgColor: 'bg-blue-50',
		borderColor: 'border-blue-100',
	},
	[OrderStatus.DELIVERED]: {
		label: 'ডেলিভারি সম্পন্ন',
		icon: Truck,
		color: 'text-[#15803D]',
		bgColor: 'bg-[#DCFCE7]',
		borderColor: 'border-[#86EFAC]',
	},
	[OrderStatus.CANCELLED]: {
		label: 'বাতিল',
		icon: XCircle,
		color: 'text-red-700',
		bgColor: 'bg-red-50',
		borderColor: 'border-red-100',
	},
};

type FilterStatus = 'ALL' | OrderStatus;

export default function UserOrdersPage() {
	const { user, status: authStatus } = useSession();
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
	const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

	useEffect(() => {
		const fetchOrders = async () => {
			if (!user?.id) return;

			try {
				setLoading(true);
				setError(null);

				const filters: any = {
					page: currentPage,
					limit: 10,
				};

				if (filterStatus !== 'ALL') {
					filters.status = filterStatus;
				}

				const response = await OrderService.getUserOrders(
					user.id,
					filters
				);

				setOrders(response.data || []);
				setTotalPages(response.meta?.totalPages || 1);
			} catch (err) {
				console.error('Error fetching orders:', err);
				setError('অর্ডার লোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
			} finally {
				setLoading(false);
			}
		};

		if (authStatus === 'authenticated' && user?.id) {
			fetchOrders();
		} else if (authStatus === 'unauthenticated') {
			setLoading(false);
		}
	}, [user?.id, authStatus, filterStatus, currentPage]);

	const toggleOrderExpand = (orderId: string) => {
		setExpandedOrder(expandedOrder === orderId ? null : orderId);
	};

	const handleImageError = (itemId: string) => {
		setImageErrors((prev) => ({ ...prev, [itemId]: true }));
	};

	const formatShortOrderId = (id: string) => {
		if (!id) return '#000000';
		const cleanId = id.replace(/-/g, '').substring(0, 7).toLowerCase();
		return `#${cleanId}`;
	};

	return (
		<div className='space-y-6 pb-8'>
			{/* 5. PAGE HEADER (Subtle cream-to-white background card with Gold button) */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#FFF9E8] to-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
				<div className='space-y-1 z-10'>
					<h1 className='text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight'>
						আমার অর্ডার সমূহ
					</h1>
					<p className='text-sm text-[#64748B] font-medium'>
						আপনার সকল অর্ডারের তালিকা ও বিস্তারিত তথ্য
					</p>
				</div>

				<Button asChild className='bg-[#F4B400] hover:bg-[#E5A700] text-[#28321A] font-extrabold rounded-xl px-5 py-2.5 shadow-xs border-0 transition-all hover:-translate-y-0.5 z-10'>
					<Link href='/marketplace'>
						<ShoppingBag className='h-4 w-4 mr-2 text-[#28321A]' />
						🛍 পণ্য কিনুন
					</Link>
				</Button>
			</div>

			{/* 6. ORDER FILTER TABS (Pill tabs) */}
			<div className='flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide pt-1'>
				{(
					[
						'ALL',
						OrderStatus.PENDING,
						OrderStatus.CONFIRMED,
						OrderStatus.DELIVERED,
						OrderStatus.CANCELLED,
					] as FilterStatus[]
				).map((status) => {
					const isActive = filterStatus === status;
					const label =
						status === 'ALL'
							? 'সব'
							: statusConfig[status as OrderStatus]?.label;

					return (
						<button
							key={status}
							onClick={() => {
								setFilterStatus(status);
								setCurrentPage(1);
							}}
							className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
								isActive
									? 'bg-[#28321A] text-white border-[#28321A] shadow-xs scale-102'
									: 'bg-white text-[#111827] border-[#E5E7EB] hover:bg-[#FFF4CC] hover:border-[#F4B400]/40 font-medium'
							}`}
						>
							{isActive && <span className='w-1.5 h-1.5 rounded-full bg-[#F4B400]' />}
							{label}
						</button>
					);
				})}
			</div>

			{/* Error State */}
			{error && (
				<Card className='p-5 border-red-200 bg-red-50 rounded-2xl'>
					<div className='flex items-center gap-3'>
						<AlertCircle className='h-5 w-5 text-red-600' />
						<p className='text-sm font-bold text-red-700'>
							{error}
						</p>
						<Button
							variant='outline'
							size='sm'
							onClick={() => window.location.reload()}
							className='ml-auto rounded-xl border-red-300 text-red-700 font-bold'
						>
							পুনরায় চেষ্টা
						</Button>
					</div>
				</Card>
			)}

			{/* 16. LOADING SKELETON STATE */}
			{loading ? (
				<div className='space-y-4'>
					{[1, 2, 3].map((i) => (
						<Card key={i} className='p-6 bg-white rounded-2xl border border-[#E5E7EB] space-y-4 animate-pulse'>
							<div className='flex items-center justify-between'>
								<div className='space-y-2'>
									<Skeleton className='h-5 w-36 rounded-md' />
									<Skeleton className='h-4 w-48 rounded-md' />
								</div>
								<Skeleton className='h-8 w-24 rounded-full' />
							</div>
							<div className='flex gap-4 pt-2'>
								<Skeleton className='h-16 w-16 rounded-xl' />
								<div className='space-y-2 flex-1'>
									<Skeleton className='h-4 w-3/4' />
									<Skeleton className='h-4 w-1/2' />
								</div>
							</div>
						</Card>
					))}
				</div>
			) : orders.length === 0 ? (
				/* 15. EMPTY STATE (Requirement #15) */
				<Card className='p-12 sm:p-16 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs text-center max-w-lg mx-auto space-y-4'>
					<div className='w-20 h-20 bg-[#FFF4CC] rounded-full flex items-center justify-center mx-auto border border-[#F4B400]/30 shadow-inner'>
						<Package className='h-10 w-10 text-[#28321A]' />
					</div>
					<div className='space-y-1.5'>
						<h3 className='text-xl font-extrabold text-[#111827]'>
							এখনও কোনো অর্ডার নেই
						</h3>
						<p className='text-sm text-[#64748B] font-medium leading-relaxed'>
							আপনার পছন্দের তাজা কৃষিপণ্য খুঁজে অর্ডার করুন।
						</p>
					</div>
					<Button asChild className='bg-[#F4B400] hover:bg-[#E5A700] text-[#28321A] font-bold rounded-xl px-6 shadow-xs border-0 mt-2'>
						<Link href='/marketplace'>
							<ShoppingBag className='h-4 w-4 mr-2 text-[#28321A]' />
							পণ্য দেখুন
						</Link>
					</Button>
				</Card>
			) : (
				/* 7. ORDERS LIST (Requirement #7) */
				<div className='space-y-4'>
					{orders.map((order) => {
						const status =
							statusConfig[order.orderStatus] ||
							statusConfig[OrderStatus.PENDING];
						const StatusIcon = status.icon;
						const isExpanded = expandedOrder === order.id;

						return (
							<Card
								key={order.id}
								className='overflow-hidden bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-all duration-300'
							>
								{/* Order Header (Clickable) */}
								<div
									className='p-5 sm:p-6 cursor-pointer bg-white hover:bg-[#FFF9E8]/30 transition-colors'
									onClick={() => toggleOrderExpand(order.id)}
								>
									<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
										<div className='flex items-start sm:items-center gap-3.5'>
											<div className={`p-2.5 rounded-xl ${status.bgColor} ${status.borderColor} border`}>
												<StatusIcon className={`h-5 w-5 ${status.color}`} />
											</div>
											<div>
												<p className='font-extrabold text-[#28321A] text-base sm:text-lg tracking-tight'>
													🕐 অর্ডার {formatShortOrderId(order.id)}
												</p>
												<div className='flex flex-wrap items-center gap-2 text-xs text-[#64748B] font-medium mt-0.5'>
													<span className='flex items-center gap-1'>
														<Calendar className='h-3.5 w-3.5 text-[#F4B400]' />
														{OrderService.formatOrderDate(order.orderDate)}
													</span>
													<span>• {order.orderItems?.length || 0}টি আইটেম</span>
												</div>
											</div>
										</div>

										<div className='flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100'>
											{/* 8. Status Badge */}
											<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.bgColor} ${status.color} ${status.borderColor}`}>
												{status.label}
											</span>

											<div className='flex items-center gap-3'>
												<p className='text-lg sm:text-xl font-black text-[#111827]'>
													{formatCurrency(Number(order.totalAmount))}
												</p>
												<div className='p-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-500'>
													{isExpanded ? (
														<ChevronUp className='h-4 w-4' />
													) : (
														<ChevronDown className='h-4 w-4' />
													)}
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Expanded Details */}
								{isExpanded && (
									<div className='border-t border-[#E5E7EB] bg-gray-50/50 p-5 sm:p-6 space-y-6'>
										{/* 9. DELIVERY INFORMATION (#FFFDF5 subtle warm background, 3 columns desktop) */}
										<div className='p-5 bg-[#FFFDF5] rounded-2xl border border-[#F4B400]/25 space-y-3 shadow-xs'>
											<h4 className='text-sm font-extrabold text-[#111827] flex items-center gap-2'>
												<MapPin className='h-4 w-4 text-[#28321A]' />
												ডেলিভারি তথ্য
											</h4>
											
											{/* Responsive 3 columns on desktop, stacked on mobile */}
											<div className='grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-semibold text-[#64748B]'>
												<div className='flex items-center gap-2 bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-xs'>
													<User className='h-4 w-4 text-[#F4B400] flex-shrink-0' />
													<span className='text-[#111827] truncate'>{order.name}</span>
												</div>
												<div className='flex items-center gap-2 bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-xs'>
													<Phone className='h-4 w-4 text-[#F4B400] flex-shrink-0' />
													<span className='text-[#111827]'>{order.phoneNumber}</span>
												</div>
												<div className='flex items-center gap-2 bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-xs'>
													<MapPin className='h-4 w-4 text-[#F4B400] flex-shrink-0' />
													<span className='text-[#111827] truncate'>{order.address}</span>
												</div>
											</div>
										</div>

										{/* 10. PRODUCT SECTION */}
										<div className='space-y-3'>
											<h4 className='text-sm font-extrabold text-[#111827] flex items-center gap-2'>
												<Package className='h-4 w-4 text-[#28321A]' />
												অর্ডারের আইটেমসমূহ
											</h4>

											<div className='space-y-2.5'>
												{order.orderItems?.map((item) => {
													const hasError = imageErrors[String(item.id)];
													const rawImg = OrderService.getProductImageUrl(item.productImage);

													return (
														<div
															key={item.id}
															className='flex items-center gap-4 p-3.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs'
														>
															{/* Product Image: 56–72px (w-16 h-16) rounded */}
															<div className='h-16 w-16 rounded-xl overflow-hidden bg-[#FFF9E8] flex-shrink-0 relative border border-[#E5E7EB]'>
																{!hasError && rawImg ? (
																	<Image
																		src={rawImg}
																		alt={item.productName}
																		fill
																		sizes='64px'
																		className='object-cover'
																		onError={() => handleImageError(String(item.id))}
																	/>
																) : (
																	<div className='w-full h-full flex items-center justify-center text-[#28321A]/40'>
																		<Sprout className='w-6 h-6' />
																	</div>
																)}
															</div>

															<div className='flex-1 min-w-0 space-y-0.5'>
																<p className='font-bold text-sm text-[#111827] truncate'>
																	{item.productName}
																</p>
																{item.variantName && (
																	<p className='text-xs text-[#64748B] font-medium'>
																		ভেরিয়েন্ট: {item.variantName}
																	</p>
																)}
																<p className='text-xs text-[#64748B] font-medium'>
																	{formatCurrency(Number(item.price))} × {item.quantity}
																</p>
															</div>

															<p className='font-black text-base text-[#111827] text-right'>
																{formatCurrency(Number(item.total))}
															</p>
														</div>
													);
												})}
											</div>
										</div>

										{/* 11 & 12. TOTAL SECTION & ACTION BUTTON */}
										<div className='pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
											<div className='flex items-baseline gap-2'>
												<span className='text-sm font-extrabold text-[#64748B]'>সর্বমোট পরিশোধযোগ্য:</span>
												<span className='text-2xl font-black text-[#28321A]'>
													{formatCurrency(Number(order.totalAmount))}
												</span>
											</div>

											<Button asChild className='bg-white hover:bg-[#28321A] hover:text-white border-2 border-[#28321A] text-[#28321A] rounded-xl font-bold px-5 py-2.5 transition-all shadow-xs'>
												<Link href={`/order/confirmation/${order.id}`}>
													ইনভয়েস ও বিস্তারিত দেখুন →
												</Link>
											</Button>
										</div>
									</div>
								)}
							</Card>
						);
					})}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className='flex items-center justify-center gap-4 py-4 pt-6'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								className='rounded-xl border-[#E5E7EB] font-bold text-xs'
							>
								পূর্ববর্তী
							</Button>
							<span className='text-xs font-bold text-[#111827]'>
								পৃষ্ঠা {currentPage} / {totalPages}
							</span>
							<Button
								variant='outline'
								size='sm'
								onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
								disabled={currentPage === totalPages}
								className='rounded-xl border-[#E5E7EB] font-bold text-xs'
							>
								পরবর্তী
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}