'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Plus, Filter, Search, Users, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/components/providers/session-provider';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchTerm]);

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

			if (Array.isArray(response.data)) {
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
				await UserService.updateUser(user.id, {
					name: user.name,
					email: user.email,
					phoneNumber: user.phoneNumber,
					password: user.password,
				});

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
		<div className='space-y-6 w-full mx-auto pb-6'>
			{/* HERO HEADER */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#FFF9E8] via-white to-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden'>
				<div className='space-y-1.5 z-10'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 rounded-xl bg-[#26351B] flex items-center justify-center text-[#F5B800] shadow-2xs'>
							<Users className='w-4 h-4 text-[#F5B800]' />
						</div>
						<h1 className='text-2xl sm:text-3xl font-black text-[#172033] tracking-tight'>
							ইউজার ম্যানেজমেন্ট (User Management)
						</h1>
					</div>
					<p className='text-xs sm:text-sm text-[#64748B] font-medium'>
						প্ল্যাটফর্মের সকল ব্যবহারকারী, রোলে পারমিশন ও একাউন্ট স্ট্যাটাস পরিচালনা করুন
					</p>
				</div>

				<Button
					onClick={handleAddUser}
					className='bg-[#F5B800] hover:bg-[#E0A800] text-[#172033] font-extrabold rounded-xl h-10 px-5 text-xs shadow-xs border-0 transition-all hover:-translate-y-0.5 z-10'
				>
					<Plus className='mr-2 h-4 w-4 text-[#172033]' />
					নতুন ইউজার যোগ করুন
				</Button>
			</div>

			{/* MAIN CARD CONTAINER */}
			<Card className='p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6'>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className='mb-6 bg-[#FAFAF6] p-1.5 rounded-2xl border border-[#E5E7EB] w-full sm:w-auto inline-flex'>
						<TabsTrigger
							value='list'
							className='rounded-xl text-xs font-extrabold py-2 px-4 transition-all data-[state=active]:bg-white data-[state=active]:text-[#172033] data-[state=active]:shadow-xs'
						>
							👥 ইউজার লিস্ট ({meta.totalItems})
						</TabsTrigger>
						<TabsTrigger
							value='form'
							disabled={!isFormOpen}
							className='rounded-xl text-xs font-extrabold py-2 px-4 transition-all data-[state=active]:bg-white data-[state=active]:text-[#172033] data-[state=active]:shadow-xs'
						>
							{selectedUser ? '✏️ সম্পাদনা করুন' : '➕ নতুন ইউজার'}
						</TabsTrigger>
					</TabsList>

					<TabsContent value='list' className='space-y-4 focus-visible:outline-none'>
						{/* TOOLBAR SEARCH & FILTERS */}
						<div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAFAF6] p-4 rounded-2xl border border-[#E5E7EB]'>
							<div className='flex items-center gap-2'>
								<h2 className='text-xs font-extrabold text-[#172033] uppercase tracking-wider flex items-center gap-2'>
									<ShieldCheck className='w-4 h-4 text-[#26351B]' />
									ব্যবহারকারী তালিকা
								</h2>
								<Badge className='bg-[#FFF9E8] text-[#26351B] border border-[#F5B800]/40 font-bold text-xs px-2.5 py-0.5 rounded-lg'>
									{meta.totalItems} জন
								</Badge>
							</div>

							<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
								<div className='relative flex-1 sm:w-72'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]' />
									<Input
										placeholder='ইউজার খুঁজুন (নাম, ইমেইল, ফোন)...'
										className='pl-9 bg-white border-[#E5E7EB] rounded-xl text-xs font-bold focus-visible:ring-[#F5B800] h-10'
										value={searchTerm}
										onChange={handleSearch}
									/>
								</div>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='outline' className='bg-white border-[#E5E7EB] text-xs font-extrabold h-10 rounded-xl hover:bg-white'>
											<Filter className='h-4 w-4 mr-2 text-[#26351B]' />
											ফিল্টার
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className='rounded-xl border-[#E5E7EB] bg-white font-bold text-xs p-2 shadow-md'>
										<DropdownMenuCheckboxItem
											checked={filters.isBlocked === false}
											onCheckedChange={(checked) =>
												handleFilterChange('isBlocked', checked ? false : null)
											}
										>
											সক্রিয় ইউজার (Active)
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={filters.isBlocked === true}
											onCheckedChange={(checked) =>
												handleFilterChange('isBlocked', checked ? true : null)
											}
										>
											ব্লকড ইউজার (Blocked)
										</DropdownMenuCheckboxItem>
										<DropdownMenuSeparator />
										<DropdownMenuCheckboxItem
											checked={filters.role === 'user'}
											onCheckedChange={(checked) =>
												handleFilterChange('role', checked ? 'user' : null)
											}
										>
											User রোল
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={filters.role === 'admin'}
											onCheckedChange={(checked) =>
												handleFilterChange('role', checked ? 'admin' : null)
											}
										>
											Admin রোল
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={filters.role === 'moderator'}
											onCheckedChange={(checked) =>
												handleFilterChange('role', checked ? 'moderator' : null)
											}
										>
											Moderator রোল
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={filters.role === 'vendor'}
											onCheckedChange={(checked) =>
												handleFilterChange('role', checked ? 'vendor' : null)
											}
										>
											Vendor রোল
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

					<TabsContent value='form' className='focus-visible:outline-none'>
						{isFormOpen && (
							<UserForm
								user={selectedUser}
								onSubmit={handleFormSubmit}
								onCancel={handleFormCancel}
							/>
						)}
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	);
}
