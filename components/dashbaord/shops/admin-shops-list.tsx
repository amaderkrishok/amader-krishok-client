'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
	Archive,
	CheckCircle2,
	FileText,
	MoreHorizontal,
	RefreshCw,
} from 'lucide-react';

import { StoreService } from '@/services/store-service';
import { type Store, StoreStatus } from '@/types/store';
import { StoreNidViewer } from './store-nid-viewer';
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
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function AdminShopsList() {
	const [stores, setStores] = useState<Store[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<StoreStatus | undefined>();

	const fetchStores = async () => {
		setLoading(true);
		try {
			const res = await StoreService.getStores({
				page,
				limit: 10,
				name: search || undefined,
				status: statusFilter,
			});
			setStores(res.data);
			setTotalPages(res.meta.totalPages);
		} catch (e) {
			console.error(e);
			toast.error('শপ লোড করতে সমস্যা হয়েছে');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStores();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, statusFilter]);

	const onArchiveToggle = async (store: Store) => {
		const targetStatus =
			store.status === StoreStatus.ARCHIVED
				? StoreStatus.APPROVED
				: StoreStatus.ARCHIVED;
		try {
			const updated = await toast.promise(
				StoreService.updateStore(String(store.id), {
					status: targetStatus,
				} as any),
				{
					loading: 'স্টোর আপডেট হচ্ছে...',
					success: 'স্টোরের স্টেটাস আপডেট হয়েছে',
					error: 'স্টোর আপডেট ব্যর্থ হয়েছে',
				}
			);
			const updatedStatus = (updated as any)?.status ?? targetStatus;
			setStores((prev) =>
				prev.map((s) =>
					s.id === store.id ? { ...s, status: updatedStatus } : s
				)
			);
		} catch {}
	};

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
								fetchStores();
							}
						}}
					/>
					<Button
						variant='outline'
						onClick={() => {
							setPage(1);
							fetchStores();
						}}
					>
						<RefreshCw className='h-4 w-4 mr-2' /> রিফ্রেশ
					</Button>
				</div>
				<div className='flex gap-2'>
					<select
						className='h-10 border rounded-md px-3 text-sm'
						value={statusFilter || ''}
						onChange={(e) =>
							setStatusFilter((e.target.value || undefined) as any)
						}
					>
						<option value=''>সব স্টেটাস</option>
						{Object.values(StoreStatus).map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
					<Button
						variant='secondary'
						onClick={() => {
							setStatusFilter(undefined);
							setSearch('');
							setPage(1);
							fetchStores();
						}}
					>
						ক্লিয়ার
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
								<TableHead>অবস্থান</TableHead>
								<TableHead>স্টেটাস</TableHead>
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
											<div className='h-4 w-32 bg-muted animate-pulse rounded' />
										</TableCell>
										<TableCell>
											<div className='h-6 w-24 bg-muted animate-pulse rounded' />
										</TableCell>
										<TableCell />
									</TableRow>
								))
							) : stores.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className='text-center py-8 text-muted-foreground'
									>
										কোন স্টোর পাওয়া যায়নি
									</TableCell>
								</TableRow>
							) : (
								stores.map((store) => {
									const statusInfo = StoreService.getFormattedStatus(
										store.status
									);
									const img = StoreService.getStoreImageUrl(store);
									return (
										<TableRow key={store.id}>
											<TableCell>
												<div className='h-12 w-12 rounded-md overflow-hidden bg-muted/20'>
													<Image
														src={img || '/placeholder.svg'}
														alt={store.name}
														width={48}
														height={48}
														className='h-full w-full object-cover'
													/>
												</div>
											</TableCell>
											<TableCell className='font-medium'>
												<div className='flex flex-col'>
													<span>{store.name}</span>
													<span className='text-xs text-muted-foreground'>
														{store.slug}
													</span>
												</div>
											</TableCell>
											<TableCell>
												<div className='text-sm text-muted-foreground'>
													{store.district ? `${store.district}, ` : ''}
													{store.division || ''}
												</div>
											</TableCell>
											<TableCell>
												<Badge
													variant='outline'
													className={`${statusInfo.color} ${statusInfo.textColor}`}
												>
													{statusInfo.label}
												</Badge>
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
															<Link href={`/admin/shops/${store.id}`}>
																<CheckCircle2 className='h-4 w-4 mr-2' />{' '}
																ম্যানেজ
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem asChild>
															<Link href={`/admin/shops/${store.id}/products`}>
																<CheckCircle2 className='h-4 w-4 mr-2' />{' '}
																প্রোডাক্টস
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem asChild>
															<StoreNidViewer
																storeId={String(store.id)}
																storeName={store.name}
																trigger={
																	<div className='flex items-center w-full px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm'>
																		<FileText className='h-4 w-4 mr-2' />
																		NID দেখুন
																	</div>
																}
															/>
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => onArchiveToggle(store)}
															className='text-destructive focus:text-destructive'
														>
															{store.status === StoreStatus.ARCHIVED ? (
																<>
																	<RefreshCw className='h-4 w-4 mr-2' />{' '}
																	আনআর্কাইভ
																</>
															) : (
																<>
																	<Archive className='h-4 w-4 mr-2' /> আর্কাইভ
																</>
															)}
														</DropdownMenuItem>
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
