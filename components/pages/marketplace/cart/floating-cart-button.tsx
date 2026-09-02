'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { formatPrice } from './cart-drawer';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingCartButton() {
	const { toggleCart, itemCount, total } = useCart();
	const [isAnimating, setIsAnimating] = useState(false);
	const [prevItemCount, setPrevItemCount] = useState(itemCount);

	// Animate when item count changes
	useEffect(() => {
		if (itemCount > prevItemCount) {
			setIsAnimating(true);
			const timeout = setTimeout(() => {
				setIsAnimating(false);
			}, 1000);
			return () => clearTimeout(timeout);
		}
		setPrevItemCount(itemCount);
	}, [itemCount, prevItemCount]);

	return (
		<div className='fixed bottom-6 right-6 z-50'>
			<button
				onClick={toggleCart}
				className='flex items-center gap-2.5 shadow-2xl bg-[#28321A] hover:bg-[#343D20] text-white border-2 border-[#F4B400]/40 rounded-full px-4.5 py-3.5 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F4B400] active:scale-95'
				aria-label='Open cart'
			>
				<div className='relative flex items-center justify-center'>
					<ShoppingCart className='h-5 w-5 text-[#F4B400]' />
					<AnimatePresence>
						{itemCount > 0 && (
							<motion.span
								initial={{ scale: 0.5, opacity: 0 }}
								animate={{
									scale: isAnimating ? [1, 1.25, 1] : 1,
									opacity: 1,
								}}
								exit={{ scale: 0.5, opacity: 0 }}
								transition={{ duration: 0.3 }}
								className='absolute -top-3.5 -right-3.5 bg-[#F4B400] text-[#172033] text-[11px] font-black rounded-full h-5.5 w-5.5 flex items-center justify-center shadow-md border-2 border-[#28321A]'
							>
								{itemCount}
							</motion.span>
						)}
					</AnimatePresence>
				</div>

				<AnimatePresence>
					{itemCount > 0 && (
						<motion.div
							initial={{ width: 0, opacity: 0 }}
							animate={{ width: 'auto', opacity: 1 }}
							exit={{ width: 0, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className='overflow-hidden text-xs font-black tracking-wide text-[#F4B400]'
						>
							<span className='whitespace-nowrap'>
								{formatPrice(total).replace('$', '৳')}
							</span>
						</motion.div>
					)}
				</AnimatePresence>
			</button>
		</div>
	);
}
