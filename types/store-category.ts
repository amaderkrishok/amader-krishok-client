export interface StoreCategory {
  id: number;
  name: string;
  slug: string;
}

export interface CreateStoreCategoryDto {
  name: string;
  slug: string;
}

export interface UpdateStoreCategoryDto {
  name?: string;
  slug?: string;
}