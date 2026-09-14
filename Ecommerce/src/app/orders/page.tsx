// src/app/orders/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPackage, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { ordersAPI } from '@/lib/api';
import { OrderSummary } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

export default function OrdersHistoryPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ordersAPI.getOrders();
        console.log('Orders data:', response.data); // Debug
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your order history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse max-w-4xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-4 h-24 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 max-w-4xl mx-auto">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 max-w-4xl mx-auto">
        <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet.</p>
        <Link href="/products">
          <Button>
            <FiShoppingBag className="mr-2" />
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <Link 
          href="/" 
          className="inline-flex items-center text-primary-600 hover:text-primary-800"
        >
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Your Order History</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.order_id} 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link href={`/orders/${order.order_id}`}>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <h3 className="font-medium text-lg">Order #{order.order_id}</h3>
                    <p className="text-gray-500 text-sm">
                      {order.created_at ? formatDate(order.created_at) : 'Date unavailable'}
                    </p>
                  </div>
                  
                  <div className="mt-2 sm:mt-0 flex items-start">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="ml-4 font-medium">${parseFloat(String(order.total || 0)).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-4 text-right">
                  <span className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
                    View Order Details
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
