'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CurrentOrdersCard() {
	// Mock data for current orders
	const currentOrders = [
		{
			id: 'ORD-7893',
			date: '2023-04-15',
			product: 'Swiss Automatic Watch',
			price: '$1,299.00',
			status: 'In Transit',
			progress: 65,
			estimatedDelivery: 'Apr 22, 2023',
			trackingNumber: 'TRK-123456789',
		},
		{
			id: 'ORD-6547',
			date: '2023-04-10',
			product: 'Premium Leather Wallet',
			price: '$149.00',
			status: 'Processing',
			progress: 25,
			estimatedDelivery: 'Apr 25, 2023',
			trackingNumber: 'TRK-987654321',
		},
	];

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'Processing':
				return <Clock className='h-4 w-4' />;
			case 'In Transit':
				return <Truck className='h-4 w-4' />;
			case 'Delivered':
				return <CheckCircle className='h-4 w-4' />;
			default:
				return <Package className='h-4 w-4' />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Processing':
				return 'bg-yellow-500';
			case 'In Transit':
				return 'bg-blue-500';
			case 'Delivered':
				return 'bg-green-500';
			default:
				return 'bg-gray-500';
		}
	};

	return (
		<Card className='h-full'>
			<CardHeader>
				<CardTitle>Current Orders</CardTitle>
				<CardDescription>
					Track your recent purchases and their delivery status
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue='all' className='w-full'>
					<TabsList className='grid w-full grid-cols-3 mb-4'>
						<TabsTrigger value='all'>All Orders</TabsTrigger>
						<TabsTrigger value='processing'>Processing</TabsTrigger>
						<TabsTrigger value='transit'>In Transit</TabsTrigger>
					</TabsList>
					<TabsContent value='all' className='space-y-4'>
						{currentOrders.map((order) => (
							<div key={order.id} className='border rounded-lg p-4'>
								<div className='flex justify-between items-start mb-2'>
									<div>
										<h3 className='font-medium'>{order.product}</h3>
										<p className='text-sm text-muted-foreground'>
											Order #{order.id} • {order.date}
										</p>
									</div>
									<Badge className='flex items-center gap-1'>
										{getStatusIcon(order.status)}
										{order.status}
									</Badge>
								</div>

								<div className='mt-4'>
									<div className='flex justify-between text-sm mb-1'>
										<span>Order Progress</span>
										<span>{order.progress}%</span>
									</div>
									<Progress value={order.progress} className='h-2' />
								</div>

								<div className='grid grid-cols-2 gap-4 mt-4 text-sm'>
									<div>
										<p className='text-muted-foreground'>Estimated Delivery</p>
										<p className='font-medium'>{order.estimatedDelivery}</p>
									</div>
									<div>
										<p className='text-muted-foreground'>Price</p>
										<p className='font-medium'>{order.price}</p>
									</div>
								</div>

								<div className='mt-4 flex justify-between items-center'>
									<p className='text-xs text-muted-foreground'>
										Tracking: {order.trackingNumber}
									</p>
									<Button variant='outline' size='sm'>
										Track Order
									</Button>
								</div>
							</div>
						))}
					</TabsContent>
					<TabsContent value='processing'>
						{currentOrders
							.filter((order) => order.status === 'Processing')
							.map((order) => (
								<div key={order.id} className='border rounded-lg p-4'>
									<div className='flex justify-between items-start mb-2'>
										<div>
											<h3 className='font-medium'>{order.product}</h3>
											<p className='text-sm text-muted-foreground'>
												Order #{order.id} • {order.date}
											</p>
										</div>
										<Badge className='flex items-center gap-1'>
											{getStatusIcon(order.status)}
											{order.status}
										</Badge>
									</div>

									<div className='mt-4'>
										<div className='flex justify-between text-sm mb-1'>
											<span>Order Progress</span>
											<span>{order.progress}%</span>
										</div>
										<Progress value={order.progress} className='h-2' />
									</div>

									<div className='grid grid-cols-2 gap-4 mt-4 text-sm'>
										<div>
											<p className='text-muted-foreground'>
												Estimated Delivery
											</p>
											<p className='font-medium'>{order.estimatedDelivery}</p>
										</div>
										<div>
											<p className='text-muted-foreground'>Price</p>
											<p className='font-medium'>{order.price}</p>
										</div>
									</div>

									<div className='mt-4 flex justify-between items-center'>
										<p className='text-xs text-muted-foreground'>
											Tracking: {order.trackingNumber}
										</p>
										<Button variant='outline' size='sm'>
											Track Order
										</Button>
									</div>
								</div>
							))}
					</TabsContent>
					<TabsContent value='transit'>
						{currentOrders
							.filter((order) => order.status === 'In Transit')
							.map((order) => (
								<div key={order.id} className='border rounded-lg p-4'>
									<div className='flex justify-between items-start mb-2'>
										<div>
											<h3 className='font-medium'>{order.product}</h3>
											<p className='text-sm text-muted-foreground'>
												Order #{order.id} • {order.date}
											</p>
										</div>
										<Badge className='flex items-center gap-1'>
											{getStatusIcon(order.status)}
											{order.status}
										</Badge>
									</div>

									<div className='mt-4'>
										<div className='flex justify-between text-sm mb-1'>
											<span>Order Progress</span>
											<span>{order.progress}%</span>
										</div>
										<Progress value={order.progress} className='h-2' />
									</div>

									<div className='grid grid-cols-2 gap-4 mt-4 text-sm'>
										<div>
											<p className='text-muted-foreground'>
												Estimated Delivery
											</p>
											<p className='font-medium'>{order.estimatedDelivery}</p>
										</div>
										<div>
											<p className='text-muted-foreground'>Price</p>
											<p className='font-medium'>{order.price}</p>
										</div>
									</div>

									<div className='mt-4 flex justify-between items-center'>
										<p className='text-xs text-muted-foreground'>
											Tracking: {order.trackingNumber}
										</p>
										<Button variant='outline' size='sm'>
											Track Order
										</Button>
									</div>
								</div>
							))}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
