'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { UserService } from '@/services/user-service';
import type { UserType } from '@/types/user';
import { UserForm } from './user-form';
import { getAxiosErrorMessage } from '@/lib/utils';

interface UserEditFormProps {
	userId: string;
}

export function UserEditForm({ userId }: UserEditFormProps) {
	const [user, setUser] = useState<UserType | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		fetchUser();
	}, [userId]);

	const fetchUser = async () => {
		try {
			setIsLoading(true);
			const response = await UserService.getUser(userId);
			setUser(response.data);
		} catch (error) {
			toast.error(getAxiosErrorMessage(error));
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (userData: UserType) => {
		try {
			await UserService.updateUser(userId, userData);
			toast.success('User updated successfully');
			router.push(`/users/${userId}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'An error occurred');
		}
	};

	const handleCancel = () => {
		router.push(`/users/${userId}`);
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>Loading user data...</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className='flex flex-col items-center justify-center h-64'>
				<div className='text-center mb-4'>User not found</div>
				<Button variant='outline' onClick={() => router.push('/users')}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Users
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<Button variant='outline' onClick={() => router.push(`/users/${userId}`)}>
				<ArrowLeft className='mr-2 h-4 w-4' />
				Back to User Profile
			</Button>

			<Card>
				<CardHeader>
					<CardTitle>Edit User</CardTitle>
					<CardDescription>
						Update user information and permissions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<UserForm
						user={user}
						onSubmit={handleSubmit}
						onCancel={handleCancel}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
