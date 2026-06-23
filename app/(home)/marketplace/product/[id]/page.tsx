import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SingleProductView } from '@/components/pages/marketplace/product/single-product-view';
import { ProductService } from '@/services/product-service';
import Link from 'next/link';

interface ProductPageProps {
	params: {
		id: string;
	};
}

// Generate metadata for the page using real data from API
export async function generateMetadata({
	params,
}: ProductPageProps): Promise<Metadata> {
	try {
		// Wait for params to resolve fully
		const resolvedParams = await params;
		const productId = Number.parseInt(resolvedParams.id);

		if (isNaN(productId)) {
			return {
				title: 'Invalid Product ID',
				description: 'The product ID is not valid',
			};
		}

		try {
			const product = await ProductService.getProductById(productId);
			const title = product?.store?.name 
				? `${product?.name} - ${product?.store?.name}` 
				: (product?.name || 'পণ্যের বিবরণ');

			return {
				title: title,
				description:
					product?.description || 'পণ্যের বিবরণ এবং ক্রয় বিকল্প দেখুন',
				openGraph: {
					title: title,
					description:
						product?.description || 'View product details and purchase options',
					images: product?.simpleProduct?.images?.[0]?.imageUrl
						? [{ url: product.simpleProduct.images[0].imageUrl }]
						: undefined,
				},
			};
		} catch (err: any) {
			// If product not found (404), return appropriate metadata
			if (err?.response?.status === 404) {
				return {
					title: 'পণ্য খুঁজে পাওয়া যায়নি',
					description: 'অনুরোধকৃত পণ্য খুঁজে পাওয়া যায়নি',
				};
			}

			// For other errors
			return {
				title: 'পণ্য লোড করতে সমস্যা হয়েছে',
				description:
					'পণ্যের তথ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন',
			};
		}
	} catch (error) {
		console.error('Error fetching product for metadata:', error);
		return {
			title: 'পণ্য লোড করতে সমস্যা হয়েছে',
			description:
				'পণ্যের তথ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন',
		};
	}
}

// Product detail page component with real API data
export default async function ProductPage({ params }: ProductPageProps) {
	try {
		// Wait for params to resolve fully
		const resolvedParams = await params;
		const productId = Number.parseInt(resolvedParams.id);

		if (isNaN(productId)) {
			return notFound();
		}

		try {
			const product = await ProductService.getProductById(productId);
            
			// If we somehow get a successful response but no product data
			if (!product) {
				return <ProductNotFound />;
			}

			return (
				<div className='container mx-auto px-4 py-8'>
					<SingleProductView product={product} />
				</div>
			);
		} catch (err: any) {
			// If product not found (404), show our custom not found UI
			if (err?.response?.status === 404) {
				return <ProductNotFound />;
			}

			// For other errors, show error UI
			console.error('Error fetching product:', err);
			return <ProductErrorView />;
		}
	} catch (error) {
		console.error('Error in product page:', error);
		return <ProductErrorView />;
	}
}

// Custom not found component that's more user-friendly than default 404
function ProductNotFound() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='text-center py-16'>
				<h1 className='text-2xl font-bold text-gray-800 mb-2'>
					পণ্য খুঁজে পাওয়া যায়নি
				</h1>
				<p className='text-gray-600 mb-6'>
					অনুরোধকৃত পণ্যটি খুঁজে পাওয়া যায়নি। এটি সরানো হয়েছে বা লিঙ্কটি ভুল
					হতে পারে।
				</p>
				<Link
					href='/marketplace'
					className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
				>
					বাজারে ফিরে যান
				</Link>
			</div>
		</div>
	);
}

// Reusable error view component
function ProductErrorView() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='text-center py-16'>
				<h1 className='text-2xl font-bold text-gray-800 mb-2'>
					পণ্যের তথ্য লোড করতে সমস্যা হয়েছে
				</h1>
				<p className='text-gray-600 mb-6'>
					অনুগ্রহ করে আবার চেষ্টা করুন বা হোম পেজে ফিরে যান
				</p>
				<Link
					href='/marketplace'
					className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
				>
					বাজারে ফিরে যান
				</Link>
			</div>
		</div>
	);
}
