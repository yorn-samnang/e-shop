'use client';

import React from 'react';
import Link from 'next/link';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Button from '@/components/ui/Button';


export default function CartPage() {
  const { items, totalItems, isInitializing } = useCart();

  if (isInitializing) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-4 h-28 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="lg:w-1/3">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="text-center py-12">
        <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link href="/products">
          <Button>
            Start Shopping
            <FiArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">Cart Items ({totalItems})</h2>
            
            <div>
              {items.map((item) => (
                <CartItem key={item.product_id} item={item} />
              ))}
            </div>

            <div className="mt-6 text-right">
              <Link href="/products" className="text-primary-600 hover:text-primary-800">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
