'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/providers/session-provider';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OrderService } from '@/services/order-service';
import { ProductService } from '@/services/product-service';
import { StoreService } from '@/services/store-service';
import { Order, OrderStatus } from '@/types/order';
import { Product } from '@/types/product';
import Link from 'next/link';
import {
	Users,
	ShoppingCart,
	Coins,
	TrendingUp,
	BarChart3,
	AlertCircle,
	ShoppingBag,
	MoveRight,
	Star,
	Package,
} from 'lucide-react';
import Image from 'next/image';

// Helper function for currency formatting
const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('bn-BD', {
		style: 'currency',
		currency: 'BDT',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	})
		.format(amount)
		.replace('BDT', '')
		.trim();
};

export default function VendorDashboardPage() {
	const { user } = useSession();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [stats, setStats] = useState({
		totalSales: 0,
		totalOrders: 0,
		pendingOrders: 0,
		confirmedOrders: 0,
		totalProducts: 0,
		averageRating: 0,
		revenue: {
			today: 0,
			thisWeek: 0,
			thisMonth: 0,
		},
	});
	const [recentOrders, setRecentOrders] = useState<Order[]>([]);
	const [topProducts, setTopProducts] = useState<Product[]>([]);

	useEffect(() => {
		const fetchDashboardData = async () => {
			if (!user?.storeId) {
				setError(
					'স্টোর আইডি পাওয়া যায়নি। আপনার অনুগ্রহ করে স্টোর তৈরি করুন।'
				);
				setLoading(false);
				return;
			}

			try {
				setLoading(true);

				// Fetch orders for recent display
				const ordersResponse = await OrderService.getStoreOrders(user.storeId, {
					limit: 5,
				});
				setRecentOrders(ordersResponse.data);

				// Fetch all orders for statistics and product sales calculation
				const allOrders = await OrderService.getStoreOrders(user.storeId, {
					limit: 100,
				});

				// Fetch top products
				const productsResponse = await ProductService.getProductsByStore(
					user.storeId
				);

				// Create a map to track sales per product
				const productSalesMap = new Map<number, number>();

				// Count products sold in all orders
				allOrders.data.forEach((order) => {
					if (order.orderItems && Array.isArray(order.orderItems)) {
						order.orderItems.forEach((item) => {
							const productId = item.productId;
							const currentSales = productSalesMap.get(productId) || 0;
							productSalesMap.set(productId, currentSales + item.quantity);
						});
					}
				});

				// Assign sales count to products without changing Product type
				const productsWithSales = productsResponse.data.map((product) => {
					const productWithSales = { ...product };
					// Use type assertion to add the dynamic property
					(productWithSales as any).totalSales =
						productSalesMap.get(product.id) || 0;
					return productWithSales;
				});

				// Now sort products by their actual sales
				const sortedProducts = [...productsWithSales]
					.sort((a, b) => {
						const aSales = (a as any).totalSales || 0;
						const bSales = (b as any).totalSales || 0;
						return bSales - aSales;
					})
					.slice(0, 5);

				setTopProducts(sortedProducts);

				// Calculate general statistics
				const totalSales = allOrders.data.reduce(
					(sum, order) => sum + Number(order.totalAmount),
					0
				);

				const pendingOrders = allOrders.data.filter(
					(order) => order.orderStatus === OrderStatus.PENDING
				).length;

				const confirmedOrders = allOrders.data.filter(
					(order) => order.orderStatus === OrderStatus.CONFIRMED
				).length;

				// Get today, this week, and this month time ranges
				const today = new Date();
				today.setHours(0, 0, 0, 0);

				const weekStart = new Date();
				weekStart.setDate(weekStart.getDate() - weekStart.getDay());
				weekStart.setHours(0, 0, 0, 0);

				const monthStart = new Date();
				monthStart.setDate(1);
				monthStart.setHours(0, 0, 0, 0);

				// Calculate revenue for different time periods
				const todayRevenue = allOrders.data
					.filter((order) => new Date(order.orderDate) >= today)
					.reduce((sum, order) => sum + Number(order.totalAmount), 0);

				const weekRevenue = allOrders.data
					.filter((order) => new Date(order.orderDate) >= weekStart)
					.reduce((sum, order) => sum + Number(order.totalAmount), 0);

				const monthRevenue = allOrders.data
					.filter((order) => new Date(order.orderDate) >= monthStart)
					.reduce((sum, order) => sum + Number(order.totalAmount), 0);

				// Set all stats
				setStats({
					totalSales: totalSales,
					totalOrders: allOrders.data.length,
					pendingOrders: pendingOrders,
					confirmedOrders: confirmedOrders,
					totalProducts: productsResponse.meta.totalItems,
					averageRating: 4.7, // Placeholder - would come from an actual reviews API
					revenue: {
						today: todayRevenue,
						thisWeek: weekRevenue,
						thisMonth: monthRevenue,
					},
				});
			} catch (err) {
				console.error('Error fetching dashboard data:', err);
				setError(
					'ড্যাশবোর্ড তথ্য লোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।'
				);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, [user?.storeId]);

	if (loading) {
		return <DashboardSkeleton />;
	}
    console.log(stats);

	if (error) {
		return (
			<div className='p-6'>
				<Alert variant='destructive' className='mb-6'>
					<AlertCircle className='h-4 w-4' />
					<AlertDescription>{error}</AlertDescription>
				</Alert>

				<div className='text-center py-8'>
					<ShoppingBag className='h-16 w-16 mx-auto mb-4 text-gray-400' />
					<h2 className='text-2xl font-bold mb-2'>আপনার স্টোর তৈরি করুন</h2>
					<p className='text-gray-600 mb-6'>
						বিক্রয় শুরু করতে প্রথমে আপনার স্টোর সেটআপ করুন।
					</p>
					<Button asChild>
						<Link href='/vendor/onboarding'>স্টোর তৈরি করুন</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			{/* Welcome Message */}
			<div className='flex flex-col md:flex-row justify-between gap-6 items-start md:items-center'>
				<div>
					<h1 className='text-3xl font-bold dark:text-white'>ড্যাশবোর্ড</h1>
					<p className='text-gray-600 dark:text-gray-300'>
						স্বাগতম, {user?.name || 'বিক্রেতা'}! আপনার স্টোরের সর্বশেষ আপডেট।
					</p>
				</div>
				<div className='flex gap-2'>
					<Button variant='outline' asChild>
						<Link href='/vendor/products/create'>
							<ShoppingBag className='h-4 w-4 mr-2' />
							নতুন পণ্য যোগ করুন
						</Link>
					</Button>
					<Button asChild>
						<Link href='/vendor/orders'>
							<ShoppingCart className='h-4 w-4 mr-2' />
							অর্ডার ম্যানেজমেন্ট
						</Link>
					</Button>
				</div>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				<Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								মোট বিক্রয়
							</p>
							<h3 className='text-2xl font-bold dark:text-white'>
								{formatCurrency(stats.totalSales)}
							</h3>
						</div>
						<div className='h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center'>
							<Coins className='h-6 w-6 text-green-600 dark:text-green-400' />
						</div>
					</div>
					<p className='text-xs mt-2 text-gray-500 dark:text-gray-400'>
						<span className='text-green-500 font-medium'>
							{stats.confirmedOrders} টি
						</span>{' '}
						কনফার্ম করা অর্ডার
					</p>
				</Card>

				<Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
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

				

				<Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								মোট পণ্য
							</p>
							<h3 className='text-2xl font-bold dark:text-white'>
								{stats.totalProducts}
							</h3>
						</div>
						<div className='h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center'>
							<Package className='h-6 w-6 text-purple-600 dark:text-purple-400' />
						</div>
					</div>
					<p className='text-xs mt-2 text-gray-500 dark:text-gray-400'>
						<Link
							href='/vendor/products'
							className='text-purple-500 font-medium flex items-center'
						>
							সব পণ্য দেখুন <MoveRight className='h-3 w-3 ml-1' />
						</Link>
					</p>
				</Card>
			</div>

			{/* Revenue Chart */}
			<Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-xl font-semibold dark:text-white'>
						আয় পরিসংখ্যান
					</h2>
				</div>

				<div className='space-y-4'>
					<div className='space-y-2'>
						<div className='flex justify-between text-sm dark:text-gray-300'>
							<span>আজকের আয়</span>
							<span>{formatCurrency(stats.revenue.today)}</span>
						</div>
						<Progress
							value={(stats.revenue.today / stats.revenue.thisMonth) * 100}
							className='bg-gray-100 dark:bg-gray-700 h-2'
						/>
					</div>
					<div className='space-y-2'>
						<div className='flex justify-between text-sm dark:text-gray-300'>
							<span>সাপ্তাহিক আয়</span>
							<span>{formatCurrency(stats.revenue.thisWeek)}</span>
						</div>
						<Progress
							value={(stats.revenue.thisWeek / stats.revenue.thisMonth) * 100}
							className='bg-gray-100 dark:bg-gray-700 h-2'
						/>
					</div>
					<div className='space-y-2'>
						<div className='flex justify-between text-sm dark:text-gray-300'>
							<span>মাসিক আয়</span>
							<span>{formatCurrency(stats.revenue.thisMonth)}</span>
						</div>
						<Progress
							value={100}
							className='bg-gray-100 dark:bg-gray-700 h-2'
						/>
					</div>
				</div>

				<div className='mt-6 flex items-center justify-between'>
					<p className='text-sm text-gray-600 dark:text-gray-400'>
						এই মাসে আপনার{' '}
						<span className='font-semibold'>{stats.totalOrders}</span> টি অর্ডার
						হয়েছে, যা আপনাকে{' '}
						<span className='font-semibold'>
							{formatCurrency(stats.revenue.thisMonth)}
						</span>{' '}
						আয় করতে সাহায্য করেছে।
					</p>
					<Button variant='default' asChild>
						<Link href='/vendor/orders'>সব অর্ডার দেখুন</Link>
					</Button>
				</div>
			</Card>

			{/* Bottom Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Recent Orders */}
				<Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-xl font-semibold dark:text-white'>
							সাম্প্রতিক অর্ডার
						</h2>
						<Button variant='outline' size='sm' asChild>
							<Link href='/vendor/orders'>সব দেখুন</Link>
						</Button>
					</div>

					{recentOrders.length > 0 ? (
						<div className='space-y-4'>
							{recentOrders.map((order) => (
								<div
									key={order.id}
									className='flex justify-between items-center border-b dark:border-gray-700 pb-4'
								>
									<div>
										<p className='font-medium dark:text-white'>{order.name}</p>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											অর্ডার #{order.id.substring(0, 8)} •{' '}
											{OrderService.formatOrderDate(order.orderDate)}
										</p>
										<div className='mt-1'>
											<span
												className={`inline-block text-xs px-2 py-1 rounded-full ${
													OrderService.getOrderStatusInfo(order.orderStatus)
														.color
												} ${
													OrderService.getOrderStatusInfo(order.orderStatus)
														.textColor
												}`}
											>
												{
													OrderService.getOrderStatusInfo(order.orderStatus)
														.label
												}
											</span>
										</div>
									</div>
									<div className='text-right'>
										<p className='font-bold dark:text-white'>
											{formatCurrency(Number(order.totalAmount))}
										</p>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											{order.orderItems?.length || 0} আইটেম
										</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='text-center py-8'>
							<p className='text-gray-500 dark:text-gray-400'>
								কোন সাম্প্রতিক অর্ডার নেই
							</p>
						</div>
					)}
				</Card>

				{/* Top Products */}
				<Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-xl font-semibold dark:text-white'>সেরা পণ্য</h2>
						<Button variant='outline' size='sm' asChild>
							<Link href='/vendor/products'>সব দেখুন</Link>
						</Button>
					</div>

					{topProducts.length > 0 ? (
						<div className='space-y-4'>
							{topProducts.map((product, index) => {
								const price = ProductService.getFormattedPrice(product);
								return (
									<div
										key={product.id}
										className='flex gap-4 border-b dark:border-gray-700 pb-4'
									>
										<div className='h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 relative'>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											{/* Use Next.js Image for optimization */}
											<Image
												src={
													ProductService.getPrimaryImage(product) ||
													'/placeholder.svg'
												}
												alt={product.name}
												fill
												sizes="64px"
												className='object-cover'
											/>
										</div>
										<div className='flex-1'>
											<p className='font-medium dark:text-white'>
												{product.name}
											</p>
											<p className='text-sm text-gray-500 dark:text-gray-400'>
												{(product as any).totalSales || 0} বার বিক্রি হয়েছে
											</p>
											<div className='mt-1'>
												<span className='text-sm font-medium'>
													{price.hasDiscount ? (
														<>
															<span className='text-primary'>
																{price.formattedDiscountPrice}
															</span>
															<span className='text-gray-500 line-through ml-1'>
																{price.formattedPrice}
															</span>
														</>
													) : (
														<span className='text-primary'>
															{price.formattedPrice}
														</span>
													)}
												</span>
											</div>
										</div>
										<div className='flex items-center'>
											<span className='text-2xl font-bold text-gray-300 dark:text-gray-600'>
												#{index + 1}
											</span>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className='text-center py-8'>
							<p className='text-gray-500 dark:text-gray-400'>
								কোন পণ্য যোগ করা হয়নি
							</p>
							<Button variant='link' className='mt-2' asChild>
								<Link href='/vendor/products/create'>পণ্য যোগ করুন</Link>
							</Button>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className='p-6 space-y-6 w-full mx-auto'>
			{/* Header Skeleton */}
			<div className='flex flex-col md:flex-row justify-between gap-6 items-start md:items-center'>
				<div>
					<Skeleton className='h-8 w-48 mb-2' />
					<Skeleton className='h-4 w-72' />
				</div>
				<div className='flex gap-2'>
					<Skeleton className='h-10 w-32' />
					<Skeleton className='h-10 w-32' />
				</div>
			</div>

			{/* Stats Grid Skeleton */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				{[1, 2, 3, 4].map((i) => (
					<Card key={i} className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<Skeleton className='h-4 w-24 mb-2' />
								<Skeleton className='h-8 w-32' />
							</div>
							<Skeleton className='h-12 w-12 rounded-full' />
						</div>
						<Skeleton className='h-4 w-36 mt-2' />
					</Card>
				))}
			</div>

			{/* Revenue Chart Skeleton */}
			<Card className='p-6'>
				<div className='flex items-center justify-between mb-4'>
					<Skeleton className='h-6 w-48' />
					<div className='flex gap-2'>
						<Skeleton className='h-8 w-20' />
						<Skeleton className='h-8 w-20' />
						<Skeleton className='h-8 w-20' />
					</div>
				</div>

				<div className='space-y-4'>
					{[1, 2, 3].map((i) => (
						<div key={i} className='space-y-2'>
							<div className='flex justify-between'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-4 w-16' />
							</div>
							<Skeleton className='h-2 w-full' />
						</div>
					))}
				</div>

				<div className='mt-6 flex items-center justify-between'>
					<Skeleton className='h-4 w-2/3' />
					<Skeleton className='h-10 w-32' />
				</div>
			</Card>

			{/* Bottom Grid Skeleton */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{[1, 2].map((i) => (
					<Card key={i} className='p-6'>
						<div className='flex justify-between items-center mb-4'>
							<Skeleton className='h-6 w-48' />
							<Skeleton className='h-8 w-20' />
						</div>

						<div className='space-y-4'>
							{[1, 2, 3, 4].map((j) => (
								<Skeleton key={j} className='h-20 w-full' />
							))}
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
