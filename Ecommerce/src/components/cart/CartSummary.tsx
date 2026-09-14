'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { ordersAPI } from '@/lib/api';
import Input from '@/components/ui/Input';

const CartSummary: React.FC = () => {
  const { totalItems, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCheckout = async () => {
    if (!address.trim()) {
      setError('Please enter your shipping address');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await ordersAPI.createOrder({ address });
      clearCart();
      window.dispatchEvent(new Event('route-navigation-start'));
      router.push(`/orders/${response.data.order_id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <p className="text-gray-600">Subtotal ({totalItems} items)</p>
          <p className="font-medium">${totalPrice.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">Shipping</p>
          <p className="font-medium">Free</p>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between">
            <p className="text-lg font-medium">Total</p>
            <p className="text-lg font-bold">${totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Input
          label="Shipping Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your full address"
          fullWidth
          error={error}
        />
      </div>
      
      <Button
        onClick={handleCheckout}
        isLoading={isLoading}
        fullWidth
        size="lg"
      >
        Checkout
      </Button>
    </div>
  );
};

export default CartSummary;
