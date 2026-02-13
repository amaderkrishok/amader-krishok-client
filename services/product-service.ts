import api from '@/lib/axios';
import axios from 'axios';
import {
	Product,
	ProductFilters,
	CreateProductDTO,
	UpdateProductDTO,
	PaginatedResponse,
} from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const PRODUCTS_ENDPOINT = `${API_URL}/products`;

export const ProductService = {
	/**
	 * Public Routes - No Authentication Required
	 */

	// Get all products with pagination and filtering
	getProducts: async (
		filters: ProductFilters = {}
	): Promise<PaginatedResponse<Product>> => {
		let url = `${PRODUCTS_ENDPOINT}?`;
		const queryParams = new URLSearchParams();

		// Add pagination params
		queryParams.append('page', (filters.page || 1).toString());
		queryParams.append('limit', (filters.limit || 10).toString());

		// Add filter params if they exist
		if (filters.storeId) queryParams.append('storeId', filters.storeId);
		if (filters.categoryId)
			queryParams.append('categoryId', filters.categoryId.toString());
		if (filters.name) queryParams.append('name', filters.name);
		if (filters.minPrice !== undefined)
			queryParams.append('minPrice', filters.minPrice.toString());
		if (filters.maxPrice !== undefined)
			queryParams.append('maxPrice', filters.maxPrice.toString());
		if (filters.productType)
			queryParams.append('productType', filters.productType);

		url += queryParams.toString();

		const response = await axios.get(url);
		return response.data;
	},

	// Get a single product by ID
	getProductById: async (id: number): Promise<Product> => {
		const response = await axios.get(`${PRODUCTS_ENDPOINT}/${id}`);
		return response.data.data;
	},

	// Get products by store
	getProductsByStore: async (
		storeId: string,
		page: number = 1,
		limit: number = 10
	): Promise<PaginatedResponse<Product>> => {
		const response = await axios.get(
			`${PRODUCTS_ENDPOINT}/store/${storeId}?page=${page}&limit=${limit}`
		);
		return response.data;
	},

	// Get products by category
	getProductsByCategory: async (
		categoryId: number,
		page: number = 1,
		limit: number = 10
	): Promise<PaginatedResponse<Product>> => {
		const response = await axios.get(
			`${PRODUCTS_ENDPOINT}/category/${categoryId}?page=${page}&limit=${limit}`
		);
		return response.data;
	},

	// Search products by term
	searchProducts: async (
		term: string,
		page: number = 1,
		limit: number = 10
	): Promise<PaginatedResponse<Product>> => {
		const response = await axios.get(
			`${PRODUCTS_ENDPOINT}/search?term=${encodeURIComponent(
				term
			)}&page=${page}&limit=${limit}`
		);
		return response.data;
	},

	/**
	 * Protected Routes - Authentication Required
	 */

	// Create a new product
	createProduct: async (productData: CreateProductDTO): Promise<Product> => {
		const response = await api.post(PRODUCTS_ENDPOINT, productData);
		return response.data;
	},

	// Update an existing product
	updateProduct: async (
		id: number,
		productData: UpdateProductDTO | (UpdateProductDTO & { status?: string })
	): Promise<Product> => {
		const response = await api.patch(`${PRODUCTS_ENDPOINT}/${id}`, productData);
		return response.data;
	},

	// Delete a product
	deleteProduct: async (id: number): Promise<void> => {
		await api.delete(`${PRODUCTS_ENDPOINT}/${id}`);
	},

	/**
	 * Helper functions
	 */

	// Archive a product (if API supports status)
	archiveProduct: async (id: number): Promise<Product | void> => {
		try {
			const response = await api.patch(`${PRODUCTS_ENDPOINT}/${id}`, { status: 'archived' });
			return response.data;
		} catch (e) {
			console.warn('Archive not supported, consider deleteProduct instead');
		}
	},

	// Unarchive a product (if API supports status)
	unarchiveProduct: async (id: number): Promise<Product | void> => {
		try {
			const response = await api.patch(`${PRODUCTS_ENDPOINT}/${id}`, { status: 'active' });
			return response.data;
		} catch (e) {
			console.warn('Unarchive not supported');
		}
	},

	// Generate image URL from different sources
	getProductImageUrl: (imageUrl: string): string => {
		// If already an absolute URL (like Unsplash), return as is
		if (imageUrl.startsWith('http')) {
			return imageUrl;
		}

		// Otherwise, prepend your API URL if needed
		return `${API_URL}/${imageUrl.replace(/^\//, '')}`;
	},

	// Get formatted product price based on type
	getFormattedPrice: (
		product: Product
	): {
		price: number;
		discountPrice?: number;
		hasDiscount: boolean;
		discountPercentage?: number;
		formattedPrice: string;
		formattedDiscountPrice?: string;
	} => {
		let price = 0;
		let discountPrice: number | undefined = undefined;

		if (product.productType === 'SIMPLE' && product.simpleProduct) {
			price = parseFloat(product.simpleProduct.price.toString());
			discountPrice = product.simpleProduct.discountPrice
				? parseFloat(product.simpleProduct.discountPrice.toString())
				: undefined;
		} else if (
			product.productType === 'VARIABLE' &&
			product.variableProduct?.variants?.length
		) {
			// For variable products, use the lowest variant price
			const prices = product.variableProduct.variants.map((v) =>
				parseFloat(v.price.toString())
			);
			price = Math.min(...prices);

			// Get discount prices that are set
			const discountPrices = product.variableProduct.variants
				.filter((v) => v.discountPrice !== undefined)
				.map((v) => parseFloat(v.discountPrice!.toString()));

			if (discountPrices.length > 0) {
				discountPrice = Math.min(...discountPrices);
			}
		}

		// Calculate discount percentage if applicable
		const hasDiscount = discountPrice !== undefined && discountPrice < price;
		const discountPercentage = hasDiscount
			? Math.round(((price - discountPrice!) / price) * 100)
			: undefined;

		// Format price displays
		const formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'BDT',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		});

		return {
			price,
			discountPrice,
			hasDiscount,
			discountPercentage,
			formattedPrice: formatter.format(price),
			formattedDiscountPrice:
				discountPrice !== undefined
					? formatter.format(discountPrice)
					: undefined,
		};
	},

	// Get primary image from a product
	getPrimaryImage: (product: Product): string | undefined => {
		if (
			product.productType === 'SIMPLE' &&
			product.simpleProduct?.images?.length
		) {
			// Try to find primary image first
			const primaryImage = product.simpleProduct.images.find(
				(img) => img.isPrimary
			);
			if (primaryImage) {
				return ProductService.getProductImageUrl(primaryImage.imageUrl);
			}
			// Fall back to first image
			return ProductService.getProductImageUrl(
				product.simpleProduct.images[0].imageUrl
			);
		} else if (
			product.productType === 'VARIABLE' &&
			product.variableProduct?.variants?.length
		) {
			// For variable products, use the first variant's first image
			const firstVariantWithImages = product.variableProduct.variants.find(
				(v) => v.images && v.images.length > 0
			);

			if (firstVariantWithImages?.images?.length) {
				return ProductService.getProductImageUrl(
					firstVariantWithImages.images[0].imageUrl
				);
			}
		}

		// Default fallback image
		return '/images/product-placeholder.png';
	},

	// Get all images from a product
	getAllProductImages: (product: Product): string[] => {
		const images: string[] = [];

		if (product.productType === 'SIMPLE' && product.simpleProduct?.images) {
			return product.simpleProduct.images.map((img) =>
				ProductService.getProductImageUrl(img.imageUrl)
			);
		} else if (
			product.productType === 'VARIABLE' &&
			product.variableProduct?.variants
		) {
			product.variableProduct.variants.forEach((variant) => {
				if (variant.images?.length) {
					variant.images.forEach((img) => {
						images.push(ProductService.getProductImageUrl(img.imageUrl));
					});
				}
			});
		}

		return images.length ? images : ['/images/product-placeholder.png'];
	},
};
