import { useState } from 'react';
import { Order, OrderStatus, UpdateOrderDTO } from '@/types/order';
import { OrderService } from '@/services/order-service';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrderEditModalProps {
	order: Order;
	isOpen: boolean;
	onClose: () => void;
	onOrderUpdated: (updatedOrder: Order) => void;
}

export function OrderEditModal({
	order,
	isOpen,
	onClose,
	onOrderUpdated,
}: OrderEditModalProps) {
	const [formData, setFormData] = useState<UpdateOrderDTO>({
		name: order.name,
		address: order.address,
		phoneNumber: order.phoneNumber,
		orderStatus: order.orderStatus,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleStatusChange = (value: OrderStatus) => {
		setFormData((prev) => ({ ...prev, orderStatus: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const updatedOrder = await OrderService.updateOrder(order.id, formData);
			toast.success('অর্ডার আপডেট করা হয়েছে।');
			onOrderUpdated(updatedOrder);
			onClose();
		} catch (error) {
			console.error('Error updating order:', error);
			toast.error('অর্ডার আপডেট করতে সমস্যা হয়েছে।');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle>অর্ডার এডিট করুন</DialogTitle>
					<DialogDescription>
						অর্ডার আইডি: #{order.id.substring(0, 8)}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-4'>
					{/* Name Field */}
					<div className='space-y-2'>
						<Label htmlFor='name'>গ্রাহকের নাম</Label>
						<Input
							id='name'
							name='name'
							value={formData.name}
							onChange={handleChange}
							required
						/>
					</div>

					{/* Phone Number Field */}
					<div className='space-y-2'>
						<Label htmlFor='phoneNumber'>ফোন নম্বর</Label>
						<Input
							id='phoneNumber'
							name='phoneNumber'
							value={formData.phoneNumber}
							onChange={handleChange}
							required
						/>
					</div>

					{/* Address Field */}
					<div className='space-y-2'>
						<Label htmlFor='address'>ঠিকানা</Label>
						<Textarea
							id='address'
							name='address'
							value={formData.address}
							onChange={handleChange}
							rows={3}
							required
						/>
					</div>

					{/* Status Field */}
					<div className='space-y-2'>
						<Label htmlFor='orderStatus'>অর্ডার স্ট্যাটাস</Label>
						<Select
							value={formData.orderStatus}
							onValueChange={(value) =>
								handleStatusChange(value as OrderStatus)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='স্ট্যাটাস নির্বাচন করুন' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={OrderStatus.PENDING}>
									{OrderService.getOrderStatusInfo(OrderStatus.PENDING).label}
								</SelectItem>
								<SelectItem value={OrderStatus.CONFIRMED}>
									{OrderService.getOrderStatusInfo(OrderStatus.CONFIRMED).label}
								</SelectItem>
								<SelectItem value={OrderStatus.DELIVERED}>
									{OrderService.getOrderStatusInfo(OrderStatus.DELIVERED).label}
								</SelectItem>
								<SelectItem value={OrderStatus.CANCELLED}>
									{OrderService.getOrderStatusInfo(OrderStatus.CANCELLED).label}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<DialogFooter className='pt-4'>
						<Button
							type='button'
							variant='outline'
							onClick={onClose}
							disabled={isSubmitting}
						>
							বাতিল করুন
						</Button>

						<Button type='submit' disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									সাবমিট হচ্ছে
								</>
							) : (
								'আপডেট করুন'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
