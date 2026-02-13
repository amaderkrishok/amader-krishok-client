'use client';

import { useState } from 'react';
import {
	Edit,
	Trash2,
	MoreVertical,
	Eye,
	CheckCircle,
	XCircle,
	User,
} from 'lucide-react';
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
import { PostCategory, PostType, PaginatedMeta } from '@/types/post';

interface PostListProps {
	posts: PostType[];
	categories: PostCategory[];
	isLoading: boolean;
	meta: PaginatedMeta;
	onEdit: (post: PostType) => void;
	onDelete: (id: number) => void;
	onUpdateStatus: (id: number, published: boolean) => void;
	onPageChange: (page: number) => void;
	onSearch: (query: string) => void;
	onFilter: (filters: {
		categoryId?: number;
		published?: boolean | null;
	}) => void;
	currentUserId?: string;
	userRole?: string;
}

export function PostList({
	posts,
	isLoading,
	meta,
	onEdit,
	onDelete,
	onUpdateStatus,
	onPageChange,
	currentUserId,
	userRole,
}: PostListProps) {
	const [postToDelete, setPostToDelete] = useState<number | null>(null);

	// Check if the user is an admin or moderator
	const isAdminOrMod = userRole === 'admin' || userRole === 'moderator';

	const handleDeleteClick = (id: number) => {
		setPostToDelete(id);
	};

	const handleDeleteConfirm = () => {
		if (postToDelete !== null) {
			onDelete(postToDelete);
			setPostToDelete(null);
		}
	};

	const handleDeleteCancel = () => {
		setPostToDelete(null);
	};

	// Check if the current user is the author/updater of the post or has special permissions
	const canEditPost = (post: PostType) => {
		return (
			isAdminOrMod || (currentUserId && post.updatedById === currentUserId)
		);
	};

	if (isLoading) {
		return (
			<div className='space-y-2'>
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className='h-16 w-full' />
				))}
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{/* Posts Table */}
			<div className='border rounded-md'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Categories</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Author</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{posts.length > 0 ? (
							posts.map((post) => (
								<TableRow key={post.id}>
									<TableCell>
										<div className='font-medium'>{post.title}</div>
										<div className='text-sm text-muted-foreground truncate max-w-[300px]'>
											{post.excerpt}
										</div>
									</TableCell>
									<TableCell>
										<div className='flex flex-wrap gap-1'>
											{post.categories?.map((category) => (
												<Badge key={category.id} variant='outline'>
													{category.name}
												</Badge>
											))}
											{(!post.categories || post.categories.length === 0) && (
												<Badge variant='outline'>Uncategorized</Badge>
											)}
										</div>
									</TableCell>
									<TableCell>
										{post.published ? (
											<Badge
												variant='outline'
												className='bg-green-50 text-green-700 border-green-200'
											>
												Published
											</Badge>
										) : (
											<Badge
												variant='outline'
												className='bg-yellow-50 text-yellow-700 border-yellow-200'
											>
												Draft
											</Badge>
										)}
									</TableCell>
									<TableCell>
										{post.updatedBy ? (
											<div className='flex items-center'>
												{post.updatedBy.image ? (
													<img
														src={post.updatedBy.image || '/placeholder.svg'}
														alt={post.updatedBy.name}
														className='h-6 w-6 rounded-full mr-2'
													/>
												) : (
													<User className='h-4 w-4 mr-1 text-muted-foreground' />
												)}
												<span className='text-sm'>
													{currentUserId && post.updatedById === currentUserId
														? 'You'
														: post.updatedBy.name}
												</span>
											</div>
										) : (
											<span className='text-sm text-muted-foreground'>
												Unknown
											</span>
										)}
									</TableCell>
									<TableCell>
										{new Date(post.createdAt || '').toLocaleDateString()}
									</TableCell>
									<TableCell className='text-right'>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant='ghost' size='icon'>
													<MoreVertical className='h-4 w-4' />
													<span className='sr-only'>Open menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												{/* Show edit option if user is author or admin/mod */}
												{canEditPost(post) && (
													<DropdownMenuItem onClick={() => onEdit(post)}>
														<Edit className='h-4 w-4 mr-2' />
														Edit post
													</DropdownMenuItem>
												)}
												<DropdownMenuItem
													onClick={() =>
														window.open(`/post/${post.slug}`, '_blank')
													}
												>
													<Eye className='h-4 w-4 mr-2' />
													View post
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												{/* Status change and delete for author or admin/mod */}
												{canEditPost(post) && (
													<>
														{!post.published ? (
															<DropdownMenuItem
																onClick={() => onUpdateStatus(post.id, true)}
															>
																<CheckCircle className='h-4 w-4 mr-2' />
																Publish
															</DropdownMenuItem>
														) : (
															<DropdownMenuItem
																onClick={() => onUpdateStatus(post.id, false)}
															>
																<XCircle className='h-4 w-4 mr-2' />
																Unpublish
															</DropdownMenuItem>
														)}
														<DropdownMenuSeparator />
														<DropdownMenuItem
															className='text-destructive'
															onClick={() => handleDeleteClick(post.id)}
														>
															<Trash2 className='h-4 w-4 mr-2' />
															Delete post
														</DropdownMenuItem>
													</>
												)}
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={6}
									className='text-center py-8 text-muted-foreground'
								>
									No posts found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{meta.totalPages > 0 && (
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
			)}

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={postToDelete !== null}
				onOpenChange={(open) => !open && setPostToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the post. This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleDeleteCancel}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
							onClick={handleDeleteConfirm}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
