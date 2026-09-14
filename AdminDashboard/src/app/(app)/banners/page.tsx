'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, TrashIcon, GripVerticalIcon, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { api } from '@/lib/axios';
import AddBannerDialog from './components/AddBannerDialog';

export type Banner = {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  button_label?: string;
  button_link?: string;
  is_active: boolean;
  order: number;
};

async function fetchBanners(): Promise<Banner[]> {
  const res = await api.get('/api/banners/?all=true');
  return res.data?.results ?? res.data ?? [];
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? 'http://localhost:8000';

function resolveImageUrl(image: string): string {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${API_BASE}${image.startsWith('/') ? '' : '/'}${image}`;
}

export default function BannersPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: fetchBanners,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/banners/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner deleted');
    },
    onError: () => toast.error('Failed to delete banner'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      api.patch(`/api/banners/${id}/`, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
    onError: () => toast.error('Failed to update banner'),
  });

  return (
    <>
      <AddBannerDialog open={openDialog} setOpen={setOpenDialog} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl">Banner Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Banners are shown as a carousel on the storefront homepage.
            </p>
          </div>
          <Button icon={<PlusIcon size={16} />} onClick={() => setOpenDialog(true)}>
            Add Banner
          </Button>
        </div>

        <Card>
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 rounded-xl border border-gray-100 p-4">
                  <div className="h-20 w-32 shrink-0 rounded-lg bg-gray-100" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-1/3 rounded bg-gray-100" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : banners.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-500">
              <ImageIcon size={40} className="text-gray-300" />
              <p className="font-medium">No banners yet</p>
              <p className="text-sm">Add your first banner to display it on the storefront.</p>
              <Button icon={<PlusIcon size={16} />} onClick={() => setOpenDialog(true)}>
                Add Banner
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                    banner.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {banner.image ? (
                      <img
                        src={resolveImageUrl(banner.image)}
                        alt={banner.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">{banner.title}</p>
                    {banner.subtitle && (
                      <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">{banner.subtitle}</p>
                    )}
                    {banner.button_label && (
                      <p className="mt-1 text-xs text-primary">
                        Button: {banner.button_label} → {banner.button_link}
                      </p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex shrink-0 items-center gap-3">
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                      <span className="text-xs">{banner.is_active ? 'Active' : 'Hidden'}</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={banner.is_active}
                        onClick={() =>
                          toggleMutation.mutate({ id: banner.id, is_active: !banner.is_active })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                          banner.is_active ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            banner.is_active ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(banner.id)}
                      className="rounded-md p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
