'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Package, CreditCard } from 'lucide-react';
import { OrderService } from '@/services/order-service';
import { useSession } from '@/components/providers/session-provider';
import { OrderStatus, type Order } from '@/types/order';

interface OrderStats {
	totalOrders: number;
	activeOrders: number;
	totalSpent: number;
	isLoading: boolean;
}

export function StatsCards() {
	const { user, isAuthenticated } = useSession();
	const [stats, setStats] = useState<OrderStats>({
		totalOrders: 0,
		activeOrders: 0,
		totalSpent: 0,
		isLoading: true,
	});

	useEffect(() => {
		const fetchOrderStats = async () => {
			if (!isAuthenticated || !user?.id) {
				setStats((prev) => ({ ...prev, isLoading: false }));
				return;
			}

			try {
				setStats((prev) => ({ ...prev, isLoading: true }));

				// Fetch user orders
				const response = await OrderService.getUserOrders(user.id, {
					limit: 1000, // Get all orders to calculate stats
				});

				if (response.statusCode === 200 && response.data) {
					const orders: Order[] = response.data;

					// Calculate total orders
					const totalOrders = orders.length;

					// Calculate active orders (pending + confirmed)
					const activeOrders = orders.filter(
						(order) =>
							order.orderStatus === OrderStatus.PENDING ||
							order.orderStatus === OrderStatus.CONFIRMED
					).length;

					// Calculate total spent (sum of all order totals)
					const totalSpent = orders.reduce((sum, order) => {
						// Convert string to number if needed
						const amount =
							typeof order.totalAmount === 'string'
								? parseFloat(order.totalAmount)
								: order.totalAmount;
						return sum + (amount || 0);
					}, 0);

					setStats({
						totalOrders,
						activeOrders,
						totalSpent,
						isLoading: false,
					});
				} else {
					setStats({
						totalOrders: 0,
						activeOrders: 0,
						totalSpent: 0,
						isLoading: false,
					});
				}
			} catch (error) {
				console.error('Error fetching order stats:', error);
				setStats({
					totalOrders: 0,
					activeOrders: 0,
					totalSpent: 0,
					isLoading: false,
				});
			}
		};

		fetchOrderStats();
	}, [isAuthenticated, user?.id]);

	// Format currency for display
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('bn-BD', {
			style: 'currency',
			currency: 'BDT',
			minimumFractionDigits: 0,
		}).format(amount);
	};

	// Show loading state
	if (stats.isLoading) {
		return (
			<>
				{[1, 2, 3].map((i) => (
					<Card key={i}>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<div className='h-4 w-20 bg-gray-200 rounded animate-pulse'></div>
							<div className='h-4 w-4 bg-gray-200 rounded animate-pulse'></div>
						</CardHeader>
						<CardContent>
							<div className='h-8 w-16 bg-gray-200 rounded animate-pulse mb-2'></div>
							<div className='h-3 w-24 bg-gray-200 rounded animate-pulse'></div>
						</CardContent>
					</Card>
				))}
			</>
		);
	}

	return (
		<>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>মোট অর্ডার</CardTitle>
					<ShoppingBag className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{stats.totalOrders}</div>
					<p className='text-xs text-muted-foreground'>সর্বমোট অর্ডার সংখ্যা</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>সক্রিয় অর্ডার</CardTitle>
					<Package className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{stats.activeOrders}</div>
					<p className='text-xs text-muted-foreground'>
						প্রক্রিয়াধীন ও নিশ্চিত অর্ডার
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>মোট খরচ</CardTitle>
					<CreditCard className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>
						{formatCurrency(stats.totalSpent)}
					</div>
					<p className='text-xs text-muted-foreground'>
						সর্বমোট ক্রয়ের পরিমাণ
					</p>
				</CardContent>
			</Card>
		</>
	);
}
