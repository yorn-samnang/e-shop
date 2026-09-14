'use client';

import React from 'react';
import Link from 'next/link';
import { FiPackage, FiArrowRight } from 'react-icons/fi';
import { OrderSummary } from '@/lib/types';
import Card from '@/components/ui/Card';

interface OrderItemProps {
  order: OrderSummary;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  return (
    <Card variant="outlined" className="p-4 mb-4 hover:border-primary-300 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex items-start">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 flex-shrink-0">
            <FiPackage className="text-primary-600" />
          </div>
          <div>
            <h3 className="font-medium">Order #{order.order_id}</h3>
            <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center mt-3 sm:mt-0">
          <div className="mr-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <div className="text-right">
            <p className="font-medium">${parseFloat(String(order.total || 0)).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          href={`/orders/${order.order_id}`}
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
        >
          View Order Details
          <FiArrowRight className="ml-1" />
        </Link>
      </div>
    </Card>
  );
};

export default OrderItem;