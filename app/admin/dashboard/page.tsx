'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/providers/session-provider';
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
import {
	Users,
	ShoppingCart,
	Store,
	Package,
	AlertCircle,
	MoveRight,
	Coins,
	Clock,
	CheckCircle,
	XCircle,
	Truck,
	ShieldCheck,
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
	const { isLoading: isSessionLoading } = useSession();
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
			if (isSessionLoading) return;

			try {
				setLoading(true);
				setError(null);

				const [ordersRes, usersRes, storesRes, productsRes] =
					await Promise.allSettled([
						OrderService.getAllOrders({ limit: 100 }),
						UserService.getUsers({ page: 1, limit: 1, isBlocked: null }),
						StoreService.getStores({ page: 1, limit: 1 }),
						ProductService.getProducts({ page: 1, limit: 1 }),
					]);

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

				const getTotalItems = (res: any): number => {
					return res?.meta?.totalItems 
						|| res?.data?.meta?.totalItems 
						|| res?.data?.length 
						|| 0;
				};

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
	}, [isSessionLoading]);

	if (isSessionLoading || loading) {
		return <DashboardSkeleton />;
	}

	if (error) {
		return (
			<div className='p-4 sm:p-6'>
				<div className='bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3 shadow-xs'>
					<AlertCircle className='h-5 w-5 text-red-500 flex-shrink-0' />
					<p className='text-red-700 text-xs sm:text-sm font-bold'>{error}</p>
					<Button
						variant='outline'
						size='sm'
						onClick={() => window.location.reload()}
						className='ml-auto rounded-xl border-red-300 text-red-700 font-bold text-xs'
					>
						পুনরায় চেষ্টা করুন
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6 w-full mx-auto pb-6'>
			{/* HERO HEADER */}
			<div className='flex flex-col md:flex-row justify-between gap-4 items-start md:items-center bg-gradient-to-r from-[#FFF9E8] via-white to-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
				<div className='space-y-1.5 z-10'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 rounded-xl bg-[#26351B] flex items-center justify-center text-[#F5B800] shadow-2xs'>
							<ShieldCheck className='w-4 h-4 text-[#F5B800]' />
						</div>
						<h1 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
							অ্যাডমিন ড্যাশবোর্ড
						</h1>
					</div>
					<p className='text-xs sm:text-sm text-[#64748B] font-medium'>
						আমাদের কৃষক প্ল্যাটফর্মের সার্বিক পর্যবেক্ষণ, পরিসংখ্যান ও পরিচালনা
					</p>
				</div>

				<div className='flex items-center gap-3 z-10 flex-wrap'>
					<Button
						variant='outline'
						asChild
						className='bg-white hover:bg-[#FAFAF6] text-[#172033] border-[#E5E7EB] font-extrabold rounded-xl h-10 px-4 text-xs shadow-xs transition-all'
					>
						<Link href='/admin/orders'>
							<ShoppingCart className='h-4 w-4 mr-2 text-[#26351B]' />
							অর্ডার ম্যানেজমেন্ট
						</Link>
					</Button>
					<Button
						asChild
						className='bg-[#F5B800] hover:bg-[#E0A800] text-[#172033] font-extrabold rounded-xl h-10 px-4 text-xs shadow-xs border-0 transition-all hover:-translate-y-0.5'
					>
						<Link href='/admin/users'>
							<Users className='h-4 w-4 mr-2 text-[#172033]' />
							ইউজার ম্যানেজমেন্ট
						</Link>
					</Button>
				</div>
			</div>

			{/* 4 MAIN KPI CARDS */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'>
				{/* Total Orders */}
				<Card className='p-5 sm:p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-all duration-200 group'>
					<div className='flex items-center justify-between'>
						<div className='space-y-1'>
							<p className='text-xs font-bold text-[#64748B] uppercase tracking-wider'>
								মোট অর্ডার
							</p>
							<h3 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
								{stats.totalOrders}
							</h3>
						</div>
						<div className='h-12 w-12 bg-[#FFF4CC] border border-[#F5B800]/40 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform'>
							<ShoppingCart className='h-6 w-6 text-[#26351B]' />
						</div>
					</div>
					<div className='mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs'>
						<span className='text-[#64748B] font-medium'>
							অপেক্ষমান:
						</span>
						<span className='font-extrabold text-[#26351B] bg-[#FFF9E8] px-2 py-0.5 rounded-md border border-[#F5B800]/30'>
							{stats.pendingOrders} টি
						</span>
					</div>
				</Card>

				{/* Total Users */}
				<Card className='p-5 sm:p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-all duration-200 group'>
					<div className='flex items-center justify-between'>
						<div className='space-y-1'>
							<p className='text-xs font-bold text-[#64748B] uppercase tracking-wider'>
								মোট ইউজার
							</p>
							<h3 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
								{stats.totalUsers}
							</h3>
						</div>
						<div className='h-12 w-12 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform'>
							<Users className='h-6 w-6 text-[#16A34A]' />
						</div>
					</div>
					<div className='mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs'>
						<Link
							href='/admin/users'
							className='text-[#16A34A] font-extrabold flex items-center gap-1 hover:underline'
						>
							সব ইউজার ম্যানেজ করুন <MoveRight className='h-3 w-3' />
						</Link>
					</div>
				</Card>

				{/* Total Stores */}
				<Card className='p-5 sm:p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-all duration-200 group'>
					<div className='flex items-center justify-between'>
						<div className='space-y-1'>
							<p className='text-xs font-bold text-[#64748B] uppercase tracking-wider'>
								মোট স্টোর
							</p>
							<h3 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
								{stats.totalStores}
							</h3>
						</div>
						<div className='h-12 w-12 bg-[#F3E8FF] border border-[#D8B4FE] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform'>
							<Store className='h-6 w-6 text-[#9333EA]' />
						</div>
					</div>
					<div className='mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs'>
						<Link
							href='/admin/shops'
							className='text-[#9333EA] font-extrabold flex items-center gap-1 hover:underline'
						>
							সব দোকান দেখুন <MoveRight className='h-3 w-3' />
						</Link>
					</div>
				</Card>

				{/* Total Products */}
				<Card className='p-5 sm:p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-all duration-200 group'>
					<div className='flex items-center justify-between'>
						<div className='space-y-1'>
							<p className='text-xs font-bold text-[#64748B] uppercase tracking-wider'>
								মোট পণ্য
							</p>
							<h3 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
								{stats.totalProducts}
							</h3>
						</div>
						<div className='h-12 w-12 bg-[#FFEDD5] border border-[#FDBA74] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform'>
							<Package className='h-6 w-6 text-[#EA580C]' />
						</div>
					</div>
					<div className='mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs'>
						<Link
							href='/admin/product-category'
							className='text-[#EA580C] font-extrabold flex items-center gap-1 hover:underline'
						>
							ক্যাটাগরি ম্যানেজমেন্ট <MoveRight className='h-3 w-3' />
						</Link>
					</div>
				</Card>
			</div>

			{/* ORDER STATUS BREAKDOWN GRID */}
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
				<Card className='p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#F5B800]/50 transition-colors'>
					<div className='flex items-center gap-3'>
						<div className='p-2.5 rounded-xl bg-[#FFF4CC] border border-[#FDE68A] text-[#B45309]'>
							<Clock className='h-4 w-4' />
						</div>
						<div>
							<p className='text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider'>
								অপেক্ষমান
							</p>
							<p className='text-lg font-black text-[#172033]'>
								{stats.pendingOrders}
							</p>
						</div>
					</div>
				</Card>

				<Card className='p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-blue-300 transition-colors'>
					<div className='flex items-center gap-3'>
						<div className='p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700'>
							<CheckCircle className='h-4 w-4' />
						</div>
						<div>
							<p className='text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider'>
								নিশ্চিত
							</p>
							<p className='text-lg font-black text-[#172033]'>
								{stats.confirmedOrders}
							</p>
						</div>
					</div>
				</Card>

				<Card className='p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-green-300 transition-colors'>
					<div className='flex items-center gap-3'>
						<div className='p-2.5 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D]'>
							<Truck className='h-4 w-4' />
						</div>
						<div>
							<p className='text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider'>
								ডেলিভারি
							</p>
							<p className='text-lg font-black text-[#172033]'>
								{stats.deliveredOrders}
							</p>
						</div>
					</div>
				</Card>

				<Card className='p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-red-300 transition-colors'>
					<div className='flex items-center gap-3'>
						<div className='p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-700'>
							<XCircle className='h-4 w-4' />
						</div>
						<div>
							<p className='text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider'>
								বাতিল
							</p>
							<p className='text-lg font-black text-[#172033]'>
								{stats.cancelledOrders}
							</p>
						</div>
					</div>
				</Card>
			</div>

			{/* REVENUE STATISTICS CARD */}
			<Card className='p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4'>
				<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4'>
					<div className='flex items-center gap-2.5'>
						<div className='w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#16A34A]'>
							<Coins className='h-5 w-5 text-[#16A34A]' />
						</div>
						<div>
							<h2 className='text-lg font-extrabold text-[#172033] tracking-tight'>
								আয় পরিসংখ্যান (Revenue Overview)
							</h2>
							<p className='text-xs text-[#64748B] font-medium'>
								প্ল্যাটফর্মের বিক্রয় ও অর্জিত রাজস্ব তথ্য
							</p>
						</div>
					</div>

					<Badge className='bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/40 text-sm font-black px-3.5 py-1.5 rounded-xl shadow-2xs'>
						মোট আয়: {formatCurrency(stats.totalRevenue)}
					</Badge>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 pt-1'>
					<div className='bg-[#FAFAF6] rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] space-y-1 shadow-2xs'>
						<p className='text-xs font-bold text-[#64748B] uppercase tracking-wider'>
							আজকের আয়
						</p>
						<p className='text-2xl font-black text-[#26351B]'>
							{formatCurrency(stats.todayRevenue)}
						</p>
					</div>

					<div className='bg-[#FAFAF6] rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] space-y-1 shadow-2xs'>
						<p className='text-xs font-bold text-[#64748B] uppercase tracking-wider'>
							সাপ্তাহিক আয়
						</p>
						<p className='text-2xl font-black text-[#26351B]'>
							{formatCurrency(stats.weekRevenue)}
						</p>
					</div>

					<div className='bg-[#FAFAF6] rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] space-y-1 shadow-2xs'>
						<p className='text-xs font-bold text-[#64748B] uppercase tracking-wider'>
							মাসিক আয়
						</p>
						<p className='text-2xl font-black text-[#26351B]'>
							{formatCurrency(stats.monthRevenue)}
						</p>
					</div>
				</div>
			</Card>

			{/* RECENT ORDERS TABLE */}
			<Card className='p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4 overflow-hidden'>
				<div className='flex justify-between items-center border-b border-[#E5E7EB] pb-4'>
					<div>
						<h2 className='text-lg font-extrabold text-[#172033] tracking-tight'>
							সাম্প্রতিক অর্ডার
						</h2>
						<p className='text-xs text-[#64748B] font-medium'>
							সর্বশেষ সম্পন্ন হওয়া অর্ডার তালিকা
						</p>
					</div>
					<Button
						variant='outline'
						size='sm'
						asChild
						className='rounded-xl border-[#E5E7EB] text-xs font-extrabold h-9 px-4 hover:bg-[#FAFAF6]'
					>
						<Link href='/admin/orders'>সব দেখুন →</Link>
					</Button>
				</div>

				{recentOrders.length > 0 ? (
					<div className='overflow-x-auto rounded-2xl border border-[#E5E7EB]'>
						<table className='w-full text-left border-collapse text-xs sm:text-sm'>
							<thead>
								<tr className='bg-[#FAFAF6] border-b border-[#E5E7EB] text-[#64748B] font-extrabold uppercase tracking-wider text-[11px]'>
									<th className='py-3.5 px-4'>অর্ডার ID</th>
									<th className='py-3.5 px-4'>ক্রেতা</th>
									<th className='py-3.5 px-4'>ফোন</th>
									<th className='py-3.5 px-4'>মোট</th>
									<th className='py-3.5 px-4'>স্ট্যাটাস</th>
									<th className='py-3.5 px-4'>তারিখ</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-[#E5E7EB] bg-white'>
								{recentOrders.map((order) => {
									const statusInfo =
										OrderService.getOrderStatusInfo(
											order.orderStatus
										);
									const grandTotal = OrderService.getOrderGrandTotal(order);

									return (
										<tr
											key={order.id}
											className='hover:bg-[#FFF9E8] transition-colors duration-150'
										>
											<td className='py-3.5 px-4 font-black text-[#172033]'>
												#{order.id.substring(0, 8)}
											</td>
											<td className='py-3.5 px-4 text-[#172033] font-bold'>
												{order.name}
											</td>
											<td className='py-3.5 px-4 text-[#64748B] font-semibold'>
												{order.phoneNumber}
											</td>
											<td className='py-3.5 px-4 font-black text-[#26351B] text-base'>
												{formatCurrency(grandTotal)}
											</td>
											<td className='py-3.5 px-4'>
												<span
													className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${statusInfo.color} ${statusInfo.textColor}`}
												>
													{statusInfo.label}
												</span>
											</td>
											<td className='py-3.5 px-4 text-[#64748B] font-medium text-xs'>
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
					<div className='text-center py-12 bg-[#FAFAF6] rounded-2xl border border-[#E5E7EB]'>
						<ShoppingCart className='h-10 w-10 mx-auto mb-2 text-[#64748B]/40' />
						<p className='text-xs font-bold text-[#64748B]'>
							এখনো কোনো অর্ডার পাওয়া যায়নি
						</p>
					</div>
				)}
			</Card>
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className='space-y-6 w-full mx-auto pb-6 animate-pulse'>
			<div className='flex flex-col md:flex-row justify-between gap-4 p-6 bg-white rounded-2xl border border-[#E5E7EB]'>
				<div>
					<Skeleton className='h-8 w-56 mb-2 rounded-lg' />
					<Skeleton className='h-4 w-72 rounded-md' />
				</div>
				<div className='flex gap-2'>
					<Skeleton className='h-10 w-36 rounded-xl' />
					<Skeleton className='h-10 w-36 rounded-xl' />
				</div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{[1, 2, 3, 4].map((i) => (
					<Card key={i} className='p-6 bg-white rounded-2xl border border-[#E5E7EB]'>
						<div className='flex items-center justify-between'>
							<div>
								<Skeleton className='h-4 w-20 mb-2 rounded-md' />
								<Skeleton className='h-8 w-16 rounded-lg' />
							</div>
							<Skeleton className='h-12 w-12 rounded-2xl' />
						</div>
						<Skeleton className='h-4 w-32 mt-3 rounded-md' />
					</Card>
				))}
			</div>

			<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
				{[1, 2, 3, 4].map((i) => (
					<Card key={i} className='p-4 bg-white rounded-2xl border border-[#E5E7EB]'>
						<Skeleton className='h-10 w-full rounded-xl' />
					</Card>
				))}
			</div>

			<Card className='p-6 bg-white rounded-2xl border border-[#E5E7EB]'>
				<Skeleton className='h-6 w-40 mb-4 rounded-lg' />
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className='h-20 w-full rounded-2xl' />
					))}
				</div>
			</Card>
		</div>
	);
}
