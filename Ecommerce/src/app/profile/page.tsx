'use client';

import React, { useState } from 'react';
import { FiUser, FiPackage, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const [isEditing, setIsEditing] = useState(false);
  
  // For a real implementation, these would be connected to a form and API
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-6">Please log in to view your profile.</p>
        <Link href="/auth/login">
          <Button>
            Login
          </Button>
        </Link>
      </div>
    );
  }

  const handleSaveProfile = () => {
    // Here you would implement API call to update profile
    // For now, we'll just toggle the editing state
    setIsEditing(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Personal Information</h2>
              {!isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {isEditing ? (
              <div>
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
                
                <div className="flex gap-4 mt-6">
                  <Button onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setUsername(user.username);
                      setEmail(user.email);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card variant="elevated" className="p-6">
            <h2 className="text-xl font-medium mb-6">Account</h2>
            
            <div className="space-y-4">
              <Link href="/orders" className="flex items-center text-primary-600 hover:text-primary-800">
                <FiPackage className="mr-2" />
                <span>Your Orders ({orders.length})</span>
              </Link>
              
              <Link href="/cart" className="flex items-center text-primary-600 hover:text-primary-800">
                <FiShoppingBag className="mr-2" />
                <span>Shopping Cart</span>
              </Link>
              
              <button
                onClick={logout}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <FiUser className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">Recent Orders</h2>
        
        {orders.length === 0 ? (
          <Card variant="outlined" className="p-6 text-center">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link href="/products">
              <Button variant="outline">
                Start Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div>
            <Card variant="outlined">
              <div className="divide-y">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.order_id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.order_id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-4 font-medium">${order.total.toFixed(2)}</span>
                      <Link
                        href={`/orders/${order.order_id}`}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {orders.length > 3 && (
              <div className="mt-4 text-center">
                <Link href="/orders" className="text-primary-600 hover:text-primary-800">
                  View All Orders
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}