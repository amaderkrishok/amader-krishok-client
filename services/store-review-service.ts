import api from '@/lib/axios';
import axios from 'axios';
import {
  CreateStoreReviewDTO,
  StoreReview,
  StoreReviewSummary,
} from '@/types/store-review';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const ENDPOINT = `${API_URL}/store-reviews`;

const extractData = (resData: any) => {
  if (resData && typeof resData === 'object' && 'data' in resData && 'statusCode' in resData) {
    return resData.data;
  }
  return resData;
};

export const StoreReviewService = {
  /**
   * Submit or update a store review
   */
  submitReview: async (dto: CreateStoreReviewDTO): Promise<StoreReview> => {
    const response = await api.post(ENDPOINT, dto);
    return extractData(response.data);
  },

  /**
   * Get store summary (average rating and review count) for store header
   */
  getStoreSummary: async (storeId: string): Promise<StoreReviewSummary> => {
    const response = await axios.get(`${ENDPOINT}/store/${storeId}/summary`);
    return extractData(response.data);
  },

  /**
   * Get all store reviews for Admin Dashboard (Rating and Comments)
   */
  getAllForAdmin: async (): Promise<StoreReview[]> => {
    const response = await api.get(`${ENDPOINT}/admin`);
    const data = extractData(response.data);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Delete a store review (Admin only)
   */
  deleteReview: async (id: number): Promise<void> => {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return extractData(response.data);
  },
};
