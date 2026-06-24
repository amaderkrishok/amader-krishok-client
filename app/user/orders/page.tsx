'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/providers/session-provider';
import { OrderService } from '@/services/order-service';
import { Order, OrderStatus } from '@/types/order';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
	{ label: string; icon: typeof Clock; color: string; bgColor: string }
> = {
	[OrderStatus.PENDING]: {
		label: 'অপেক্ষমান',
		icon: Clock,
		color: 'text-yellow-700 dark:text-yellow-400',
		bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
	},
	[OrderStatus.CONFIRMED]: {
		label: 'নিশ্চিত',
		icon: CheckCircle,
		color: 'text-blue-700 dark:text-blue-400',
		bgColor: 'bg-blue-100 dark:bg-blue-900/30',
	},
	[OrderStatus.DELIVERED]: {
		label: 'ডেলিভারি সম্পন্ন',
		icon: Truck,
		color: 'text-green-700 dark:text-green-400',
		bgColor: 'bg-green-100 dark:bg-green-900/30',
	},
	[OrderStatus.CANCELLED]: {
		label: 'বাতিল',
		icon: XCircle,
		color: 'text-red-700 dark:text-red-400',
		bgColor: 'bg-red-100 dark:bg-red-900/30',
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

	// Count by status
	const orderCounts = {
		ALL: orders.length,
		[OrderStatus.PENDING]: orders.filter(
			(o) => o.orderStatus === OrderStatus.PENDING
		).length,
		[OrderStatus.CONFIRMED]: orders.filter(
			(o) => o.orderStatus === OrderStatus.CONFIRMED
		).length,
		[OrderStatus.DELIVERED]: orders.filter(
			(o) => o.orderStatus === OrderStatus.DELIVERED
		).length,
		[OrderStatus.CANCELLED]: orders.filter(
			(o) => o.orderStatus === OrderStatus.CANCELLED
		).length,
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold dark:text-white'>
						আমার অর্ডার সমূহ
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						আপনার সমস্ত অর্ডারের তালিকা ও বিস্তারিত
					</p>
				</div>
				<Button asChild>
					<Link href='/marketplace'>
						<ShoppingBag className='h-4 w-4 mr-2' />
						শপিং করুন
					</Link>
				</Button>
			</div>

			{/* Filter Tabs */}
			<div className='flex flex-wrap gap-2'>
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
						<Button
							key={status}
							variant={isActive ? 'default' : 'outline'}
							size='sm'
							onClick={() => {
								setFilterStatus(status);
								setCurrentPage(1);
							}}
							className='rounded-full'
						>
							{label}
						</Button>
					);
				})}
			</div>

			{/* Error State */}
			{error && (
				<Card className='p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'>
					<div className='flex items-center gap-3'>
						<AlertCircle className='h-5 w-5 text-red-500' />
						<p className='text-red-700 dark:text-red-400'>
							{error}
						</p>
						<Button
							variant='outline'
							size='sm'
							onClick={() => window.location.reload()}
							className='ml-auto'
						>
							পুনরায় চেষ্টা
						</Button>
					</div>
				</Card>
			)}

			{/* Loading State */}
			{loading ? (
				<div className='space-y-4'>
					{[1, 2, 3].map((i) => (
						<Card key={i} className='p-6'>
							<div className='flex items-center justify-between'>
								<div className='space-y-2'>
									<Skeleton className='h-5 w-32' />
									<Skeleton className='h-4 w-48' />
								</div>
								<Skeleton className='h-8 w-24 rounded-full' />
							</div>
							<div className='mt-4 flex gap-4'>
								<Skeleton className='h-16 w-16 rounded-md' />
								<div className='space-y-2 flex-1'>
									<Skeleton className='h-4 w-3/4' />
									<Skeleton className='h-4 w-1/2' />
								</div>
							</div>
						</Card>
					))}
				</div>
			) : orders.length === 0 ? (
				/* Empty State */
				<Card className='p-12'>
					<div className='text-center'>
						<ShoppingCart className='h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600' />
						<h3 className='text-xl font-semibold mb-2 dark:text-white'>
							{filterStatus === 'ALL'
								? 'এখনো কোন অর্ডার নেই'
								: 'এই ক্যাটাগরিতে কোন অর্ডার নেই'}
						</h3>
						<p className='text-gray-500 dark:text-gray-400 mb-6'>
							{filterStatus === 'ALL'
								? 'আমাদের মার্কেটপ্লেস থেকে পণ্য কিনতে শুরু করুন!'
								: 'অন্য ফিল্টার চেষ্টা করুন'}
						</p>
						{filterStatus === 'ALL' && (
							<Button asChild>
								<Link href='/marketplace'>
									<ShoppingBag className='h-4 w-4 mr-2' />
									মার্কেটপ্লেসে যান
								</Link>
							</Button>
						)}
					</div>
				</Card>
			) : (
				/* Orders List */
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
								className='overflow-hidden dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow'
							>
								{/* Order Header */}
								<div
									className='p-4 sm:p-6 cursor-pointer'
									onClick={() =>
										toggleOrderExpand(order.id)
									}
								>
									<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
										<div className='flex items-start sm:items-center gap-3'>
											<div
												className={`p-2 rounded-full ${status.bgColor}`}
											>
												<StatusIcon
													className={`h-5 w-5 ${status.color}`}
												/>
											</div>
											<div>
												<p className='font-semibold dark:text-white'>
													অর্ডার #
													{order.id.substring(0, 8)}
												</p>
												<div className='flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1'>
													<span className='flex items-center gap-1'>
														<Calendar className='h-3 w-3' />
														{OrderService.formatOrderDate(
															order.orderDate
														)}
													</span>
													<span>
														•{' '}
														{order.orderItems
															?.length || 0}{' '}
														টি আইটেম
													</span>
												</div>
											</div>
										</div>
										<div className='flex items-center gap-3'>
											<Badge
												className={`${status.bgColor} ${status.color} border-0`}
											>
												{status.label}
											</Badge>
											<p className='text-lg font-bold dark:text-white'>
												{formatCurrency(
													Number(order.totalAmount)
												)}
											</p>
											{isExpanded ? (
												<ChevronUp className='h-5 w-5 text-gray-400' />
											) : (
												<ChevronDown className='h-5 w-5 text-gray-400' />
											)}
										</div>
									</div>
								</div>

								{/* Expanded Order Details */}
								{isExpanded && (
									<div className='border-t dark:border-gray-700'>
										{/* Delivery Info */}
										<div className='px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900/50'>
											<h4 className='text-sm font-semibold mb-2 dark:text-gray-300'>
												ডেলিভারি তথ্য
											</h4>
											<div className='grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm'>
												<div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
													<Package className='h-4 w-4' />
													<span>{order.name}</span>
												</div>
												<div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
													<Phone className='h-4 w-4' />
													<span>
														{order.phoneNumber}
													</span>
												</div>
												<div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
													<MapPin className='h-4 w-4' />
													<span>
														{order.address}
													</span>
												</div>
											</div>
										</div>

										{/* Order Items */}
										<div className='px-4 sm:px-6 py-4'>
											<h4 className='text-sm font-semibold mb-3 dark:text-gray-300'>
												অর্ডার আইটেম
											</h4>
											<div className='space-y-3'>
												{order.orderItems?.map(
													(item) => (
														<div
															key={item.id}
															className='flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30'
														>
															<div className='h-14 w-14 rounded-md overflow-hidden bg-white dark:bg-gray-700 flex-shrink-0 relative'>
																<Image
																	src={
																		OrderService.getProductImageUrl(
																			item.productImage
																		) ||
																		'/placeholder.svg'
																	}
																	alt={
																		item.productName
																	}
																	fill
																	sizes='56px'
																	className='object-cover'
																/>
															</div>
															<div className='flex-1 min-w-0'>
																<p className='font-medium dark:text-white truncate'>
																	{
																		item.productName
																	}
																</p>
																{item.variantName && (
																	<p className='text-xs text-gray-500 dark:text-gray-400'>
																		ভেরিয়েন্ট:{' '}
																		{
																			item.variantName
																		}
																	</p>
																)}
																<p className='text-xs text-gray-500 dark:text-gray-400'>
																	{formatCurrency(
																		Number(
																			item.price
																		)
																	)}{' '}
																	×{' '}
																	{
																		item.quantity
																	}
																</p>
															</div>
															<p className='font-semibold dark:text-white'>
																{formatCurrency(
																	Number(
																		item.total
																	)
																)}
															</p>
														</div>
													)
												)}
											</div>

											{/* Total */}
											<div className='mt-4 pt-3 border-t dark:border-gray-700 flex justify-between items-center'>
												<span className='font-medium dark:text-gray-300'>
													সর্বমোট
												</span>
												<span className='text-xl font-bold dark:text-white'>
													{formatCurrency(
														Number(
															order.totalAmount
														)
													)}
												</span>
											</div>
										</div>
									</div>
								)}
							</Card>
						);
					})}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className='flex items-center justify-center gap-4 py-4'>
							<Button
								variant='outline'
								size='sm'
								onClick={() =>
									setCurrentPage((p) => Math.max(1, p - 1))
								}
								disabled={currentPage === 1}
							>
								পূর্ববর্তী
							</Button>
							<span className='text-sm text-gray-500 dark:text-gray-400'>
								পৃষ্ঠা {currentPage} / {totalPages}
							</span>
							<Button
								variant='outline'
								size='sm'
								onClick={() =>
									setCurrentPage((p) =>
										Math.min(totalPages, p + 1)
									)
								}
								disabled={currentPage === totalPages}
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