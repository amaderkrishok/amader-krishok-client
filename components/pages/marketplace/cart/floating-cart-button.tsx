'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { formatPrice } from './cart-drawer';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingCartButton() {
	const { toggleCart, itemCount, subtotal } = useCart();
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
		<div className='fixed bottom-[84px] right-6 z-40'>
			<button
				onClick={toggleCart}
				className='flex items-center gap-2.5 shadow-2xl bg-[#2D331F] hover:bg-[#1F2516] text-white border border-white/20 rounded-full px-4 py-3 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#EAB308]'
				aria-label='Open cart'
			>
				<div className='relative flex items-center justify-center'>
					<ShoppingCart className='h-5 w-5 text-[#EAB308]' />
					<AnimatePresence>
						{itemCount > 0 && (
							<motion.span
								initial={{ scale: 0.5, opacity: 0 }}
								animate={{
									scale: isAnimating ? [1, 1.2, 1] : 1,
									opacity: 1,
								}}
								exit={{ scale: 0.5, opacity: 0 }}
								transition={{ duration: 0.3 }}
								className='absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-md border-2 border-[#2D331F]'
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
							className='overflow-hidden text-xs font-black tracking-wide text-amber-300'
						>
							<span className='whitespace-nowrap'>
								{formatPrice(subtotal).replace('$', '৳')}
							</span>
						</motion.div>
					)}
				</AnimatePresence>
			</button>
		</div>
	);
}
