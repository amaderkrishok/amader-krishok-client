'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
	ArrowLeft,
	Mail,
	Phone,
	Calendar,
	Shield,
	Store,
	CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { UserService } from '@/services/user-service';
import type { UserType } from '@/types/user';
import { getAxiosErrorMessage } from '@/lib/utils';
import React from 'react';

interface UserProfileProps {
	userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
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
			console.log(response.data);
			
			setUser(response.data);
		} catch (error) {
			toast.error(getAxiosErrorMessage(error));
		} finally {
			setIsLoading(false);
		}
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
			<div className='flex items-center justify-center h-64'>
				<div className='text-center'>Loading user profile...</div>
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
			<Button variant='outline' onClick={() => router.push('/users')}>
				<ArrowLeft className='mr-2 h-4 w-4' />
				Back to Users
			</Button>

			<Card>
				<CardHeader className='pb-4'>
					<div className='flex items-start justify-between'>
						<div className='flex items-center space-x-4'>
							<Avatar className='h-20 w-20'>
								<AvatarImage src={user.image || ''} alt={user.name} />
								<AvatarFallback className='text-lg'>
									{getInitials(user.name)}
								</AvatarFallback>
							</Avatar>
							<div>
								<CardTitle className='text-2xl'>{user.name}</CardTitle>
								<CardDescription className='flex items-center mt-1'>
									<Badge variant={getRoleBadgeVariant(user.role)}>
										{user.role}
									</Badge>
									{user.isBlocked ? (
										<Badge
											variant='outline'
											className='ml-2 bg-red-50 text-red-700 border-red-200'
										>
											Blocked
										</Badge>
									) : (
										<Badge
											variant='outline'
											className='ml-2 bg-green-50 text-green-700 border-green-200'
										>
											Active
										</Badge>
									)}
									{user.isApproved ? (
										<Badge
											variant='outline'
											className='ml-2 bg-green-50 text-green-700 border-green-200'
										>
											Approved
										</Badge>
									) : (
										<Badge
											variant='outline'
											className='ml-2 bg-yellow-50 text-yellow-700 border-yellow-200'
										>
											Pending
										</Badge>
									)}
								</CardDescription>
							</div>
						</div>
						<div className='flex space-x-2'>
							<Button
								variant='outline'
								onClick={() => router.push(`edit/${userId}`)}
							>
								Edit Profile
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue='details'>
						<TabsList className='mb-4'>
							<TabsTrigger value='details'>User Details</TabsTrigger>
							<TabsTrigger value='activity'>Activity</TabsTrigger>
							<TabsTrigger value='security'>Security</TabsTrigger>
						</TabsList>
						<TabsContent value='details'>
							<div className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<div className='text-sm font-medium text-muted-foreground'>
											Contact Information
										</div>
										<div className='flex items-center'>
											<Mail className='h-4 w-4 mr-2 text-muted-foreground' />
											<span>{user.email}</span>
										</div>
										{user.phoneNumber && (
											<div className='flex items-center'>
												<Phone className='h-4 w-4 mr-2 text-muted-foreground' />
												<span>{user.phoneNumber}</span>
											</div>
										)}
									</div>
									<div className='space-y-2'>
										<div className='text-sm font-medium text-muted-foreground'>
											Account Information
										</div>
										<div className='flex items-center'>
											<Calendar className='h-4 w-4 mr-2 text-muted-foreground' />
											<span>
												Created: {new Date(user.createdAt).toLocaleDateString()}
											</span>
										</div>
										<div className='flex items-center'>
											<Shield className='h-4 w-4 mr-2 text-muted-foreground' />
											<span>Role: {user.role}</span>
										</div>
										{user.storeId && (
											<div className='flex items-center'>
												<Store className='h-4 w-4 mr-2 text-muted-foreground' />
												<span>Store ID: {user.storeId}</span>
											</div>
										)}
									</div>
								</div>
								<Separator />
								<div className='space-y-2'>
									<div className='text-sm font-medium text-muted-foreground'>
										Account Status
									</div>
									<div className='flex flex-col space-y-2'>
										<div className='flex items-center justify-between'>
											<div className='flex items-center'>
												<CheckCircle className='h-4 w-4 mr-2 text-muted-foreground' />
												<span>Block Status</span>
											</div>
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
										</div>
										<div className='flex items-center justify-between'>
											<div className='flex items-center'>
												<CheckCircle className='h-4 w-4 mr-2 text-muted-foreground' />
												<span>Approval Status</span>
											</div>
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
										</div>
										<div className='flex items-center justify-between'>
											<div className='flex items-center'>
												<CheckCircle className='h-4 w-4 mr-2 text-muted-foreground' />
												<span>Email Verification</span>
											</div>
											{user.emailVerified ? (
												<Badge
													variant='outline'
													className='bg-green-50 text-green-700 border-green-200'
												>
													Verified
												</Badge>
											) : (
												<Badge
													variant='outline'
													className='bg-yellow-50 text-yellow-700 border-yellow-200'
												>
													Not Verified
												</Badge>
											)}
										</div>
									</div>
								</div>
							</div>
						</TabsContent>
						<TabsContent value='activity'>
							<div className='text-center py-8 text-muted-foreground'>
								User activity history will be displayed here.
							</div>
						</TabsContent>
						<TabsContent value='security'>
							<div className='text-center py-8 text-muted-foreground'>
								Security settings will be displayed here.
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
