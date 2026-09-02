'use client';

import { useState, useEffect } from 'react';
import { OrderService } from '@/services/order-service';
import { OrderFilters, Order } from '@/types/order';
import { PaginatedResponse } from '@/types/pagination/pagination';
import { Card } from '@/components/ui/card';
import { Loader2, ShoppingCart, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { OrderFilter } from '@/components/dashbaord/orders/order-filter';
import { OrderList } from '@/components/dashbaord/orders/order-list';

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<PaginatedResponse<Order> | null>(null);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState<OrderFilters>({
		page: 1,
		limit: 10,
	});

	useEffect(() => {
		const fetchOrders = async () => {
			setLoading(true);
			try {
				const result = await OrderService.getAllOrders(filters);
				setOrders(result);
			} catch (error) {
				console.error('Error fetching orders:', error);
				toast.error('অর্ডার লোড করতে সমস্যা হয়েছে।');
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [filters]);

	const handleFilterChange = (newFilters: OrderFilters) => {
		setFilters({ ...newFilters, page: 1 });
	};

	const handlePageChange = (page: number) => {
		setFilters((prev) => ({ ...prev, page }));
	};

	const totalItems = orders?.meta?.totalItems || orders?.data?.length || 0;

	return (
		<div className='space-y-6 w-full mx-auto pb-6'>
			{/* HERO HEADER */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#FFF9E8] via-white to-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
				<div className='space-y-1.5 z-10'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 rounded-xl bg-[#26351B] flex items-center justify-center text-[#F5B800] shadow-2xs'>
							<ShoppingCart className='w-4 h-4 text-[#F5B800]' />
						</div>
						<h1 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
							সকল অর্ডার (All Orders)
						</h1>
					</div>
					<p className='text-xs sm:text-sm text-[#64748B] font-medium'>
						প্ল্যাটফর্মের সমস্ত কাস্টমার অর্ডার পর্যবেক্ষণ, ফিল্টার ও স্ট্যাটাস পরিচালনা করুন
					</p>
				</div>

				<div className='bg-[#FFF4CC] px-4 py-2 rounded-xl border border-[#F5B800]/40 text-xs font-black text-[#26351B] shadow-2xs'>
					সর্বমোট {totalItems} টি অর্ডার
				</div>
			</div>

			{/* MAIN CARD CONTAINER */}
			<Card className='p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6'>
				<div className='border-b border-[#E5E7EB] pb-4 flex items-center justify-between'>
					<h2 className='text-lg font-extrabold text-[#172033] flex items-center gap-2'>
						<ShieldCheck className='w-5 h-5 text-[#26351B]' />
						অর্ডার ফিল্টার ও লিস্ট
					</h2>
				</div>

				{/* Order Filter */}
				<OrderFilter
					onChange={handleFilterChange}
					initialFilters={filters}
					showStoreFilter={true}
				/>

				{/* Order List */}
				{loading ? (
					<div className='flex flex-col justify-center items-center py-16 bg-[#FAFAF6] rounded-2xl border border-[#E5E7EB] space-y-3'>
						<Loader2 className='h-8 w-8 text-[#26351B] animate-spin' />
						<span className='text-xs font-bold text-[#64748B]'>
							অর্ডার লোড হচ্ছে...
						</span>
					</div>
				) : (
					<OrderList
						orders={orders?.data || []}
						pagination={orders || undefined}
						onPageChange={handlePageChange}
					/>
				)}
			</Card>
		</div>
	);
}