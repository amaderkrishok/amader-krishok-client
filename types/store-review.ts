export interface StoreReviewUser {
  id: string;
  name: string;
  image?: string;
  phoneNumber?: string;
}

export interface StoreReviewStore {
  id: string;
  name: string;
}

export interface StoreReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  userId?: string;
  user?: StoreReviewUser;
  storeId?: string;
  store?: StoreReviewStore;
}

export interface StoreReviewSummary {
  averageRating: number;
  totalReviews: number;
}

export interface CreateStoreReviewDTO {
  storeId: string;
  rating: number;
  comment: string;
}
