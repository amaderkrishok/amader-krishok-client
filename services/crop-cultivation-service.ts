import axios from 'axios';
import api from '@/lib/axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// Types based on the backend DTOs
export interface CultivationDto {
	id?: string;
	name: string;
	method: any; // Rich text content
}

export interface DiseaseDto {
	id?: string;
	diseaseName: string;
	description: any; // Rich text content
}

export interface CropDto {
	id: string;
	name: string;
	cultivations: CultivationDto[];
	diseases?: DiseaseDto[];
}

export interface CropNameIdDto {
	id: string;
	name: string;
}

export interface CreateCropDto {
	name: string;
	cultivations: Omit<CultivationDto, 'id'>[];
	diseases?: Omit<DiseaseDto, 'id'>[];
}

export interface UpdateCropDto {
	name?: string;
	cultivations?: CultivationDto[];
	diseases?: DiseaseDto[];
}

export interface CropResponseDto {
	success: boolean;
	statusCode?: number;
	message?: string;
	data: CropDto;
}

export interface CropsPaginationResponseDto {
	success: boolean;
	statusCode?: number;
	message?: string;
	data: CropDto[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export const CropCultivationService = {
	/**
	 * Get all crops with pagination or a specific crop by ID
	 * (Public endpoint - no token required)
	 *
	 * @param params Query parameters for the request
	 * @returns Promise with crop data
	 */
	getCrops: async (params: {
		id?: string;
		page?: number;
		limit?: number;
		includeRelations?: boolean;
	}): Promise<CropsPaginationResponseDto | CropResponseDto> => {
		try {
			// Using axios directly since this is a public endpoint
			const response = await axios.get(`${API_URL}/crops`, { params });
			return response.data;
		} catch (error) {
			console.error('Error fetching crops:', error);
			throw error;
		}
	},

	/**
	 * Get a specific crop by ID
	 * (Public endpoint - no token required)
	 *
	 * @param id The UUID of the crop
	 * @param includeRelations Whether to include cultivations and diseases
	 * @returns Promise with crop data
	 */
	getCropById: async (
		id: string,
		includeRelations: boolean = true
	): Promise<CropResponseDto> => {
		try {
			// Using axios directly since this is a public endpoint
			const response = await axios.get(`${API_URL}/crops`, {
				params: { id, includeRelations },
			});
			return response.data;
		} catch (error) {
			console.error(`Error fetching crop with ID ${id}:`, error);
			throw error;
		}
	},

	/**
	 * Get all crop names and IDs - useful for dropdowns
	 * (Public endpoint - no token required)
	 *
	 * @returns Promise with array of crop names and IDs
	 */
	getCropNamesAndIds: async (): Promise<CropNameIdDto[]> => {
		try {
			// Using axios directly since this is a public endpoint
			const response = await axios.get(`${API_URL}/crops/names`);
			return response.data;
		} catch (error) {
			console.error('Error fetching crop names and IDs:', error);
			throw error;
		}
	},

	/**
	 * Create a new crop
	 * (Protected endpoint - token required)
	 *
	 * @param cropData Data for the new crop
	 * @returns Promise with the created crop data
	 */
	createCrop: async (cropData: CreateCropDto): Promise<CropResponseDto> => {
		try {
			// Using api instance with auth token for protected endpoint
			const response = await api.post('/crops', cropData);
			return response.data;
		} catch (error) {
			console.error('Error creating crop:', error);
			throw error;
		}
	},

	/**
	 * Update an existing crop
	 * (Protected endpoint - token required)
	 *
	 * @param id The UUID of the crop to update
	 * @param cropData The updated crop data
	 * @returns Promise with the updated crop data
	 */
	updateCrop: async (
		id: string,
		cropData: UpdateCropDto
	): Promise<CropResponseDto> => {
		try {
			// Using api instance with auth token for protected endpoint
			const response = await api.put(`/crops/${id}`, cropData);
			return response.data;
		} catch (error) {
			console.error(`Error updating crop with ID ${id}:`, error);
			throw error;
		}
	},

	/**
	 * Delete a crop
	 * (Protected endpoint - token required)
	 *
	 * @param id The UUID of the crop to delete
	 * @returns Promise with response data
	 */
	deleteCrop: async (id: string): Promise<CropResponseDto> => {
		try {
			// Using api instance with auth token for protected endpoint
			const response = await api.delete(`/crops/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Error deleting crop with ID ${id}:`, error);
			throw error;
		}
	},

	/**
	 * Helper method to validate if a string is in UUID format
	 *
	 * @param id The string to validate
	 * @returns Boolean indicating if the string is a valid UUID
	 */
	isValidUuid: (id: string): boolean => {
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return uuidRegex.test(id);
	},
};

export default CropCultivationService;
