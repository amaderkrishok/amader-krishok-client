import { OrderItem } from '@/types/order';
import Image from 'next/image';
import React from 'react';

interface OrderItemsTableProps {
	items: OrderItem[];
	totalAmount: string;
}

export function OrderItemsTable({ items, totalAmount }: OrderItemsTableProps) {
	return (
		<div className='mt-8'>
			<h2 className='text-lg font-semibold mb-4'>অর্ডার করা পণ্যসমূহ</h2>

			{/* Desktop Table - Hidden on mobile */}
			<div className='hidden md:block border rounded-lg overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								<th
									scope='col'
									className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									পণ্য
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									পরিমাণ
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									মূল্য
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									মোট
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{items.map((item) => (
								<tr key={item.id} className='hover:bg-gray-50'>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='flex items-center'>
											<div className='flex-shrink-0 h-12 w-12 rounded bg-gray-100 overflow-hidden relative'>
												<Image
													src={
														item.productImage ||
														'/images/product-placeholder.png'
													}
													alt={item.productName}
													fill
													sizes='(max-width: 48px) 100vw'
													className='object-cover'
												/>
											</div>
											<div className='ml-4'>
												<div className='text-sm font-medium text-gray-900'>
													{item.productName}
												</div>
												{item.variantName && (
													<div className='text-sm text-gray-500'>
														ভেরিয়েন্ট: {item.variantName}
													</div>
												)}
											</div>
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-900'>{item.quantity}</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-right'>
										<div className='text-sm text-gray-900'>
											{item.price.toString()} টাকা
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-right'>
										<div className='text-sm font-medium text-gray-900'>
											{item.total.toString()} টাকা
										</div>
									</td>
								</tr>
							))}
						</tbody>
						<tfoot className='bg-gray-50'>
							<tr className='bg-gray-100'>
								<td
									colSpan={3}
									className='px-6 py-4 text-right text-base font-semibold text-gray-900'
								>
									সর্বমোট:
								</td>
								<td className='px-6 py-4 text-right whitespace-nowrap text-base font-semibold text-gray-900'>
									{totalAmount} টাকা
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>

			{/* Mobile Card View - Shown only on mobile */}
			<div className='md:hidden space-y-4'>
				{items.map((item) => (
					<div key={item.id} className='border rounded-lg bg-white p-4'>
						<div className='flex gap-3'>
							<div className='h-16 w-16 rounded bg-gray-100 overflow-hidden relative flex-shrink-0'>
								<Image
									src={item.productImage || '/images/product-placeholder.png'}
									alt={item.productName}
									fill
									sizes='(max-width: 64px) 100vw'
									className='object-cover'
								/>
							</div>

							<div className='flex-1 min-w-0'>
								<h4 className='font-medium text-gray-900 truncate'>
									{item.productName}
								</h4>
								{item.variantName && (
									<p className='text-sm text-gray-500'>
										ভেরিয়েন্ট: {item.variantName}
									</p>
								)}
							</div>
						</div>

						<div className='grid grid-cols-2 gap-2 mt-4 text-sm'>
							<div>
								<span className='text-gray-500 block'>পরিমাণ:</span>
								<span>{item.quantity}</span>
							</div>
							<div>
								<span className='text-gray-500 block'>মূল্য:</span>
								<span>{item.price.toString()} টাকা</span>
							</div>
							<div className='col-span-2 pt-2 border-t'>
								<span className='text-gray-500'>আইটেম মোট:</span>
								<span className='font-medium float-right'>
									{item.total.toString()} টাকা
								</span>
							</div>
						</div>
					</div>
				))}

				{/* Mobile Total */}
				<div className='bg-gray-100 rounded-lg p-4 mt-4'>
					<div className='flex justify-between items-center'>
						<span className='font-semibold'>সর্বমোট:</span>
						<span className='font-semibold text-right'>{totalAmount} টাকা</span>
					</div>
				</div>
			</div>
		</div>
	);
}
