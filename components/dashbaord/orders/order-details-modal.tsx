import { Order,  } from '@/types/order';
import { OrderService } from '@/services/order-service';
import { OrderStatusBadge } from './order-status-badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { OrderItemList } from './order-item-list';


interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>অর্ডার বিস্তারিত</DialogTitle>
          <DialogDescription>
            অর্ডার আইডি: #{order.id.substring(0, 8)}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">বিস্তারিত</TabsTrigger>
            <TabsTrigger value="products">পণ্য সমূহ</TabsTrigger>
          </TabsList>
          
          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Order Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">অর্ডার তথ্য</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">অর্ডার তারিখ:</span>
                    <span>{OrderService.formatOrderDate(order.orderDate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">আপডেট:</span>
                    <span>{OrderService.formatOrderDate(order.updatedAt)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">অর্ডার স্ট্যাটাস:</span>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">স্টোর কাউন্ট:</span>
                    <span>{order.storeCount}</span>
                  </div>
                </div>
              </div>
              
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">গ্রাহক তথ্য</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">নাম:</span>
                    <span>{order.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">ফোন নম্বর:</span>
                    <span>{order.phoneNumber}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-gray-500">ঠিকানা:</span>
                    <p className="text-right">{order.address}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">অর্ডার সামারি</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>মোট:</span>
                  <span>{order.totalAmount} ৳</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <div className="mt-4">
              <h3 className="font-medium text-lg mb-4">পণ্য সমূহ</h3>
              <OrderItemList items={order.orderItems} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}