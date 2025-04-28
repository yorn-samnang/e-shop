"use client";

import { Button } from "@/components/common/Button";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  AlertTriangleIcon,
  DollarSignIcon,
  PlusIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";

// Sample data for demo purposes
const mockOrders = [
  {
    id: "1001",
    date: "2023-06-01",
    customer: "John Doe",
    total: "$125.00",
    status: "delivered" as const,
  },
  {
    id: "1002",
    date: "2023-06-02",
    customer: "Jane Smith",
    total: "$85.50",
    status: "processing" as const,
  },
  {
    id: "1003",
    date: "2023-06-03",
    customer: "Bob Johnson",
    total: "$220.75",
    status: "shipped" as const,
  },
  {
    id: "1004",
    date: "2023-06-04",
    customer: "Alice Brown",
    total: "$45.99",
    status: "pending" as const,
  },
  {
    id: "1005",
    date: "2023-06-05",
    customer: "Charlie Wilson",
    total: "$310.25",
    status: "cancelled" as const,
  },
];
const mockDailyData = [
  {
    name: "Mon",
    value: 1200,
  },
  {
    name: "Tue",
    value: 1800,
  },
  {
    name: "Wed",
    value: 1500,
  },
  {
    name: "Thu",
    value: 2100,
  },
  {
    name: "Fri",
    value: 2400,
  },
  {
    name: "Sat",
    value: 1700,
  },
  {
    name: "Sun",
    value: 1300,
  },
];
const mockWeeklyData = [
  {
    name: "Week 1",
    value: 9500,
  },
  {
    name: "Week 2",
    value: 12000,
  },
  {
    name: "Week 3",
    value: 10800,
  },
  {
    name: "Week 4",
    value: 15000,
  },
];
const mockMonthlyData = [
  {
    name: "Jan",
    value: 42000,
  },
  {
    name: "Feb",
    value: 38000,
  },
  {
    name: "Mar",
    value: 45000,
  },
  {
    name: "Apr",
    value: 50000,
  },
  {
    name: "May",
    value: 55000,
  },
  {
    name: "Jun",
    value: 48000,
  },
];
export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Dashboard</h1>
        <div className="flex space-x-3">
          <Button variant="outline">Export Data</Button>
          <Button icon={<PlusIcon size={16} />}>Add Product</Button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Sales"
          value="$48,574.23"
          icon={<DollarSignIcon size={24} />}
          trend={{
            value: 12.5,
            isPositive: true,
          }}
          color="#1E40AF"
        />
        <StatsCard
          title="New Orders"
          value="124"
          icon={<ShoppingBagIcon size={24} />}
          trend={{
            value: 8.2,
            isPositive: true,
          }}
          color="#0EA5E9"
        />
        <StatsCard
          title="Low Stock Items"
          value="23"
          icon={<AlertTriangleIcon size={24} />}
          trend={{
            value: 2.1,
            isPositive: false,
          }}
          color="#F59E0B"
        />
        <StatsCard
          title="New Users"
          value="45"
          icon={<UsersIcon size={24} />}
          trend={{
            value: 5.8,
            isPositive: true,
          }}
          color="#10B981"
        />
      </div>
      {/* Charts & Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart
            dailyData={mockDailyData}
            weeklyData={mockWeeklyData}
            monthlyData={mockMonthlyData}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-white p-5 shadow">
            <h3 className="mb-4 font-semibold text-lg">Quick Actions</h3>
            <div className="space-y-3">
              <Button fullWidth icon={<ShoppingBagIcon size={16} />}>
                View Products
              </Button>
              <Button
                fullWidth
                variant="secondary"
                icon={<ShoppingBagIcon size={16} />}
              >
                Manage Orders
              </Button>
              <Button
                fullWidth
                variant="outline"
                icon={<UsersIcon size={16} />}
              >
                User Management
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Orders */}
      <RecentOrdersTable orders={mockOrders} />
    </div>
  );
}

