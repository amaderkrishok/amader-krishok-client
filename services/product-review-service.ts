import api from '@/lib/axios';
import axios from 'axios';
import {
  CheckEligibilityResponse,
  CreateProductReviewDTO,
  ProductReview,
  ProductReviewSummary,
} from '@/types/product-review';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const ENDPOINT = `${API_URL}/product-reviews`;

const extractData = (resData: any) => {
  if (resData && typeof resData === 'object' && 'data' in resData && 'statusCode' in resData) {
    return resData.data;
  }
  return resData;
};

export const ProductReviewService = {
  /**
   * Submit or update a product review
   */
  submitReview: async (dto: CreateProductReviewDTO): Promise<ProductReview> => {
    const response = await api.post(ENDPOINT, dto);
    return extractData(response.data);
  },

  /**
   * Get reviews and average rating for a product
   */
  getByProduct: async (productId: number): Promise<ProductReviewSummary> => {
    const response = await axios.get(`${ENDPOINT}/product/${productId}`);
    return extractData(response.data);
  },

  /**
   * Check if logged in user is eligible to review product
   */
  checkEligibility: async (productId: number): Promise<CheckEligibilityResponse> => {
    const response = await api.get(`${ENDPOINT}/check-eligibility/${productId}`);
    return extractData(response.data);
  },

  /**
   * Get batch summaries for multiple product IDs
   */
  getBatchSummaries: async (
    productIds: number[]
  ): Promise<Record<number, { averageRating: number; totalReviews: number }>> => {
    if (!productIds.length) return {};
    const response = await axios.get(
      `${ENDPOINT}/batch-summary?ids=${productIds.join(',')}`
    );
    return extractData(response.data);
  },

  /**
   * Get all product reviews for Admin
   */
  getAllForAdmin: async (): Promise<ProductReview[]> => {
    const response = await api.get(`${ENDPOINT}/admin`);
    const data = extractData(response.data);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Delete a product review
   */
  deleteReview: async (id: number): Promise<void> => {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return extractData(response.data);
  },
};
