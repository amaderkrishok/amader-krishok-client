'use client';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Search,
	MessageSquare,
	AlertCircle,
	CheckCircle,
	Clock,
} from 'lucide-react';

type Ticket = {
	id: string;
	title: string;
	description: string;
	status: 'open' | 'in-progress' | 'resolved' | 'closed';
	priority: 'low' | 'medium' | 'high';
	category: string;
	createdAt: Date;
	updatedAt: Date;
	messages: number;
};

export function SupportTickets() {
	const [searchTerm, setSearchTerm] = useState('');

	// Mock data for tickets
	const tickets: Ticket[] = [
		{
			id: 'TKT-1234',
			title: 'Issue with order delivery',
			description:
				"My order is showing as delivered but I haven't received it yet.",
			status: 'in-progress',
			priority: 'high',
			category: 'Shipping',
			createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
			updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
			messages: 3,
		},
		{
			id: 'TKT-1235',
			title: 'Request for product return',
			description:
				'I would like to return my Swiss Army Knife as it has a manufacturing defect.',
			status: 'open',
			priority: 'medium',
			category: 'Returns',
			createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
			updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
			messages: 1,
		},
		{
			id: 'TKT-1236',
			title: 'Question about product warranty',
			description:
				'I need information about the warranty coverage for my watch.',
			status: 'resolved',
			priority: 'low',
			category: 'Warranty',
			createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
			updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
			messages: 4,
		},
		{
			id: 'TKT-1237',
			title: 'Billing discrepancy',
			description:
				'I was charged more than the listed price for my recent purchase.',
			status: 'closed',
			priority: 'high',
			category: 'Billing',
			createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
			updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
			messages: 6,
		},
	];

	const filteredTickets = tickets.filter(
		(ticket) =>
			ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'open':
				return <AlertCircle className='h-4 w-4 text-yellow-500' />;
			case 'in-progress':
				return <Clock className='h-4 w-4 text-blue-500' />;
			case 'resolved':
				return <CheckCircle className='h-4 w-4 text-green-500' />;
			case 'closed':
				return <CheckCircle className='h-4 w-4 text-gray-500' />;
			default:
				return <AlertCircle className='h-4 w-4' />;
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'low':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'high':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	return (
		<Card>
			<CardHeader>
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div>
						<CardTitle>Support Tickets</CardTitle>
						<CardDescription>
							View and manage your support requests
						</CardDescription>
					</div>
					<div className='flex items-center gap-2'>
						<div className='relative'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Search tickets...'
								className='pl-8 w-[200px] md:w-[250px]'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue='all' className='w-full'>
					<TabsList className='grid w-full grid-cols-4 mb-4'>
						<TabsTrigger value='all'>All Tickets</TabsTrigger>
						<TabsTrigger value='open'>Open</TabsTrigger>
						<TabsTrigger value='in-progress'>In Progress</TabsTrigger>
						<TabsTrigger value='resolved'>Resolved</TabsTrigger>
					</TabsList>

					<TabsContent value='all' className='space-y-4'>
						{filteredTickets.length > 0 ? (
							filteredTickets.map((ticket) => (
								<div key={ticket.id} className='border rounded-lg p-4'>
									<div className='flex flex-col md:flex-row md:items-center justify-between mb-2'>
										<div className='flex items-start gap-2'>
											<div>
												<h3 className='font-medium flex items-center gap-2'>
													{ticket.title}
													<Badge variant='outline' className='ml-2'>
														{ticket.id}
													</Badge>
												</h3>
												<p className='text-sm text-muted-foreground mt-1'>
													{ticket.description.length > 100
														? `${ticket.description.substring(0, 100)}...`
														: ticket.description}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-2 mt-2 md:mt-0'>
											<Badge
												variant='outline'
												className={`${getPriorityColor(
													ticket.priority
												)} capitalize`}
											>
												{ticket.priority}
											</Badge>
											<Badge
												variant='outline'
												className='flex items-center gap-1'
											>
												{getStatusIcon(ticket.status)}
												<span className='capitalize'>
													{ticket.status.replace('-', ' ')}
												</span>
											</Badge>
										</div>
									</div>

									<div className='flex flex-col md:flex-row justify-between items-start md:items-center mt-4 text-sm'>
										<div className='flex items-center gap-4'>
											<span className='text-muted-foreground'>
												Category: {ticket.category}
											</span>
											<span className='text-muted-foreground'>
												Created: {formatDate(ticket.createdAt)}
											</span>
											<span className='text-muted-foreground'>
												Updated: {formatDate(ticket.updatedAt)}
											</span>
										</div>
										<div className='flex items-center gap-2 mt-2 md:mt-0'>
											<Badge
												variant='secondary'
												className='flex items-center gap-1'
											>
												<MessageSquare className='h-3 w-3' />
												{ticket.messages}{' '}
												{ticket.messages === 1 ? 'message' : 'messages'}
											</Badge>
											<Button variant='outline' size='sm'>
												View Ticket
											</Button>
										</div>
									</div>
								</div>
							))
						) : (
							<div className='text-center py-10'>
								<p className='text-muted-foreground'>
									No tickets found matching your search.
								</p>
							</div>
						)}
					</TabsContent>

					<TabsContent value='open' className='space-y-4'>
						{filteredTickets
							.filter((ticket) => ticket.status === 'open')
							.map((ticket) => (
								<div key={ticket.id} className='border rounded-lg p-4'>
									{/* Same content structure as above */}
									<div className='flex flex-col md:flex-row md:items-center justify-between mb-2'>
										<div className='flex items-start gap-2'>
											<div>
												<h3 className='font-medium flex items-center gap-2'>
													{ticket.title}
													<Badge variant='outline' className='ml-2'>
														{ticket.id}
													</Badge>
												</h3>
												<p className='text-sm text-muted-foreground mt-1'>
													{ticket.description.length > 100
														? `${ticket.description.substring(0, 100)}...`
														: ticket.description}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-2 mt-2 md:mt-0'>
											<Badge
												variant='outline'
												className={`${getPriorityColor(
													ticket.priority
												)} capitalize`}
											>
												{ticket.priority}
											</Badge>
											<Badge
												variant='outline'
												className='flex items-center gap-1'
											>
												{getStatusIcon(ticket.status)}
												<span className='capitalize'>
													{ticket.status.replace('-', ' ')}
												</span>
											</Badge>
										</div>
									</div>

									<div className='flex flex-col md:flex-row justify-between items-start md:items-center mt-4 text-sm'>
										<div className='flex items-center gap-4'>
											<span className='text-muted-foreground'>
												Category: {ticket.category}
											</span>
											<span className='text-muted-foreground'>
												Created: {formatDate(ticket.createdAt)}
											</span>
											<span className='text-muted-foreground'>
												Updated: {formatDate(ticket.updatedAt)}
											</span>
										</div>
										<div className='flex items-center gap-2 mt-2 md:mt-0'>
											<Badge
												variant='secondary'
												className='flex items-center gap-1'
											>
												<MessageSquare className='h-3 w-3' />
												{ticket.messages}{' '}
												{ticket.messages === 1 ? 'message' : 'messages'}
											</Badge>
											<Button variant='outline' size='sm'>
												View Ticket
											</Button>
										</div>
									</div>
								</div>
							))}
					</TabsContent>

					<TabsContent value='in-progress' className='space-y-4'>
						{filteredTickets
							.filter((ticket) => ticket.status === 'in-progress')
							.map((ticket) => (
								<div key={ticket.id} className='border rounded-lg p-4'>
									{/* Same content structure as above */}
									<div className='flex flex-col md:flex-row md:items-center justify-between mb-2'>
										<div className='flex items-start gap-2'>
											<div>
												<h3 className='font-medium flex items-center gap-2'>
													{ticket.title}
													<Badge variant='outline' className='ml-2'>
														{ticket.id}
													</Badge>
												</h3>
												<p className='text-sm text-muted-foreground mt-1'>
													{ticket.description.length > 100
														? `${ticket.description.substring(0, 100)}...`
														: ticket.description}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-2 mt-2 md:mt-0'>
											<Badge
												variant='outline'
												className={`${getPriorityColor(
													ticket.priority
												)} capitalize`}
											>
												{ticket.priority}
											</Badge>
											<Badge
												variant='outline'
												className='flex items-center gap-1'
											>
												{getStatusIcon(ticket.status)}
												<span className='capitalize'>
													{ticket.status.replace('-', ' ')}
												</span>
											</Badge>
										</div>
									</div>

									<div className='flex flex-col md:flex-row justify-between items-start md:items-center mt-4 text-sm'>
										<div className='flex items-center gap-4'>
											<span className='text-muted-foreground'>
												Category: {ticket.category}
											</span>
											<span className='text-muted-foreground'>
												Created: {formatDate(ticket.createdAt)}
											</span>
											<span className='text-muted-foreground'>
												Updated: {formatDate(ticket.updatedAt)}
											</span>
										</div>
										<div className='flex items-center gap-2 mt-2 md:mt-0'>
											<Badge
												variant='secondary'
												className='flex items-center gap-1'
											>
												<MessageSquare className='h-3 w-3' />
												{ticket.messages}{' '}
												{ticket.messages === 1 ? 'message' : 'messages'}
											</Badge>
											<Button variant='outline' size='sm'>
												View Ticket
											</Button>
										</div>
									</div>
								</div>
							))}
					</TabsContent>

					<TabsContent value='resolved' className='space-y-4'>
						{filteredTickets
							.filter(
								(ticket) =>
									ticket.status === 'resolved' || ticket.status === 'closed'
							)
							.map((ticket) => (
								<div key={ticket.id} className='border rounded-lg p-4'>
									{/* Same content structure as above */}
									<div className='flex flex-col md:flex-row md:items-center justify-between mb-2'>
										<div className='flex items-start gap-2'>
											<div>
												<h3 className='font-medium flex items-center gap-2'>
													{ticket.title}
													<Badge variant='outline' className='ml-2'>
														{ticket.id}
													</Badge>
												</h3>
												<p className='text-sm text-muted-foreground mt-1'>
													{ticket.description.length > 100
														? `${ticket.description.substring(0, 100)}...`
														: ticket.description}
												</p>
											</div>
										</div>
										<div className='flex items-center gap-2 mt-2 md:mt-0'>
											<Badge
												variant='outline'
												className={`${getPriorityColor(
													ticket.priority
												)} capitalize`}
											>
												{ticket.priority}
											</Badge>
											<Badge
												variant='outline'
												className='flex items-center gap-1'
											>
												{getStatusIcon(ticket.status)}
												<span className='capitalize'>
													{ticket.status.replace('-', ' ')}
												</span>
											</Badge>
										</div>
									</div>

									<div className='flex flex-col md:flex-row justify-between items-start md:items-center mt-4 text-sm'>
										<div className='flex items-center gap-4'>
											<span className='text-muted-foreground'>
												Category: {ticket.category}
											</span>
											<span className='text-muted-foreground'>
												Created: {formatDate(ticket.createdAt)}
											</span>
											<span className='text-muted-foreground'>
												Updated: {formatDate(ticket.updatedAt)}
											</span>
										</div>
										<div className='flex items-center gap-2 mt-2 md:mt-0'>
											<Badge
												variant='secondary'
												className='flex items-center gap-1'
											>
												<MessageSquare className='h-3 w-3' />
												{ticket.messages}{' '}
												{ticket.messages === 1 ? 'message' : 'messages'}
											</Badge>
											<Button variant='outline' size='sm'>
												View Ticket
											</Button>
										</div>
									</div>
								</div>
							))}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
