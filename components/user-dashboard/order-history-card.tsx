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
import { Search, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { OrderService } from '@/services/order-service';
import { useSession } from '@/components/providers/session-provider';
import { OrderStatus, type Order } from '@/types/order';

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

				// Build filters
				const filters: any = {
					page: orderHistory.currentPage,
					limit: 10,
				};

				// Add status filter if not 'all'
				if (statusFilter !== 'all') {
					filters.status = statusFilter.toUpperCase();
				}

				const response = await OrderService.getUserOrders(user.id, filters);

				if (response.statusCode === 200 && response.data) {
					let orders = response.data;

					// Apply search filter on frontend (since API might not support it)
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

					// Apply sorting
					orders = [...orders].sort((a, b) => {
						const dateA = new Date(a.orderDate).getTime();
						const dateB = new Date(b.orderDate).getTime();

						switch (sortBy) {
							case 'recent':
								return dateB - dateA; // Newest first
							case 'oldest':
								return dateA - dateB; // Oldest first
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

	// Handle pagination
	const handlePageChange = (page: number) => {
		setOrderHistory((prev) => ({ ...prev, currentPage: page }));
	};

	// Get status badge
	const getStatusBadge = (status: OrderStatus) => {
		const statusInfo = OrderService.getOrderStatusInfo(status);

		const getIcon = () => {
			switch (status) {
				case OrderStatus.PENDING:
					return <Clock className='h-3 w-3' />;
				case OrderStatus.CONFIRMED:
					return <Package className='h-3 w-3' />;
				case OrderStatus.DELIVERED:
					return <CheckCircle className='h-3 w-3' />;
				case OrderStatus.CANCELLED:
					return <XCircle className='h-3 w-3' />;
				default:
					return null;
			}
		};

		return (
			<Badge
				variant='outline'
				className={`flex items-center gap-1 w-fit ${statusInfo.color} ${statusInfo.textColor}`}
			>
				{getIcon()}
				{statusInfo.label}
			</Badge>
		);
	};

	// Format currency
	const formatCurrency = (amount: string | number) => {
		const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
		return new Intl.NumberFormat('bn-BD', {
			style: 'currency',
			currency: 'BDT',
			minimumFractionDigits: 0,
		}).format(numAmount);
	};

	// Get primary product name for display
	const getPrimaryProductName = (order: Order) => {
		if (order.orderItems.length === 0) return 'No items';
		if (order.orderItems.length === 1) return order.orderItems[0].productName;
		return `${order.orderItems[0].productName} +${
			order.orderItems.length - 1
		} more`;
	};

	// Loading skeleton
	if (orderHistory.isLoading) {
		return (
			<Card>
				<CardHeader>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
						<div>
							<div className='h-6 w-32 bg-gray-200 rounded animate-pulse mb-2'></div>
							<div className='h-4 w-48 bg-gray-200 rounded animate-pulse'></div>
						</div>
						<div className='flex items-center gap-2'>
							<div className='h-10 w-64 bg-gray-200 rounded animate-pulse'></div>
							<div className='h-10 w-32 bg-gray-200 rounded animate-pulse'></div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className='rounded-md border'>
						<div className='p-4 space-y-4'>
							{[...Array(5)].map((_, i) => (
								<div key={i} className='flex justify-between items-center'>
									<div className='flex-1 space-y-2'>
										<div className='h-4 w-24 bg-gray-200 rounded animate-pulse'></div>
										<div className='h-4 w-32 bg-gray-200 rounded animate-pulse'></div>
									</div>
									<div className='h-4 w-16 bg-gray-200 rounded animate-pulse'></div>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div>
						<CardTitle>অর্ডার ইতিহাস</CardTitle>
						<CardDescription>
							আপনার সকল পূর্ববর্তী অর্ডার এবং তাদের বিস্তারিত দেখুন
						</CardDescription>
					</div>
					<div className='flex items-center gap-2'>
						<div className='relative'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='অর্ডার খুঁজুন...'
								className='pl-8 w-[200px] md:w-[250px]'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className='w-[130px]'>
								<SelectValue placeholder='স্ট্যাটাস' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>সব অর্ডার</SelectItem>
								<SelectItem value='pending'>অপেক্ষমান</SelectItem>
								<SelectItem value='confirmed'>নিশ্চিত</SelectItem>
								<SelectItem value='delivered'>ডেলিভারি</SelectItem>
								<SelectItem value='cancelled'>বাতিল</SelectItem>
							</SelectContent>
						</Select>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className='w-[130px]'>
								<SelectValue placeholder='সাজান' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='recent'>নতুন আগে</SelectItem>
								<SelectItem value='oldest'>পুরাতন আগে</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>অর্ডার আইডি</TableHead>
								<TableHead>তারিখ</TableHead>
								<TableHead className='hidden md:table-cell'>পণ্য</TableHead>
								<TableHead>মূল্য</TableHead>
								<TableHead className='hidden md:table-cell'>
									স্ট্যাটাস
								</TableHead>
								<TableHead className='text-right'>অ্যাকশন</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orderHistory.orders.length > 0 ? (
								orderHistory.orders.map((order) => (
									<TableRow key={order.id}>
										<TableCell className='font-medium'>{order.id}</TableCell>
										<TableCell>
											{OrderService.formatOrderDate(order.orderDate)}
										</TableCell>
										<TableCell className='hidden md:table-cell max-w-[200px] truncate'>
											{getPrimaryProductName(order)}
										</TableCell>
										<TableCell>{formatCurrency(order.totalAmount)}</TableCell>
										<TableCell className='hidden md:table-cell'>
											{getStatusBadge(order.orderStatus)}
										</TableCell>
										<TableCell className='text-right'>
											<Button
												variant='outline'
												size='sm'
												onClick={() => {
													window.location.href = `/order/confirmation/${order.id}`;
												}}
											>
												দেখুন
											</Button>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={6} className='text-center py-6'>
										{searchTerm || statusFilter !== 'all'
											? 'আপনার অনুসন্ধানের সাথে কোন অর্ডার পাওয়া যায়নি।'
											: 'এখনও কোন অর্ডার নেই।'}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{/* Pagination */}
				{orderHistory.totalPages > 1 && (
					<div className='flex items-center justify-between mt-4'>
						<div className='text-sm text-muted-foreground'>
							মোট {orderHistory.totalOrders} টি অর্ডার
						</div>
						<div className='flex items-center gap-2'>
							<Button
								variant='outline'
								size='sm'
								disabled={orderHistory.currentPage === 1}
								onClick={() => handlePageChange(orderHistory.currentPage - 1)}
							>
								আগের
							</Button>
							<span className='text-sm'>
								পৃষ্ঠা {orderHistory.currentPage} / {orderHistory.totalPages}
							</span>
							<Button
								variant='outline'
								size='sm'
								disabled={orderHistory.currentPage === orderHistory.totalPages}
								onClick={() => handlePageChange(orderHistory.currentPage + 1)}
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
