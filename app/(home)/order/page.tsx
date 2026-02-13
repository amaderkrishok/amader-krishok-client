'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrderService } from '@/services/order-service';
import { useCart } from '@/context/cart-context';
import { useSession } from '@/components/providers/session-provider';
import { toast } from 'sonner';
import { OrderStatus } from '@/types/order';
import { EmptyCartMessage } from '@/components/pages/order/empty-cart-message';
import { OrderForm } from '@/components/pages/order/order-form';
import { CartItemsSummary } from '@/components/pages/order/cart-items-summary';
import { OrderSummary } from '@/components/pages/order/order-summary';
import OrderPageSkeleton from '@/components/pages/order/order-page-skeleton';

// Form validation schema using zod
const orderFormSchema = z.object({
	name: z.string().min(2, { message: 'Name is required' }),
	phoneNumber: z
		.string()
		.min(11, { message: 'Valid phone number is required' }),
	address: z.string().min(5, { message: 'Address is required' }),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;


// Main Order Page component
export default function OrderPage() {
	const router = useRouter();
	const { items, subtotal, clearCart } = useCart();
	const { user } = useSession();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Initialize form with user data if authenticated
	const form = useForm<OrderFormValues>({
		resolver: zodResolver(orderFormSchema),
		defaultValues: {
			name: user?.name || '',
			phoneNumber: user?.phoneNumber || '',
			address: '',
		},
	});

	// Add loading state
	useEffect(() => {
		// Simulate cart data loading
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 800); // Wait 800ms before showing content

		return () => clearTimeout(timer);
	}, []);

	// Prepare order items from cart items
	const prepareOrderItems = () => {
		return items.map((item) => {
			const isVariable = item.product.productType === 'VARIABLE';

			return {
				productId: item.productId,
				storeId: item.storeId,
				quantity: item.quantity,
				variantName: isVariable
					? item.selectedVariant?.variantName || null
					: null,
				productDetails: isVariable
					? {
							description: item.selectedVariant?.variantName || '',
					  }
					: undefined,
			};
		});
	};

	// Handle form submission
	const onSubmit = async (data: OrderFormValues) => {
		if (items.length === 0) {
			toast.error('অর্ডার করার জন্য কার্টে পণ্য যোগ করুন');
			return;
		}

		setIsSubmitting(true);
		try {
			const orderData = {
				name: data.name,
				address: data.address,
				phoneNumber: data.phoneNumber,
				buyerId: user?.id || null,
				orderItems: prepareOrderItems(),
				orderStatus: OrderStatus.PENDING,
			};

			const response = await OrderService.createOrder(orderData);
			toast.success('অর্ডার সফলভাবে সম্পন্ন হয়েছে!');

			// Get the order ID from the response
			const orderId = response.data?.id;

			// Then clear the cart after navigation starts
			clearCart();

			// Start the redirect first
			router.push(`/order/confirmation/${orderId}`);

			
		} catch (error) {
			console.error('Error creating order:', error);
			toast.error('অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Show skeleton loader while loading
	if (isLoading) {
		return <OrderPageSkeleton />;
	}

	// If cart is empty after loading, show message and redirect button
	if (items.length === 0) {
		return <EmptyCartMessage />;
	}

	return (
		<div className='container mx-auto px-4 py-10 max-w-6xl'>
			<h1 className='text-2xl md:text-3xl font-bold mb-8'>
				অর্ডার সম্পূর্ণ করুন
			</h1>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Checkout form */}
				<div className='lg:col-span-2'>
					<OrderForm
						form={form}
						onSubmit={onSubmit}
						isSubmitting={isSubmitting}
					/>
				</div>

				{/* Order summary */}
				<div>
					<div className='sticky top-6'>
						<div className='bg-white p-6 rounded-lg border mb-6'>
							<h2 className='text-xl font-semibold mb-4'>আপনার পণ্যসমূহ</h2>
							<CartItemsSummary items={items} />
						</div>

						<OrderSummary subtotal={subtotal} />
					</div>
				</div>
			</div>
		</div>
	);
}
