'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, MoreHorizontal, Trash, AlertCircle, Eye, Search, Package } from 'lucide-react';

import { ProductService } from '@/services/product-service';
import { type Product, ProductType } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
	const [searchQuery, setSearchQuery] = useState('');
	const { user } = useSession();

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
			const response = await ProductService.getProductsByStore(
				user.storeId,
				currentPage
			);

			setProducts(response.data || []);
			setTotalPages(response.meta?.totalPages || 1);
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

		toast.promise(
			ProductService.deleteProduct(id).then(() => {
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

	const filteredProducts = products.filter((product) =>
		product.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className='space-y-4'>
			{error && (
				<Alert variant='destructive' className='rounded-2xl'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>ত্রুটি</AlertTitle>
					<AlertDescription className='flex items-center justify-between'>
						<span>{error}</span>
						<Button variant='outline' size='sm' onClick={fetchProducts} className='rounded-xl text-xs font-bold'>
							আবার চেষ্টা করুন
						</Button>
					</AlertDescription>
				</Alert>
			)}

			{/* SEARCH & TOOLBAR */}
			<div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-[18px] border border-[#E5E7EB] shadow-xs'>
				<div className='relative flex-1 max-w-md'>
					<Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] h-4 w-4' />
					<Input
						placeholder='🔍 পণ্য খুঁজুন...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='pl-10 rounded-xl border-[#E5E7EB] text-xs font-semibold bg-[#FAFAF6] focus:bg-white h-10'
					/>
				</div>

				<div className='flex items-center justify-between sm:justify-end gap-3 text-xs font-bold text-[#64748B]'>
					<span className='px-3 py-1.5 rounded-full bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/30'>
						মোট {filteredProducts.length}টি পণ্য
					</span>
				</div>
			</div>

			{/* TABLE CARD */}
			<Card className='rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs overflow-hidden'>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow className='bg-[#FAFAF6] hover:bg-[#FAFAF6] border-b border-[#E5E7EB]'>
								<TableHead className='w-[80px] font-extrabold text-[#172033] text-xs uppercase tracking-wider py-4'>ছবি</TableHead>
								<TableHead className='font-extrabold text-[#172033] text-xs uppercase tracking-wider py-4'>নাম</TableHead>
								<TableHead className='font-extrabold text-[#172033] text-xs uppercase tracking-wider py-4'>ধরন</TableHead>
								<TableHead className='font-extrabold text-[#172033] text-xs uppercase tracking-wider py-4'>মূল্য</TableHead>
								<TableHead className='font-extrabold text-[#172033] text-xs uppercase tracking-wider py-4'>বিভাগ</TableHead>
								<TableHead className='w-[80px] font-extrabold text-[#172033] text-xs uppercase tracking-wider py-4 text-right'>অ্যাকশন</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								Array.from({ length: 5 }).map((_, index) => (
									<TableRow key={`skeleton-${index}`}>
										<TableCell>
											<Skeleton className='h-12 w-12 rounded-xl' />
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
										<TableCell className='text-right'>
											<Skeleton className='h-8 w-8 rounded-full ml-auto' />
										</TableCell>
									</TableRow>
								))
							) : filteredProducts.length > 0 ? (
								filteredProducts.map((product) => {
									const priceInfo = ProductService.getFormattedPrice(product);
									const primaryImage = ProductService.getPrimaryImage(product);

									return (
										<TableRow key={product.id} className='hover:bg-[#FFF9E8]/50 border-b border-[#E5E7EB] transition-colors'>
											<TableCell className='py-3'>
												<div className='h-12 w-12 rounded-xl overflow-hidden bg-gray-100 border border-[#E5E7EB] flex-shrink-0 relative'>
													<Image
														src={primaryImage || '/placeholder.svg'}
														alt={product.name}
														fill
														sizes='48px'
														className='object-cover'
													/>
												</div>
											</TableCell>
											<TableCell className='font-extrabold text-sm text-[#172033] py-3'>
												{product.name}
											</TableCell>
											<TableCell className='py-3'>
												<Badge className='bg-[#FAFAF6] text-[#26351B] border border-[#E5E7EB] text-[11px] font-bold px-2.5 py-0.5 rounded-full'>
													{getProductTypeLabel(product.productType)}
												</Badge>
											</TableCell>
											<TableCell className='py-3'>
												{priceInfo.hasDiscount ? (
													<div>
														<span className='font-black text-sm text-[#26351B]'>
															{priceInfo.formattedDiscountPrice}
														</span>
														<span className='ml-2 text-xs text-[#64748B] line-through font-medium'>
															{priceInfo.formattedPrice}
														</span>
													</div>
												) : (
													<span className='font-black text-sm text-[#26351B]'>
														{priceInfo.formattedPrice}
													</span>
												)}
											</TableCell>
											<TableCell className='py-3'>
												<div className='flex flex-wrap gap-1'>
													{product.productCategories?.map((category) => (
														<Badge
															key={category.id}
															className='bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full'
														>
															{category.name}
														</Badge>
													))}
												</div>
											</TableCell>

											<TableCell className='py-3 text-right'>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant='ghost' size='icon' className='h-8 w-8 rounded-xl hover:bg-black/5'>
															<MoreHorizontal className='h-4 w-4 text-[#172033]' />
															<span className='sr-only'>মেনু খুলুন</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end' className='rounded-xl border-[#E5E7EB] shadow-md'>
														<DropdownMenuLabel className='text-xs font-extrabold text-[#64748B]'>অ্যাকশন</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem asChild className='cursor-pointer text-xs font-bold'>
															<Link href={`/marketplace/product/${product.id}`}>
																<Eye className='h-4 w-4 mr-2 text-[#26351B]' />
																দেখুন
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem asChild className='cursor-pointer text-xs font-bold'>
															<Link href={`/vendor/products/${product.id}/edit`}>
																<Edit className='h-4 w-4 mr-2 text-blue-600' />
																এডিট করুন
															</Link>
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleDeleteProduct(product.id)}
															className='text-red-600 focus:text-red-700 cursor-pointer text-xs font-bold'
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
									<TableCell colSpan={6} className='h-32 text-center text-xs font-medium text-[#64748B]'>
										<Package className='w-8 h-8 text-[#64748B]/40 mx-auto mb-2' />
										কোনো পণ্য পাওয়া যায়নি।{' '}
										<Link
											href='/vendor/products/create'
											className='font-bold text-[#26351B] underline hover:text-[#F5B800]'
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
					<div className='flex items-center justify-between py-4 px-6 border-t border-[#E5E7EB] bg-[#FAFAF6] text-xs font-bold'>
						<div className='text-[#64748B]'>
							পৃষ্ঠা <span className='text-[#172033]'>{currentPage}</span> / <span className='text-[#172033]'>{totalPages}</span>
						</div>
						<div className='flex items-center space-x-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => setCurrentPage(currentPage - 1)}
								disabled={currentPage === 1}
								className='rounded-xl border-[#E5E7EB] text-xs font-bold'
							>
								পূর্ববর্তী
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => setCurrentPage(currentPage + 1)}
								disabled={currentPage === totalPages}
								className='rounded-xl border-[#E5E7EB] text-xs font-bold'
							>
								পরবর্তী
							</Button>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}
