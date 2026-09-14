// context/CartContext.tsx
'use client';

import React, { createContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { cartAPI } from '@/lib/api';
import { CartItem, CartItemData } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  isInitializing: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (item: CartItemData) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  items: [],
  isLoading: false,
  isInitializing: true,
  totalItems: 0,
  totalPrice: 0,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async (showInitialLoader = false) => {
    if (!isAuthenticated) {
      setIsInitializing(false);
      return;
    }

    if (showInitialLoader) setIsInitializing(true);
    try {
      const response = await cartAPI.getCart();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      if (showInitialLoader) setIsInitializing(false);
    }
  }, [isAuthenticated]);

  // Fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart(true);
    } else {
      setItems([]);
      setIsInitializing(false);
    }
  }, [fetchCart, isAuthenticated]);

  const addToCart = async (item: CartItemData) => {
    setIsLoading(true);
    try {
      await cartAPI.addToCart(item);
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    const previousItems = items;
    setItems((currentItems) => currentItems.map((item) =>
      item.product_id === productId ? { ...item, quantity } : item,
    ));
    setIsLoading(true);
    try {
      await cartAPI.updateCartItem(productId, quantity);
    } catch (error) {
      setItems(previousItems);
      console.error('Error updating cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    const previousItems = items;
    setItems((currentItems) => currentItems.filter((item) => item.product_id !== productId));
    setIsLoading(true);
    try {
      await cartAPI.removeFromCart(productId);
    } catch (error) {
      setItems(previousItems);
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    // This is a local clear, typically called after order creation
    setItems([]);
  };

  // Calculate totals
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        isInitializing,
        totalItems,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
