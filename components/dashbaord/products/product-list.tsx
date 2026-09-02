'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, MoreHorizontal, Trash, AlertCircle, Eye, Search, Package, Plus } from 'lucide-react';

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

	// Filter by search query only
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
					<span className='px-3.5 py-2 rounded-xl bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/40 text-xs font-extrabold shadow-xs'>
						মোট {filteredProducts.length}টি পণ্য
					</span>
				</div>
			</div>

			{/* PRODUCT TABLE CARD */}
			<Card className='rounded-[18px] border border-[#E5E7EB] bg-white shadow-xs overflow-hidden'>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow className='bg-[#FAFAF6] hover:bg-[#FAFAF6] border-b border-[#E5E7EB]'>
								<TableHead className='w-[70px] font-extrabold text-[#172033] text-xs uppercase tracking-wider py-4 pl-4'>ছবি</TableHead>
								<TableHead className='font-extrabold text-[#172033] text-xs uppercase tracking-wider py-4'>নাম</TableHead>
								<TableHead className='font-extrabold text-[#172033] text-xs uppercase tracking-wider py-4'>ধরন</TableHead>
								<TableHead className='font-extrabold text-[#172033] text-xs uppercase tracking-wider py-4'>মূল্য</TableHead>
								<TableHead className='font-extrabold text-[#172033] text-xs uppercase tracking-wider py-4'>বিভাগ</TableHead>
								<TableHead className='w-[80px] font-extrabold text-[#172033] text-xs uppercase tracking-wider py-4 text-center pr-4'>অ্যাকশন</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								Array.from({ length: 5 }).map((_, index) => (
									<TableRow key={`skeleton-${index}`}>
										<TableCell className='pl-4 py-4'>
											<Skeleton className='h-12 w-12 rounded-xl' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-[180px] mb-1' />
											<Skeleton className='h-3 w-[120px]' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-6 w-[90px] rounded-full' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-4 w-[90px]' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-6 w-[120px] rounded-full' />
										</TableCell>
										<TableCell className='text-center pr-4'>
											<Skeleton className='h-8 w-8 rounded-full mx-auto' />
										</TableCell>
									</TableRow>
								))
							) : filteredProducts.length > 0 ? (
								filteredProducts.map((product) => {
									const priceInfo = ProductService.getFormattedPrice(product);
									const primaryImage = ProductService.getPrimaryImage(product);
									const primaryCategory = product.productCategories?.[0]?.name || 'সাধারণ';

									let discountPercent = 0;
									if (priceInfo.hasDiscount && product.simpleProductData) {
										const regular = product.simpleProductData.price;
										const discount = product.simpleProductData.discountPrice || 0;
										if (regular > 0 && discount < regular) {
											discountPercent = Math.round(((regular - discount) / regular) * 100);
										}
									}

									return (
										<TableRow
											key={product.id}
											className='hover:bg-[#FFF9E8] border-b border-[#E5E7EB] transition-colors duration-200 group'
										>
											{/* 48x48px Thumbnail */}
											<TableCell className='py-4 pl-4'>
												<div className='h-12 w-12 rounded-[10px] overflow-hidden bg-gray-100 border border-[#E5E7EB] flex-shrink-0 relative shadow-xs'>
													<Image
														src={primaryImage || '/placeholder.svg'}
														alt={product.name}
														fill
														sizes='48px'
														className='object-cover'
													/>
												</div>
											</TableCell>

											{/* Name & Metadata */}
											<TableCell className='py-4'>
												<div className='space-y-0.5'>
													<p className='font-extrabold text-sm text-[#172033] tracking-tight group-hover:text-[#26351B] transition-colors'>
														{product.name}
													</p>
													<p className='text-[11px] text-[#64748B] font-medium'>
														{primaryCategory} • {getProductTypeLabel(product.productType)}
													</p>
												</div>
											</TableCell>

											{/* Product Type Pill */}
											<TableCell className='py-4'>
												<span className='inline-block bg-[#FAFAF6] text-[#26351B] border border-[#E5E7EB] text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs'>
													{getProductTypeLabel(product.productType)}
												</span>
											</TableCell>

											{/* Price & Discount */}
											<TableCell className='py-4'>
												<div className='flex items-center gap-2 flex-wrap'>
													{priceInfo.hasDiscount ? (
														<>
															<span className='font-black text-base text-[#26351B] tracking-tight'>
																{priceInfo.formattedDiscountPrice}
															</span>
															<span className='text-xs text-[#64748B] line-through font-medium'>
																{priceInfo.formattedPrice}
															</span>
															{discountPercent > 0 && (
																<span className='bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/40 text-[10px] font-black px-2 py-0.5 rounded-full'>
																	{discountPercent}% ছাড়
																</span>
															)}
														</>
													) : (
														<span className='font-black text-base text-[#26351B] tracking-tight'>
															{priceInfo.formattedPrice}
														</span>
													)}
												</div>
											</TableCell>

											{/* Category Badges */}
											<TableCell className='py-4'>
												<div className='flex flex-wrap gap-1.5'>
													{product.productCategories?.length > 0 ? (
														product.productCategories.map((category) => (
															<Badge
																key={category.id}
																className='bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/40 text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-2xs'
															>
																{category.name}
															</Badge>
														))
													) : (
														<span className='text-xs text-[#64748B] font-medium'>বিভাগ নেই</span>
													)}
												</div>
											</TableCell>

											{/* Action Circular Button */}
											<TableCell className='py-4 text-center pr-4'>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8 rounded-full border border-[#E5E7EB] hover:bg-[#FFF9E8] hover:border-[#F5B800]/50 transition-colors mx-auto'
														>
															<MoreHorizontal className='h-4 w-4 text-[#172033]' />
															<span className='sr-only'>মেনু খুলুন</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end' className='rounded-xl border-[#E5E7EB] shadow-md p-1 bg-white min-w-[140px]'>
														<DropdownMenuLabel className='text-[10px] font-extrabold uppercase text-[#64748B] px-2 py-1'>
															অ্যাকশন
														</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem asChild className='cursor-pointer text-xs font-bold rounded-lg py-2'>
															<Link href={`/marketplace/product/${product.id}`}>
																<Eye className='h-3.5 w-3.5 mr-2 text-[#26351B]' />
																পণ্য দেখুন
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem asChild className='cursor-pointer text-xs font-bold rounded-lg py-2'>
															<Link href={`/vendor/products/${product.id}/edit`}>
																<Edit className='h-3.5 w-3.5 mr-2 text-blue-600' />
																সম্পাদনা করুন
															</Link>
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleDeleteProduct(product.id)}
															className='text-red-600 focus:text-red-700 cursor-pointer text-xs font-bold rounded-lg py-2'
														>
															<Trash className='h-3.5 w-3.5 mr-2' />
															পণ্য মুছে ফেলুন
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell colSpan={6} className='h-64 text-center py-12'>
										<div className='max-w-sm mx-auto space-y-3'>
											<div className='w-16 h-16 bg-[#FFF9E8] rounded-full flex items-center justify-center mx-auto border border-[#F5B800]/40 shadow-xs'>
												<Package className='w-8 h-8 text-[#26351B]' />
											</div>
											<div className='space-y-1'>
												<h3 className='text-base font-extrabold text-[#172033]'>
													কোনো পণ্য পাওয়া যায়নি
												</h3>
												<p className='text-xs text-[#64748B] font-medium'>
													আপনার স্টোরে প্রথম পণ্যটি যোগ করুন।
												</p>
											</div>
											<Link href='/vendor/products/create' className='inline-block pt-2'>
												<Button className='bg-[#F5B800] hover:bg-[#E0A800] text-[#172033] font-extrabold rounded-xl px-5 py-2.5 shadow-xs border-0 text-xs'>
													<Plus className='mr-1.5 h-4 w-4 text-[#172033]' />
													+ নতুন পণ্য যোগ করুন
												</Button>
											</Link>
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{/* PAGINATION */}
				{!loading && totalPages > 1 && (
					<div className='flex items-center justify-between py-4 px-6 border-t border-[#E5E7EB] bg-[#FAFAF6] text-xs font-bold'>
						<div className='text-[#64748B]'>
							পৃষ্ঠা <span className='text-[#172033]'>{currentPage}</span> / <span className='text-[#172033]'>{totalPages}</span>
						</div>
						<div className='flex items-center space-x-1.5'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => setCurrentPage(currentPage - 1)}
								disabled={currentPage === 1}
								className='rounded-xl border-[#E5E7EB] text-xs font-bold h-8 px-3'
							>
								&lt;
							</Button>
							{Array.from({ length: totalPages }).map((_, idx) => {
								const pageNum = idx + 1;
								const isActive = pageNum === currentPage;
								return (
									<Button
										key={pageNum}
										variant={isActive ? 'default' : 'outline'}
										size='sm'
										onClick={() => setCurrentPage(pageNum)}
										className={`h-8 w-8 rounded-xl text-xs font-bold ${
											isActive
												? 'bg-[#F5B800] text-[#172033] hover:bg-[#E0A800] border-0 shadow-xs'
												: 'border-[#E5E7EB] text-[#172033] hover:bg-[#FFF9E8]'
										}`}
									>
										{pageNum}
									</Button>
								);
							})}
							<Button
								variant='outline'
								size='sm'
								onClick={() => setCurrentPage(currentPage + 1)}
								disabled={currentPage === totalPages}
								className='rounded-xl border-[#E5E7EB] text-xs font-bold h-8 px-3'
							>
								&gt;
							</Button>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}
