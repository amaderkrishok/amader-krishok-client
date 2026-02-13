'use client';

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from 'react';
import type { Product, ProductVariant } from '@/types/product';

export interface CartItem {
	productId: number;
	product: Product;
	storeId: string;
	quantity: number;
	variantId?: number;
	selectedVariant?: ProductVariant;
}

interface CartContextType {
	items: CartItem[];
	addItem: (product: Product, quantity: number, variantId?: number) => void;
	removeItem: (productId: number, variantId?: number) => void;
	updateQuantity: (
		productId: number,
		quantity: number,
		variantId?: number
	) => void;
	clearCart: () => void;
	isOpen: boolean;
	openCart: () => void;
	closeCart: () => void;
	toggleCart: () => void;
	itemCount: number;
	subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Initialize cart from localStorage when component mounts
	useEffect(() => {
		setMounted(true);
		const storedCart = localStorage.getItem('cart');
		if (storedCart) {
			try {
				setItems(JSON.parse(storedCart));
			} catch (error) {
				console.error('Failed to parse cart from localStorage:', error);
				localStorage.removeItem('cart');
			}
		}
	}, []);

	// Update localStorage when cart changes
	useEffect(() => {
		if (mounted) {
			localStorage.setItem('cart', JSON.stringify(items));
		}
	}, [items, mounted]);

	const findItemIndex = (productId: number, variantId?: number) => {
		return items.findIndex(
			(item) =>
				item.productId === productId &&
				(variantId ? item.variantId === variantId : !item.variantId)
		);
	};

	const addItem = (product: Product, quantity: number, variantId?: number) => {
		setItems((prevItems) => {
			const itemIndex = findItemIndex(product.id, variantId);

			// Find the selected variant if variantId is provided
			let selectedVariant: ProductVariant | undefined;
			if (
				variantId &&
				product.productType === 'VARIABLE' &&
				product.variableProduct?.variants
			) {
				selectedVariant = product.variableProduct.variants.find(
					(v) => v.id === variantId
				);
			}

			const storeId = product.store.id || '';

			if (itemIndex >= 0) {
				// Item exists, update quantity
				const updatedItems = [...prevItems];
				updatedItems[itemIndex].quantity += quantity;
				return updatedItems;
			} else {
				// Item doesn't exist, add new item
				return [
					...prevItems,
					{
						productId: product.id,
						product,
						storeId, // Include the storeId
						quantity,
						variantId,
						selectedVariant,
					},
				];
			}
		});

		// Open cart when adding items
		setIsOpen(true);
	};

	const removeItem = (productId: number, variantId?: number) => {
		setItems((prevItems) =>
			prevItems.filter(
				(item) =>
					!(
						item.productId === productId &&
						(variantId ? item.variantId === variantId : !item.variantId)
					)
			)
		);
	};

	const updateQuantity = (
		productId: number,
		quantity: number,
		variantId?: number
	) => {
		if (quantity <= 0) {
			removeItem(productId, variantId);
			return;
		}

		setItems((prevItems) => {
			const itemIndex = findItemIndex(productId, variantId);
			if (itemIndex >= 0) {
				const updatedItems = [...prevItems];
				updatedItems[itemIndex].quantity = quantity;
				return updatedItems;
			}
			return prevItems;
		});
	};

	const clearCart = () => {
		setItems([]);
	};

	const openCart = () => setIsOpen(true);
	const closeCart = () => setIsOpen(false);
	const toggleCart = () => setIsOpen((prev) => !prev);

	// Calculate total number of items
	const itemCount = items.reduce((total, item) => total + item.quantity, 0);

	// Calculate subtotal
	const subtotal = items.reduce((total, item) => {
		let price = 0;

		if (item.selectedVariant) {
			// Use variant price
			price =
				item.selectedVariant.discountPrice != null
					? Number(item.selectedVariant.discountPrice)
					: Number(item.selectedVariant.price);
		} else if (
			item.product.productType === 'SIMPLE' &&
			item.product.simpleProduct
		) {
			// Use simple product price
			price =
				item.product.simpleProduct.discountPrice != null
					? Number(item.product.simpleProduct.discountPrice)
					: Number(item.product.simpleProduct.price);
		}

		return total + price * item.quantity;
	}, 0);

	const value = {
		items,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		isOpen,
		openCart,
		closeCart,
		toggleCart,
		itemCount,
		subtotal,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
}
