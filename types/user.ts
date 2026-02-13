export interface UserType {
  id: string
  name: string
  email: string
  emailVerified: boolean
  phoneNumber: string
  role: string
  isBlocked: boolean
  isApproved: boolean
  image: string | null
  createdAt: string
  updatedAt: string
  storeId: string | null
  password?: string
}

export interface UserFilters {
  role: string | null
  isBlocked: boolean | null
}

export interface PaginationMeta {
  totalItems: number
  itemCount: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
}
