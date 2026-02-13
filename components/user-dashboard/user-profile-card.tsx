'use client';

import type React from 'react';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Save } from 'lucide-react';

export function UserProfileCard() {
	const [isEditing, setIsEditing] = useState(false);
	const [userData, setUserData] = useState({
		name: 'John Doe',
		email: 'john@example.com',
		phone: '+1 (555) 123-4567',
		address: '123 Swiss Ave, Zurich, Switzerland',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsEditing(false);
		// Here you would typically save the data to your backend
	};

	return (
		<Card className='h-full'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle>Profile Information</CardTitle>
					<Button
						variant='outline'
						size='icon'
						onClick={() => setIsEditing(!isEditing)}
					>
						{isEditing ? (
							<Save className='h-4 w-4' />
						) : (
							<Pencil className='h-4 w-4' />
						)}
						<span className='sr-only'>{isEditing ? 'Save' : 'Edit'}</span>
					</Button>
				</div>
				<CardDescription>Manage your personal information</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='flex justify-center mb-6'>
						<Avatar className='h-24 w-24'>
							<AvatarImage src='/placeholder-user.jpg' alt='User' />
							<AvatarFallback className='text-2xl'>JD</AvatarFallback>
						</Avatar>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='name'>Full Name</Label>
						{isEditing ? (
							<Input
								id='name'
								name='name'
								value={userData.name}
								onChange={handleChange}
							/>
						) : (
							<div className='py-2 px-3 rounded-md bg-muted'>
								{userData.name}
							</div>
						)}
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='email'>Email</Label>
						{isEditing ? (
							<Input
								id='email'
								name='email'
								type='email'
								value={userData.email}
								onChange={handleChange}
							/>
						) : (
							<div className='py-2 px-3 rounded-md bg-muted'>
								{userData.email}
							</div>
						)}
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='phone'>Phone</Label>
						{isEditing ? (
							<Input
								id='phone'
								name='phone'
								value={userData.phone}
								onChange={handleChange}
							/>
						) : (
							<div className='py-2 px-3 rounded-md bg-muted'>
								{userData.phone}
							</div>
						)}
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='address'>Shipping Address</Label>
						{isEditing ? (
							<Input
								id='address'
								name='address'
								value={userData.address}
								onChange={handleChange}
							/>
						) : (
							<div className='py-2 px-3 rounded-md bg-muted'>
								{userData.address}
							</div>
						)}
					</div>

					{isEditing && (
						<Button type='submit' className='w-full'>
							Save Changes
						</Button>
					)}
				</form>
			</CardContent>
		</Card>
	);
}
