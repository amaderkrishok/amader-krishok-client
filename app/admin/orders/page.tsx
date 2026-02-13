'use client';

import { useState, useEffect } from 'react';
import { OrderService } from '@/services/order-service';
import { OrderFilters } from '@/types/order';
import { PaginatedResponse } from '@/types/pagination/pagination';
import { Order } from '@/types/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { OrderFilter } from '@/components/dashbaord/orders/order-filter';
import { OrderList } from '@/components/dashbaord/orders/order-list';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<PaginatedResponse<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10
  });
  
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const result = await OrderService.getAllOrders(filters);
        setOrders(result);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('অর্ডার লোড করতে সমস্যা হয়েছে।');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [filters]);
  
  const handleFilterChange = (newFilters: OrderFilters) => {
    // Reset to page 1 when filters change
    setFilters({ ...newFilters, page: 1 });
  };
  
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">সকল অর্ডার</h1>
        <p className="text-gray-600">সমস্ত অর্ডার দেখুন এবং পরিচালনা করুন।</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>অর্ডার ম্যানেজমেন্ট</CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Order Filter with store filter enabled for admin */}
          <OrderFilter
            onChange={handleFilterChange}
            initialFilters={filters}
            showStoreFilter={true}
          />
          
          {/* Order List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="ml-2">অর্ডার লোড হচ্ছে...</span>
            </div>
          ) : (
            <OrderList 
              orders={orders?.data || []} 
              pagination={orders || undefined}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}