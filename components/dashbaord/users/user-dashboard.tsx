'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/components/providers/session-provider';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserService } from '@/services/user-service';
import type { UserType, UserFilters, PaginationMeta } from '@/types/user';
import { UserList } from './user-list';
import { UserForm } from './user-form';
import { getAxiosErrorMessage } from '@/lib/utils';

export function UserDashboard() {
	const { data: session } = useSession();
	const [users, setUsers] = useState<UserType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('list');
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const [filters, setFilters] = useState<UserFilters>({
		role: null,
		isBlocked: null,
	});
	const [meta, setMeta] = useState<PaginationMeta>({
		totalItems: 0,
		itemCount: 0,
		itemsPerPage: 10,
		totalPages: 1,
		currentPage: 1,
	});

	// Debounce search term
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Fetch users when filters or search term changes
	useEffect(() => {
		fetchUsers(1);
	}, [filters, debouncedSearchTerm]);

	const fetchUsers = async (page = 1) => {
		try {
			setIsLoading(true);
			const response = await UserService.getUsers({
				page,
				limit: 10,
				search: debouncedSearchTerm,
				role: filters.role,
				isBlocked: filters.isBlocked,
			});

			// Make sure response.data exists and is an array
			if (Array.isArray(response.data)) {
				// Filter out the current user
				let filteredUsers = response.data;

				if (session?.user?.id) {
					filteredUsers = filteredUsers.filter(
						(user: UserType) => session?.user?.id && user.id !== session.user.id
					);
				}

				setUsers(filteredUsers);
			} else {
				console.error('Expected array of users but got:', response.data);
				setUsers([]);
			}

			// Check if meta exists before setting it
			if (response.meta) {
				setMeta(response.meta);
			} else {
				console.warn('Meta information is missing in the API response');
			}
		} catch (error) {
			console.error('Error loading users:', error);
			toast.error(getAxiosErrorMessage(error));
			setUsers([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateUserStatus = async (id: string, isBlocked: boolean) => {
		try {
			await UserService.updateUserStatus(id, isBlocked);
			toast.success(`User ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
			fetchUsers(meta.currentPage);
		} catch (error) {
			toast.error(getAxiosErrorMessage(error));
		}
	};

	const handleApproveUser = async (id: string, isApproved: boolean) => {
		try {
			await UserService.approveUser(id, isApproved);
			toast.success(
				`User ${isApproved ? 'approved' : 'rejected'} successfully`
			);
			fetchUsers(meta.currentPage);
		} catch (error) {
			toast.error(getAxiosErrorMessage(error));
		}
	};

	const handleUpdateUserRole = async (id: string, role: string) => {
		try {
			await UserService.updateUserRole(id, role);
			toast.success(`User role updated to ${role} successfully`);
			fetchUsers(meta.currentPage);
		} catch (error) {
			toast.error(getAxiosErrorMessage(error));
		}
	};

	const handleAddUser = () => {
		setSelectedUser(null);
		setIsFormOpen(true);
		setActiveTab('form');
	};

	const handleEditUser = (user: UserType) => {
		setSelectedUser(user);
		setIsFormOpen(true);
		setActiveTab('form');
	};

	const handleDeleteUser = async (id: string) => {
		try {
			await UserService.deleteUser(id);
			toast.success('User deleted successfully');
			fetchUsers(meta.currentPage);
		} catch (error) {
			toast.error(getAxiosErrorMessage(error));
		}
	};

	const handleFormSubmit = async (user: UserType) => {
		try {
			if (user.id) {
				// Update basic user info
				await UserService.updateUser(user.id, {
					name: user.name,
					email: user.email,
					phoneNumber: user.phoneNumber,
					password: user.password,
				});

				// Update status fields separately
				await UserService.updateCompleteStatus(user.id, {
					role: user.role,
					isApproved: user.isApproved,
					isBlocked: user.isBlocked,
				});

				toast.success('User updated successfully');
			} else {
				await UserService.createUser(user);
				toast.success('User created successfully');
			}
			setIsFormOpen(false);
			setActiveTab('list');
			fetchUsers(meta.currentPage);
		} catch (error) {
			toast.error(getAxiosErrorMessage(error));
		}
	};

	const handleFormCancel = () => {
		setIsFormOpen(false);
		setActiveTab('list');
	};

	const handleFilterChange = (
		key: keyof UserFilters,
		value: UserFilters[keyof UserFilters]
	) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handlePageChange = (page: number) => {
		fetchUsers(page);
	};

	return (
		<Card className='w-full'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<div>
					<CardTitle className='text-2xl font-bold tracking-tight'>
						User Management
					</CardTitle>
					<CardDescription>
						Manage your users and their account permissions
					</CardDescription>
				</div>
				<Button onClick={handleAddUser}>
					<Plus className='mr-2 h-4 w-4' />
					Add User
				</Button>
			</CardHeader>
			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className='mb-4'>
						<TabsTrigger value='list'>Users List</TabsTrigger>
						<TabsTrigger value='form' disabled={!isFormOpen}>
							{selectedUser ? 'Edit User' : 'New User'}
						</TabsTrigger>
					</TabsList>
					<TabsContent value='list'>
						<div className='flex items-center justify-between mb-4'>
							<div className='flex items-center gap-2'>
								<h2 className='text-lg font-medium'>All users</h2>
								<Badge variant='secondary'>{meta.totalItems}</Badge>
							</div>
							<div className='flex items-center gap-3'>
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
									<Input
										placeholder='Search users...'
										className='pl-9 w-[300px]'
										value={searchTerm}
										onChange={handleSearch}
									/>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='outline'>
											<Filter className='h-4 w-4 mr-2' />
											Filters
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuCheckboxItem
											checked={filters.isBlocked === false}
											onCheckedChange={(checked) =>
												handleFilterChange('isBlocked', checked ? false : null)
											}
										>
											Active Users
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={filters.isBlocked === true}
											onCheckedChange={(checked) =>
												handleFilterChange('isBlocked', checked ? true : null)
											}
										>
											Blocked Users
										</DropdownMenuCheckboxItem>
										<DropdownMenuSeparator />
										<DropdownMenuCheckboxItem
											checked={filters.role === 'user'}
											onCheckedChange={(checked) =>
												handleFilterChange('role', checked ? 'user' : null)
											}
										>
											User Role
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={filters.role === 'admin'}
											onCheckedChange={(checked) =>
												handleFilterChange('role', checked ? 'admin' : null)
											}
										>
											Admin Role
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={filters.role === 'moderator'}
											onCheckedChange={(checked) =>
												handleFilterChange('role', checked ? 'moderator' : null)
											}
										>
											Moderator Role
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={filters.role === 'vendor'}
											onCheckedChange={(checked) =>
												handleFilterChange('role', checked ? 'vendor' : null)
											}
										>
											Vendor Role
										</DropdownMenuCheckboxItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
						<UserList
							users={users}
							isLoading={isLoading}
							meta={meta}
							onEdit={handleEditUser}
							onDelete={handleDeleteUser}
							onUpdateStatus={handleUpdateUserStatus}
							onApprove={handleApproveUser}
							onUpdateRole={handleUpdateUserRole}
							onPageChange={handlePageChange}
						/>
					</TabsContent>
					<TabsContent value='form'>
						{isFormOpen && (
							<UserForm
								user={selectedUser}
								onSubmit={handleFormSubmit}
								onCancel={handleFormCancel}
							/>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
