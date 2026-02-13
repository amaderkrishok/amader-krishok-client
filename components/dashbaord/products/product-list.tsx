'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, MoreHorizontal, Trash, AlertCircle, Eye } from 'lucide-react';

import { ProductService } from '@/services/product-service';
import { type Product, ProductType } from '@/types/product';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useSession } from '@/components/providers/session-provider';

export function ProductList() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const { user } = useSession();

	// Fetch products on mount and when page changes
	useEffect(() => {
		if (user?.storeId) {
			fetchProducts();
		} else {
			setLoading(false);
			setError(
				'স্টোর আইডি পাওয়া যায়নি। অনুগ্রহ করে আপনার প্রোফাইল চেক করুন।'
			);
		}
	}, [currentPage, user?.storeId]);

	const fetchProducts = async () => {
		if (!user?.storeId) return;

		setLoading(true);
		setError(null);

		try {
			// Fetch products from the vendor's store using storeId
			const response = await ProductService.getProductsByStore(
				user.storeId,
				currentPage
			);

			setProducts(response.data);
			setTotalPages(response.meta.totalPages);
		} catch (error) {
			console.error('Error fetching products:', error);
			setError('পণ্য লোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');

			toast.error('পণ্য লোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteProduct = async (id: number) => {
		if (!confirm('আপনি কি নিশ্চিত যে আপনি এই পণ্যটি মুছতে চান?')) {
			return;
		}

		// Use the promise pattern for loading state
		toast.promise(
			ProductService.deleteProduct(id).then(() => {
				// Refresh the product list after successful deletion
				fetchProducts();
			}),
			{
				loading: 'পণ্য মুছে ফেলা হচ্ছে...',
				success: 'পণ্য সফলভাবে মুছে ফেলা হয়েছে',
				error: 'পণ্য মুছতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।',
			}
		);
	};

	const getProductTypeLabel = (type: ProductType) => {
		return type === ProductType.SIMPLE ? 'সাধারণ' : 'ভেরিয়েবল';
	};

	// Handle retry when error occurs
	const handleRetry = () => {
		fetchProducts();
	};

	return (
		<div className='space-y-4'>
			{error && (
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>ত্রুটি</AlertTitle>
					<AlertDescription className='flex items-center justify-between'>
						<span>{error}</span>
						<Button variant='outline' size='sm' onClick={handleRetry}>
							আবার চেষ্টা করুন
						</Button>
					</AlertDescription>
				</Alert>
			)}

			<Card className='overflow-hidden'>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-[80px]'>ছবি</TableHead>
								<TableHead>নাম</TableHead>
								<TableHead>ধরন</TableHead>
								<TableHead>মূল্য</TableHead>
								<TableHead>বিভাগ</TableHead>
								<TableHead>স্টেটাস</TableHead>
								<TableHead className='w-[80px]'></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								// Loading skeletons with better layout
								Array.from({ length: 5 }).map((_, index) => (
									<TableRow key={`skeleton-${index}`}>
										<TableCell>
											<Skeleton className='h-12 w-12 rounded-md' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-[200px]' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-[80px]' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-[100px]' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-[120px]' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-[100px]' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-8 w-8 rounded-full' />
										</TableCell>
									</TableRow>
								))
							) : products.length > 0 ? (
								// Display actual products
								products.map((product) => {
									const priceInfo = ProductService.getFormattedPrice(product);
									const primaryImage = ProductService.getPrimaryImage(product);

									return (
										<TableRow key={product.id}>
											<TableCell>
												<div className='h-12 w-12 rounded-md overflow-hidden bg-muted/20'>
													<Image
														src={primaryImage || '/placeholder.svg'}
														alt={product.name}
														width={48}
														height={48}
														className='h-full w-full object-cover'
													/>
												</div>
											</TableCell>
											<TableCell className='font-medium'>
												{product.name}
											</TableCell>
											<TableCell>
												<Badge variant='outline'>
													{getProductTypeLabel(product.productType)}
												</Badge>
											</TableCell>
											<TableCell>
												{priceInfo.hasDiscount ? (
													<div>
														<span className='font-medium'>
															{priceInfo.formattedDiscountPrice}
														</span>
														<span className='ml-2 text-sm text-muted-foreground line-through'>
															{priceInfo.formattedPrice}
														</span>
													</div>
												) : (
													<span className='font-medium'>
														{priceInfo.formattedPrice}
													</span>
												)}
											</TableCell>
											<TableCell>
												<div className='flex flex-wrap gap-1'>
													{product.productCategories.map((category) => (
														<Badge
															key={category.id}
															variant='secondary'
															className='mr-1'
														>
															{category.name}
														</Badge>
													))}
												</div>
											</TableCell>

											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant='ghost' size='icon'>
															<MoreHorizontal className='h-4 w-4' />
															<span className='sr-only'>মেনু খুলুন</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuLabel>অ্যাকশন</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem asChild>
															<Link
																href={`/marketplace/product/${product.id}`}
															>
																<Eye className='h-4 w-4 mr-2' />
																দেখুন
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem asChild>
															<Link
																href={`/vendor/products/${product.id}/edit`}
															>
																<Edit className='h-4 w-4 mr-2' />
																এডিট করুন
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleDeleteProduct(product.id)}
															className='text-destructive focus:text-destructive'
														>
															<Trash className='h-4 w-4 mr-2' />
															মুছুন
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell colSpan={7} className='h-24 text-center'>
										কোন পণ্য পাওয়া যায়নি।{' '}
										<Link
											href='/vendor/products/create'
											className='font-medium underline'
										>
											একটি তৈরি করুন
										</Link>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{!loading && totalPages > 1 && (
					<div className='flex items-center justify-end space-x-2 py-4 px-4 border-t'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setCurrentPage(currentPage - 1)}
							disabled={currentPage === 1}
						>
							পূর্ববর্তী
						</Button>
						<div className='text-sm text-muted-foreground'>
							পৃষ্ঠা {currentPage} / {totalPages}
						</div>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setCurrentPage(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							পরবর্তী
						</Button>
					</div>
				)}
			</Card>
		</div>
	);
}
