export interface ProductReviewUser {
  id: string;
  name: string;
  image?: string;
}

export interface ProductReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  userId?: string;
  user?: ProductReviewUser;
  productId?: number;
  product?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ProductReviewSummary {
  averageRating: number;
  totalReviews: number;
  reviews?: ProductReview[];
}

export interface CheckEligibilityResponse {
  eligible: boolean;
  hasReviewed: boolean;
  existingReview?: ProductReview | null;
}

export interface CreateProductReviewDTO {
  productId: number;
  rating: number;
  comment: string;
}
