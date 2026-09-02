'use client';

import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Search, Clock, CheckCircle, XCircle, Package, ArrowRight, Calendar, ShoppingBag } from 'lucide-react';
import { OrderService } from '@/services/order-service';
import { useSession } from '@/components/providers/session-provider';
import { OrderStatus, type Order } from '@/types/order';
import Link from 'next/link';

interface OrderHistoryState {
	orders: Order[];
	isLoading: boolean;
	currentPage: number;
	totalPages: number;
	totalOrders: number;
}

export function OrderHistoryCard() {
	const { user, isAuthenticated } = useSession();
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [sortBy, setSortBy] = useState<string>('recent');

	const [orderHistory, setOrderHistory] = useState<OrderHistoryState>({
		orders: [],
		isLoading: true,
		currentPage: 1,
		totalPages: 1,
		totalOrders: 0,
	});

	// Fetch orders
	useEffect(() => {
		const fetchOrders = async () => {
			if (!isAuthenticated || !user?.id) {
				setOrderHistory((prev) => ({ ...prev, isLoading: false }));
				return;
			}

			try {
				setOrderHistory((prev) => ({ ...prev, isLoading: true }));

				const filters: any = {
					page: orderHistory.currentPage,
					limit: 10,
				};

				if (statusFilter !== 'all') {
					filters.status = statusFilter.toUpperCase();
				}

				const response = await OrderService.getUserOrders(user.id, filters);

				if (response.statusCode === 200 && response.data) {
					let orders = response.data;

					if (searchTerm) {
						orders = orders.filter(
							(order) =>
								order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
								order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
								order.orderItems.some((item) =>
									item.productName
										.toLowerCase()
										.includes(searchTerm.toLowerCase())
								)
						);
					}

					orders = [...orders].sort((a, b) => {
						const dateA = new Date(a.orderDate).getTime();
						const dateB = new Date(b.orderDate).getTime();

						switch (sortBy) {
							case 'recent':
								return dateB - dateA;
							case 'oldest':
								return dateA - dateB;
							default:
								return dateB - dateA;
						}
					});

					setOrderHistory({
						orders,
						isLoading: false,
						currentPage: response.meta?.currentPage || 1,
						totalPages: response.meta?.totalPages || 1,
						totalOrders: response.meta?.totalItems || orders.length,
					});
				} else {
					setOrderHistory({
						orders: [],
						isLoading: false,
						currentPage: 1,
						totalPages: 1,
						totalOrders: 0,
					});
				}
			} catch (error) {
				console.error('Error fetching orders:', error);
				setOrderHistory({
					orders: [],
					isLoading: false,
					currentPage: 1,
					totalPages: 1,
					totalOrders: 0,
				});
			}
		};

		fetchOrders();
	}, [
		isAuthenticated,
		user?.id,
		orderHistory.currentPage,
		statusFilter,
		sortBy,
		searchTerm,
	]);

	const handlePageChange = (page: number) => {
		setOrderHistory((prev) => ({ ...prev, currentPage: page }));
	};

	// Format Order ID to short hash (Requirement #7)
	const formatShortOrderId = (id: string) => {
		if (!id) return '#000000';
		const cleanId = id.replace(/-/g, '').substring(0, 7).toUpperCase();
		return `#${cleanId}`;
	};

	// Get status badge matching Requirement #7
	const getStatusBadge = (status: OrderStatus) => {
		switch (status) {
			case OrderStatus.PENDING:
				return (
					<span className='inline-flex items-center gap-1.5 bg-[#FFF4CC] text-[#B45309] border border-[#FDE68A] px-3 py-1 rounded-full text-xs font-bold shadow-xs'>
						<Clock className='h-3.5 w-3.5 text-[#B45309]' />
						অপেক্ষমান
					</span>
				);
			case OrderStatus.CONFIRMED:
				return (
					<span className='inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold shadow-xs'>
						<Package className='h-3.5 w-3.5 text-blue-700' />
						নিশ্চিত
					</span>
				);
			case OrderStatus.DELIVERED:
				return (
					<span className='inline-flex items-center gap-1.5 bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] px-3 py-1 rounded-full text-xs font-bold shadow-xs'>
						<CheckCircle className='h-3.5 w-3.5 text-[#15803D]' />
						সম্পন্ন
					</span>
				);
			case OrderStatus.CANCELLED:
				return (
					<span className='inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-full text-xs font-bold shadow-xs'>
						<XCircle className='h-3.5 w-3.5 text-red-700' />
						বাতিল
					</span>
				);
			default:
				return (
					<span className='inline-flex items-center gap-1.5 bg-[#FFF9E8] text-[#B45309] border border-[#F4B400]/30 px-3 py-1 rounded-full text-xs font-bold shadow-xs'>
						<Clock className='h-3.5 w-3.5 text-[#B45309]' />
						প্রস্তুত হচ্ছে
					</span>
				);
		}
	};

	const formatCurrency = (amount: string | number) => {
		const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
		return new Intl.NumberFormat('bn-BD', {
			style: 'currency',
			currency: 'BDT',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		})
			.format(numAmount)
			.replace('BDT', '৳')
			.trim();
	};

	const getPrimaryProductName = (order: Order) => {
		if (!order.orderItems || order.orderItems.length === 0) return 'পণ্য তথ্য নেই';
		if (order.orderItems.length === 1) return order.orderItems[0].productName;
		return `${order.orderItems[0].productName} (+আরো ${order.orderItems.length - 1}টি)`;
	};

	if (orderHistory.isLoading) {
		return (
			<Card className='bg-white rounded-3xl border border-[#E5E7EB] shadow-xs p-6 space-y-4 animate-pulse'>
				<div className='flex justify-between items-center'>
					<div className='h-6 w-36 bg-gray-200 rounded-md'></div>
					<div className='h-10 w-48 bg-gray-200 rounded-xl'></div>
				</div>
				<div className='space-y-3 pt-4'>
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className='h-12 w-full bg-gray-100 rounded-xl'></div>
					))}
				</div>
			</Card>
		);
	}

	return (
		<Card className='bg-white rounded-3xl border border-[#E5E7EB] shadow-xs overflow-hidden'>
			<CardHeader className='p-6 sm:p-8 pb-4 border-b border-[#E5E7EB]/60'>
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div>
						<CardTitle className='text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight'>
							সাম্প্রতিক অর্ডার
						</CardTitle>
						<CardDescription className='text-sm text-[#667085] font-medium mt-1'>
							আপনার সর্বশেষ অর্ডারগুলোর অবস্থা দেখুন।
						</CardDescription>
					</div>

					<div className='flex items-center gap-2.5 flex-wrap sm:flex-nowrap'>
						<div className='relative flex-1 sm:w-auto'>
							<Search className='absolute left-3 top-3 h-4 w-4 text-[#667085]' />
							<Input
								type='search'
								placeholder='অর্ডার খুঁজুন...'
								className='pl-9 w-full sm:w-[200px] md:w-[240px] rounded-xl border-[#E5E7EB] focus:border-[#28321A] text-xs sm:text-sm font-medium'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className='w-[130px] rounded-xl border-[#E5E7EB] text-xs font-bold text-[#172033]'>
								<SelectValue placeholder='স্ট্যাটাস' />
							</SelectTrigger>
							<SelectContent className='rounded-xl'>
								<SelectItem value='all'>সব অর্ডার</SelectItem>
								<SelectItem value='pending'>অপেক্ষমান</SelectItem>
								<SelectItem value='confirmed'>নিশ্চিত</SelectItem>
								<SelectItem value='delivered'>সম্পন্ন</SelectItem>
								<SelectItem value='cancelled'>বাতিল</SelectItem>
							</SelectContent>
						</Select>

						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className='w-[130px] rounded-xl border-[#E5E7EB] text-xs font-bold text-[#172033]'>
								<SelectValue placeholder='সাজান' />
							</SelectTrigger>
							<SelectContent className='rounded-xl'>
								<SelectItem value='recent'>নতুন আগে</SelectItem>
								<SelectItem value='oldest'>পুরাতন আগে</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardHeader>

			<CardContent className='p-0'>
				{orderHistory.orders.length > 0 ? (
					<>
						{/* DESKTOP TABLE VIEW */}
						<div className='hidden md:block overflow-x-auto'>
							<Table>
								<TableHeader className='bg-gray-50/70'>
									<TableRow className='hover:bg-transparent border-b border-[#E5E7EB]'>
										<TableHead className='font-bold text-[#172033] pl-6 py-4'>অর্ডার আইডি</TableHead>
										<TableHead className='font-bold text-[#172033] py-4'>তারিখ</TableHead>
										<TableHead className='font-bold text-[#172033] py-4'>পণ্য</TableHead>
										<TableHead className='font-bold text-[#172033] py-4'>মূল্য</TableHead>
										<TableHead className='font-bold text-[#172033] py-4'>স্ট্যাটাস</TableHead>
										<TableHead className='font-bold text-[#172033] text-right pr-6 py-4'>অ্যাকশন</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{orderHistory.orders.map((order) => (
										<TableRow key={order.id} className='hover:bg-[#FFF9E8]/40 transition-colors border-b border-[#E5E7EB]/50'>
											{/* Requirement #7: Shortened Order ID */}
											<TableCell className='font-extrabold text-[#28321A] pl-6 py-4'>
												{formatShortOrderId(order.id)}
											</TableCell>
											<TableCell className='text-xs font-semibold text-[#667085] py-4'>
												{OrderService.formatOrderDate(order.orderDate)}
											</TableCell>
											<TableCell className='font-bold text-[#172033] max-w-[220px] truncate py-4'>
												{getPrimaryProductName(order)}
											</TableCell>
											<TableCell className='font-black text-[#172033] text-base py-4'>
												{formatCurrency(order.totalAmount)}
											</TableCell>
											<TableCell className='py-4'>
												{getStatusBadge(order.orderStatus)}
											</TableCell>
											<TableCell className='text-right pr-6 py-4'>
												<Button
													variant='outline'
													size='sm'
													onClick={() => {
														window.location.href = `/order/confirmation/${order.id}`;
													}}
													className='bg-white hover:bg-[#28321A] hover:text-white border-2 border-[#28321A] text-[#28321A] rounded-xl font-bold px-4 shadow-xs transition-all'
												>
													দেখুন →
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{/* Requirement #8: MOBILE RESPONSIVE CARDS VIEW */}
						<div className='md:hidden p-4 space-y-3'>
							{orderHistory.orders.map((order) => (
								<div
									key={order.id}
									className='bg-white border border-[#E5E7EB] rounded-2xl p-4 space-y-3 shadow-xs hover:border-[#28321A] transition-all'
								>
									<div className='flex items-center justify-between border-b border-gray-100 pb-2.5'>
										<span className='font-extrabold text-[#28321A] text-sm'>
											{formatShortOrderId(order.id)}
										</span>
										{getStatusBadge(order.orderStatus)}
									</div>

									<div className='space-y-1'>
										<p className='font-bold text-sm text-[#172033] line-clamp-1'>
											{getPrimaryProductName(order)}
										</p>
										<p className='text-xs text-[#667085] font-medium flex items-center gap-1'>
											<Calendar className='w-3.5 h-3.5 text-[#F4B400]' />
											{OrderService.formatOrderDate(order.orderDate)}
										</p>
									</div>

									<div className='flex items-center justify-between pt-2 border-t border-gray-100'>
										<span className='font-black text-base text-[#172033]'>
											{formatCurrency(order.totalAmount)}
										</span>
										<Button
											variant='outline'
											size='sm'
											onClick={() => {
												window.location.href = `/order/confirmation/${order.id}`;
											}}
											className='bg-white hover:bg-[#28321A] hover:text-white border-2 border-[#28321A] text-[#28321A] rounded-xl font-bold px-3 py-1 text-xs'
										>
											দেখুন →
										</Button>
									</div>
								</div>
							))}
						</div>
					</>
				) : (
					/* POLISHED EMPTY STATE (Requirement #12) */
					<div className='text-center py-16 px-6 max-w-md mx-auto my-4 space-y-4'>
						<div className='w-20 h-20 bg-[#FFF9E8] rounded-full flex items-center justify-center mx-auto border border-[#F4B400]/30 shadow-inner'>
							<Package className='w-10 h-10 text-[#28321A]' />
						</div>
						<div className='space-y-1.5'>
							<h3 className='text-xl font-bold text-[#172033]'>
								এখনো কোনো অর্ডার নেই
							</h3>
							<p className='text-sm text-[#667085] font-medium leading-relaxed'>
								কৃষকের কাছ থেকে সরাসরি তাজা ও মানসম্মত পণ্য কিনতে শুরু করুন।
							</p>
						</div>
						<Button asChild className='bg-[#F4B400] hover:bg-[#E5A700] text-[#172033] font-bold rounded-xl px-6 shadow-md border-0'>
							<Link href='/marketplace'>
								<ShoppingBag className='w-4 h-4 mr-2' />
								পণ্য দেখুন
							</Link>
						</Button>
					</div>
				)}

				{/* PAGINATION */}
				{orderHistory.totalPages > 1 && (
					<div className='flex items-center justify-between p-4 sm:p-6 border-t border-[#E5E7EB] bg-gray-50/50'>
						<div className='text-xs sm:text-sm font-bold text-[#667085]'>
							মোট {orderHistory.totalOrders} টি অর্ডার
						</div>
						<div className='flex items-center gap-2'>
							<Button
								variant='outline'
								size='sm'
								disabled={orderHistory.currentPage === 1}
								onClick={() => handlePageChange(orderHistory.currentPage - 1)}
								className='rounded-xl border-[#E5E7EB] text-xs font-bold'
							>
								আগের
							</Button>
							<span className='text-xs font-bold text-[#172033] px-2'>
								পৃষ্ঠা {orderHistory.currentPage} / {orderHistory.totalPages}
							</span>
							<Button
								variant='outline'
								size='sm'
								disabled={orderHistory.currentPage === orderHistory.totalPages}
								onClick={() => handlePageChange(orderHistory.currentPage + 1)}
								className='rounded-xl border-[#E5E7EB] text-xs font-bold'
							>
								পরের
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
