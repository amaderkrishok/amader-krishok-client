'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Package, CreditCard, Bookmark } from 'lucide-react';
import { OrderService } from '@/services/order-service';
import { useSession } from '@/components/providers/session-provider';
import { useSavedProducts } from '@/context/saved-products-context';
import { OrderStatus, type Order } from '@/types/order';

interface OrderStats {
	totalOrders: number;
	activeOrders: number;
	totalSpent: number;
	isLoading: boolean;
}

export function StatsCards() {
	const { user, isAuthenticated } = useSession();
	const { savedProducts } = useSavedProducts();
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
					limit: 1000,
				});

				if (response.statusCode === 200 && response.data) {
					const orders: Order[] = response.data;

					const totalOrders = orders.length;
					const activeOrders = orders.filter(
						(order) =>
							order.orderStatus === OrderStatus.PENDING ||
							order.orderStatus === OrderStatus.CONFIRMED
					).length;

					const totalSpent = orders.reduce((sum, order) => {
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

	const formatCurrency = (amount: number) => {
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

	if (stats.isLoading) {
		return (
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full'>
				{[1, 2, 3, 4].map((i) => (
					<Card key={i} className='bg-white rounded-2xl border border-[#E5E7EB] p-5 animate-pulse space-y-3'>
						<div className='flex justify-between items-center'>
							<div className='h-4 w-20 bg-gray-200 rounded-md'></div>
							<div className='h-9 w-9 bg-gray-200 rounded-xl'></div>
						</div>
						<div className='h-8 w-24 bg-gray-200 rounded-md'></div>
						<div className='h-3 w-32 bg-gray-200 rounded-md'></div>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full'>
			{/* 1. TOTAL ORDERS CARD */}
			<Card className='bg-[#F4F6F0] border border-[#28321A]/15 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group'>
				<CardHeader className='p-0 flex flex-row items-center justify-between space-y-0 pb-3'>
					<CardTitle className='text-xs sm:text-sm font-bold text-[#28321A]'>মোট অর্ডার</CardTitle>
					<div className='p-2.5 rounded-xl bg-[#28321A] text-white shadow-xs group-hover:scale-110 transition-transform'>
						<ShoppingBag className='h-4.5 w-4.5 text-[#F4B400]' />
					</div>
				</CardHeader>
				<CardContent className='p-0 space-y-1'>
					<div className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
						{stats.totalOrders}
					</div>
					<p className='text-[11px] sm:text-xs text-[#667085] font-semibold'>সর্বমোট অর্ডার সংখ্যা</p>
				</CardContent>
			</Card>

			{/* 2. ACTIVE ORDERS CARD */}
			<Card className='bg-[#FFF4CC] border border-[#FDE68A] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group'>
				<CardHeader className='p-0 flex flex-row items-center justify-between space-y-0 pb-3'>
					<CardTitle className='text-xs sm:text-sm font-bold text-[#B45309]'>সক্রিয় অর্ডার</CardTitle>
					<div className='p-2.5 rounded-xl bg-[#B45309] text-white shadow-xs group-hover:scale-110 transition-transform'>
						<Package className='h-4.5 w-4.5 text-[#FFF4CC]' />
					</div>
				</CardHeader>
				<CardContent className='p-0 space-y-1'>
					<div className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
						{stats.activeOrders}
					</div>
					<p className='text-[11px] sm:text-xs text-[#B45309]/80 font-semibold'>প্রক্রিয়াধীন ও নিশ্চিত অর্ডার</p>
				</CardContent>
			</Card>

			{/* 3. TOTAL SPENT CARD */}
			<Card className='bg-[#FFF9E8] border border-[#F4B400]/30 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group'>
				<CardHeader className='p-0 flex flex-row items-center justify-between space-y-0 pb-3'>
					<CardTitle className='text-xs sm:text-sm font-bold text-[#28321A]'>মোট খরচ</CardTitle>
					<div className='p-2.5 rounded-xl bg-[#F4B400] text-[#172033] shadow-xs group-hover:scale-110 transition-transform'>
						<CreditCard className='h-4.5 w-4.5 text-[#172033]' />
					</div>
				</CardHeader>
				<CardContent className='p-0 space-y-1'>
					<div className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight truncate'>
						{formatCurrency(stats.totalSpent)}
					</div>
					<p className='text-[11px] sm:text-xs text-[#667085] font-semibold'>সর্বমোট ব্যয়ের পরিমাণ</p>
				</CardContent>
			</Card>

			{/* 4. SAVED PRODUCTS CARD */}
			<Card className='bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group'>
				<CardHeader className='p-0 flex flex-row items-center justify-between space-y-0 pb-3'>
					<CardTitle className='text-xs sm:text-sm font-bold text-[#15803D]'>সংরক্ষিত পণ্য</CardTitle>
					<div className='p-2.5 rounded-xl bg-[#15803D] text-white shadow-xs group-hover:scale-110 transition-transform'>
						<Bookmark className='h-4.5 w-4.5 text-white' />
					</div>
				</CardHeader>
				<CardContent className='p-0 space-y-1'>
					<div className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
						{savedProducts ? savedProducts.length : 0}
					</div>
					<p className='text-[11px] sm:text-xs text-[#15803D]/80 font-semibold'>বুকমার্ক করা পণ্যসমূহ</p>
				</CardContent>
			</Card>
		</div>
	);
}
