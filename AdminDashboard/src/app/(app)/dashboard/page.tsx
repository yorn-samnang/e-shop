"use client";

import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { fetchOrders, fetchProducts, fetchUsers } from "@/utils/quries";
import { useQuery } from "@tanstack/react-query";
import { PackageIcon, ShoppingCartIcon, UsersIcon } from "lucide-react";

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

export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
};

// Placeholder chart data (no time-series endpoint available)
const emptyChartData = [
  { name: "Mon", value: 0 },
  { name: "Tue", value: 0 },
  { name: "Wed", value: 0 },
  { name: "Thu", value: 0 },
  { name: "Fri", value: 0 },
  { name: "Sat", value: 0 },
  { name: "Sun", value: 0 },
];

export default function DashboardPage() {
  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const productCount: number =
    productsData?.count ?? productsData?.results?.length ?? 0;
  const orders: Order[] = Array.isArray(ordersData)
    ? ordersData
    : ordersData?.results ?? [];
  const orderCount: number = ordersData?.count ?? orders.length;
  const users: User[] = Array.isArray(usersData)
    ? usersData
    : usersData?.results ?? [];
  const userCount: number = usersData?.count ?? users.length;

  // Map orders to the shape expected by RecentOrdersTable
  const recentOrders = orders.slice(0, 10).map((o) => ({
    id: String(o.order_id),
    date: new Date(o.created_at).toLocaleDateString(),
    customer: o.user_email ?? "—",
    total: `$${o.total}`,
    status: o.status,
  }));

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatsCard
          title="Total Products"
          value={productCount}
          icon={<PackageIcon size={22} />}
          color="#C2410C"
        />
        <StatsCard
          title="Total Orders"
          value={orderCount}
          icon={<ShoppingCartIcon size={22} />}
          color="#10B981"
        />
        <StatsCard
          title="Total Users"
          value={userCount}
          icon={<UsersIcon size={22} />}
          color="#F59E0B"
        />
      </div>

      {/* Sales Chart (placeholder data — no time-series API) */}
      <SalesChart
        dailyData={emptyChartData}
        weeklyData={emptyChartData}
        monthlyData={emptyChartData}
      />

      {/* Recent Orders */}
      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
}
