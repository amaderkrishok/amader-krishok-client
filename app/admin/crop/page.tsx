'use client';

import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pagination } from '@/components/dashbaord/crop/pagination';
import api from '@/lib/axios';
import { getAxiosErrorMessage } from '@/lib/utils';

interface Crop {
	id: string;
	name: string;
	cultivations: any[];
	diseases: any[];
}

interface PaginationInfo {
	total: number;
	page: number;
	pageSize: number;
	pageCount: number;
}

export default function ManageCrops() {
	const router = useRouter();
	const [crops, setCrops] = useState<Crop[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo>({
		total: 0,
		page: 1,
		pageSize: 10,
		pageCount: 1,
	});
	const [loading, setLoading] = useState(true);
	const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);

	useEffect(() => {
		fetchCrops(1);
	}, []);

	const fetchCrops = async (page: number) => {
		setLoading(true);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/crops?page=${page}&limit=10&includeRelations=true`
			);

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();

			// Check for success field as in your NestJS API
			if (data.success === false) {
				throw new Error(data.error || 'Failed to fetch crops');
			}

			// Access data property directly since your NestJS API now returns { success: true, data: [...] }
			setCrops(data.data || []);

			// Access pagination data from your NestJS format
			setPagination({
				total: data.pagination?.total || 0,
				page: data.pagination?.page || page,
				pageSize: data.pagination?.pageSize || 10,
				pageCount: data.pagination?.pageCount || 1,
			});
		} catch (error) {
			console.error('Error fetching crops:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to load crops'
			);
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (page: number) => {
		fetchCrops(page);
	};

	const handleDelete = async (id: string) => {
		toast.warning('Are you sure?', {
			description: 'This action cannot be undone.',
			action: {
				label: 'Delete',
				onClick: async () => {
					try {
						setDeleteInProgress(id);

						// Correctly handle axios response
						const response = await api.delete(`/crops/${id}`);
						const data = response.data; // Access the data directly

						if (data.statusCode === 200) {
							// Remove the deleted crop from the state
							setCrops((prevCrops) =>
								prevCrops.filter((crop) => crop.id !== id)
							);

							// Update pagination info
							setPagination((prevPagination) => ({
								...prevPagination,
								total: prevPagination.total - 1,
							}));

							toast.success('Crop deleted successfully!');

							// If we've deleted the last item on the current page, go to previous page
							if (crops.length === 1 && pagination.page > 1) {
								fetchCrops(pagination.page - 1);
							} else if (crops.length === 1) {
								// If it's the first page and we deleted the last item
								fetchCrops(1);
							} else {
								// Otherwise refresh the current page
								fetchCrops(pagination.page);
							}
						} else {
							toast.error(data.error || 'Failed to delete crop');
						}
					} catch (error) {
						console.error('Error deleting crop:', error);
						toast.error(getAxiosErrorMessage(error));
					} finally {
						setDeleteInProgress(null);
					}
				},
			},
		});
	};

	const handleEdit = (id: string) => {
		router.push(`/admin/crop/update-crop/${id}`);
	};

	return (
		<div className='container mx-auto p-4 md:p-8'>
			<div className='flex justify-between items-center mb-8'>
				<h1 className='text-2xl md:text-3xl font-bold'>Manage Crops</h1>
				<Button onClick={() => router.push('/admin/crop/add-crop')}>
					Add New Crop
				</Button>
			</div>

			{loading ? (
				<div className='flex justify-center items-center h-64'>
					<Loader2 className='h-8 w-8 animate-spin' />
				</div>
			) : crops.length === 0 ? (
				<div className='text-center p-8 border rounded-md bg-muted/20'>
					<p className='text-muted-foreground mb-4'>No crops found</p>
					<Button onClick={() => router.push('crop/add-crop')}>
						Add Your First Crop
					</Button>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{crops.map((crop) => (
						<Card key={crop.id} className='flex flex-col'>
							<CardHeader>
								<CardTitle className='text-xl'>{crop.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='mb-1'>
									Cultivations: {crop.cultivations?.length || 0}
								</p>
								<p>Diseases: {crop.diseases?.length || 0}</p>
							</CardContent>
							<CardFooter className='flex flex-wrap gap-2 mt-auto'>
								<Button
									variant='destructive'
									onClick={() => handleDelete(crop.id)}
									disabled={deleteInProgress === crop.id}
								>
									{deleteInProgress === crop.id ? (
										<Loader2 className='h-4 w-4 mr-2 animate-spin' />
									) : (
										<Trash className='h-4 w-4 mr-2' />
									)}
									Delete
								</Button>
								<Button variant='outline' onClick={() => handleEdit(crop.id)}>
									<Edit className='h-4 w-4 mr-2' />
									Edit
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}

			{!loading && crops.length > 0 && (
				<div className='mt-8 flex justify-center'>
					<Pagination
						total={pagination.total}
						pageSize={pagination.pageSize}
						siblingCount={1}
						currentPage={pagination.page}
						onPageChange={handlePageChange}
					/>
				</div>
			)}
		</div>
	);
}
