import { OrderItem } from '@/types/order';
import { OrderService } from '@/services/order-service';

interface OrderItemListProps {
  items: OrderItem[];
}

export function OrderItemList({ items }: OrderItemListProps) {
  if (items.length === 0) {
    return <p className="text-gray-500">কোন পণ্য নেই</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-start border-b pb-4">
          <div className="h-16 w-16 rounded bg-gray-100 mr-4 overflow-hidden flex-shrink-0">
            <img 
              src={OrderService.getProductImageUrl(item.productImage)}
              alt={item.productName}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium">{item.productName}</h4>
            
            {item.variantName && (
              <p className="text-sm text-gray-500">
                ভেরিয়েন্ট: {item.variantName}
              </p>
            )}
            
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-600">
                {item.price} ৳ x {item.quantity}
              </span>
              <span className="font-medium">
                {item.total} ৳
              </span>
            </div>
            
            {item.store && (
              <p className="text-xs text-gray-500 mt-1">
                স্টোর: {item.store.name}
              </p>
            )}
          </div>
        </div>
      ))}
      
      <div className="flex justify-between font-medium pt-2">
        <span>মোট:</span>
        <span>
          {items.reduce((sum, item) => sum + item.total, 0)} ৳
        </span>
      </div>
    </div>
  );
}