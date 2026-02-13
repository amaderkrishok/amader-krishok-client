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
		<div className='fixed bottom-4 right-4 z-40'>
			<button
				onClick={toggleCart}
				className='flex items-center shadow-lg bg-green-600 text-white rounded-full p-3 hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
				aria-label='Open cart'
			>
				<div className='relative'>
					<ShoppingCart className='h-6 w-6' />
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
								className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'
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
							className='overflow-hidden ml-2'
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
