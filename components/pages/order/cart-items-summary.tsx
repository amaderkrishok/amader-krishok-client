import { useCart } from '@/context/cart-context';
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '../marketplace/cart/cart-drawer';

interface CartItemsSummaryProps {
	items: ReturnType<typeof useCart>['items'];
}

export function CartItemsSummary({ items }: CartItemsSummaryProps) {
	if (items.length === 0) {
		return (
			<div className='bg-white p-6 rounded-[20px] border border-[#E5E7EB] text-center text-[#667085] py-8'>
				আপনার কার্টে কোন পণ্য নেই
			</div>
		);
	}

	return (
		<div className='bg-white p-6 rounded-[20px] border border-[#E5E7EB] shadow-xs'>
			<div className='flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-4'>
				<h2 className='text-lg font-extrabold text-[#28321A] flex items-center gap-2'>
					<ShoppingBag className='w-4 h-4 text-[#28321A]' />
					<span>আপনার পণ্যসমূহ</span>
				</h2>
				<span className='text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFF4CC] text-[#28321A] border border-[#F4B400]/30'>
					{items.length} টি পণ্য
				</span>
			</div>

			<ul className='space-y-4'>
				{items.map((item, index) => {
					const isVariable = item.product.productType === 'VARIABLE';
					const price = isVariable
						? item.selectedVariant?.discountPrice != null
							? Number(item.selectedVariant.discountPrice)
							: Number(item.selectedVariant?.price || 0)
						: item.product.simpleProduct?.discountPrice != null
						? Number(item.product.simpleProduct.discountPrice)
						: Number(item.product.simpleProduct?.price || 0);

					const formattedUnitPrice = formatPrice(price);
					const formattedTotalPrice = formatPrice(price * item.quantity);

					// Image resolution
					let imageUrl = '/placeholder.svg';
					if (isVariable && item.selectedVariant?.images?.[0]) {
						imageUrl = item.selectedVariant.images[0].imageUrl;
					} else if (item.product.simpleProduct?.images?.[0]) {
						imageUrl = item.product.simpleProduct.images[0].imageUrl;
					}

					return (
						<li
							key={`${item.productId}-${item.variantId || 'simple'}`}
							className={`flex gap-3.5 items-center ${
								index !== items.length - 1
									? 'border-b border-[#E5E7EB]/80 pb-4'
									: ''
							}`}
						>
							<div className='w-[72px] h-[72px] bg-gray-50 rounded-[14px] overflow-hidden flex-shrink-0 border border-gray-100 relative group'>
								<img
									src={imageUrl}
									alt={item.product.name}
									className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
								/>
							</div>

							<div className='flex-grow min-w-0'>
								<h4 className='font-bold text-sm text-[#172033] line-clamp-1'>
									{item.product.name}
								</h4>

								{isVariable && item.selectedVariant && (
									<p className='text-xs text-[#667085] mt-0.5'>
										ধরণ: {item.selectedVariant.variantName}
									</p>
								)}

								<div className='flex items-center justify-between mt-2 pt-1 border-t border-dashed border-gray-100'>
									<div className='text-xs text-[#667085]'>
										{formattedUnitPrice} × {item.quantity}
									</div>
									<div className='font-bold text-sm text-[#28321A]'>
										{formattedTotalPrice}
									</div>
								</div>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
