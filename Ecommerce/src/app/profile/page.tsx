'use client';

import React, { useState, useRef } from 'react';
import { FiUser, FiPackage, FiShoppingBag, FiCamera, FiCheck, FiX, FiEdit2 } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { uploadAvatar } from '@/lib/blob';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { orders } = useOrders();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(user?.username || '');
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-6">Please log in to view your profile.</p>
        <Link href="/auth/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  const displayName = user.first_name
    ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
    : user.username;

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(null);
    setAvatarUploading(true);
    try {
      const profileImageUrl = await uploadAvatar(file);
      await updateProfile({ profile_image: profileImageUrl });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload image. Please try again.';
      setAvatarError(msg);
    } finally {
      setAvatarUploading(false);
      // Reset file input so the same file can be selected again
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleStartEditing = () => {
    setUsername(user.username);
    setFirstName(user.first_name || '');
    setLastName(user.last_name || '');
    setSaveError(null);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setSaveError(null);
    setIsSaving(true);
    try {
      await updateProfile({
        username,
        first_name: firstName,
        last_name: lastName,
      });
      setIsEditing(false);
    } catch (err: unknown) {
      const errData = (err as { response?: { data?: Record<string, string[]> } })?.response?.data;
      if (errData) {
        const first = Object.values(errData).flat()[0];
        setSaveError(typeof first === 'string' ? first : 'Failed to save changes.');
      } else {
        setSaveError('Failed to save changes. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setSaveError(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* ── Personal Information card ── */}
        <div className="md:col-span-2">
          <Card variant="elevated" className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Personal Information</h2>
              {!isEditing && (
                <Button variant="outline" onClick={handleStartEditing}>
                  <FiEdit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-5 mb-6">
              <div className="relative shrink-0">
                {user.profile_image ? (
                  <Image
                    src={user.profile_image}
                    alt={displayName}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-200"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white text-2xl font-semibold ring-2 ring-gray-200">
                    {initials}
                  </div>
                )}

                {/* Camera overlay button */}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  aria-label="Change profile photo"
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-gray-200 shadow text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition"
                >
                  {avatarUploading ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <FiCamera className="h-3.5 w-3.5" />
                  )}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div>
                <p className="font-semibold text-lg text-slate-900 dark:text-white">{displayName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                {avatarError && (
                  <p className="mt-1 text-xs text-red-600">{avatarError}</p>
                )}
                {avatarUploading && (
                  <p className="mt-1 text-xs text-gray-500">Uploading photo…</p>
                )}
              </div>
            </div>

            {/* Edit form / read-only view */}
            {isEditing ? (
              <div>
                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                  <Input
                    label="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                    placeholder="e.g. Sam"
                  />
                  <Input
                    label="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                    placeholder="e.g. Johnson"
                  />
                </div>

                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-500 text-sm">
                    {user.email}
                    <span className="ml-2 text-xs text-gray-400">(cannot be changed here)</span>
                  </p>
                </div>

                {saveError && (
                  <p className="mb-4 text-sm text-red-600 rounded-md bg-red-50 px-3 py-2 border border-red-200">
                    {saveError}
                  </p>
                )}

                <div className="flex gap-3 mt-2">
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent inline-block" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <FiCheck className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleCancelEditing} disabled={isSaving}>
                    <FiX className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {(user.first_name || user.last_name) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">First name</p>
                      <p className="font-medium">{user.first_name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last name</p>
                      <p className="font-medium">{user.last_name || '—'}</p>
                    </div>
                  </div>
                )}
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

        {/* ── Account sidebar ── */}
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

      {/* ── Recent Orders ── */}
      <div>
        <h2 className="text-xl font-medium mb-4">Recent Orders</h2>

        {orders.length === 0 ? (
          <Card variant="outlined" className="p-6 text-center">
            <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
            <Link href="/products">
              <Button variant="outline">Start Shopping</Button>
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
                      <span className="mr-4 font-medium">${parseFloat(String(order.total || 0)).toFixed(2)}</span>
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
