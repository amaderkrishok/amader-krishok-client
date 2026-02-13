import { useState } from 'react';
import { Order } from '@/types/order';
import { OrderListItem } from './order-list-item';
import { OrderDetailsModal } from './order-details-modal';
import { OrderPagination } from './order-pagination';

interface OrderListProps {
	orders: Order[];
	meta?: {
		itemsPerPage: number;
		totalItems: number;
		currentPage: number;
		totalPages: number;
	} | null;
	links?: {
		first: string;
		last: string;
		current: string;
		next?: string | null;
		previous?: string | null;
	} | null;
	onPageChange?: (page: number) => void;
	onOrderUpdated?: (updatedOrder: Order) => void;
}

export function OrderList({
	orders,
	meta,
	onPageChange,
	onOrderUpdated,
}: OrderListProps) {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	const handleViewDetails = (order: Order) => {
		setSelectedOrder(order);
	};

	const handleCloseDetails = () => {
		setSelectedOrder(null);
	};

	if (orders.length === 0) {
		return (
			<div className='text-center py-10'>
				<p className='text-gray-500 dark:text-gray-400'>
					কোন অর্ডার পাওয়া যায়নি
				</p>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='rounded-md border dark:border-gray-700 overflow-hidden'>
				<div className='bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700 grid grid-cols-4'>
					<span className='font-medium dark:text-gray-200'>অর্ডার আইডি</span>
					<span className='font-medium dark:text-gray-200'>গ্রাহক</span>
					<span className='font-medium dark:text-gray-200'>মোট</span>
					<span className='font-medium dark:text-gray-200 text-right'>
						অ্যাকশন
					</span>
				</div>

				<div className='divide-y dark:divide-gray-700'>
					{orders.map((order) => (
						<OrderListItem
							key={order.id}
							order={order}
							onViewDetails={handleViewDetails}
							onOrderUpdated={onOrderUpdated}
						/>
					))}
				</div>
			</div>

			{meta && onPageChange && (
				<OrderPagination
					currentPage={meta.currentPage}
					totalPages={meta.totalPages}
					onPageChange={onPageChange}
				/>
			)}

			{selectedOrder && (
				<OrderDetailsModal
					order={selectedOrder}
					isOpen={!!selectedOrder}
					onClose={handleCloseDetails}
				/>
			)}
		</div>
	);
}
