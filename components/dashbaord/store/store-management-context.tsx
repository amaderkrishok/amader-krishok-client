'use client';

import React, {
	createContext,
	useContext,
	ReactNode,
	useState,
	useEffect,
	useCallback,
} from 'react';
import { Store, UpdateStoreDTO } from '@/types/store';
import { StoreService } from '@/services/store-service';
import { UploadService } from '@/services/upload-service';
import { toast } from 'sonner';

type ViewMode = 'vendor' | 'admin';

interface StoreManagementContextType {
	// State
	store: Store | null;
	isLoading: boolean;
	isUpdating: boolean;
	isEditMode: boolean;
	viewMode: ViewMode;

	// Actions
	fetchStore: () => Promise<void>;
	updateStore: (data: UpdateStoreDTO) => Promise<boolean>;
	replaceStoreImage: (
		file: File,
		type: 'storeImage' | 'storeCoverImage'
	) => Promise<boolean>;
	setEditMode: (isEdit: boolean) => void;
	canEdit: (field: string) => boolean;
}

interface StoreManagementProviderProps {
	children: ReactNode;
	storeId?: string;
	userRole?: string;
	viewMode?: ViewMode;
}

const StoreManagementContext = createContext<
	StoreManagementContextType | undefined
>(undefined);

export function StoreManagementProvider({
	children,
	storeId,
	userRole = 'vendor',
	viewMode = 'vendor',
}: StoreManagementProviderProps) {
	const [store, setStore] = useState<Store | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);

	// Define which fields can be edited based on role
	const canEdit = useCallback(
		(field: string): boolean => {
			// Readonly fields for vendors
			const vendorReadOnlyFields = [
				'id',
				'slug',
				'status',
				'trialUsed',
				'createdAt',
				'updatedAt',
				'ownerId',
				'storeSubscription',
			];

			// For vendors, check if the field is NOT in the readonly list
			if (userRole === 'vendor') {
				return !vendorReadOnlyFields.includes(field);
			}

			// Admins can edit everything except core fields
			if (userRole === 'admin' || userRole === 'moderator') {
				return !['id', 'createdAt', 'updatedAt', 'ownerId'].includes(field);
			}

			return false;
		},
		[userRole]
	);

	// Fetch store data
	const fetchStore = useCallback(async () => {
		if (!storeId) {
			setIsLoading(false);
			return;
		}

		setIsLoading(true);

		try {
			const storeData = await StoreService.getStoreById(storeId);
			setStore(storeData.data);
		} catch (error) {
			console.error('Error fetching store:', error);
			toast.error('স্টোর তথ্য লোড করতে সমস্যা হয়েছে');
		} finally {
			setIsLoading(false);
		}
	}, [storeId]);

	// Replace store image
	const replaceStoreImage = async (
		file: File,
		type: 'storeImage' | 'storeCoverImage'
	): Promise<boolean> => {
		if (!store) {
			console.log('[DEBUG] Store is null, cannot upload image');
			return false;
		}

		setIsUpdating(true);
		console.log(`[DEBUG] Starting image replacement for ${type}`, {
			storeId: store.id,
			fileName: file.name,
			fileSize: `${(file.size / 1024).toFixed(2)} KB`,
			fileType: file.type,
		});

		try {
			// Validate file
			console.log('[DEBUG] Validating file...');
			if (!UploadService.isValidImage(file, 5)) {
				console.log('[DEBUG] File validation failed');
				toast.error(
					'অবৈধ ছবি। JPEG, PNG অথবা WebP ফরম্যাট এবং 2MB এর মধ্যে হতে হবে।'
				);
				return false;
			}
			console.log('[DEBUG] File validation passed');

			// Get current image URL
			const currentImageUrl =
				type === 'storeImage' ? store.storeImage : store.storeCoverImage;
			console.log('[DEBUG] Current image URL:', currentImageUrl);

			if (!currentImageUrl) {
				// Upload new image if no existing image
				console.log('[DEBUG] No existing image found, uploading new image');
				const folder = `stores/${store.id}`;
				console.log('[DEBUG] Upload folder:', folder);

				console.log('[DEBUG] Calling uploadSingleFile...');
				const fileResponse = await UploadService.uploadSingleFile(file, folder);
				console.log('[DEBUG] Upload response:', fileResponse);

				if (!fileResponse || !fileResponse.url) {
					console.error('[DEBUG] Upload failed - No URL returned');
					toast.error('ছবি আপলোড করতে সমস্যা হয়েছে');
					return false;
				}

				// Update store with new image URL
				console.log(
					'[DEBUG] Updating store with new image URL:',
					fileResponse.url
				);
				const updateResult = await updateStore({ [type]: fileResponse.url });
				console.log('[DEBUG] Store update result:', updateResult);
				return updateResult;
			}

			// Replace existing image
			console.log('[DEBUG] Replacing existing image...');
			console.log('[DEBUG] Parameters:', {
				file: `${file.name} (${file.size} bytes)`,
				currentImageUrl,
				storeId: store.id,
			});

			const result = await UploadService.replaceImage(
				file,
				currentImageUrl,
				store.id
			);
			console.log('[DEBUG] Replace image result:', result);

			if (result && result.image && result.image.url) {
				// Update store with new image URL
				console.log(
					'[DEBUG] Updating store with replaced image URL:',
					result.image.url
				);
				const updateResult = await updateStore({ [type]: result.image.url });
				console.log(
					'[DEBUG] Store update result after image replacement:',
					updateResult
				);
				return updateResult;
			} else {
				console.error(
					'[DEBUG] Replace image failed - Invalid result structure:',
					result
				);
				toast.error('ছবি আপডেট করতে সমস্যা হয়েছে');
				return false;
			}
		} catch (error) {
			console.error(`[DEBUG] Error in replaceStoreImage for ${type}:`, error);
			if (error instanceof Error) {
				console.error('[DEBUG] Error details:', {
					message: error.message,
					stack: error.stack,
				});
			}
			toast.error(`ছবি আপডেট করতে সমস্যা হয়েছে`);
			return false;
		} finally {
			console.log(`[DEBUG] Image replacement process completed for ${type}`);
			setIsUpdating(false);
		}
	};

	// Update the updateStore function to properly handle UUID
	const updateStore = async (data: UpdateStoreDTO): Promise<boolean> => {
		if (!store) {
			console.error('[DEBUG] Cannot update: Store is null');
			return false;
		}

		setIsUpdating(true);
		console.log('[DEBUG] Starting updateStore with data:', data);

		// Make sure store.id is treated as a string UUID
		const storeIdString = String(store.id);
		console.log('[DEBUG] Store ID as string:', storeIdString);

		try {
			// Filter out any fields that shouldn't be updated
			const allowedFields = Object.keys(data).filter((field) => canEdit(field));
			console.log('[DEBUG] Allowed fields after filtering:', allowedFields);

			if (allowedFields.length === 0) {
				console.warn('[DEBUG] No allowed fields to update');
				toast.error('কোন পরিবর্তনযোগ্য ক্ষেত্র নাই');
				return false;
			}

			// Create a properly typed filtered data object
			const filteredData: UpdateStoreDTO = {};

			// Transfer only the allowed fields with proper typing
			allowedFields.forEach((field) => {
				if (field in data) {
					const key = field as keyof typeof data;
					(filteredData as Record<string, any>)[key] = data[key];
				}
			});

			console.log('[DEBUG] Filtered data to send:', filteredData);
			console.log('[DEBUG] Raw JSON payload:', JSON.stringify(filteredData));

			// Add this section to verify URL format
			if (filteredData.storeImage || filteredData.storeCoverImage) {
				console.log('[DEBUG] Image URL validation:');
				if (filteredData.storeImage) {
					console.log('- Store image URL:', filteredData.storeImage);
					console.log('- URL valid:', isValidUrl(filteredData.storeImage));
				}
				if (filteredData.storeCoverImage) {
					console.log('- Store cover image URL:', filteredData.storeCoverImage);
					console.log('- URL valid:', isValidUrl(filteredData.storeCoverImage));
				}
			}

			// Pass the store ID as an explicit string to ensure correct type
			const updatedStore = await StoreService.updateStore(
				storeIdString,
				filteredData
			);
			console.log('[DEBUG] Update successful, received:', updatedStore);
			setStore(updatedStore);
			toast.success('স্টোর আপডেট করা হয়েছে');
			return true;
		} catch (error: any) {
			console.error('[DEBUG] Error updating store:', error);
			console.error('[DEBUG] Error response data:', error.response?.data);
			console.error('[DEBUG] Error status:', error.response?.status);
			toast.error(
				`স্টোর আপডেট করতে সমস্যা হয়েছে: ${
					error.response?.data?.error || error.message
				}`
			);
			return false;
		} finally {
			setIsUpdating(false);
			setIsEditMode(false);
		}
	};

	// Helper function to validate URLs
	function isValidUrl(string: string) {
		try {
			new URL(string);
			return true;
		} catch {
			return false;
		}
	}

	// Load store data on component mount
	useEffect(() => {
		fetchStore();
	}, [fetchStore]);

	const value = {
		store,
		isLoading,
		isUpdating,
		isEditMode,
		viewMode,
		fetchStore,
		updateStore,
		replaceStoreImage,
		setEditMode: setIsEditMode,
		canEdit,
	};

	return (
		<StoreManagementContext.Provider value={value}>
			{children}
		</StoreManagementContext.Provider>
	);
}

export const useStoreManagement = (): StoreManagementContextType => {
	const context = useContext(StoreManagementContext);

	if (context === undefined) {
		throw new Error(
			'useStoreManagement must be used within a StoreManagementProvider'
		);
	}

	return context;
};
