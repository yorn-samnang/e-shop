"use client";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ArrowLeftIcon, SaveIcon, UserIcon, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function UserDetailPage  ()  {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  // In a real application, you would fetch user data based on the ID
  const user = {
    id,
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    registrationDate: '2023-01-15',
    status: 'active',
    role: 'Admin',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA'
  };
  const recentOrders = [{
    id: '1001',
    date: '2023-06-01',
    total: '$125.00',
    status: 'delivered'
  }, {
    id: '1002',
    date: '2023-05-15',
    total: '$85.50',
    status: 'delivered'
  }, {
    id: '1003',
    date: '2023-04-22',
    total: '$220.75',
    status: 'delivered'
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/users" className="mr-4 p-1 rounded-md hover:bg-gray-100">
            <ArrowLeftIcon size={20} />
          </Link>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Cancel</Button>
          <Button icon={<SaveIcon size={16} />}>Save Changes</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={user.firstName} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={user.lastName} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={user.email} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={user.phone} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" rows={3} defaultValue={user.address} />
              </div>
            </div>
          </Card>
          <Card title="Account Settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={user.username} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={user.role}>
                  <option value="Admin">Admin</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" placeholder="Leave blank to keep current" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" placeholder="Leave blank to keep current" />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input id="status" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked={user.status === 'active'} />
                  <label htmlFor="status" className="ml-2 block text-sm text-gray-900">
                    Active Account
                  </label>
                </div>
              </div>
            </div>
          </Card>
          <Card title="Permissions">
            <div className="space-y-4">
              <div className="flex items-center">
                <input id="perm-products" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked />
                <label htmlFor="perm-products" className="ml-2 block text-sm text-gray-900">
                  Manage Products
                </label>
              </div>
              <div className="flex items-center">
                <input id="perm-orders" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked />
                <label htmlFor="perm-orders" className="ml-2 block text-sm text-gray-900">
                  Manage Orders
                </label>
              </div>
              <div className="flex items-center">
                <input id="perm-users" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked />
                <label htmlFor="perm-users" className="ml-2 block text-sm text-gray-900">
                  Manage Users
                </label>
              </div>
              <div className="flex items-center">
                <input id="perm-settings" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked />
                <label htmlFor="perm-settings" className="ml-2 block text-sm text-gray-900">
                  Manage Settings
                </label>
              </div>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-[#1E293B] flex items-center justify-center text-white mb-4">
                <UserIcon size={48} />
              </div>
              <h3 className="text-lg font-medium">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Member since {user.registrationDate}
              </p>
              <div className="mt-6 w-full">
                <Button fullWidth variant="outline">
                  Change Avatar
                </Button>
              </div>
            </div>
          </Card>
          <Card title="Recent Orders">
            <div className="space-y-3">
              {recentOrders.map(order => <div key={order.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                  <div className="flex items-center">
                    <ShoppingBagIcon size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Order #{order.id}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{order.total}</p>
                    <p className="text-xs text-green-600">{order.status}</p>
                  </div>
                </div>)}
              <Link href="/orders" className="text-sm text-[#1E40AF] hover:underline block text-center mt-4">
                View All Orders
              </Link>
            </div>
          </Card>
          <Card>
            <div className="space-y-4">
              <Button fullWidth variant="danger">
                Delete User
              </Button>
              <Button fullWidth variant="outline">
                Impersonate User
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
