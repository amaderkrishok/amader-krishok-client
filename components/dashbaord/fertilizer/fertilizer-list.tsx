'use client';

import { useState } from 'react';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import type { FertilizerCalculatorType } from '@/types/fertilizer';

interface FertilizerListProps {
	calculators: FertilizerCalculatorType[];
	isLoading: boolean;
	onEdit: (calculator: FertilizerCalculatorType) => void;
	onDelete: (id: number) => void;
}

export function FertilizerList({
	calculators,
	isLoading,
	onEdit,
	onDelete,
}: FertilizerListProps) {
	const [calculatorToDelete, setCalculatorToDelete] = useState<number | null>(
		null
	);

	const handleDeleteClick = (id: number) => {
		setCalculatorToDelete(id);
	};

	const handleDeleteConfirm = () => {
		if (calculatorToDelete !== null) {
			onDelete(calculatorToDelete);
			setCalculatorToDelete(null);
		}
	};

	const handleDeleteCancel = () => {
		setCalculatorToDelete(null);
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

	if (!calculators || calculators.length === 0) {
		return (
			<div className='text-center py-8 text-muted-foreground'>
				No fertilizer calculators found
			</div>
		);
	}

	return (
		<div className='border rounded-md'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Crop ID</TableHead>
						<TableHead>Crop Name</TableHead>
						<TableHead>Fertilizers</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{calculators.map((calculator) => (
						<TableRow key={calculator.id}>
							<TableCell className='font-medium'>{calculator.id}</TableCell>
							<TableCell className='font-medium'>{calculator.name}</TableCell>
							<TableCell>
								<div className='flex flex-wrap gap-1'>
									{Object.entries(calculator.fertilizerAmounts).map(
										([name, amount]) => (
											<span
												key={name}
												className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted'
											>
												{name}: {amount}g
											</span>
										)
									)}
								</div>
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
										<DropdownMenuItem onClick={() => onEdit(calculator)}>
											<Edit className='h-4 w-4 mr-2' />
											Edit
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className='text-destructive'
											onClick={() => calculator.id !== undefined && handleDeleteClick(calculator.id)}
										>
											<Trash2 className='h-4 w-4 mr-2' />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<AlertDialog
				open={calculatorToDelete !== null}
				onOpenChange={(open) => !open && setCalculatorToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the fertilizer calculator. This
							action cannot be undone.
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
