// orders/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiPackage, FiTruck, FiMapPin } from 'react-icons/fi';
import { ordersAPI } from '@/lib/api';
import { Order } from '@/lib/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProductImage from '@/components/products/ProductImage';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await ordersAPI.getOrderById(orderId);
        console.log("Order data received:", response.data);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Helper function to safely format price
  const formatPrice = (price: any): number => {
    // If price is already a number, return it
    if (typeof price === 'number') return price;
    
    // If it's a string, try to parse it
    if (typeof price === 'string') {
      const parsed = parseFloat(price);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    // Default fallback
    return 0;
  };

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get appropriate status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'processing':
        return <FiPackage />;
      case 'shipped':
      case 'delivered':
        return <FiTruck />;
      default:
        return <FiPackage />;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="mb-8 h-24 bg-gray-200 rounded"></div>
        <div className="mb-4 h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="mb-6">The order you are looking for does not exist or you do not have permission to view it.</p>
        <Link href="/orders">
          <Button>
            <FiArrowLeft className="mr-2" />
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/orders" 
          className="inline-flex items-center text-primary-600 hover:text-primary-800"
        >
          <FiArrowLeft className="mr-2" />
          Back to Orders
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Order #{order.order_id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="outlined" className="p-4">
          <div className="flex items-center text-gray-500 mb-2">
            <FiPackage className="mr-2" />
            <span>Order Status</span>
          </div>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-1">{order.status}</span>
            </span>
          </div>
        </Card>

        <Card variant="outlined" className="p-4">
          <div className="flex items-center text-gray-500 mb-2">
            <FiTruck className="mr-2" />
            <span>Order Date</span>
          </div>
          <div className="font-medium">
            {formatDate(order.created_at)}
          </div>
        </Card>

        <Card variant="outlined" className="p-4">
          <div className="flex items-center text-gray-500 mb-2">
            <FiMapPin className="mr-2" />
            <span>Shipping Address</span>
          </div>
          <div className="font-medium">
            {order.address}
          </div>
        </Card>
      </div>

      <Card variant="outlined" className="mb-8">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Order Items</h2>
        </div>

        <div>
          {order.items.map((item) => {
            const price = formatPrice(item.price);
            return (
              <div key={item.product_id} className="flex items-center p-4 border-b last:border-0">
                <div className="h-16 w-16 rounded border overflow-hidden relative mr-4">
                  <Link href={`/products/${item.product_id}`} className="block relative h-full w-full">
                    {/* Use regular Next.js Image instead of ProductImage if you're having position issues */}
                    {/* <Image 
                      src={item.image_url || '/placeholder-product.jpg'}
                      alt={item.name || 'Product image'}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority={true}
                    /> */}
                    <ProductImage 
                      src={item.image_url || '/placeholder-product.jpg'}
                      alt={item.name || 'Product image'}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority={true}
                      />
                  </Link>
                </div>
                <div className="flex-grow">
                  <Link href={`/products/${item.product_id}`} className="font-medium hover:text-primary-600">
                    {item.name}
                  </Link>
                  <p className="text-gray-500 text-sm">
                    ${price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card variant="outlined" className="mb-8">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Order Summary</h2>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium">${formatPrice(order.total).toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Shipping</p>
              <p className="font-medium">Free</p>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between">
                <p className="text-lg font-medium">Total</p>
                <p className="text-lg font-bold">${formatPrice(order.total).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push('/orders')}>
          <FiArrowLeft className="mr-2" />
          Back to Orders
        </Button>
        
        <Button onClick={() => window.print()}>
          Print Order
        </Button>
      </div>
    </div>
  );
}

