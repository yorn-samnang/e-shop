"use client";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { StatusPill } from "@/components/common/StatusPill";
import { PlusIcon, SearchIcon, FilterIcon, UserIcon, EditIcon, TrashIcon, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Sample data for demo purposes
const mockUsers = [{
  id: '1',
  username: 'johndoe',
  email: 'john@example.com',
  registrationDate: '2023-01-15',
  status: 'active' as const,
  role: 'Admin'
}, {
  id: '2',
  username: 'janesmith',
  email: 'jane@example.com',
  registrationDate: '2023-02-20',
  status: 'active' as const,
  role: 'Customer'
}, {
  id: '3',
  username: 'bobwilson',
  email: 'bob@example.com',
  registrationDate: '2023-03-10',
  status: 'inactive' as const,
  role: 'Customer'
}, {
  id: '4',
  username: 'alicebrown',
  email: 'alice@example.com',
  registrationDate: '2023-04-05',
  status: 'active' as const,
  role: 'Admin'
}, {
  id: '5',
  username: 'charliejones',
  email: 'charlie@example.com',
  registrationDate: '2023-05-12',
  status: 'inactive' as const,
  role: 'Customer'
}, {
  id: '6',
  username: 'davemiller',
  email: 'dave@example.com',
  registrationDate: '2023-06-18',
  status: 'active' as const,
  role: 'Customer'
}, {
  id: '7',
  username: 'evagarcia',
  email: 'eva@example.com',
  registrationDate: '2023-07-22',
  status: 'active' as const,
  role: 'Customer'
}, {
  id: '8',
  username: 'franklopez',
  email: 'frank@example.com',
  registrationDate: '2023-08-30',
  status: 'inactive' as const,
  role: 'Customer'
}];

export default function UsersPage  ()  {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(mockUsers.map(user => user.id));
    } else {
      setSelectedRows([]);
    }
  };
  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  const filteredUsers = mockUsers.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button icon={<PlusIcon size={16} />}>Add New User</Button>
      </div>
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" icon={<FilterIcon size={16} />}>
              Filter
            </Button>
            {selectedRows.length > 0 && <Button variant="danger">Delete Selected</Button>}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" onChange={handleSelectAll} checked={selectedRows.length === mockUsers.length && mockUsers.length > 0} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" checked={selectedRows.includes(user.id)} onChange={() => handleSelectRow(user.id)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#1E293B] flex items-center justify-center text-white">
                        <UserIcon size={16} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.registrationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusPill status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Link href={`/users/${user.id}`} className="text-[#1E40AF] hover:text-[#1e3a8a]">
                        <EditIcon size={16} />
                      </Link>
                      <button className="text-[#DC2626] hover:text-[#b91c1c]">
                        <TrashIcon size={16} />
                      </button>
                      <div className="relative">
                        <button className="text-gray-500 hover:text-gray-700">
                          <MoreHorizontalIcon size={16} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredUsers.length}</span> of{' '}
            <span className="font-medium">{mockUsers.length}</span> users
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
