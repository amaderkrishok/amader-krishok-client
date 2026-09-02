'use client';

import { useState, useEffect } from 'react';
import { OrderService } from '@/services/order-service';
import { OrderFilters, OrderStatus } from '@/types/order';
import { Order, OrdersResponse } from '@/types/order';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, PackageCheck, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { OrderFilter } from '@/components/dashbaord/orders/order-filter';
import { OrderList } from '@/components/dashbaord/orders/order-list';
import { useSession } from '@/components/providers/session-provider';

export default function VendorOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [response, setResponse] = useState<OrdersResponse | null>(null);
	const { user } = useSession();
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState<OrderFilters>({
		page: 1,
		limit: 10,
	});

	const [storeId, setStoreId] = useState<string | null>(null);

	useEffect(() => {
		if (user?.storeId) {
			setStoreId(user.storeId);
		}
	}, [user]);

	useEffect(() => {
		const fetchOrders = async () => {
			if (!storeId) return;

			setLoading(true);
			try {
				const result = await OrderService.getStoreOrders(storeId, filters);
				setOrders(result.data || []);
				setResponse(result);
			} catch (error) {
				console.error('Error fetching orders:', error);
				toast.error('অর্ডার লোড করতে সমস্যা হয়েছে।');
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [filters, storeId]);

	const handleFilterChange = (newFilters: OrderFilters) => {
		setFilters({ ...newFilters, page: 1 });
	};

	const handlePageChange = (page: number) => {
		setFilters((prev) => ({ ...prev, page }));
	};

	const handleOrderUpdated = (updatedOrder: Order) => {
		setOrders((currentOrders) =>
			currentOrders.map((order) =>
				order.id === updatedOrder.id ? updatedOrder : order
			)
		);

		if (response) {
			const updatedData = response.data.map((order) =>
				order.id === updatedOrder.id ? updatedOrder : order
			);

			setResponse({
				...response,
				data: updatedData,
			});
		}
	};

	// Real Data KPI Summary Counters
	const totalCount = response?.meta?.totalItems || orders.length;
	const pendingCount = orders.filter(
		(o) => o.orderStatus === OrderStatus.PENDING
	).length;
	const confirmedCount = orders.filter(
		(o) => o.orderStatus === OrderStatus.CONFIRMED
	).length;
	const deliveredCount = orders.filter(
		(o) => o.orderStatus === OrderStatus.DELIVERED
	).length;

	return (
		<div className='p-4 sm:p-6 lg:p-8 space-y-6 w-full min-h-screen bg-[#F7F6F0] selection:bg-[#F5B800] selection:text-[#172033]'>
			{/* HERO PAGE HEADER */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-7 rounded-[18px] border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
				<div className='space-y-1.5 z-10'>
					<div className='flex items-center gap-2.5'>
						<div className='p-2 rounded-xl bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/30'>
							<ShoppingBag className='w-5 h-5 text-[#26351B]' />
						</div>
						<h1 className='text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight'>
							অর্ডার ম্যানেজমেন্ট
						</h1>
					</div>
					<p className='text-sm text-[#64748B] font-medium'>
						আপনার দোকানের সকল অর্ডার দেখুন এবং পরিচালনা করুন।
					</p>
				</div>

				<div className='flex items-center gap-2 bg-[#FAFAF6] px-4 py-2 rounded-xl border border-[#E5E7EB] z-10'>
					<span className='text-xs font-semibold text-[#64748B]'>মোট অর্ডার:</span>
					<span className='text-sm font-black text-[#26351B]'>{totalCount}টি</span>
				</div>
			</div>

			{!storeId ? (
				<div className='text-center py-12 bg-white rounded-[18px] border border-[#E5E7EB] p-8 shadow-xs'>
					<p className='text-sm font-bold text-[#64748B]'>
						আপনার কোন স্টোর নেই। আপনি যদি ভেন্ডর হন, তাহলে প্রথমে একটি স্টোর তৈরি করুন।
					</p>
				</div>
			) : (
				<div className='space-y-6'>
					{/* 2. ORDER SUMMARY CARDS (KPIs) */}
					<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
						{/* Total Orders */}
						<div className='bg-white p-4.5 rounded-[18px] border border-[#E5E7EB] shadow-xs space-y-1 flex items-center justify-between'>
							<div>
								<p className='text-xs font-extrabold text-[#64748B] uppercase tracking-wider'>
									মোট অর্ডার
								</p>
								<p className='text-2xl font-black text-[#172033] mt-1'>{totalCount}</p>
							</div>
							<div className='p-2.5 rounded-xl bg-[#FAFAF6] text-[#26351B] border border-[#E5E7EB]'>
								<PackageCheck className='w-5 h-5 text-[#26351B]' />
							</div>
						</div>

						{/* Pending */}
						<div className='bg-[#FFF9E8] p-4.5 rounded-[18px] border border-[#F5B800]/40 shadow-xs space-y-1 flex items-center justify-between'>
							<div>
								<p className='text-xs font-extrabold text-[#B45309] uppercase tracking-wider'>
									অপেক্ষমান
								</p>
								<p className='text-2xl font-black text-[#B45309] mt-1'>{pendingCount}</p>
							</div>
							<div className='p-2.5 rounded-xl bg-white text-[#B45309] border border-[#F5B800]/40'>
								<Clock className='w-5 h-5 text-[#B45309]' />
							</div>
						</div>

						{/* Confirmed */}
						<div className='bg-[#EFF6FF] p-4.5 rounded-[18px] border border-[#93C5FD] shadow-xs space-y-1 flex items-center justify-between'>
							<div>
								<p className='text-xs font-extrabold text-[#1D4ED8] uppercase tracking-wider'>
									নিশ্চিত
								</p>
								<p className='text-2xl font-black text-[#1D4ED8] mt-1'>{confirmedCount}</p>
							</div>
							<div className='p-2.5 rounded-xl bg-white text-[#1D4ED8] border border-[#93C5FD]'>
								<CheckCircle2 className='w-5 h-5 text-[#1D4ED8]' />
							</div>
						</div>

						{/* Completed / Delivered */}
						<div className='bg-[#ECFDF5] p-4.5 rounded-[18px] border border-[#A7F3D0] shadow-xs space-y-1 flex items-center justify-between'>
							<div>
								<p className='text-xs font-extrabold text-[#15803D] uppercase tracking-wider'>
									সম্পন্ন
								</p>
								<p className='text-2xl font-black text-[#15803D] mt-1'>{deliveredCount}</p>
							</div>
							<div className='p-2.5 rounded-xl bg-white text-[#15803D] border border-[#A7F3D0]'>
								<CheckCircle2 className='w-5 h-5 text-[#15803D]' />
							</div>
						</div>
					</div>

					{/* 3. ORDER FILTER TOOLBAR */}
					<OrderFilter onChange={handleFilterChange} initialFilters={filters} />

					{/* 4. ORDERS LIST / TABLE */}
					<OrderList
						orders={orders}
						meta={response?.meta || null}
						links={response?.links || null}
						onPageChange={handlePageChange}
						onOrderUpdated={handleOrderUpdated}
						isLoading={loading}
					/>
				</div>
			)}
		</div>
	);
}
