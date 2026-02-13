'use client';

import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
} from 'react';
import {
	StoreCategory,
	CreateStoreCategoryDto,
	UpdateStoreCategoryDto,
} from '@/types/store-category';
import { StoreCategoryService } from '@/services/store-category-service';
import { toast } from 'sonner';

// Define the shape of our context
export interface StoreCategoryContextType {
	// State
	categories: StoreCategory[];
	loading: boolean;
	dialogOpen: boolean;
	currentCategory: StoreCategory | null;
	isCreating: boolean;
	deleteInProgress: number | null;

	// Actions
	fetchCategories: () => Promise<void>;
	openCreateDialog: () => void;
	openEditDialog: (category: StoreCategory) => void;
	closeDialog: () => void;
	createCategory: (data: CreateStoreCategoryDto) => Promise<boolean>;
	updateCategory: (
		id: number,
		data: UpdateStoreCategoryDto
	) => Promise<boolean>;
	deleteCategory: (id: number) => Promise<void>;
}

// Create the context with a default empty value
const StoreCategoryContext = createContext<
	StoreCategoryContextType | undefined
>(undefined);

// Custom hook to use the context
export const useStoreCategories = () => {
	const context = useContext(StoreCategoryContext);
	if (context === undefined) {
		throw new Error(
			'useStoreCategories must be used within a StoreCategoryProvider'
		);
	}
	return context;
};

// Provider component
export const StoreCategoryProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [categories, setCategories] = useState<StoreCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [currentCategory, setCurrentCategory] = useState<StoreCategory | null>(
		null
	);
	const [isCreating, setIsCreating] = useState(false);
	const [deleteInProgress, setDeleteInProgress] = useState<number | null>(null);

	// Fetch all categories
	const fetchCategories = useCallback(async () => {
		try {
			setLoading(true);
			const response = await StoreCategoryService.getAllCategories();
			console.log(response);
			
			setCategories(response.data);
		} catch (error) {
			console.error('Failed to fetch categories:', error);
			toast.error('Failed to load store categories');
		} finally {
			setLoading(false);
		}
	}, []);

	// Open dialog for creating a new category
	const openCreateDialog = useCallback(() => {
		setCurrentCategory(null);
		setIsCreating(true);
		setDialogOpen(true);
	}, []);

	// Open dialog for editing a category
	const openEditDialog = useCallback((category: StoreCategory) => {
		setCurrentCategory(category);
		setIsCreating(false);
		setDialogOpen(true);
	}, []);

	// Close the dialog
	const closeDialog = useCallback(() => {
		setDialogOpen(false);
		setCurrentCategory(null);
		setIsCreating(false);
	}, []);

	// Create a new category
	const createCategory = useCallback(
		async (data: CreateStoreCategoryDto): Promise<boolean> => {
			try {
				await StoreCategoryService.createCategory(data);
				await fetchCategories();
				toast.success('Category created successfully');
				closeDialog();
				return true;
			} catch (error) {
				console.error('Failed to create category:', error);
				toast.error('Failed to create category');
				return false;
			}
		},
		[fetchCategories, closeDialog]
	);

	// Update an existing category
	const updateCategory = useCallback(
		async (id: number, data: UpdateStoreCategoryDto): Promise<boolean> => {
			try {
				await StoreCategoryService.updateCategory(id, data);
				await fetchCategories();
				toast.success('Category updated successfully');
				closeDialog();
				return true;
			} catch (error) {
				console.error('Failed to update category:', error);
				toast.error('Failed to update category');
				return false;
			}
		},
		[fetchCategories, closeDialog]
	);

	// Delete a category
	const deleteCategory = useCallback(
		async (id: number): Promise<void> => {
			try {
				setDeleteInProgress(id);
				await StoreCategoryService.deleteCategory(id);
				await fetchCategories();
				toast.success('Category deleted successfully');
			} catch (error) {
				console.error('Failed to delete category:', error);
				toast.error('Failed to delete category');
			} finally {
				setDeleteInProgress(null);
			}
		},
		[fetchCategories]
	);

	// Create the context value object
	const value = {
		categories,
		loading,
		dialogOpen,
		currentCategory,
		isCreating,
		deleteInProgress,
		fetchCategories,
		openCreateDialog,
		openEditDialog,
		closeDialog,
		createCategory,
		updateCategory,
		deleteCategory,
	};

	return (
		<StoreCategoryContext.Provider value={value}>
			{children}
		</StoreCategoryContext.Provider>
	);
};
