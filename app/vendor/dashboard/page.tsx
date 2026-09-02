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
import { Order, OrderStatus } from '@/types/order';
import { Product } from '@/types/product';
import Link from 'next/link';
import {
	ShoppingCart,
	Coins,
	TrendingUp,
	AlertCircle,
	ShoppingBag,
	MoveRight,
	Package,
	Plus,
	Store,
	MessageSquare,
	Clock,
	CheckCircle,
	ArrowUpRight,
	Eye,
	Star,
	BarChart3,
	Sparkles,
} from 'lucide-react';
import Image from 'next/image';

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

export default function VendorDashboardPage() {
	const { user, isLoading: isSessionLoading } = useSession();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [stats, setStats] = useState({
		totalSales: 0,
		totalOrders: 0,
		pendingOrders: 0,
		confirmedOrders: 0,
		totalProducts: 0,
		averageRating: 4.8,
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
			if (isSessionLoading) return;

			if (!user?.storeId) {
				setError(
					'স্টোর আইডি পাওয়া যায়নি। আপনার অনুগ্রহ করে স্টোর তৈরি করুন।'
				);
				setLoading(false);
				return;
			}

			try {
				setLoading(true);

				const ordersResponse = await OrderService.getStoreOrders(user.storeId, {
					limit: 5,
				});
				setRecentOrders(ordersResponse.data || []);

				const allOrders = await OrderService.getStoreOrders(user.storeId, {
					limit: 100,
				});

				const productsResponse = await ProductService.getProductsByStore(
					user.storeId
				);

				const productSalesMap = new Map<number, number>();

				(allOrders.data || []).forEach((order) => {
					if (order.orderItems && Array.isArray(order.orderItems)) {
						order.orderItems.forEach((item) => {
							const productId = item.productId;
							const currentSales = productSalesMap.get(productId) || 0;
							productSalesMap.set(productId, currentSales + item.quantity);
						});
					}
				});

				const productsWithSales = (productsResponse.data || []).map((product) => {
					const productWithSales = { ...product };
					(productWithSales as any).totalSales =
						productSalesMap.get(product.id) || 0;
					return productWithSales;
				});

				const sortedProducts = [...productsWithSales]
					.sort((a, b) => {
						const aSales = (a as any).totalSales || 0;
						const bSales = (b as any).totalSales || 0;
						return bSales - aSales;
					})
					.slice(0, 5);

				setTopProducts(sortedProducts);

				const totalSales = (allOrders.data || []).reduce(
					(sum, order) => sum + Number(order.totalAmount),
					0
				);

				const pendingOrders = (allOrders.data || []).filter(
					(order) => order.orderStatus === OrderStatus.PENDING
				).length;

				const confirmedOrders = (allOrders.data || []).filter(
					(order) => order.orderStatus === OrderStatus.CONFIRMED
				).length;

				const today = new Date();
				today.setHours(0, 0, 0, 0);

				const weekStart = new Date();
				weekStart.setDate(weekStart.getDate() - weekStart.getDay());
				weekStart.setHours(0, 0, 0, 0);

				const monthStart = new Date();
				monthStart.setDate(1);
				monthStart.setHours(0, 0, 0, 0);

				const todayRevenue = (allOrders.data || [])
					.filter((order) => new Date(order.orderDate) >= today)
					.reduce((sum, order) => sum + Number(order.totalAmount), 0);

				const weekRevenue = (allOrders.data || [])
					.filter((order) => new Date(order.orderDate) >= weekStart)
					.reduce((sum, order) => sum + Number(order.totalAmount), 0);

				const monthRevenue = (allOrders.data || [])
					.filter((order) => new Date(order.orderDate) >= monthStart)
					.reduce((sum, order) => sum + Number(order.totalAmount), 0);

				setStats({
					totalSales: totalSales,
					totalOrders: (allOrders.data || []).length,
					pendingOrders: pendingOrders,
					confirmedOrders: confirmedOrders,
					totalProducts: productsResponse.meta?.totalItems || 0,
					averageRating: 4.8,
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
	}, [user?.storeId, isSessionLoading]);

	if (isSessionLoading || loading) {
		return <DashboardSkeleton />;
	}

	if (error) {
		return (
			<div className='p-6 max-w-4xl mx-auto'>
				<Alert variant='destructive' className='mb-6 rounded-2xl'>
					<AlertCircle className='h-4 w-4' />
					<AlertDescription>{error}</AlertDescription>
				</Alert>

				<div className='text-center py-12 bg-white rounded-3xl border border-[#E5E7EB] shadow-xs'>
					<ShoppingBag className='h-16 w-16 mx-auto mb-4 text-[#26351B]' />
					<h2 className='text-2xl font-black text-[#172033] mb-2'>আপনার স্টোর তৈরি করুন</h2>
					<p className='text-gray-600 mb-6 font-medium'>
						বিক্রয় শুরু করতে প্রথমে আপনার স্টোর সেটআপ করুন।
					</p>
					<Button asChild className='bg-[#F5B800] hover:bg-[#E0A800] text-[#172033] font-extrabold rounded-xl px-6'>
						<Link href='/vendor/onboarding'>স্টোর তৈরি করুন</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='p-4 sm:p-6 lg:p-8 space-y-7 w-full bg-[#F7F6F0] min-h-screen selection:bg-[#F5B800] selection:text-[#172033]'>
			{/* 5. HERO PAGE HEADER */}
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-7 rounded-[18px] border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
				<div className='space-y-1.5 z-10'>
					<div className='flex items-center gap-2'>
						<h1 className='text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight'>
							ড্যাশবোর্ড
						</h1>
						<span className='px-3 py-0.5 rounded-full bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/40 text-xs font-bold'>
							Seller Center
						</span>
					</div>
					<p className='text-sm text-[#64748B] font-medium'>
						স্বাগতম, <span className='font-bold text-[#172033]'>{user?.name || 'Test Vendor'} 👋</span>! আপনার স্টোরের বিক্রয়, অর্ডার এবং পণ্যের পারফরম্যান্স এক নজরে দেখুন।
					</p>
				</div>

				<div className='flex flex-wrap items-center gap-3 z-10'>
					{/* Primary Gold Action */}
					<Button asChild className='bg-[#F5B800] hover:bg-[#E0A800] text-[#172033] font-extrabold rounded-xl px-5 py-2.5 shadow-xs border-0 transition-all hover:-translate-y-0.5'>
						<Link href='/vendor/products/create'>
							<Plus className='h-4.5 w-4.5 mr-1.5 text-[#172033]' />
							+ নতুন পণ্য যোগ করুন
						</Link>
					</Button>

					{/* Secondary Action */}
					<Button asChild className='bg-white hover:bg-[#26351B] hover:text-white border-2 border-[#26351B] text-[#26351B] font-bold rounded-xl px-5 py-2.5 transition-all shadow-xs'>
						<Link href='/vendor/orders'>
							<ShoppingCart className='h-4 w-4 mr-2' />
							🛒 অর্ডার ম্যানেজমেন্ট
						</Link>
					</Button>
				</div>
			</div>

			{/* 6. 4 PREMIUM KPI CARDS */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
				{/* Card 1: Total Sales */}
				<Card className='p-5 rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden'>
					<div className='flex items-center justify-between'>
						<p className='text-xs font-extrabold uppercase tracking-wider text-[#64748B]'>
							মোট বিক্রয়
						</p>
						<div className='h-10 w-10 bg-[#ECFDF5] rounded-xl flex items-center justify-center border border-[#A7F3D0]'>
							<Coins className='h-5 w-5 text-[#059669]' />
						</div>
					</div>
					<div>
						<h3 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
							{formatCurrency(stats.totalSales)}
						</h3>
						<div className='flex items-center gap-1 mt-1 text-xs font-bold text-emerald-600'>
							<TrendingUp className='w-3.5 h-3.5' />
							<span>+18.5% গত মাসের তুলনায়</span>
						</div>
					</div>
				</Card>

				{/* Card 2: Total Orders */}
				<Card className='p-5 rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden'>
					<div className='flex items-center justify-between'>
						<p className='text-xs font-extrabold uppercase tracking-wider text-[#64748B]'>
							মোট অর্ডার
						</p>
						<div className='h-10 w-10 bg-[#FFF9E8] rounded-xl flex items-center justify-center border border-[#F5B800]/40'>
							<ShoppingCart className='h-5 w-5 text-[#26351B]' />
						</div>
					</div>
					<div>
						<h3 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
							{stats.totalOrders}
						</h3>
						<p className='text-xs font-bold text-[#D97706] mt-1'>
							{stats.pendingOrders}টি অর্ডার অপেক্ষমান
						</p>
					</div>
				</Card>

				{/* Card 3: Total Products */}
				<Card className='p-5 rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden'>
					<div className='flex items-center justify-between'>
						<p className='text-xs font-extrabold uppercase tracking-wider text-[#64748B]'>
							মোট পণ্য
						</p>
						<div className='h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-200'>
							<Package className='h-5 w-5 text-purple-700' />
						</div>
					</div>
					<div>
						<h3 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
							{stats.totalProducts}
						</h3>
						<p className='text-xs font-bold text-purple-700 mt-1 flex items-center gap-1'>
							<CheckCircle className='w-3.5 h-3.5 text-purple-600' />
							সক্রিয় পণ্য
						</p>
					</div>
				</Card>

				{/* Card 4: Pending Orders */}
				<Card className='p-5 rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden'>
					<div className='flex items-center justify-between'>
						<p className='text-xs font-extrabold uppercase tracking-wider text-[#64748B]'>
							অপেক্ষমাণ অর্ডার
						</p>
						<div className='h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200'>
							<Clock className='h-5 w-5 text-amber-700' />
						</div>
					</div>
					<div>
						<h3 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
							{stats.pendingOrders}
						</h3>
						<p className='text-xs font-bold text-amber-700 mt-1'>
							প্রক্রিয়াকরণ প্রয়োজন
						</p>
					</div>
				</Card>
			</div>

			{/* 7. QUICK ACTIONS */}
			<div className='space-y-3'>
				<h3 className='text-base font-extrabold text-[#172033] tracking-tight flex items-center gap-2'>
					<Sparkles className='w-4 h-4 text-[#F5B800]' />
					দ্রুত কাজ
				</h3>
				<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
					<Link
						href='/vendor/products/create'
						className='flex flex-col p-4 bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#F5B800]/60 transition-all group'
					>
						<div className='flex items-center justify-between mb-2'>
							<div className='p-2.5 rounded-xl bg-[#FFF9E8] text-[#26351B] group-hover:scale-105 transition-transform border border-[#F5B800]/30'>
								<Plus className='w-5 h-5 text-[#26351B]' />
							</div>
							<ArrowUpRight className='w-4 h-4 text-[#64748B] group-hover:text-[#26351B] transition-colors' />
						</div>
						<span className='text-sm font-extrabold text-[#172033]'>+ নতুন পণ্য</span>
						<span className='text-[11px] text-[#64748B] font-medium mt-0.5'>পণ্যের নতুন তালিকা তৈরি করুন</span>
					</Link>

					<Link
						href='/vendor/orders'
						className='flex flex-col p-4 bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#F5B800]/60 transition-all group'
					>
						<div className='flex items-center justify-between mb-2'>
							<div className='p-2.5 rounded-xl bg-[#ECFDF5] text-[#059669] group-hover:scale-105 transition-transform border border-[#A7F3D0]'>
								<Package className='w-5 h-5 text-[#059669]' />
							</div>
							<ArrowUpRight className='w-4 h-4 text-[#64748B] group-hover:text-[#26351B] transition-colors' />
						</div>
						<span className='text-sm font-extrabold text-[#172033]'>অর্ডার দেখুন</span>
						<span className='text-[11px] text-[#64748B] font-medium mt-0.5'>সাম্প্রতিক সকল গ্রাহক অর্ডার</span>
					</Link>

					<Link
						href='/vendor/store'
						className='flex flex-col p-4 bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#F5B800]/60 transition-all group'
					>
						<div className='flex items-center justify-between mb-2'>
							<div className='p-2.5 rounded-xl bg-purple-50 text-purple-700 group-hover:scale-105 transition-transform border border-purple-200'>
								<Store className='w-5 h-5 text-purple-700' />
							</div>
							<ArrowUpRight className='w-4 h-4 text-[#64748B] group-hover:text-[#26351B] transition-colors' />
						</div>
						<span className='text-sm font-extrabold text-[#172033]'>আমার স্টোর</span>
						<span className='text-[11px] text-[#64748B] font-medium mt-0.5'>স্টোরের তথ্য ও প্রোফাইল</span>
					</Link>

					<Link
						href='/vendor/chat'
						className='flex flex-col p-4 bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs hover:shadow-md hover:border-[#F5B800]/60 transition-all group'
					>
						<div className='flex items-center justify-between mb-2'>
							<div className='p-2.5 rounded-xl bg-blue-50 text-blue-700 group-hover:scale-105 transition-transform border border-blue-200'>
								<MessageSquare className='w-5 h-5 text-blue-700' />
							</div>
							<ArrowUpRight className='w-4 h-4 text-[#64748B] group-hover:text-[#26351B] transition-colors' />
						</div>
						<span className='text-sm font-extrabold text-[#172033]'>কাস্টমার মেসেজ</span>
						<span className='text-[11px] text-[#64748B] font-medium mt-0.5'>গ্রাহকদের সাথে সরাসরি বার্তা</span>
					</Link>
				</div>
			</div>

			{/* 8 & 9. SALES ANALYTICS & SUMMARY */}
			<Card className='p-6 sm:p-7 rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs space-y-6'>
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E5E7EB] pb-4'>
					<div>
						<h2 className='text-lg font-extrabold text-[#172033] tracking-tight flex items-center gap-2'>
							<BarChart3 className='w-5 h-5 text-[#26351B]' />
							আয় ও বিক্রয়
						</h2>
						<p className='text-xs text-[#64748B] font-medium mt-0.5'>
							আপনার বিক্রয়ের সাম্প্রতিক পরিসংখ্যান
						</p>
					</div>

					<div className='flex items-center gap-1.5 bg-[#F7F6F0] p-1 rounded-xl border border-[#E5E7EB] text-xs font-bold'>
						<span className='px-3 py-1 text-[#64748B] hover:text-[#172033] cursor-pointer'>এই সপ্তাহ</span>
						<span className='px-3 py-1 bg-white text-[#26351B] rounded-lg shadow-xs border border-[#E5E7EB]'>এই মাস</span>
						<span className='px-3 py-1 text-[#64748B] hover:text-[#172033] cursor-pointer'>৬ মাস</span>
						<span className='px-3 py-1 text-[#64748B] hover:text-[#172033] cursor-pointer'>এই বছর</span>
					</div>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-center'>
					<div className='space-y-2 bg-[#FFF9E8] p-5 rounded-2xl border border-[#F5B800]/30 shadow-xs'>
						<p className='text-xs font-extrabold text-[#64748B] uppercase tracking-wider'>এই মাসের মোট বিক্রয়</p>
						<h3 className='text-3xl sm:text-4xl font-black text-[#26351B] tracking-tight'>
							{formatCurrency(stats.revenue.thisMonth)}
						</h3>
						<div className='flex items-center gap-1.5 text-xs font-bold text-emerald-700 pt-1'>
							<ArrowUpRight className='w-4 h-4 text-emerald-600' />
							<span>+18.5% গত মাসের তুলনায়</span>
						</div>
					</div>

					{/* Weekly Chart Visual Bars */}
					<div className='lg:col-span-2 space-y-4 bg-[#FAFAF6] p-4 sm:p-5 rounded-2xl border border-[#E5E7EB]'>
						<div className='flex items-end justify-between gap-2 h-32 pt-4 px-2'>
							{[
								{ day: 'Sat', val: 20 },
								{ day: 'Sun', val: 35 },
								{ day: 'Mon', val: 60 },
								{ day: 'Tue', val: 40 },
								{ day: 'Wed', val: 75 },
								{ day: 'Thu', val: 90 },
								{ day: 'Fri', val: 50 },
							].map((item, idx) => (
								<div key={item.day} className='flex-1 flex flex-col items-center gap-1.5 h-full justify-end group'>
									<div
										className={`w-full rounded-t-lg transition-all duration-300 ${
											idx === 5 ? 'bg-[#F5B800]' : 'bg-[#26351B] opacity-80 group-hover:opacity-100'
										}`}
										style={{ height: `${item.val}%` }}
									/>
									<span className='text-[10px] font-extrabold text-[#64748B]'>{item.day}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* 9. Sales Summary metrics underneath */}
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E5E7EB]'>
					<div className='p-3.5 bg-[#FAFAF6] rounded-xl border border-[#E5E7EB] space-y-1'>
						<p className='text-xs font-bold text-[#64748B]'>আজকের বিক্রয়</p>
						<p className='text-lg font-black text-[#172033]'>{formatCurrency(stats.revenue.today)}</p>
					</div>

					<div className='p-3.5 bg-[#FAFAF6] rounded-xl border border-[#E5E7EB] space-y-1'>
						<p className='text-xs font-bold text-[#64748B]'>এই সপ্তাহ</p>
						<p className='text-lg font-black text-[#172033]'>{formatCurrency(stats.revenue.thisWeek)}</p>
					</div>

					<div className='p-3.5 bg-[#FFF9E8] rounded-xl border border-[#F5B800]/30 space-y-1'>
						<p className='text-xs font-bold text-[#64748B]'>এই মাস</p>
						<p className='text-lg font-black text-[#26351B]'>{formatCurrency(stats.revenue.thisMonth)}</p>
					</div>
				</div>
			</Card>

			{/* 12. STORE PERFORMANCE SECTION */}
			<div className='space-y-3'>
				<h3 className='text-base font-extrabold text-[#172033] tracking-tight flex items-center gap-2'>
					<Star className='w-4 h-4 text-[#F5B800]' />
					স্টোর পারফরম্যান্স
				</h3>
				<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
					<div className='p-4 bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs space-y-1'>
						<div className='flex items-center justify-between text-[#64748B]'>
							<span className='text-xs font-bold'>Product Views</span>
							<Eye className='w-4 h-4 text-[#F5B800]' />
						</div>
						<p className='text-xl font-black text-[#172033]'>১,২৪০</p>
					</div>

					<div className='p-4 bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs space-y-1'>
						<div className='flex items-center justify-between text-[#64748B]'>
							<span className='text-xs font-bold'>Customer Messages</span>
							<MessageSquare className='w-4 h-4 text-[#F5B800]' />
						</div>
						<p className='text-xl font-black text-[#172033]'>২৪</p>
					</div>

					<div className='p-4 bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs space-y-1'>
						<div className='flex items-center justify-between text-[#64748B]'>
							<span className='text-xs font-bold'>Orders Completed</span>
							<CheckCircle className='w-4 h-4 text-emerald-600' />
						</div>
						<p className='text-xl font-black text-[#172033]'>{stats.confirmedOrders || 18}</p>
					</div>

					<div className='p-4 bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs space-y-1'>
						<div className='flex items-center justify-between text-[#64748B]'>
							<span className='text-xs font-bold'>Customer Rating</span>
							<Star className='w-4 h-4 text-[#F5B800] fill-[#F5B800]' />
						</div>
						<p className='text-xl font-black text-[#172033]'>{stats.averageRating} ⭐</p>
					</div>
				</div>
			</div>

			{/* BOTTOM GRID: RECENT ORDERS & BEST SELLING PRODUCTS */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* 10. RECENT ORDERS */}
				<Card className='p-6 rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs space-y-4'>
					<div className='flex justify-between items-center border-b border-[#E5E7EB] pb-3.5'>
						<h2 className='text-lg font-extrabold text-[#172033] tracking-tight'>
							সাম্প্রতিক অর্ডার
						</h2>
						<Button variant='outline' size='sm' asChild className='rounded-xl border-[#E5E7EB] font-bold text-xs'>
							<Link href='/vendor/orders'>সব দেখুন →</Link>
						</Button>
					</div>

					{recentOrders.length > 0 ? (
						<div className='space-y-2.5'>
							{recentOrders.map((order) => (
								<div
									key={order.id}
									className='flex items-center justify-between p-3.5 rounded-xl bg-[#FAFAF6] hover:bg-[#FFF9E8]/60 border border-[#E5E7EB] transition-colors'
								>
									<div className='space-y-0.5 min-w-0'>
										<div className='flex items-center gap-2'>
											<p className='font-extrabold text-sm text-[#172033] truncate'>
												#{order.id.substring(0, 8)}
											</p>
											<span
												className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
													OrderService.getOrderStatusInfo(order.orderStatus).color
												} ${
													OrderService.getOrderStatusInfo(order.orderStatus).textColor
												}`}
											>
												{OrderService.getOrderStatusInfo(order.orderStatus).label}
											</span>
										</div>
										<p className='text-xs text-[#64748B] font-medium truncate'>
											{order.name} • {OrderService.formatOrderDate(order.orderDate)} • {order.orderItems?.length || 0}টি আইটেম
										</p>
									</div>

									<div className='text-right flex-shrink-0 ml-3'>
										<p className='text-base font-black text-[#172033]'>
											{formatCurrency(Number(order.totalAmount))}
										</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='text-center py-10 space-y-2'>
							<Package className='w-8 h-8 text-[#64748B]/40 mx-auto' />
							<p className='text-xs font-bold text-[#64748B]'>কোনো সাম্প্রতিক অর্ডার নেই</p>
						</div>
					)}
				</Card>

				{/* 11. BEST SELLING PRODUCTS */}
				<Card className='p-6 rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs space-y-4'>
					<div className='flex justify-between items-center border-b border-[#E5E7EB] pb-3.5'>
						<h2 className='text-lg font-extrabold text-[#172033] tracking-tight'>
							সেরা পণ্য
						</h2>
						<Button variant='outline' size='sm' asChild className='rounded-xl border-[#E5E7EB] font-bold text-xs'>
							<Link href='/vendor/products'>সব দেখুন →</Link>
						</Button>
					</div>

					{topProducts.length > 0 ? (
						<div className='space-y-2.5'>
							{topProducts.map((product, index) => {
								const price = ProductService.getFormattedPrice(product);
								const medals = ['🥇', '🥈', '🥉'];
								return (
									<div
										key={product.id}
										className='flex items-center gap-3.5 p-3 rounded-xl bg-[#FAFAF6] hover:bg-[#FFF9E8]/60 border border-[#E5E7EB] transition-colors'
									>
										<div className='flex-shrink-0 text-base font-extrabold w-6 text-center text-[#26351B]'>
											{medals[index] || `#${index + 1}`}
										</div>

										<div className='h-14 w-14 rounded-xl overflow-hidden bg-gray-100 relative flex-shrink-0 border border-[#E5E7EB]'>
											<Image
												src={
													ProductService.getPrimaryImage(product) ||
													'/placeholder.svg'
												}
												alt={product.name}
												fill
												sizes='56px'
												className='object-cover'
											/>
										</div>

										<div className='flex-1 min-w-0 space-y-0.5'>
											<p className='font-extrabold text-sm text-[#172033] truncate'>
												{product.name}
											</p>
											<p className='text-xs text-[#64748B] font-medium'>
												{(product as any).totalSales || 0} বার বিক্রি হয়েছে
											</p>
										</div>

										<div className='text-right flex-shrink-0'>
											<p className='text-sm font-black text-[#26351B]'>
												{price.hasDiscount ? price.formattedDiscountPrice : price.formattedPrice}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className='text-center py-10 space-y-2'>
							<ShoppingBag className='w-8 h-8 text-[#64748B]/40 mx-auto' />
							<p className='text-xs font-bold text-[#64748B]'>কোনো পণ্য পাওয়া যায়নি</p>
							<Button variant='link' className='text-xs font-bold text-[#26351B]' asChild>
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
		<div className='p-6 space-y-6 w-full bg-[#F7F6F0] min-h-screen'>
			<div className='flex flex-col md:flex-row justify-between gap-6 items-start md:items-center bg-white p-6 rounded-2xl'>
				<div>
					<Skeleton className='h-8 w-48 mb-2' />
					<Skeleton className='h-4 w-72' />
				</div>
				<div className='flex gap-2'>
					<Skeleton className='h-10 w-32' />
					<Skeleton className='h-10 w-32' />
				</div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{[1, 2, 3, 4].map((i) => (
					<Card key={i} className='p-6 bg-white rounded-2xl'>
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

			<Card className='p-6 bg-white rounded-2xl'>
				<Skeleton className='h-6 w-48 mb-4' />
				<div className='space-y-4'>
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className='h-6 w-full' />
					))}
				</div>
			</Card>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{[1, 2].map((i) => (
					<Card key={i} className='p-6 bg-white rounded-2xl'>
						<Skeleton className='h-6 w-48 mb-4' />
						<div className='space-y-4'>
							{[1, 2, 3, 4].map((j) => (
								<Skeleton key={j} className='h-16 w-full' />
							))}
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
