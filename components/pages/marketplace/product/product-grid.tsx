import { ProductCard } from './product-card';
import { ProductCardSkeleton } from './product-card-skeleton';
import type { Product } from '@/types/product';

interface ProductGridProps {
	products: Product[];
	isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
	if (isLoading) {
		return (
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{Array.from({ length: 6 }).map((_, index) => (
					<ProductCardSkeleton key={index} />
				))}
			</div>
		);
	}


	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
