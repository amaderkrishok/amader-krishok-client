import { OrderStatus } from '@/types/order';
import { OrderService } from '@/services/order-service';

interface OrderStatusBadgeProps {
	status: OrderStatus;
	size?: 'sm' | 'md' | 'lg';
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
	const statusInfo = OrderService.getOrderStatusInfo(status);

	const getStatusStyles = (statusVal: OrderStatus) => {
		switch (statusVal) {
			case OrderStatus.PENDING:
				return 'bg-[#FFF9E8] text-[#B45309] border border-[#F5B800]/40';
			case OrderStatus.CONFIRMED:
				return 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#93C5FD]';
			case OrderStatus.DELIVERED:
				return 'bg-[#ECFDF5] text-[#15803D] border border-[#A7F3D0]';
			case OrderStatus.CANCELLED:
				return 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]';
			default:
				return 'bg-[#FAFAF6] text-[#172033] border border-[#E5E7EB]';
		}
	};

	const sizeClasses = {
		sm: 'px-2 py-0.5 text-[10px]',
		md: 'px-3 py-1 text-xs',
		lg: 'px-3.5 py-1.5 text-sm',
	};

	return (
		<span
			className={`inline-flex items-center gap-1 rounded-full font-extrabold shadow-2xs ${sizeClasses[size]} ${getStatusStyles(
				status
			)}`}
		>
			<span className='w-1.5 h-1.5 rounded-full bg-current' />
			{statusInfo.label}
		</span>
	);
}