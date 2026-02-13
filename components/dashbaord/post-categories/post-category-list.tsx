'use client';

import { useState, useRef, useCallback } from 'react';
import { Edit, Trash2, MoreVertical, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { PostCategoryType, PaginationMeta } from '@/types/post';

interface PostCategoryListProps {
	categories: PostCategoryType[];
	isLoading: boolean;
	meta: PaginationMeta;
	onEdit: (category: PostCategoryType) => void;
	onDelete: (id: number) => void;
	onPageChange: (page: number) => void;
}

export function PostCategoryList({
	categories,
	isLoading,
	meta,
	onEdit,
	onDelete,
	onPageChange,
}: PostCategoryListProps) {
	const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement | null>(null);

	// Store the category and reference to the clicked button
	const handleDeleteClick = (id: number, buttonRef: HTMLButtonElement) => {
		triggerRef.current = buttonRef;
		setCategoryToDelete(id);
		setIsConfirmOpen(true);
	};

	const handleConfirm = useCallback(() => {
		if (categoryToDelete !== null) {
			onDelete(categoryToDelete);
		}
		setIsConfirmOpen(false);
	}, [categoryToDelete, onDelete]);

	const handleCancel = useCallback(() => {
		setIsConfirmOpen(false);
	}, []);

	// Handle dialog close and focus management
	const handleOpenChange = useCallback((open: boolean) => {
		if (!open) {
			setIsConfirmOpen(false);
			// Use requestAnimationFrame to ensure the dialog is fully removed from the DOM
			requestAnimationFrame(() => {
				// Focus the trigger element that opened the dialog
				if (triggerRef.current) {
					triggerRef.current.focus();
				}
			});
		}
	}, []);

	if (isLoading) {
		return (
			<div className='space-y-2'>
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className='h-16 w-full' />
				))}
			</div>
		);
	}

	if (!categories || categories.length === 0) {
		return (
			<div className='text-center py-8 text-muted-foreground'>
				No categories found
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='border rounded-md'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Slug</TableHead>
							<TableHead>Posts</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{categories.map((category) => (
							<TableRow key={category.id}>
								<TableCell>
									<div className='font-medium'>{category.name}</div>
									<div className='text-sm text-muted-foreground truncate max-w-[300px]'>
										{category.description}
									</div>
								</TableCell>
								<TableCell>{category.slug}</TableCell>
								<TableCell>
									<Badge variant='secondary'>{category.postsCount || 0}</Badge>
								</TableCell>
								<TableCell>
									{new Date(category.createdAt || '').toLocaleDateString()}
								</TableCell>
								<TableCell className='text-right'>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant='ghost' size='icon'>
												<MoreVertical className='h-4 w-4 cursor-pointer' />
												<span className='sr-only'>Open menu</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end'>
											<DropdownMenuItem onClick={() => onEdit(category)}>
												<Edit className='h-4 w-4 mr-2' />
												Edit category
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													window.open(`/categories/${category.slug}`, '_blank')
												}
											>
												<Eye className='h-4 w-4 mr-2' />
												View category
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													window.open(
														`/posts?category=${category.id}`,
														'_blank'
													)
												}
											>
												<FileText className='h-4 w-4 mr-2' />
												View posts
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className='text-destructive'
												onClick={(e) => {
													// Close dropdown first to prevent nested focus issues
													document.body.click(); // Close the dropdown menu
													// Get the delete button for focus restoration
													const deleteButton =
														e.currentTarget as unknown as HTMLButtonElement;
													setTimeout(() => {
														handleDeleteClick(category.id, deleteButton);
													}, 100);
												}}
												disabled={category.postsCount! > 0}
											>
												<Trash2 className='h-4 w-4 mr-2' />
												Delete category
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className='flex items-center justify-center gap-1'>
				{Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
					(page) => (
						<Button
							key={page}
							variant={page === meta.currentPage ? 'default' : 'outline'}
							size='icon'
							className='w-8 h-8'
							onClick={() => onPageChange(page)}
						>
							{page}
						</Button>
					)
				)}
			</div>

			{/* Use a controlled dialog with proper focus management */}
			<AlertDialog open={isConfirmOpen} onOpenChange={handleOpenChange}>
				<AlertDialogContent onEscapeKeyDown={handleCancel}>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the category. This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
							onClick={handleConfirm}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
