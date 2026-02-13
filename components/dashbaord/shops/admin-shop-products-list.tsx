'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, MoreHorizontal, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { ProductService } from '@/services/product-service';
import { type Product } from '@/types/product';
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
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Props {
	storeId: string;
}

export function AdminShopProductsList({ storeId }: Props) {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [search, setSearch] = useState('');

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const res = await ProductService.getProductsByStore(storeId, page, 10);
			const filtered = search
				? res.data.filter((p) =>
						p.name.toLowerCase().includes(search.toLowerCase())
				  )
				: res.data;
			setProducts(filtered);
			setTotalPages(res.meta.totalPages);
		} catch (e) {
			console.error(e);
			toast.error('প্রোডাক্ট লোড করতে সমস্যা হয়েছে');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	// Archive/Delete action removed per requirement; only Edit remains

	return (
		<div className='space-y-4'>
			<div className='flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between'>
				<div className='flex gap-2 w-full sm:w-auto'>
					<Input
						placeholder='নাম দিয়ে খুঁজুন...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								setPage(1);
								fetchProducts();
							}
						}}
					/>
					<Button
						variant='outline'
						onClick={() => {
							setPage(1);
							fetchProducts();
						}}
					>
						<RefreshCw className='h-4 w-4 mr-2' /> রিফ্রেশ
					</Button>
				</div>
			</div>

			<Card className='overflow-hidden'>
				<div className='overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-[72px]'>ছবি</TableHead>
								<TableHead>নাম</TableHead>
								<TableHead>দাম</TableHead>
								<TableHead className='w-[80px]' />
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={`sk-${i}`}>
										<TableCell>
											<div className='h-12 w-12 bg-muted animate-pulse rounded' />
										</TableCell>
										<TableCell>
											<div className='h-4 w-40 bg-muted animate-pulse rounded' />
										</TableCell>
										<TableCell>
											<div className='h-4 w-24 bg-muted animate-pulse rounded' />
										</TableCell>
										<TableCell />
									</TableRow>
								))
							) : products.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={4}
										className='text-center py-8 text-muted-foreground'
									>
										কোন প্রোডাক্ট পাওয়া যায়নি
									</TableCell>
								</TableRow>
							) : (
								products.map((product) => {
									const primaryImg = ProductService.getPrimaryImage(product);
									const priceInfo = ProductService.getFormattedPrice(product);
									return (
										<TableRow key={product.id}>
											<TableCell>
												<div className='h-12 w-12 rounded-md overflow-hidden bg-muted/20'>
													<Image
														src={primaryImg || '/placeholder.svg'}
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
												<div className='text-sm'>
													{priceInfo.formattedPrice}
													{priceInfo.hasDiscount && (
														<span className='text-muted-foreground ml-2 line-through'>
															{priceInfo.formattedDiscountPrice}
														</span>
													)}
												</div>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant='ghost' size='icon'>
															<MoreHorizontal className='h-4 w-4' />
															<span className='sr-only'>মেনু</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuLabel>অ্যাকশন</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem asChild>
															<Link
																href={`/vendor/products/${product.id}/edit`}
															>
																<Edit className='h-4 w-4 mr-2' /> এডিট
															</Link>
														</DropdownMenuItem>
														{/* Archive/Delete action removed */}
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</div>
				{!loading && totalPages > 1 && (
					<div className='flex items-center justify-end gap-2 py-4 px-4 border-t'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
						>
							পূর্ববর্তী
						</Button>
						<div className='text-sm text-muted-foreground'>
							পৃষ্ঠা {page} / {totalPages}
						</div>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}
						>
							পরবর্তী
						</Button>
					</div>
				)}
			</Card>
		</div>
	);
}
