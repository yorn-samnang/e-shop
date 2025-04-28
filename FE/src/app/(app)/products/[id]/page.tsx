'use client';

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { LayoutIcon, DollarSignIcon, PackageIcon, ImageIcon, TagIcon, ArrowLeftIcon, SaveIcon, TrashIcon, PlusIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProductDetailPage  ()  {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [activeTab, setActiveTab] = useState('basic');
  const product = {
    id,
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    sku: 'HDX-100',
    regularPrice: 149.99,
    salePrice: 129.99,
    cost: 75.0,
    stock: 25,
    lowStockThreshold: 5,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80', 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80'],
    categories: ['Electronics', 'Audio'],
    tags: ['wireless', 'headphones', 'premium', 'audio'],
    status: 'active'
  };
  const tabs = [{
    id: 'basic',
    label: 'Basic Info',
    icon: <LayoutIcon size={16} />
  }, {
    id: 'pricing',
    label: 'Pricing',
    icon: <DollarSignIcon size={16} />
  }, {
    id: 'inventory',
    label: 'Inventory',
    icon: <PackageIcon size={16} />
  }, {
    id: 'images',
    label: 'Images',
    icon: <ImageIcon size={16} />
  }, {
    id: 'categories',
    label: 'Categories & Tags',
    icon: <TagIcon size={16} />
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/products" className="mr-4 p-1 rounded-md hover:bg-gray-100">
            <ArrowLeftIcon size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Edit Product</h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Cancel</Button>
          <Button icon={<SaveIcon size={16} />}>Save Changes</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <div className="border-b mb-6">
              <nav className="flex space-x-2 overflow-x-auto pb-2">
                {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === tab.id ? 'bg-[#1E40AF] text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>)}
              </nav>
            </div>
            {activeTab === 'basic' && <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={product.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={product.sku} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" rows={6} defaultValue={product.description} />
                </div>
                <div className="flex items-center">
                  <input id="status" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked={product.status === 'active'} />
                  <label htmlFor="status" className="ml-2 block text-sm text-gray-900">
                    Active Product
                  </label>
                </div>
              </div>}
            {activeTab === 'pricing' && <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Regular Price ($)
                    </label>
                    <input type="number" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={product.regularPrice} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Price ($)
                    </label>
                    <input type="number" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={product.salePrice} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost ($)
                    </label>
                    <input type="number" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={product.cost} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profit Margin
                    </label>
                    <div className="flex items-center">
                      <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500 w-full">
                        {((product.salePrice - product.cost) / product.salePrice * 100).toFixed(2)}
                        %
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <input id="on-sale" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked={product.salePrice < product.regularPrice} />
                    <label htmlFor="on-sale" className="ml-2 block text-sm text-gray-900">
                      On Sale
                    </label>
                  </div>
                </div>
              </div>}
            {activeTab === 'inventory' && <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input type="number" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={product.stock} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Low Stock Threshold
                    </label>
                    <input type="number" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" defaultValue={product.lowStockThreshold} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <input id="track-inventory" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" defaultChecked />
                    <label htmlFor="track-inventory" className="ml-2 block text-sm text-gray-900">
                      Track Inventory
                    </label>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <input id="allow-backorders" type="checkbox" className="h-4 w-4 text-[#1E40AF] focus:ring-[#1E40AF] border-gray-300 rounded" />
                    <label htmlFor="allow-backorders" className="ml-2 block text-sm text-gray-900">
                      Allow Backorders
                    </label>
                  </div>
                </div>
              </div>}
            {activeTab === 'images' && <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {product.images.map((image, index) => <div key={index} className="relative group">
                      <img src={image} alt={`Product ${index + 1}`} className="h-32 w-full object-cover rounded-md border border-gray-200" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 rounded-md">
                        <button className="p-1 bg-white rounded-full">
                          <TrashIcon size={16} className="text-red-600" />
                        </button>
                      </div>
                      {index === 0 && <div className="absolute top-2 left-2 bg-[#1E40AF] text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>}
                    </div>)}
                  <div className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center h-32 hover:border-[#1E40AF] cursor-pointer">
                    <div className="flex flex-col items-center text-gray-400 hover:text-[#1E40AF]">
                      <PlusIcon size={24} />
                      <span className="text-xs mt-1">Add Image</span>
                    </div>
                  </div>
                </div>
              </div>}
            {activeTab === 'categories' && <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {product.categories.map((category, index) => <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {category}
                        <button className="ml-1 text-gray-500 hover:text-gray-700">
                          <XIcon size={14} />
                        </button>
                      </div>)}
                  </div>
                  <div className="flex">
                    <input type="text" className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" placeholder="Add a category" />
                    <button className="bg-[#1E40AF] text-white px-3 py-2 rounded-r-md">
                      <PlusIcon size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {product.tags.map((tag, index) => <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {tag}
                        <button className="ml-1 text-gray-500 hover:text-gray-700">
                          <XIcon size={14} />
                        </button>
                      </div>)}
                  </div>
                  <div className="flex">
                    <input type="text" className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent" placeholder="Add a tag" />
                    <button className="bg-[#1E40AF] text-white px-3 py-2 rounded-r-md">
                      <PlusIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>}
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Product Preview</h3>
            </div>
            <div className="flex flex-col items-center">
              <img src={product.images[0]} alt={product.name} className="h-48 w-full object-cover rounded-md mb-4" />
              <h4 className="font-medium">{product.name}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-medium text-[#1E40AF]">
                  ${product.salePrice}
                </span>
                {product.salePrice < product.regularPrice && <span className="text-sm text-gray-500 line-through">
                    ${product.regularPrice}
                  </span>}
              </div>
              <div className="mt-2">
                {product.stock > 0 ? <span className="text-xs text-green-600">
                    In Stock ({product.stock})
                  </span> : <span className="text-xs text-red-600">Out of Stock</span>}
              </div>
            </div>
          </Card>
          <Card>
            <div className="space-y-4">
              <Button fullWidth>Preview Product</Button>
              <Button fullWidth variant="outline">
                Duplicate Product
              </Button>
              <Button fullWidth variant="danger">
                Delete Product
              </Button>
            </div>
          </Card>
          <Card>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span>June 1, 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated</span>
                <span>June 5, 2023</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Product ID</span>
                <span>#{id}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
