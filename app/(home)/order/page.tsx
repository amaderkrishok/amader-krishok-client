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
import { Leaf, Check, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';

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
	const { items, subtotal, deliveryCharge, total, clearCart } = useCart();
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
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 800);

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

			const orderId = response.data?.id;
			clearCart();
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
		<div className='min-h-screen bg-[#F7F6F0] py-8 sm:py-12'>
			<div className='container mx-auto px-4 max-w-6xl'>
				{/* Page Header */}
				<div className='mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E7EB] pb-6'>
					<div>
						<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4CC] text-[#28321A] text-xs font-bold mb-2 border border-[#F4B400]/30'>
							<Leaf className='w-3.5 h-3.5 text-[#28321A]' />
							<span>কৃষকের বাজার চেকআউট</span>
						</div>
						<h1 className='text-2xl sm:text-3xl font-extrabold text-[#28321A] tracking-tight'>
							অর্ডার সম্পূর্ণ করুন
						</h1>
						<p className='text-sm text-[#667085] mt-1'>
							আপনার তথ্য দিন এবং অর্ডারটি নিশ্চিত করুন
						</p>
					</div>

					{/* Progress Indicator */}
					<div className='flex items-center justify-center sm:justify-end gap-2 text-xs font-semibold self-center sm:self-auto bg-white px-4 py-2.5 rounded-2xl border border-[#E5E7EB] shadow-2xs'>
						<div className='flex items-center gap-1.5 text-[#16A34A]'>
							<div className='w-5 h-5 rounded-full bg-[#16A34A]/10 flex items-center justify-center text-[10px] font-bold'>
								<Check className='w-3 h-3' />
							</div>
							<span>01 কার্ট</span>
						</div>
						<span className='text-gray-300'>→</span>
						<div className='flex items-center gap-1.5 text-[#172033] bg-[#FFF4CC] px-2.5 py-1 rounded-xl border border-[#F4B400]/40 font-bold'>
							<div className='w-5 h-5 rounded-full bg-[#F4B400] text-[#172033] flex items-center justify-center text-[10px] font-bold'>
								02
							</div>
							<span>ডেলিভারি</span>
						</div>
						<span className='text-gray-300'>→</span>
						<div className='flex items-center gap-1.5 text-gray-400'>
							<div className='w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-medium'>
								03
							</div>
							<span>নিশ্চিত করুন</span>
						</div>
					</div>
				</div>

				{/* Main Content Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
					{/* Left Column: Delivery Form (~60%) */}
					<div className='lg:col-span-7'>
						<OrderForm
							form={form}
							onSubmit={onSubmit}
							isSubmitting={isSubmitting}
						/>
					</div>

					{/* Right Column: Order & Product Summaries (~40%) */}
					<div className='lg:col-span-5 space-y-6 lg:sticky lg:top-8'>
						<CartItemsSummary items={items} />

						<OrderSummary
							subtotal={subtotal}
							deliveryCharge={deliveryCharge}
							total={total}
						/>

						{/* Trust Badge */}
						<div className='flex items-center justify-center gap-2 p-3 bg-white/80 rounded-xl border border-[#E5E7EB] text-xs text-[#667085] text-center'>
							<ShieldCheck className='w-4 h-4 text-[#16A34A]' />
							<span>১০০% নিরাপদ লেনদেন ও খামার থেকে সরাসরি ডেলিভারি</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
