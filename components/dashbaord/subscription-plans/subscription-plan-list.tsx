'use client';

import { useState } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';
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
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { SubscriptionPlanType } from '@/types/subscription-plan';


interface SubscriptionPlanListProps {
	plans: SubscriptionPlanType[];
	isLoading: boolean;
	onEdit: (plan: SubscriptionPlanType) => void;
	onDelete: (id: number) => void;
}

export function SubscriptionPlanList({
	plans,
	isLoading,
	onEdit,
	onDelete,
}: SubscriptionPlanListProps) {
	const [planToDelete, setPlanToDelete] = useState<number | null>(null);

	const handleDeleteClick = (id: number) => {
		setPlanToDelete(id);
	};

	const handleDeleteConfirm = () => {
		if (planToDelete !== null) {
			onDelete(planToDelete);
			setPlanToDelete(null);
		}
	};

	const handleDeleteCancel = () => {
		setPlanToDelete(null);
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(price / 100);
	};

	if (isLoading) {
		return (
			<div className='space-y-2'>
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton key={i} className='h-16 w-full' />
				))}
			</div>
		);
	}

	if (!plans || plans.length === 0) {
		return (
			<div className='text-center py-8 text-muted-foreground'>
				No subscription plans found
			</div>
		);
	}

	return (
		<div className='border rounded-md'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Product Limit</TableHead>
						<TableHead>Variable Products</TableHead>
						<TableHead>Analytics</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{plans.map((plan) => (
						<TableRow key={plan.id}>
							<TableCell className='font-medium'>{plan.name}</TableCell>
							<TableCell>
								{plan.price === 0 ? (
									<Badge variant='outline'>Free</Badge>
								) : (
									formatPrice(plan.price)
								)}
							</TableCell>
							<TableCell>{plan.productLimit}</TableCell>
							<TableCell>
								{plan.supportVariableProduct ? (
									<Check className='h-5 w-5 text-green-500' />
								) : (
									<X className='h-5 w-5 text-red-500' />
								)}
							</TableCell>
							<TableCell>
								{plan.analytics ? (
									<Check className='h-5 w-5 text-green-500' />
								) : (
									<X className='h-5 w-5 text-red-500' />
								)}
							</TableCell>
							<TableCell className='text-right'>
								<div className='flex justify-end space-x-1'>
									<Button
										variant='ghost'
										size='sm'
										className='h-8 w-8 p-0'
										onClick={() => onEdit(plan)}
									>
										<Edit className='h-4 w-4' />
										<span className='sr-only'>Edit</span>
									</Button>
									<Button
										variant='ghost'
										size='sm'
										className='h-8 w-8 p-0 text-destructive hover:text-destructive'
										onClick={() => plan.id !== undefined && handleDeleteClick(plan.id)}
									>
										<Trash2 className='h-4 w-4' />
										<span className='sr-only'>Delete</span>
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<AlertDialog
				open={planToDelete !== null}
				onOpenChange={(open) => !open && setPlanToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the subscription plan. This action
							cannot be undone.
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
