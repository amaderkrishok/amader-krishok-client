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
	Search,
	Filter,
	Store as StoreIcon,
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
		<Card className='p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-5'>
			{/* TOOLBAR */}
			<div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#FAFAF6] p-4 rounded-2xl border border-[#E5E7EB]'>
				<div className='flex items-center gap-2 flex-1 max-w-md'>
					<div className='relative w-full'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]' />
						<Input
							placeholder='নাম দিয়ে খুঁজুন...'
							value={search}
							className='pl-9 bg-white border-[#E5E7EB] rounded-xl text-xs font-bold focus-visible:ring-[#F5B800] h-10'
							onChange={(e) => setSearch(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									setPage(1);
									fetchStores();
								}
							}}
						/>
					</div>
					<Button
						variant='outline'
						onClick={() => {
							setPage(1);
							fetchStores();
						}}
						className='bg-white border-[#E5E7EB] text-xs font-extrabold h-10 rounded-xl hover:bg-white shrink-0'
					>
						<RefreshCw className='h-3.5 w-3.5 mr-1.5 text-[#26351B]' /> রিফ্রেশ
					</Button>
				</div>

				<div className='flex items-center gap-2'>
					<select
						className='h-10 border border-[#E5E7EB] rounded-xl px-3 text-xs font-bold bg-white text-[#172033] focus:ring-1 focus:ring-[#F5B800]'
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
						variant='outline'
						onClick={() => {
							setStatusFilter(undefined);
							setSearch('');
							setPage(1);
							fetchStores();
						}}
						className='bg-white border-[#E5E7EB] text-xs font-extrabold h-10 rounded-xl hover:bg-[#FAFAF6]'
					>
						ক্লিয়ার
					</Button>
				</div>
			</div>

			{/* STORES TABLE */}
			<div className='overflow-x-auto rounded-2xl border border-[#E5E7EB]'>
				<table className='w-full text-left border-collapse text-xs sm:text-sm'>
					<thead>
						<tr className='bg-[#FAFAF6] border-b border-[#E5E7EB] text-[#64748B] font-extrabold uppercase tracking-wider text-[11px]'>
							<th className='py-3.5 px-4 w-[72px]'>ছবি</th>
							<th className='py-3.5 px-4'>নাম</th>
							<th className='py-3.5 px-4'>অবস্থান</th>
							<th className='py-3.5 px-4'>স্টেটাস</th>
							<th className='py-3.5 px-4 text-right w-[80px]'>অ্যাকশন</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-[#E5E7EB] bg-white'>
						{loading ? (
							Array.from({ length: 5 }).map((_, i) => (
								<tr key={`sk-${i}`}>
									<td className='py-3.5 px-4'>
										<div className='h-12 w-12 bg-gray-100 animate-pulse rounded-xl' />
									</td>
									<td className='py-3.5 px-4'>
										<div className='h-4 w-40 bg-gray-100 animate-pulse rounded-md' />
									</td>
									<td className='py-3.5 px-4'>
										<div className='h-4 w-32 bg-gray-100 animate-pulse rounded-md' />
									</td>
									<td className='py-3.5 px-4'>
										<div className='h-6 w-24 bg-gray-100 animate-pulse rounded-full' />
									</td>
									<td className='py-3.5 px-4' />
								</tr>
							))
						) : stores.length === 0 ? (
							<tr>
								<td
									colSpan={5}
									className='text-center py-12 text-[#64748B] font-bold text-xs bg-[#FAFAF6]'
								>
									<StoreIcon className='h-10 w-10 mx-auto mb-2 text-[#64748B]/40' />
									কোন স্টোর পাওয়া যায়নি
								</td>
							</tr>
						) : (
							stores.map((store) => {
								const statusInfo = StoreService.getFormattedStatus(
									store.status
								);
								const img = StoreService.getStoreImageUrl(store);
								return (
									<tr key={store.id} className='hover:bg-[#FFF9E8] transition-colors duration-150'>
										<td className='py-3.5 px-4'>
											<div className='h-12 w-12 rounded-xl overflow-hidden bg-[#FFF9E8] border border-[#E5E7EB] relative flex-shrink-0'>
												<Image
													src={img || '/placeholder.svg'}
													alt={store.name}
													width={48}
													height={48}
													className='h-full w-full object-cover'
												/>
											</div>
										</td>
										<td className='py-3.5 px-4 font-extrabold text-[#172033]'>
											<div className='flex flex-col'>
												<span>{store.name}</span>
												<span className='text-xs font-semibold text-[#64748B]'>
													{store.slug}
												</span>
											</div>
										</td>
										<td className='py-3.5 px-4 text-xs font-bold text-[#64748B]'>
											{store.district ? `${store.district}, ` : ''}
											{store.division || ''}
										</td>
										<td className='py-3.5 px-4'>
											<Badge
												variant='outline'
												className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${statusInfo.color} ${statusInfo.textColor}`}
											>
												{statusInfo.label}
											</Badge>
										</td>
										<td className='py-3.5 px-4 text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant='ghost' size='icon' className='h-8 w-8 rounded-xl border border-[#E5E7EB] hover:bg-[#FAFAF6]'>
														<MoreHorizontal className='h-4 w-4 text-[#172033]' />
														<span className='sr-only'>মেনু</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end' className='rounded-xl border-[#E5E7EB] bg-white font-bold text-xs p-2 shadow-md'>
													<DropdownMenuLabel className='text-[10px] text-[#64748B] uppercase tracking-wider'>অ্যাকশন</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem asChild className='cursor-pointer py-2'>
														<Link href={`/admin/shops/${store.id}`}>
															<CheckCircle2 className='h-4 w-4 mr-2 text-[#26351B]' />{' '}
															ম্যানেজ
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem asChild className='cursor-pointer py-2'>
														<Link href={`/admin/shops/${store.id}/products`}>
															<CheckCircle2 className='h-4 w-4 mr-2 text-[#26351B]' />{' '}
															প্রোডাক্টস
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem asChild className='cursor-pointer py-2'>
														<StoreNidViewer
															storeId={String(store.id)}
															storeName={store.name}
															trigger={
																<div className='flex items-center w-full px-2 py-1 text-xs font-bold cursor-pointer hover:bg-[#FFF9E8] rounded-md'>
																	<FileText className='h-4 w-4 mr-2 text-[#F5B800]' />
																	NID দেখুন
																</div>
															}
														/>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => onArchiveToggle(store)}
														className='text-red-600 focus:text-red-700 cursor-pointer py-2'
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
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{!loading && totalPages > 1 && (
				<div className='flex items-center justify-between py-3 px-2 border-t border-[#E5E7EB] pt-4'>
					<div className='text-xs font-bold text-[#64748B]'>
						পৃষ্ঠা {page} / {totalPages}
					</div>
					<div className='flex items-center gap-2'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1}
							className='rounded-xl border-[#E5E7EB] text-xs font-extrabold h-9 px-3'
						>
							পূর্ববর্তী
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page === totalPages}
							className='rounded-xl border-[#E5E7EB] text-xs font-extrabold h-9 px-3'
						>
							পরবর্তী
						</Button>
					</div>
				</div>
			)}
		</Card>
	);
}
