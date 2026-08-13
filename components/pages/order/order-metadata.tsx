import { OrderService } from '@/services/order-service';
import { Order, OrderStatus } from '@/types/order';
import React from 'react';
import { Calendar, PackageCheck, ShoppingBag, CreditCard, User, Phone, MapPin, ClipboardList } from 'lucide-react';

interface OrderMetadataProps {
  order: Order;
}

export function OrderMetadata({ order }: OrderMetadataProps) {
  // Helper function to render status badge
  const renderStatusBadge = (status: OrderStatus) => {
    const statusInfo = OrderService.getOrderStatusInfo(status);

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color} ${statusInfo.textColor} border border-current/20`}
      >
        <PackageCheck className='w-3.5 h-3.5' />
        <span>{statusInfo.label}</span>
      </span>
    );
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
      {/* Left Card: Order Info */}
      <div className='bg-white p-6 rounded-[20px] border border-[#E5E7EB] shadow-xs space-y-4'>
        <div className='border-b border-[#E5E7EB] pb-3 flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full bg-[#FFF4CC] text-[#28321A] flex items-center justify-center border border-[#F4B400]/30'>
            <ClipboardList className='w-4 h-4' />
          </div>
          <h2 className='font-extrabold text-base text-[#28321A]'>অর্ডারের তথ্য</h2>
        </div>

        <div className='space-y-3 text-sm'>
          <div className='flex items-center justify-between py-1 border-b border-gray-50'>
            <span className='text-[#64748B] flex items-center gap-2 text-xs'>
              <Calendar className='w-4 h-4 text-[#28321A]' />
              অর্ডারের তারিখ
            </span>
            <span className='font-bold text-[#172033] text-xs'>
              {OrderService.formatOrderDate(order.orderDate)}
            </span>
          </div>

          <div className='flex items-center justify-between py-1 border-b border-gray-50'>
            <span className='text-[#64748B] flex items-center gap-2 text-xs'>
              <PackageCheck className='w-4 h-4 text-[#28321A]' />
              অর্ডার স্ট্যাটাস
            </span>
            <div>{renderStatusBadge(order.orderStatus)}</div>
          </div>

          <div className='flex items-center justify-between py-1 border-b border-gray-50'>
            <span className='text-[#64748B] flex items-center gap-2 text-xs'>
              <ShoppingBag className='w-4 h-4 text-[#28321A]' />
              মোট পণ্য
            </span>
            <span className='font-bold text-[#172033] text-xs bg-[#F7F9F5] px-2.5 py-0.5 rounded-full border border-gray-200'>
              {order.orderItems?.length || 0} টি পণ্য
            </span>
          </div>

          <div className='flex items-center justify-between py-1'>
            <span className='text-[#64748B] flex items-center gap-2 text-xs'>
              <CreditCard className='w-4 h-4 text-[#28321A]' />
              পেমেন্ট মেথড
            </span>
            <span className='font-bold text-[#16A34A] text-xs bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#DCFCE7]'>
              ক্যাশ অন ডেলিভারি
            </span>
          </div>
        </div>
      </div>

      {/* Right Card: Customer Info */}
      <div className='bg-white p-6 rounded-[20px] border border-[#E5E7EB] shadow-xs space-y-4'>
        <div className='border-b border-[#E5E7EB] pb-3 flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full bg-[#FFF4CC] text-[#28321A] flex items-center justify-center border border-[#F4B400]/30'>
            <User className='w-4 h-4' />
          </div>
          <h2 className='font-extrabold text-base text-[#28321A]'>গ্রাহকের তথ্য</h2>
        </div>

        <div className='space-y-3 text-sm'>
          <div className='flex items-center justify-between py-1 border-b border-gray-50'>
            <span className='text-[#64748B] flex items-center gap-2 text-xs'>
              <User className='w-4 h-4 text-[#28321A]' />
              নাম
            </span>
            <span className='font-bold text-[#172033] text-xs'>{order.name}</span>
          </div>

          <div className='flex items-center justify-between py-1 border-b border-gray-50'>
            <span className='text-[#64748B] flex items-center gap-2 text-xs'>
              <Phone className='w-4 h-4 text-[#28321A]' />
              মোবাইল নম্বর
            </span>
            <span className='font-bold text-[#172033] text-xs font-mono'>{order.phoneNumber}</span>
          </div>

          <div className='flex items-start justify-between py-1'>
            <span className='text-[#64748B] flex items-center gap-2 text-xs flex-shrink-0'>
              <MapPin className='w-4 h-4 text-[#28321A]' />
              ডেলিভারি ঠিকানা
            </span>
            <span className='font-bold text-[#172033] text-xs text-right max-w-[200px] leading-snug'>
              {order.address}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}