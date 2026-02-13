'use client';

import { useState } from 'react';
import {
	Edit,
	Trash2,
	MoreVertical,
	UserIcon,
	Store,
	CheckCircle,
	XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import type { UserType, PaginationMeta } from '@/types/user';

interface UserListProps {
	users: UserType[];
	isLoading: boolean;
	meta: PaginationMeta;
	onEdit: (user: UserType) => void;
	onDelete: (id: string) => void;
	onUpdateStatus?: (id: string, isBlocked: boolean) => void;
	onApprove?: (id: string, isApproved: boolean) => void;
	onUpdateRole?: (id: string, role: string) => void;
	onPageChange: (page: number) => void;
}

export function UserList({
	users,
	isLoading,
	meta,
	onEdit,
	onDelete,
	onUpdateStatus,
	onApprove,
	onPageChange,
}: UserListProps) {
	const [userToDelete, setUserToDelete] = useState<string | null>(null);

	const handleDeleteClick = (id: string) => {
		setUserToDelete(id);
	};

	const handleDeleteConfirm = () => {
		if (userToDelete !== null) {
			onDelete(userToDelete);
			setUserToDelete(null);
		}
	};

	const handleDeleteCancel = () => {
		setUserToDelete(null);
	};

	const getInitials = (name: string) => {
		return name.charAt(0).toUpperCase() || 'U';
	};

	const getRoleBadgeVariant = (role: string) => {
		switch (role.toLowerCase()) {
			case 'admin':
				return 'default';
			case 'moderator':
				return 'outline';
			case 'vendor':
				return 'secondary';
			default:
				return 'secondary';
		}
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

	if (!users || users.length === 0) {
		return (
			<div className='text-center py-8 text-muted-foreground'>
				No users found
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='border rounded-md'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Approval</TableHead>
							<TableHead>Store ID</TableHead>
							<TableHead>Joined At</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell>
									<div className='flex items-center gap-3'>
										<Avatar>
											<AvatarImage src={user.image || ''} alt={user.name} />
											<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
										</Avatar>
										<div>
											<div className='font-medium'>{user.name}</div>
											<div className='text-sm text-muted-foreground'>
												{user.email}
											</div>
											<div className='text-sm text-muted-foreground'>
												{user.phoneNumber}
											</div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge variant={getRoleBadgeVariant(user.role)}>
										{user.role}
									</Badge>
								</TableCell>
								<TableCell>
									{user.isBlocked ? (
										<Badge
											variant='outline'
											className='bg-red-50 text-red-700 border-red-200'
										>
											Blocked
										</Badge>
									) : (
										<Badge
											variant='outline'
											className='bg-green-50 text-green-700 border-green-200'
										>
											Active
										</Badge>
									)}
								</TableCell>
								<TableCell>
									{user.isApproved ? (
										<Badge
											variant='outline'
											className='bg-green-50 text-green-700 border-green-200'
										>
											Approved
										</Badge>
									) : (
										<Badge
											variant='outline'
											className='bg-yellow-50 text-yellow-700 border-yellow-200'
										>
											Pending
										</Badge>
									)}
								</TableCell>
								<TableCell>
									{user.storeId ? (
										<div className='flex items-center'>
											<Store className='h-4 w-4 mr-1 text-muted-foreground' />
											<span
												className='text-xs truncate max-w-[100px]'
												title={user.storeId}
											>
												{user.storeId.substring(0, 8)}...
											</span>
										</div>
									) : (
										<span className='text-muted-foreground text-xs'>
											No store
										</span>
									)}
								</TableCell>
								<TableCell>
									{new Date(user.createdAt).toLocaleDateString()}
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
											<DropdownMenuItem onClick={() => onEdit(user)}>
												<Edit className='h-4 w-4 mr-2' />
												Edit user
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													(window.location.href = `users/${user.id}`)
												}
											>
												<UserIcon className='h-4 w-4 mr-2' />
												View profile
											</DropdownMenuItem>
											{user.storeId && (
												<DropdownMenuItem
													onClick={() =>
														(window.location.href = `/marketplace/stores/${user.storeId}`)
													}
												>
													<Store className='h-4 w-4 mr-2' />
													View store
												</DropdownMenuItem>
											)}
											<DropdownMenuSeparator />
											{onUpdateStatus && (
												<>
													{user.isBlocked ? (
														<DropdownMenuItem
															onClick={() => onUpdateStatus(user.id, false)}
														>
															<CheckCircle className='h-4 w-4 mr-2' />
															Unblock user
														</DropdownMenuItem>
													) : (
														<DropdownMenuItem
															onClick={() => onUpdateStatus(user.id, true)}
														>
															<XCircle className='h-4 w-4 mr-2' />
															Block user
														</DropdownMenuItem>
													)}
												</>
											)}
											{onApprove && (
												<>
													{!user.isApproved ? (
														<DropdownMenuItem
															onClick={() => onApprove(user.id, true)}
														>
															<CheckCircle className='h-4 w-4 mr-2' />
															Approve user
														</DropdownMenuItem>
													) : (
														<DropdownMenuItem
															onClick={() => onApprove(user.id, false)}
														>
															<XCircle className='h-4 w-4 mr-2' />
															Revoke approval
														</DropdownMenuItem>
													)}
												</>
											)}
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className='text-destructive'
												onClick={() => handleDeleteClick(user.id)}
											>
												<Trash2 className='h-4 w-4 mr-2' />
												Delete user
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

			<AlertDialog
				open={userToDelete !== null}
				onOpenChange={(open) => !open && setUserToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the user. This action cannot be
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
