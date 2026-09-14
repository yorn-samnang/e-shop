"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { StatusPill } from "@/components/common/StatusPill";
import { fetchOrders } from "@/utils/quries";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type Order = {
  order_id: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: string;
  created_at: string;
  address: string;
  items?: OrderItem[];
  user_email?: string;
};

export type OrderItem = {
  product_id: number;
  name: string;
  quantity: number;
  price: string;
};

type StatusFilter =
  | "all"
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const PAGE_SIZE = 20;

export default function OrdersPage() {
  const { data, isPending } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const orders: Order[] = Array.isArray(data) ? data : data?.results ?? [];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = orders.filter((order) => {
    const matchesSearch =
      String(order.order_id).includes(searchTerm) ||
      (order.user_email ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Orders</h1>
      </div>

      <Card>
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by order ID or user email..."
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div>
            <select
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter);
                setPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  User Email
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isPending ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    Loading orders…
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 text-sm">
                      #{order.order_id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                      {order.user_email ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                      ${order.total}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <Link href={`/orders/${order.order_id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-gray-700 text-sm">
            Showing{" "}
            <span className="font-medium">
              {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(page * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of <span className="font-medium">{filtered.length}</span> orders
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
