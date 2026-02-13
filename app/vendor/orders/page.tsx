'use client';

import { useState, useEffect } from 'react';
import { OrderService } from '@/services/order-service';
import { OrderFilters } from '@/types/order';
import { Order, OrdersResponse } from '@/types/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
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

				setOrders(result.data);
				console.log('Orders data:', result.data);

				setResponse(result);
				console.log('Response state:', result);
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
		// Update the orders array
		setOrders((currentOrders) =>
			currentOrders.map((order) =>
				order.id === updatedOrder.id ? updatedOrder : order
			)
		);

		// Update the full response
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

	return (
		<div className='container mx-auto py-8 px-4'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold mb-2 dark:text-white'>
					অর্ডার ম্যানেজমেন্ট
				</h1>
				<p className='text-gray-600 dark:text-gray-300'>
					আপনার দোকানের সকল অর্ডার দেখুন এবং পরিচালনা করুন।
				</p>
			</div>

			{!storeId ? (
				<div className='text-center py-12'>
					<p className='text-gray-500 dark:text-gray-400'>
						আপনার কোন স্টোর নেই। আপনি যদি ভেন্ডর হন, তাহলে প্রথমে একটি স্টোর
						তৈরি করুন।
					</p>
				</div>
			) : (
				<Card className='dark:border-gray-700 dark:bg-gray-800'>
					<CardHeader>
						<CardTitle className='dark:text-white'>অর্ডার সমূহ</CardTitle>
					</CardHeader>

					<CardContent>
						<OrderFilter
							onChange={handleFilterChange}
							initialFilters={filters}
						/>

						{loading ? (
							<div className='flex justify-center items-center py-12'>
								<Loader2 className='h-8 w-8 text-primary animate-spin' />
								<span className='ml-2 dark:text-white'>
									অর্ডার লোড হচ্ছে...
								</span>
							</div>
						) : (
							<OrderList
								orders={orders}
								meta={response?.meta || null}
								links={response?.links || null}
								onPageChange={handlePageChange}
								onOrderUpdated={handleOrderUpdated}
							/>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
