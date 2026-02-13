'use client';

import { useState } from 'react';
import {
	Edit,
	Trash2,
	GripVertical,
	ChevronRight,
	ChevronDown,
} from 'lucide-react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCategoryType } from '@/types/product-category';
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

interface CategoryTreeProps {
	categories: ProductCategoryType[];
	isLoading: boolean;
	onEdit: (category: ProductCategoryType) => void;
	onDelete: (id: number) => void;
	onMove: (categoryId: number, newParentId: number | null) => void;
}

interface CategoryItemProps {
	category: ProductCategoryType;
	level: number;
	onEdit: (category: ProductCategoryType) => void;
	onDelete: (id: number) => void;
	onMove: (categoryId: number, newParentId: number | null) => void;
}

interface DragItem {
	id: number;
	type: string;
}

const ItemType = 'CATEGORY';

function CategoryItem({
	category,
	level,
	onEdit,
	onDelete,
	onMove,
}: CategoryItemProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const hasChildren = category.children && category.children.length > 0;

	// Check if this category is a descendant of another category
	const isDescendantOf = (
		categoryId: number,
		potentialAncestorId: number
	): boolean => {
		if (categoryId === potentialAncestorId) return true;

		// Find the potential ancestor in the categories
		const findCategory = (
			categories: ProductCategoryType[] | undefined,
			id: number
		): ProductCategoryType | null => {
			if (!categories) return null;

			for (const cat of categories) {
				if (cat.id === id) return cat;
				const found = findCategory(cat.children, id);
				if (found) return found;
			}

			return null;
		};

		const potentialAncestor = findCategory([category], potentialAncestorId);
		return !!potentialAncestor;
	};

	const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
		type: ItemType,
		item: { id: category.id, type: ItemType } as DragItem,
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const [{ isOver, canDrop }, drop] = useDrop<
		DragItem,
		void,
		{ isOver: boolean; canDrop: boolean }
	>(() => ({
		accept: ItemType,
		drop: (item, monitor) => {
			if (monitor.didDrop()) {
				return;
			}

			// Don't allow dropping on itself or its children
			if (item.id !== category.id && !isDescendantOf(item.id, category.id)) {
				onMove(item.id, category.id);
			}
		},
		canDrop: (item) => {
			// Prevent dropping on itself or its descendants
			return item.id !== category.id && !isDescendantOf(item.id, category.id);
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver({ shallow: true }),
			canDrop: !!monitor.canDrop(),
		}),
	}));

	return (
		<div
			ref={dragPreview}
			style={{ opacity: isDragging ? 0.5 : 1 }}
			className='select-none'
		>
			<div
				ref={drop}
				className={`flex items-center p-2 rounded-md mb-1 ${
					isOver && canDrop
						? 'bg-muted/50 border-2 border-dashed border-primary'
						: ''
				}`}
			>
				<div
					ref={drag}
					className='cursor-move mr-2 text-muted-foreground hover:text-foreground'
				>
					<GripVertical size={16} />
				</div>

				{hasChildren ? (
					<Button
						variant='ghost'
						size='sm'
						className='p-0 h-6 w-6'
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded ? (
							<ChevronDown size={16} />
						) : (
							<ChevronRight size={16} />
						)}
					</Button>
				) : (
					<div className='w-6' />
				)}

				<div
					className='flex-1 font-medium ml-1'
					style={{ paddingLeft: `${level * 8}px` }}
				>
					{category.name}
				</div>

				<div className='flex space-x-1'>
					<Button
						variant='ghost'
						size='sm'
						className='h-8 w-8 p-0'
						onClick={() => onEdit(category)}
					>
						<Edit size={16} />
						<span className='sr-only'>Edit</span>
					</Button>

					<Button
						variant='ghost'
						size='sm'
						className='h-8 w-8 p-0 text-destructive hover:text-destructive'
						onClick={() => setIsDeleteDialogOpen(true)}
					>
						<Trash2 size={16} />
						<span className='sr-only'>Delete</span>
					</Button>
				</div>
			</div>

			{isExpanded && hasChildren && (
				<div className='pl-6'>
					{category.children.map((child) => (
						<CategoryItem
							key={child.id}
							category={child}
							level={level + 1}
							onEdit={onEdit}
							onDelete={onDelete}
							onMove={onMove}
						/>
					))}
				</div>
			)}

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the category "{category.name}".
							{hasChildren && ' All child categories will also be deleted.'}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
							onClick={() => {
								onDelete(category.id);
								setIsDeleteDialogOpen(false);
							}}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

// Improved root drop area component
function RootDropArea({ onDrop }: { onDrop: (categoryId: number) => void }) {
	const [{ isOver, canDrop }, drop] = useDrop(() => ({
		accept: ItemType,
		drop: (item: DragItem) => {
			onDrop(item.id);
			return { dropped: true }; // Return something to indicate the drop was handled
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop(),
		}),
	}));

	return (
		<div
			ref={drop}
			className={`mt-4 p-3 rounded-md border transition-colors ${
				isOver && canDrop
					? 'bg-muted/50 border-2 border-dashed border-primary'
					: 'border-dashed border-muted-foreground/50'
			}`}
		>
			<p className='text-sm text-center text-muted-foreground'>
				Drop here to make a top-level category
			</p>
		</div>
	);
}

export function CategoryTree({
	categories,
	isLoading,
	onEdit,
	onDelete,
	onMove,
}: CategoryTreeProps) {
	if (isLoading) {
		return (
			<div className='space-y-2'>
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className='h-10 w-full' />
				))}
			</div>
		);
	}

	if (!categories || categories.length === 0) {
		return (
			<div className='text-center py-8 text-muted-foreground'>
				No categories found
			</div>
		);
	}

	// Handle making a category a top-level category
	const handleMakeTopLevel = (categoryId: number) => {
		// Call onMove with null as the parent ID to make it a top-level category
		onMove(categoryId, null);
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<div className='border rounded-md p-4'>
				{categories.map((category) => (
					<CategoryItem
						key={category.id}
						category={category}
						level={0}
						onEdit={onEdit}
						onDelete={onDelete}
						onMove={onMove}
					/>
				))}
				<RootDropArea onDrop={handleMakeTopLevel} />
			</div>
		</DndProvider>
	);
}
