'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, ShoppingBag, Calendar, Wallet } from 'lucide-react';
import { OrderService } from '@/services/order-service';
import { useSession } from '@/components/providers/session-provider';
import type { Order } from '@/types/order';

export function SpendingSummary() {
	const { user, isAuthenticated } = useSession();
	const [totalSpent, setTotalSpent] = useState(0);
	const [monthlySpent, setMonthlySpent] = useState(0);
	const [totalOrders, setTotalOrders] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSummary = async () => {
			if (!isAuthenticated || !user?.id) {
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				const response = await OrderService.getUserOrders(user.id, { limit: 1000 });

				if (response.statusCode === 200 && response.data) {
					const orders: Order[] = response.data;
					setTotalOrders(orders.length);

					const now = new Date();
					const currentMonth = now.getMonth();
					const currentYear = now.getFullYear();

					let total = 0;
					let monthTotal = 0;

					orders.forEach((o) => {
						const amt = typeof o.totalAmount === 'string' ? parseFloat(o.totalAmount) : o.totalAmount || 0;
						total += amt;

						if (o.orderDate) {
							const d = new Date(o.orderDate);
							if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
								monthTotal += amt;
							}
						}
					});

					setTotalSpent(total);
					setMonthlySpent(monthTotal);
				}
			} catch (err) {
				console.error('Error calculating spending summary:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchSummary();
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

	if (loading) {
		return (
			<Card className='bg-white rounded-3xl border border-[#E5E7EB] p-6 animate-pulse space-y-4'>
				<div className='h-5 w-40 bg-gray-200 rounded'></div>
				<div className='grid grid-cols-3 gap-4 pt-2'>
					<div className='h-12 bg-gray-100 rounded-xl'></div>
					<div className='h-12 bg-gray-100 rounded-xl'></div>
					<div className='h-12 bg-gray-100 rounded-xl'></div>
				</div>
			</Card>
		);
	}

	return (
		<Card className='bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='space-y-1'>
					<h3 className='text-lg font-extrabold text-[#172033] flex items-center gap-2'>
						<Wallet className='w-5 h-5 text-[#F4B400]' />
						আপনার কেনাকাটার সারাংশ
					</h3>
					<p className='text-xs text-[#667085] font-medium'>
						কেনাকাটার খরচ ও অর্ডারের সার্বিক চিত্র
					</p>
				</div>

				<div className='p-2.5 rounded-xl bg-[#FFF9E8] border border-[#F4B400]/30 text-[#28321A]'>
					<TrendingUp className='w-5 h-5 text-[#28321A]' />
				</div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
				<div className='p-4 bg-[#F4F6F0] rounded-2xl border border-[#28321A]/10 space-y-1'>
					<span className='text-xs font-bold text-[#667085] flex items-center gap-1'>
						<Wallet className='w-3.5 h-3.5 text-[#28321A]' />
						মোট খরচ
					</span>
					<div className='text-2xl font-black text-[#172033] tracking-tight'>
						{formatCurrency(totalSpent)}
					</div>
				</div>

				<div className='p-4 bg-[#FFF9E8] rounded-2xl border border-[#F4B400]/30 space-y-1'>
					<span className='text-xs font-bold text-[#B45309] flex items-center gap-1'>
						<Calendar className='w-3.5 h-3.5 text-[#B45309]' />
						এই মাসে খরচ
					</span>
					<div className='text-2xl font-black text-[#172033] tracking-tight'>
						{formatCurrency(monthlySpent)}
					</div>
				</div>

				<div className='p-4 bg-gray-50 rounded-2xl border border-[#E5E7EB] space-y-1'>
					<span className='text-xs font-bold text-[#667085] flex items-center gap-1'>
						<ShoppingBag className='w-3.5 h-3.5 text-[#28321A]' />
						অর্ডার সংখ্যা
					</span>
					<div className='text-2xl font-black text-[#172033] tracking-tight'>
						{totalOrders} টি
					</div>
				</div>
			</div>
		</Card>
	);
}
