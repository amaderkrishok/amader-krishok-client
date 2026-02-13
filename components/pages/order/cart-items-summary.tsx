import { useCart } from '@/context/cart-context';
import React from 'react';

interface CartItemsSummaryProps {
	items: ReturnType<typeof useCart>['items'];
}

export function CartItemsSummary({ items }: CartItemsSummaryProps) {
	if (items.length === 0) {
		return <p className='text-center py-6'>আপনার কার্টে কোন পণ্য নেই</p>;
	}

	return (
		<ul className='space-y-4'>
			{items.map((item) => {
				const isVariable = item.product.productType === 'VARIABLE';
				const price = isVariable
					? item.selectedVariant?.discountPrice || item.selectedVariant?.price
					: item.product.simpleProduct?.discountPrice ||
					  item.product.simpleProduct?.price;

				const formattedPrice = Number(price).toFixed(2);
				const totalPrice = (Number(price) * item.quantity).toFixed(2);

				return (
					<li
						key={`${item.productId}-${item.variantId || 'simple'}`}
						className='flex gap-4 py-3 border-b'
					>
						<div className='w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0'>
							{isVariable && item.selectedVariant?.images?.[0] ? (
								<img
									src={item.selectedVariant.images[0].imageUrl}
									alt={item.product.name}
									className='w-full h-full object-cover'
								/>
							) : item.product.simpleProduct?.images?.[0] ? (
								<img
									src={item.product.simpleProduct.images[0].imageUrl}
									alt={item.product.name}
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-400'>
									No image
								</div>
							)}
						</div>

						<div className='flex-grow'>
							<h4 className='font-medium'>{item.product.name}</h4>

							{isVariable && item.selectedVariant && (
								<p className='text-sm text-gray-600'>
									ভেরিয়েন্ট: {item.selectedVariant.variantName}
								</p>
							)}

							<div className='flex justify-between mt-2'>
								<div className='text-sm'>
									<span className='text-gray-600'>
										{formattedPrice} টাকা × {item.quantity}
									</span>
								</div>
								<div className='font-medium'>{totalPrice} টাকা</div>
							</div>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
