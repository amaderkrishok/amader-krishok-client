'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { OrderService } from '@/services/order-service';
import { Order } from '@/types/order';
import { useCart } from '@/context/cart-context';
import { OrderLoadingState } from '@/components/pages/order/order-loading-state';
import { OrderErrorState } from '@/components/pages/order/order-error-state';
import { OrderHeader } from '@/components/pages/order/order-header';
import { OrderMetadata } from '@/components/pages/order/order-metadata';
import { OrderItemsTable } from '@/components/pages/order/order-items-table';
import { OrderNextSteps } from '@/components/pages/order/order-next-steps';


export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear cart upon reaching confirmation page (runs once on mount)
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      try {
        setLoading(true);
        const response = await OrderService.getOrderById(orderId);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('অর্ডার লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-[#F7F9F5] py-12 px-4'>
        <div className='container mx-auto max-w-5xl'>
          <OrderLoadingState />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className='min-h-screen bg-[#F7F9F5] py-12 px-4'>
        <div className='container mx-auto max-w-4xl'>
          <OrderErrorState error={error} />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#F7F9F5] py-8 sm:py-14'>
      <div className='container mx-auto px-4 max-w-6xl space-y-2'>
        <OrderHeader orderId={order.id} />
        <OrderMetadata order={order} />
        <OrderItemsTable items={order.orderItems} totalAmount={order.totalAmount} />
        <OrderNextSteps orderId={order.id} />
      </div>
    </div>
  );
}