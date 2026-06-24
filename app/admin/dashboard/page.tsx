'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { OrderService } from '@/services/order-service';
import { UserService } from '@/services/user-service';
import { StoreService } from '@/services/store-service';
import { ProductService } from '@/services/product-service';
import { Order, OrderStatus } from '@/types/order';
import Link from 'next/link';
import Image from 'next/image';
import {
	Users,
	ShoppingCart,
	Store,
	Package,
	TrendingUp,
	AlertCircle,
	MoveRight,
	Coins,
	Clock,
	CheckCircle,
	XCircle,
	Truck,
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

interface DashboardStats {
	totalOrders: number;
	totalUsers: number;
	totalStores: number;
	totalProducts: number;
	pendingOrders: number;
	confirmedOrders: number;
	deliveredOrders: number;
	cancelledOrders: number;
	totalRevenue: number;
	todayRevenue: number;
	weekRevenue: number;
	monthRevenue: number;
}

export default function AdminDashboardPage() {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<DashboardStats>({
		totalOrders: 0,
		totalUsers: 0,
		totalStores: 0,
		totalProducts: 0,
		pendingOrders: 0,
		confirmedOrders: 0,
		deliveredOrders: 0,
		cancelledOrders: 0,
		totalRevenue: 0,
		todayRevenue: 0,
		weekRevenue: 0,
		monthRevenue: 0,
	});
	const [recentOrders, setRecentOrders] = useState<Order[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				setError(null);

				// Fetch all data in parallel for speed
				const [ordersRes, usersRes, storesRes, productsRes] =
					await Promise.allSettled([
						OrderService.getAllOrders({ limit: 100 }),
						UserService.getUsers({ page: 1, limit: 1, isBlocked: null }),
						StoreService.getStores({ page: 1, limit: 1 }),
						ProductService.getProducts({ page: 1, limit: 1 }),
					]);

				// Extract totals from meta - handle various response shapes
				const orders =
					ordersRes.status === 'fulfilled' ? ordersRes.value : null;
				const usersData =
					usersRes.status === 'fulfilled' ? usersRes.value : null;
				const storesData =
					storesRes.status === 'fulfilled' ? storesRes.value : null;
				const productsData =
					productsRes.status === 'fulfilled' ? productsRes.value : null;

				const allOrders = orders?.data || [];
				setRecentOrders(allOrders.slice(0, 8));

				// Helper: extract totalItems from various response shapes
				const getTotalItems = (res: any): number => {
					return res?.meta?.totalItems 
						|| res?.data?.meta?.totalItems 
						|| res?.data?.length 
						|| 0;
				};

				// Calculate order stats
				const pendingOrders = allOrders.filter(
					(o: Order) => o.orderStatus === OrderStatus.PENDING
				).length;
				const confirmedOrders = allOrders.filter(
					(o: Order) => o.orderStatus === OrderStatus.CONFIRMED
				).length;
				const deliveredOrders = allOrders.filter(
					(o: Order) => o.orderStatus === OrderStatus.DELIVERED
				).length;
				const cancelledOrders = allOrders.filter(
					(o: Order) => o.orderStatus === OrderStatus.CANCELLED
				).length;

				const totalRevenue = allOrders.reduce(
					(sum: number, o: Order) => sum + Number(o.totalAmount),
					0
				);

				// Calculate time-based revenue
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const weekStart = new Date();
				weekStart.setDate(weekStart.getDate() - weekStart.getDay());
				weekStart.setHours(0, 0, 0, 0);
				const monthStart = new Date();
				monthStart.setDate(1);
				monthStart.setHours(0, 0, 0, 0);

				const todayRevenue = allOrders
					.filter((o: Order) => new Date(o.orderDate) >= today)
					.reduce(
						(sum: number, o: Order) => sum + Number(o.totalAmount),
						0
					);
				const weekRevenue = allOrders
					.filter((o: Order) => new Date(o.orderDate) >= weekStart)
					.reduce(
						(sum: number, o: Order) => sum + Number(o.totalAmount),
						0
					);
				const monthRevenue = allOrders
					.filter((o: Order) => new Date(o.orderDate) >= monthStart)
					.reduce(
						(sum: number, o: Order) => sum + Number(o.totalAmount),
						0
					);

				setStats({
					totalOrders: orders?.meta?.totalItems || allOrders.length,
					totalUsers: getTotalItems(usersData),
					totalStores: getTotalItems(storesData),
					totalProducts: getTotalItems(productsData),
					pendingOrders,
					confirmedOrders,
					deliveredOrders,
					cancelledOrders,
					totalRevenue,
					todayRevenue,
					weekRevenue,
					monthRevenue,
				});
			} catch (err) {
				console.error('Admin dashboard error:', err);
				setError(
					'ড্যাশবোর্ড তথ্য লোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।'
				);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	if (loading) {
		return <DashboardSkeleton />;
	}

	if (error) {
		return (
			<div className='p-6'>
				<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3'>
					<AlertCircle className='h-5 w-5 text-red-500' />
					<p className='text-red-700 dark:text-red-400'>{error}</p>
					<Button
						variant='outline'
						size='sm'
						onClick={() => window.location.reload()}
						className='ml-auto'
					>
						পুনরায় চেষ্টা করুন
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			{/* Header */}
			<div className='flex flex-col md:flex-row justify-between gap-4 items-start md:items-center'>
				<div>
					<h1 className='text-3xl font-bold dark:text-white'>
						অ্যাডমিন ড্যাশবোর্ড
					</h1>
					<p className='text-gray-600 dark:text-gray-400'>
						সাইটের সর্বশেষ পরিসংখ্যান ও আপডেট
					</p>
				</div>
				<div className='flex gap-2'>
					<Button variant='outline' asChild>
						<Link href='/admin/orders'>
							<ShoppingCart className='h-4 w-4 mr-2' />
							অর্ডার ম্যানেজমেন্ট
						</Link>
					</Button>
					<Button asChild>
						<Link href='/admin/users'>
							<Users className='h-4 w-4 mr-2' />
							ইউজার ম্যানেজমেন্ট
						</Link>
					</Button>
				</div>
			</div>

			{/* Stats Grid - 4 main cards */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<Card className='p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								মোট অর্ডার
							</p>
							<h3 className='text-2xl font-bold dark:text-white'>
								{stats.totalOrders}
							</h3>
						</div>
						<div className='h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center'>
							<ShoppingCart className='h-6 w-6 text-blue-600 dark:text-blue-400' />
						</div>
					</div>
					<p className='text-xs mt-2 text-gray-500 dark:text-gray-400'>
						<span className='text-amber-500 font-medium'>
							{stats.pendingOrders} টি
						</span>{' '}
						অর্ডার অপেক্ষমান
					</p>
				</Card>

				<Card className='p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								মোট ইউজার
							</p>
							<h3 className='text-2xl font-bold dark:text-white'>
								{stats.totalUsers}
							</h3>
						</div>
						<div className='h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center'>
							<Users className='h-6 w-6 text-green-600 dark:text-green-400' />
						</div>
					</div>
					<p className='text-xs mt-2 text-gray-500 dark:text-gray-400'>
						<Link
							href='/admin/users'
							className='text-green-500 font-medium flex items-center'
						>
							সব ইউজার দেখুন{' '}
							<MoveRight className='h-3 w-3 ml-1' />
						</Link>
					</p>
				</Card>

				<Card className='p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								মোট স্টোর
							</p>
							<h3 className='text-2xl font-bold dark:text-white'>
								{stats.totalStores}
							</h3>
						</div>
						<div className='h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center'>
							<Store className='h-6 w-6 text-purple-600 dark:text-purple-400' />
						</div>
					</div>
					<p className='text-xs mt-2 text-gray-500 dark:text-gray-400'>
						<Link
							href='/admin/shops'
							className='text-purple-500 font-medium flex items-center'
						>
							সব দোকান দেখুন{' '}
							<MoveRight className='h-3 w-3 ml-1' />
						</Link>
					</p>
				</Card>

				<Card className='p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								মোট পণ্য
							</p>
							<h3 className='text-2xl font-bold dark:text-white'>
								{stats.totalProducts}
							</h3>
						</div>
						<div className='h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center'>
							<Package className='h-6 w-6 text-orange-600 dark:text-orange-400' />
						</div>
					</div>
					<p className='text-xs mt-2 text-gray-500 dark:text-gray-400'>
						<Link
							href='/admin/product-category'
							className='text-orange-500 font-medium flex items-center'
						>
							ক্যাটাগরি ম্যানেজমেন্ট{' '}
							<MoveRight className='h-3 w-3 ml-1' />
						</Link>
					</p>
				</Card>
			</div>

			{/* Order Status Breakdown */}
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
				<Card className='p-4 dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-yellow-400'>
					<div className='flex items-center gap-3'>
						<Clock className='h-5 w-5 text-yellow-500' />
						<div>
							<p className='text-xs text-gray-500 dark:text-gray-400'>
								অপেক্ষমান
							</p>
							<p className='text-xl font-bold dark:text-white'>
								{stats.pendingOrders}
							</p>
						</div>
					</div>
				</Card>
				<Card className='p-4 dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-blue-400'>
					<div className='flex items-center gap-3'>
						<CheckCircle className='h-5 w-5 text-blue-500' />
						<div>
							<p className='text-xs text-gray-500 dark:text-gray-400'>
								নিশ্চিত
							</p>
							<p className='text-xl font-bold dark:text-white'>
								{stats.confirmedOrders}
							</p>
						</div>
					</div>
				</Card>
				<Card className='p-4 dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-green-400'>
					<div className='flex items-center gap-3'>
						<Truck className='h-5 w-5 text-green-500' />
						<div>
							<p className='text-xs text-gray-500 dark:text-gray-400'>
								ডেলিভারি
							</p>
							<p className='text-xl font-bold dark:text-white'>
								{stats.deliveredOrders}
							</p>
						</div>
					</div>
				</Card>
				<Card className='p-4 dark:bg-gray-800 dark:border-gray-700 border-l-4 border-l-red-400'>
					<div className='flex items-center gap-3'>
						<XCircle className='h-5 w-5 text-red-500' />
						<div>
							<p className='text-xs text-gray-500 dark:text-gray-400'>
								বাতিল
							</p>
							<p className='text-xl font-bold dark:text-white'>
								{stats.cancelledOrders}
							</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Revenue Card */}
			<Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-xl font-semibold dark:text-white flex items-center gap-2'>
						<Coins className='h-5 w-5 text-green-500' />
						আয় পরিসংখ্যান
					</h2>
					<Badge variant='secondary' className='text-lg px-4 py-1'>
						মোট: {formatCurrency(stats.totalRevenue)}
					</Badge>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div className='bg-green-50 dark:bg-green-900/20 rounded-lg p-4'>
						<p className='text-sm text-green-700 dark:text-green-400'>
							আজকের আয়
						</p>
						<p className='text-2xl font-bold text-green-800 dark:text-green-300'>
							{formatCurrency(stats.todayRevenue)}
						</p>
					</div>
					<div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4'>
						<p className='text-sm text-blue-700 dark:text-blue-400'>
							সাপ্তাহিক আয়
						</p>
						<p className='text-2xl font-bold text-blue-800 dark:text-blue-300'>
							{formatCurrency(stats.weekRevenue)}
						</p>
					</div>
					<div className='bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4'>
						<p className='text-sm text-purple-700 dark:text-purple-400'>
							মাসিক আয়
						</p>
						<p className='text-2xl font-bold text-purple-800 dark:text-purple-300'>
							{formatCurrency(stats.monthRevenue)}
						</p>
					</div>
				</div>
			</Card>

			{/* Recent Orders Table */}
			<Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-semibold dark:text-white'>
						সাম্প্রতিক অর্ডার
					</h2>
					<Button variant='outline' size='sm' asChild>
						<Link href='/admin/orders'>সব দেখুন</Link>
					</Button>
				</div>

				{recentOrders.length > 0 ? (
					<div className='overflow-x-auto'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='border-b dark:border-gray-700'>
									<th className='text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium'>
										অর্ডার ID
									</th>
									<th className='text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium'>
										ক্রেতা
									</th>
									<th className='text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium'>
										ফোন
									</th>
									<th className='text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium'>
										মোট
									</th>
									<th className='text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium'>
										স্ট্যাটাস
									</th>
									<th className='text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium'>
										তারিখ
									</th>
								</tr>
							</thead>
							<tbody>
								{recentOrders.map((order) => {
									const statusInfo =
										OrderService.getOrderStatusInfo(
											order.orderStatus
										);
									return (
										<tr
											key={order.id}
											className='border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
										>
											<td className='py-3 px-2 font-mono text-xs dark:text-gray-300'>
												#{order.id.substring(0, 8)}
											</td>
											<td className='py-3 px-2 dark:text-white font-medium'>
												{order.name}
											</td>
											<td className='py-3 px-2 dark:text-gray-300'>
												{order.phoneNumber}
											</td>
											<td className='py-3 px-2 font-semibold dark:text-white'>
												{formatCurrency(
													Number(order.totalAmount)
												)}
											</td>
											<td className='py-3 px-2'>
												<span
													className={`inline-block text-xs px-2 py-1 rounded-full ${statusInfo.color} ${statusInfo.textColor}`}
												>
													{statusInfo.label}
												</span>
											</td>
											<td className='py-3 px-2 text-gray-500 dark:text-gray-400 text-xs'>
												{OrderService.formatOrderDate(
													order.orderDate
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				) : (
					<div className='text-center py-12'>
						<ShoppingCart className='h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600' />
						<p className='text-gray-500 dark:text-gray-400'>
							এখনো কোনো অর্ডার নেই
						</p>
					</div>
				)}
			</Card>
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			<div className='flex flex-col md:flex-row justify-between gap-4'>
				<div>
					<Skeleton className='h-8 w-56 mb-2' />
					<Skeleton className='h-4 w-72' />
				</div>
				<div className='flex gap-2'>
					<Skeleton className='h-10 w-36' />
					<Skeleton className='h-10 w-36' />
				</div>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{[1, 2, 3, 4].map((i) => (
					<Card key={i} className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<Skeleton className='h-4 w-20 mb-2' />
								<Skeleton className='h-8 w-16' />
							</div>
							<Skeleton className='h-12 w-12 rounded-full' />
						</div>
						<Skeleton className='h-4 w-32 mt-2' />
					</Card>
				))}
			</div>
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
				{[1, 2, 3, 4].map((i) => (
					<Card key={i} className='p-4'>
						<Skeleton className='h-12 w-full' />
					</Card>
				))}
			</div>
			<Card className='p-6'>
				<Skeleton className='h-6 w-40 mb-4' />
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className='h-20 w-full rounded-lg' />
					))}
				</div>
			</Card>
			<Card className='p-6'>
				<Skeleton className='h-6 w-48 mb-4' />
				{[1, 2, 3, 4, 5].map((i) => (
					<Skeleton key={i} className='h-12 w-full mb-2' />
				))}
			</Card>
		</div>
	);
}
