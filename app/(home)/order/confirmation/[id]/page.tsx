'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { OrderService } from '@/services/order-service';
import { Order } from '@/types/order';
import { OrderLoadingState } from '@/components/pages/order/order-loading-state';
import { OrderErrorState } from '@/components/pages/order/order-error-state';
import { OrderHeader } from '@/components/pages/order/order-header';
import { OrderMetadata } from '@/components/pages/order/order-metadata';
import { OrderItemsTable } from '@/components/pages/order/order-items-table';
import { OrderNextSteps } from '@/components/pages/order/order-next-steps';


export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        <OrderLoadingState />
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className='container mx-auto px-4 py-12 max-w-4xl'>
        <OrderErrorState error={error} />
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
        <OrderHeader orderId={order.id} />
        
        <div className='p-6'>
          <OrderMetadata order={order} />
          <OrderItemsTable items={order.orderItems} totalAmount={order.totalAmount} />
        </div>
        
        <OrderNextSteps orderId={order.id} />
      </div>
    </div>
  );
}