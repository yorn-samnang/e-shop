"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { StatusPill } from "@/components/common/StatusPill";
import { api } from "@/lib/axios";
import { fetchOrder } from "@/utils/quries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export type OrderItem = {
  product_id: number;
  name: string;
  quantity: number;
  price: string;
};

export type Order = {
  order_id: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: string;
  created_at: string;
  address: string;
  items?: OrderItem[];
  user_email?: string;
};

type Status = Order["status"];

const STATUS_OPTIONS: Status[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id),
  });

  const order: Order | undefined = data;

  const [selectedStatus, setSelectedStatus] = useState<Status | "">("");

  // Sync local status select once data loads
  const currentStatus = (selectedStatus || order?.status) as Status | "";

  const updateStatusMutation = useMutation({
    mutationFn: async (status: Status) => {
      const res = await api.patch(`/api/orders/admin/${id}/`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated");
    },
    onError: () => {
      toast.error("Failed to update order status");
    },
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Loading…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Order not found.
      </div>
    );
  }

  const items: OrderItem[] = order.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/orders" className="mr-4 rounded-md p-1 hover:bg-gray-100">
            <ArrowLeftIcon size={20} />
          </Link>
          <h1 className="font-bold text-2xl">Order #{order.order_id}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Status & Info */}
          <Card>
            <div className="mb-4 flex flex-col border-b pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-3">
                  <h3 className="font-medium text-lg">Order Status</h3>
                  <StatusPill status={order.status} />
                </div>
                <p className="text-gray-500 text-sm">
                  Placed on{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Status editor */}
            <div className="mb-6">
              <h4 className="mb-2 font-medium text-sm">Update Status</h4>
              <div className="flex items-center gap-3">
                <select
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={currentStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as Status)
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <Button
                  icon={<SaveIcon size={14} />}
                  disabled={
                    updateStatusMutation.isPending ||
                    currentStatus === order.status
                  }
                  onClick={() => {
                    if (currentStatus)
                      updateStatusMutation.mutate(currentStatus as Status);
                  }}
                >
                  {updateStatusMutation.isPending ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium">Customer</h4>
                <p className="text-gray-700 text-sm">
                  {order.user_email ?? "—"}
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-medium">Shipping Address</h4>
                <p className="text-gray-700 text-sm">{order.address || "—"}</p>
              </div>
            </div>
          </Card>

          {/* Order Items */}
          <Card>
            <h3 className="mb-4 font-medium text-lg">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500 text-sm"
                      >
                        No items.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const subtotal = (
                        parseFloat(item.price) * item.quantity
                      ).toFixed(2);
                      return (
                        <tr key={item.product_id}>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="font-medium text-gray-900 text-sm">
                              {item.name}
                            </div>
                            <div className="text-gray-500 text-xs">
                              ID: {item.product_id}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                            ${item.price}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                            {item.quantity}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                            ${subtotal}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Order Total</span>
                <span>${order.total}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar summary */}
        <div className="space-y-6">
          <Card title="Order Summary">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-medium">#{order.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <StatusPill status={order.status} />
              </div>
              <div className="flex justify-between border-t pt-3 font-bold">
                <span>Total</span>
                <span>${order.total}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
