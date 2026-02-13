import { OrderService } from '@/services/order-service';
import { Order, OrderStatus } from '@/types/order';
import React from 'react';

interface OrderMetadataProps {
  order: Order;
}

export function OrderMetadata({ order }: OrderMetadataProps) {
  // Helper function to render status badge
  const renderStatusBadge = (status: OrderStatus) => {
    const statusInfo = OrderService.getOrderStatusInfo(status);

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.textColor}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div>
        <h2 className='font-medium text-gray-700 mb-2'>অর্ডারের বিবরণ</h2>
        <div className='space-y-2 text-sm'>
          <p>
            <span className='text-gray-500'>অর্ডার তারিখ:</span>{' '}
            {OrderService.formatOrderDate(order.orderDate)}
          </p>
          <p>
            <span className='text-gray-500'>অর্ডার স্টেটাস:</span>{' '}
            {renderStatusBadge(order.orderStatus)}
          </p>
          <p>
            <span className='text-gray-500'>মোট স্টোর:</span> {order.storeCount}
          </p>
        </div>
      </div>

      <div>
        <h2 className='font-medium text-gray-700 mb-2'>গ্রাহকের তথ্য</h2>
        <div className='space-y-2 text-sm'>
          <p>
            <span className='text-gray-500'>নাম:</span> {order.name}
          </p>
          <p>
            <span className='text-gray-500'>মোবাইল:</span> {order.phoneNumber}
          </p>
          <p>
            <span className='text-gray-500'>ঠিকানা:</span> {order.address}
          </p>
        </div>
      </div>
    </div>
  );
}