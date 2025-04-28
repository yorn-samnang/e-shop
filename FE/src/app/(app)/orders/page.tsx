'use client';

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { StatusPill } from "@/components/common/StatusPill";
import { DownloadIcon, SearchIcon, FilterIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Sample data for demo purposes
const mockOrders = [{
  id: '1001',
  date: '2023-06-01 14:30',
  customer: 'John Doe',
  total: '$125.00',
  payment: 'Paid',
  status: 'delivered' as const
}, {
  id: '1002',
  date: '2023-06-02 09:15',
  customer: 'Jane Smith',
  total: '$85.50',
  payment: 'Paid',
  status: 'processing' as const
}, {
  id: '1003',
  date: '2023-06-03 16:45',
  customer: 'Bob Johnson',
  total: '$220.75',
  payment: 'Pending',
  status: 'shipped' as const
}, {
  id: '1004',
  date: '2023-06-04 11:20',
  customer: 'Alice Brown',
  total: '$45.99',
  payment: 'Paid',
  status: 'pending' as const
}, {
  id: '1005',
  date: '2023-06-05 13:10',
  customer: 'Charlie Wilson',
  total: '$310.25',
  payment: 'Failed',
  status: 'cancelled' as const
}, {
  id: '1006',
  date: '2023-06-06 10:30',
  customer: 'Eva Martinez',
  total: '$78.50',
  payment: 'Paid',
  status: 'delivered' as const
}, {
  id: '1007',
  date: '2023-06-07 15:45',
  customer: 'David Lee',
  total: '$156.75',
  payment: 'Paid',
  status: 'shipped' as const
}, {
  id: '1008',
  date: '2023-06-08 12:20',
  customer: 'Sophia Wang',
  total: '$92.25',
  payment: 'Pending',
  status: 'processing' as const
}];
export default function OrdersPage(){
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.includes(searchTerm) || order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter) {
      return matchesSearch && order.status === statusFilter;
    }
    return matchesSearch;
  });
  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Button icon={<DownloadIcon size={16} />} variant="outline">
          Export Orders
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setStatusFilter(null)} className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === null ? 'bg-[#1E40AF] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
          All
        </button>
        {statusOptions.map(status => <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1 rounded-full text-sm font-medium ${statusFilter === status ? 'bg-[#1E40AF] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>)}
      </div>
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search by order ID or customer..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div>
            <Button variant="outline" icon={<FilterIcon size={16} />}>
              More Filters
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map(order => <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.payment === 'Paid' ? 'bg-green-100 text-green-800' : order.payment === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusPill status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/orders/${order.id}`} className="text-[#1E40AF] hover:text-[#1e3a8a] flex items-center">
                      <EyeIcon size={16} className="mr-1" /> View
                    </Link>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredOrders.length}</span> of{' '}
            <span className="font-medium">{mockOrders.length}</span> orders
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>;
};
