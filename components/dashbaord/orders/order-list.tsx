'use client';

import { useState } from 'react';
import { Order } from '@/types/order';
import { OrderListItem } from './order-list-item';
import { OrderDetailsModal } from './order-details-modal';
import { OrderPagination } from './order-pagination';
import { Package } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
	isLoading?: boolean;
}

export function OrderList({
	orders,
	meta,
	onPageChange,
	onOrderUpdated,
	isLoading = false,
}: OrderListProps) {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	const handleViewDetails = (order: Order) => {
		setSelectedOrder(order);
	};

	const handleCloseDetails = () => {
		setSelectedOrder(null);
	};

	/* 12. EMPTY STATE */
	if (!isLoading && orders.length === 0) {
		return (
			<Card className='rounded-[18px] border border-[#E5E7EB] bg-white p-12 text-center shadow-xs'>
				<div className='max-w-sm mx-auto space-y-3'>
					<div className='w-16 h-16 bg-[#FFF9E8] rounded-full flex items-center justify-center mx-auto border border-[#F5B800]/40 shadow-xs'>
						<Package className='w-8 h-8 text-[#26351B]' />
					</div>
					<div className='space-y-1'>
						<h3 className='text-base font-extrabold text-[#172033]'>
							কোনো অর্ডার পাওয়া যায়নি
						</h3>
						<p className='text-xs text-[#64748B] font-medium'>
							আপনার দোকানে এখনো কোনো অর্ডার আসেনি।
						</p>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<div className='space-y-4'>
			{/* 4. ORDER TABLE CONTAINER */}
			<Card className='rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs overflow-hidden'>
				{/* Table Header */}
				<div className='hidden md:grid grid-cols-12 bg-[#FAFAF6] px-5 py-3.5 border-b border-[#E5E7EB] text-xs font-extrabold uppercase tracking-wider text-[#172033]'>
					<div className='col-span-3'>অর্ডার আইডি ও স্ট্যাটাস</div>
					<div className='col-span-3'>গ্রাহক</div>
					<div className='col-span-3'>মোট মূল্য</div>
					<div className='col-span-3 text-right'>অ্যাকশন</div>
				</div>

				{/* Order Rows */}
				<div className='divide-y divide-[#E5E7EB]'>
					{orders.map((order) => (
						<OrderListItem
							key={order.id}
							order={order}
							onViewDetails={handleViewDetails}
							onOrderUpdated={onOrderUpdated}
						/>
					))}
				</div>

				{/* 13. PAGINATION */}
				{meta && onPageChange && meta.totalPages > 1 && (
					<div className='p-4 border-t border-[#E5E7EB] bg-[#FAFAF6]'>
						<OrderPagination
							currentPage={meta.currentPage}
							totalPages={meta.totalPages}
							onPageChange={onPageChange}
						/>
					</div>
				)}
			</Card>

			{/* Order Details Modal */}
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
