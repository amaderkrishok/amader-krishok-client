import api from '@/lib/axios';

/**
 * Interface for uploaded image response
 */
interface ImageResponse {
	url: string;
	key: string;
}

/**
 * Interface for detailed file response
 */
interface FileDetailResponse {
	url: string;
	key: string;
	filename: string;
	mimetype: string;
	size: number;
	uploadedAt: string;
}

/**
 * Interface for the response when uploading multiple images
 */
interface MultipleImagesResponse {
	data: {
		images: ImageResponse[];
	};
}

/**
 * Interface for the response when uploading a single image
 */
interface SingleImageResponse {
	data: {
		image: ImageResponse;
	};
}

/**
 * Interface for the response when replacing an image
 */
interface ReplaceImageResponse {
	data: {
		oldDeleted: boolean;
		image: ImageResponse;
	};
}

/**
 * Interface for the response when deleting a file
 */
interface DeleteFileResponse {
	data: {
		message: string;
	};
}

/**
 * Interface for the response when uploading a single file
 */
interface SingleFileResponse {
	data: {
		file: FileDetailResponse;
	};
}

/**
 * Interface for the response when uploading multiple files
 */
interface MultipleFilesResponse {
	data: {
		files: FileDetailResponse[];
	};
}

/**
 * Upload service for managing file uploads to the backend
 */
export const UploadService = {
	/**
	 * Upload multiple product images (up to 5)
	 *
	 * @param {File[]} files - Array of image files to upload (max 5)
	 * @param {string} storeId - ID of the store the images belong to
	 * @returns {Promise<ImageResponse[]>} Array of uploaded image data with URLs and keys
	 * @throws {Error} When validation fails or server returns an error
	 *
	 * @example
	 * // Upload multiple product images
	 * const files = [file1, file2]; // From file input
	 * const storeId = "550e8400-e29b-41d4-a716-446655440000";
	 * const images = await UploadService.uploadProductImages(files, storeId);
	 * console.log(images); // [{ url: '...', key: '...' }, { url: '...', key: '...' }]
	 */
	uploadProductImages: async (
		files: File[],
		storeId: string
	): Promise<ImageResponse[]> => {
		if (!files.length || files.length > 5) {
			throw new Error('Please provide between 1 and 5 images');
		}

		const formData = new FormData();

		// Append each file to the form data
		files.forEach((file) => {
			formData.append('files', file);
		});

		// Add store ID
		formData.append('storeId', storeId);

		try {
			const response = await api.post<MultipleImagesResponse>(
				'/uploads/product-images',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			return response.data.data.images;
		} catch (error) {
			// Extract error message if available
			const message =
				error.response?.data?.message || 'Failed to upload images';
			throw new Error(message);
		}
	},

	/**
	 * Upload a single variant image
	 *
	 * @param {File} file - Image file to upload
	 * @param {string} storeId - ID of the store the image belongs to
	 * @returns {Promise<ImageResponse>} Uploaded image data with URL and key
	 * @throws {Error} When validation fails or server returns an error
	 *
	 * @example
	 * // Upload a variant image
	 * const file = event.target.files[0]; // From file input
	 * const storeId = "550e8400-e29b-41d4-a716-446655440000";
	 * const image = await UploadService.uploadVariantImage(file, storeId);
	 * console.log(image); // { url: '...', key: '...' }
	 */
	uploadVariantImage: async (
		file: File,
		storeId: string
	): Promise<ImageResponse> => {
		const formData = new FormData();

		// Add the file to form data
		formData.append('file', file);

		// Add store ID
		formData.append('storeId', storeId);

		try {
			const response = await api.post<SingleImageResponse>(
				'/uploads/variant-image',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			return response.data.data.image;
		} catch (error) {
			const message =
				error.response?.data?.message || 'Failed to upload variant image';
			throw new Error(message);
		}
	},

	/**
	 * Delete a file by its URL
	 *
	 * @param {string} fileUrl - URL of the file to delete
	 * @returns {Promise<boolean>} True if the file was deleted successfully
	 * @throws {Error} When validation fails or server returns an error
	 *
	 * @example
	 * // Delete an uploaded file
	 * const fileUrl = "https://utfs.io/f/abc123...";
	 * const result = await UploadService.deleteFile(fileUrl);
	 * console.log(result); // true
	 */
	deleteFile: async (fileUrl: string): Promise<boolean> => {
		try {
			const response = await api.delete<DeleteFileResponse>('/uploads/file', {
				data: { url: fileUrl },
			});

			return response.data.data.message === 'File deleted successfully';
		} catch (error) {
			const message = error.response?.data?.message || 'Failed to delete file';
			throw new Error(message);
		}
	},

	/**
	 * Replace an existing image with a new one
	 *
	 * @param {File} file - New image file to upload
	 * @param {string} oldUrl - URL of the image to replace
	 * @param {string} storeId - ID of the store the image belongs to
	 * @returns {Promise<{oldDeleted: boolean, image: ImageResponse}>} Result containing whether the old image was deleted and the new image data
	 * @throws {Error} When validation fails or server returns an error
	 *
	 * @example
	 * // Replace an image
	 * const newFile = event.target.files[0]; // From file input
	 * const oldUrl = "https://utfs.io/f/abc123...";
	 * const storeId = "550e8400-e29b-41d4-a716-446655440000";
	 * const result = await UploadService.replaceImage(newFile, oldUrl, storeId);
	 * console.log(result);
	 * // { oldDeleted: true, image: { url: '...', key: '...' } }
	 */
	replaceImage: async (
		file: File,
		oldUrl: string,
		storeId: string
	): Promise<{ oldDeleted: boolean; image: ImageResponse }> => {
		const formData = new FormData();

		// Add the new file
		formData.append('file', file);

		// Add old URL and store ID
		formData.append('oldUrl', oldUrl);
		formData.append('storeId', storeId);

		try {
			const response = await api.put<ReplaceImageResponse>(
				'/uploads/replace-image',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			return response.data.data;
		} catch (error) {
			const message =
				error.response?.data?.message || 'Failed to replace image';
			throw new Error(message);
		}
	},

	/**
	 * Upload a single file of any supported type
	 *
	 * @param {File} file - File to upload
	 * @param {string} [folder] - Optional folder path for organization
	 * @param {string} [fileName] - Optional custom file name (extension will be preserved)
	 * @returns {Promise<FileDetailResponse>} Detailed information about the uploaded file
	 * @throws {Error} When validation fails or server returns an error
	 *
	 * @example
	 * // Upload a PDF file with custom folder and name
	 * const file = event.target.files[0]; // From file input
	 * const result = await UploadService.uploadSingleFile(file, "reports", "annual-report-2025");
	 * console.log(result.url); // URL to access the file
	 */
	uploadSingleFile: async (
		file: File,
		folder?: string,
		fileName?: string
	): Promise<FileDetailResponse> => {
		const formData = new FormData();

		// Add the file
		formData.append('file', file);

		// Add optional params if provided
		if (folder) formData.append('folder', folder);
		if (fileName) formData.append('fileName', fileName);

		try {
			const response = await api.post<SingleFileResponse>(
				'/uploads/single-file',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			return response.data.data.file;
		} catch (error) {
			const message = error.response?.data?.message || 'Failed to upload file';
			throw new Error(message);
		}
	},

	/**
	 * Upload multiple files of any supported type
	 *
	 * @param {File[]} files - Array of files to upload (max 10)
	 * @param {string} [folder] - Optional folder path for organization
	 * @returns {Promise<FileDetailResponse[]>} Array of detailed information about each uploaded file
	 * @throws {Error} When validation fails or server returns an error
	 *
	 * @example
	 * // Upload multiple files to a custom folder
	 * const files = Array.from(fileInput.files);
	 * const results = await UploadService.uploadMultipleFiles(files, "project-assets");
	 * console.log(`Uploaded ${results.length} files`);
	 * console.log(results.map(f => f.url)); // Array of URLs
	 */
	uploadMultipleFiles: async (
		files: File[],
		folder?: string
	): Promise<FileDetailResponse[]> => {
		if (!files.length) {
			throw new Error('Please provide at least one file');
		}

		if (files.length > 10) {
			throw new Error('Maximum 10 files can be uploaded at once');
		}

		const formData = new FormData();

		// Append each file to the form data
		files.forEach((file) => {
			formData.append('files', file);
		});

		// Add optional folder if provided
		if (folder) formData.append('folder', folder);

		try {
			const response = await api.post<MultipleFilesResponse>(
				'/uploads/multiple-files',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			return response.data.data.files;
		} catch (error) {
			// Extract error message if available
			const message = error.response?.data?.message || 'Failed to upload files';
			throw new Error(message);
		}
	},

	/**
	 * Check if a file is valid according to type and size constraints
	 *
	 * @param {File} file - File to check
	 * @param {string[]} validTypes - Array of allowed MIME types
	 * @param {number} maxSizeInMB - Maximum file size in MB
	 * @returns {boolean} True if the file is valid
	 *
	 * @example
	 * // Check if file is a valid image (max 2MB)
	 * const file = event.target.files[0];
	 * if (!UploadService.isValidFile(file, ['image/jpeg', 'image/png', 'image/webp'], 2)) {
	 *   alert('Please select a valid image file (JPEG, PNG, WebP) under 2MB');
	 * }
	 */
	isValidFile: (
		file: File,
		validTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'],
		maxSizeInMB: number = 2
	): boolean => {
		const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
		return validTypes.includes(file.type) && file.size <= maxSizeInBytes;
	},

	/**
	 * Utility function to check if a file is a valid image
	 *
	 * @param {File} file - File to check
	 * @param {number} maxSizeInMB - Maximum file size in MB
	 * @returns {boolean} True if the file is a valid image
	 *
	 * @example
	 * // Check if file is a valid image (max 2MB)
	 * const file = event.target.files[0];
	 * if (!UploadService.isValidImage(file, 2)) {
	 *   alert('Please select a valid image file (JPEG, PNG, WebP) under 2MB');
	 * }
	 */
	isValidImage: (file: File, maxSizeInMB: number = 2): boolean => {
		const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
		return UploadService.isValidFile(file, validTypes, maxSizeInMB);
	},

	/**
	 * Format file size to human-readable string
	 *
	 * @param {number} bytes - File size in bytes
	 * @returns {string} Human-readable file size
	 *
	 * @example
	 * // Format file size
	 * const fileSize = UploadService.formatFileSize(1500000);
	 * console.log(fileSize); // "1.43 MB"
	 */
	formatFileSize: (bytes: number): string => {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	},
};
