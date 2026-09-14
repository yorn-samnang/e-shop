// cart/CartItem.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart, isLoading } = useCart();
  const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:8000';
  const [imageError, setImageError] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(item.product_id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item.product_id);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Correctly format the image URL
  const getImageUrl = (path: string): string => {
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const baseUrl = IMAGE_URL.endsWith('/') ? IMAGE_URL.slice(0, -1) : IMAGE_URL;
    const imagePath = path.startsWith('/') ? path : '/' + path;
    return baseUrl + imagePath;
  };


  

  return (
    <div className="flex items-center py-6 border-b border-gray-200">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
        {item.image_url && !imageError ? (
          <img
            src={getImageUrl(item.image_url)}
            alt={item.name}
            className="h-full w-full object-cover object-center"
            onError={() => setImageError(true)}
          />
        ) : (
          // Placeholder with icon instead of image file
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <FiShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between">
            <Link href={`/products/${item.product_id}`} className="font-medium text-gray-900 hover:text-primary-600">
              {item.name}
            </Link>
            <p className="ml-4 text-gray-900 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm mt-2">
          <div className="flex items-center border rounded">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isLoading}
              className="p-2 hover:bg-gray-100 disabled:opacity-50"
            >
              <FiMinus size={16} />
            </button>
            <span className="px-3">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 disabled:opacity-50"
            >
              <FiPlus size={16} />
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="text-red-500 hover:text-red-600 flex items-center disabled:opacity-50"
          >
            <FiTrash2 className="mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
