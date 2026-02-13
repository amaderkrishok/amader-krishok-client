import { OrderStatus } from '@/types/order';
import { OrderService } from '@/services/order-service';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const statusInfo = OrderService.getOrderStatusInfo(status);
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  
  return (
    <span className={`rounded-full font-medium ${sizeClasses[size]} ${statusInfo.color} ${statusInfo.textColor}`}>
      {statusInfo.label}
    </span>
  );
}