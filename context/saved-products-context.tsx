'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

interface SavedProductsContextType {
	savedProducts: Product[];
	toggleSaveProduct: (product: Product) => void;
	isProductSaved: (productId: number) => boolean;
	removeProduct: (productId: number) => void;
}

const SavedProductsContext = createContext<SavedProductsContextType | undefined>(undefined);

export function SavedProductsProvider({ children }: { children: React.ReactNode }) {
	const [savedProducts, setSavedProducts] = useState<Product[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);

	// Load from local storage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem('amader-krishok-saved-products');
			if (stored) {
				setSavedProducts(JSON.parse(stored));
			}
		} catch (error) {
			console.error('Failed to load saved products:', error);
		} finally {
			setIsInitialized(true);
		}
	}, []);

	// Save to local storage whenever it changes
	useEffect(() => {
		if (isInitialized) {
			try {
				localStorage.setItem('amader-krishok-saved-products', JSON.stringify(savedProducts));
			} catch (error) {
				console.error('Failed to save products to local storage:', error);
			}
		}
	}, [savedProducts, isInitialized]);

	const isProductSaved = (productId: number) => {
		return savedProducts.some((p) => p.id === productId);
	};

	const toggleSaveProduct = (product: Product) => {
		setSavedProducts((prev) => {
			const isSaved = prev.some((p) => p.id === product.id);
			if (isSaved) {
				toast.success('পণ্যটি সংরক্ষিত তালিকা থেকে সরানো হয়েছে'); // Removed from saved
				return prev.filter((p) => p.id !== product.id);
			} else {
				toast.success('পণ্যটি সফলভাবে সংরক্ষণ করা হয়েছে'); // Saved successfully
				return [...prev, product];
			}
		});
	};

	const removeProduct = (productId: number) => {
		setSavedProducts((prev) => prev.filter((p) => p.id !== productId));
		toast.success('পণ্যটি সংরক্ষিত তালিকা থেকে সরানো হয়েছে');
	};

	return (
		<SavedProductsContext.Provider
			value={{
				savedProducts,
				toggleSaveProduct,
				isProductSaved,
				removeProduct,
			}}
		>
			{children}
		</SavedProductsContext.Provider>
	);
}

export function useSavedProducts() {
	const context = useContext(SavedProductsContext);
	if (context === undefined) {
		throw new Error('useSavedProducts must be used within a SavedProductsProvider');
	}
	return context;
}
