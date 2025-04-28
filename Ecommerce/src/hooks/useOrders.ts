'use client';

import { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '@/lib/api';
import { Order, OrderSummary, OrderCreateData } from '@/lib/types';
import { useAuth } from './useAuth';

export const useOrders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ordersAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch a specific order by ID
  const fetchOrderById = useCallback(async (orderId: number) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ordersAPI.getOrderById(orderId);
      setCurrentOrder(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order #${orderId}:`, error);
      setError('Failed to fetch order details');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Create a new order
  const createOrder = useCallback(async (orderData: OrderCreateData) => {
    if (!isAuthenticated) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ordersAPI.createOrder(orderData);
      // Refresh the orders list
      fetchOrders();
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchOrders]);

  // Fetch orders on component mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  return {
    orders,
    currentOrder,
    isLoading,
    error,
    fetchOrders,
    fetchOrderById,
    createOrder,
  };
};