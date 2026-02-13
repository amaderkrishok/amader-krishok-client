'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export function CreateTicketButton() {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		category: '',
		priority: '',
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically submit the ticket to your backend
		console.log('Submitting ticket:', formData);

		// Reset form and close dialog
		setFormData({
			title: '',
			description: '',
			category: '',
			priority: '',
		});
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<PlusCircle className='mr-2 h-4 w-4' />
					Create Ticket
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[500px]'>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create Support Ticket</DialogTitle>
						<DialogDescription>
							Fill out the form below to create a new support ticket. Our team
							will respond as soon as possible.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='title'>Title</Label>
							<Input
								id='title'
								name='title'
								value={formData.title}
								onChange={handleChange}
								placeholder='Brief description of your issue'
								className='w-full'
								required
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='description'>Description</Label>
							<Textarea
								id='description'
								name='description'
								value={formData.description}
								onChange={handleChange}
								placeholder='Please provide details about your issue'
								className='min-h-[100px]'
								required
							/>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='category'>Category</Label>
								<Select
									value={formData.category}
									onValueChange={(value) =>
										handleSelectChange('category', value)
									}
									required
								>
									<SelectTrigger id='category'>
										<SelectValue placeholder='Select category' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='billing'>Billing</SelectItem>
										<SelectItem value='shipping'>Shipping</SelectItem>
										<SelectItem value='returns'>Returns</SelectItem>
										<SelectItem value='product'>Product</SelectItem>
										<SelectItem value='warranty'>Warranty</SelectItem>
										<SelectItem value='other'>Other</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='priority'>Priority</Label>
								<Select
									value={formData.priority}
									onValueChange={(value) =>
										handleSelectChange('priority', value)
									}
									required
								>
									<SelectTrigger id='priority'>
										<SelectValue placeholder='Select priority' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='low'>Low</SelectItem>
										<SelectItem value='medium'>Medium</SelectItem>
										<SelectItem value='high'>High</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type='submit'>Submit Ticket</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
