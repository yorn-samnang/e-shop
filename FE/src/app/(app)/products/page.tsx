'use client';

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { StatusPill } from "@/components/common/StatusPill";
import { PlusIcon, SearchIcon, FilterIcon, EditIcon, TrashIcon, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Sample data for demo purposes
const mockProducts = [{
  id: '1',
  name: 'Premium Wireless Headphones',
  thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
  sku: 'HDX-100',
  price: '$149.99',
  stock: 25,
  status: 'active' as const
}, {
  id: '2',
  name: 'Ultra HD Smart TV',
  thumbnail: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
  sku: 'TV-UHD-55',
  price: '$799.99',
  stock: 12,
  status: 'active' as const
}, {
  id: '3',
  name: 'Professional Camera Lens',
  thumbnail: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
  sku: 'LNS-PRO-50',
  price: '$299.99',
  stock: 8,
  status: 'active' as const
}, {
  id: '4',
  name: 'Ergonomic Office Chair',
  thumbnail: 'https://images.unsplash.com/photo-1561476108-a9921b0a9b48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
  sku: 'CHR-ERG-100',
  price: '$249.99',
  stock: 5,
  status: 'low' as const
}, {
  id: '5',
  name: 'Mechanical Keyboard',
  thumbnail: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
  sku: 'KBD-MECH-RGB',
  price: '$129.99',
  stock: 0,
  status: 'inactive' as const
}, {
  id: '6',
  name: 'Wireless Gaming Mouse',
  thumbnail: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
  sku: 'MSE-GM-PO',
  price: '$89.99',
  stock: 18,
  status: 'active' as const
}, {
  id: '7',
  name: 'Noise-Cancelling Earbuds',
  thumbnail: 'https://images.unsplash.com/photo-1590658268037-7e57a5b3e075?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
  sku: 'EBD-NC-100',
  price: '$119.99',
  stock: 3,
  status: 'low' as const
}];
export default function ProductsPage   ()  {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(mockProducts.map(product => product.id));
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
  const filteredProducts = mockProducts.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'inactive' as const;
    if (stock <= 5) return 'low' as const;
    return 'in-stock' as const;
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button icon={<PlusIcon size={16} />}>Add New Product</Button>
      </div>
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search products..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
                  <input type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" onChange={handleSelectAll} checked={selectedRows.length === mockProducts.length && mockProducts.length > 0} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
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
              {filteredProducts.map(product => <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" checked={selectedRows.includes(product.id)} onChange={() => handleSelectRow(product.id)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-md object-cover" src={product.thumbnail} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusPill status={getStockStatus(product.stock)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Link href={`/products/${product.id}`} className="text-[#1E40AF] hover:text-[#1e3a8a]">
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
            <span className="font-medium">{filteredProducts.length}</span> of{' '}
            <span className="font-medium">{mockProducts.length}</span> products
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
