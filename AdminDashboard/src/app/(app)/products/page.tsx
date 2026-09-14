"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { StatusPill } from "@/components/common/StatusPill";
import { api } from "@/lib/axios";
import { fetchProducts } from "@/utils/quries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import AddProductDialog from "./components/AddProductDialog";

export type Product = {
  id: number;
  description: string;
  name: string;
  price: string;
  in_stock: number;
  image_url: string;
  category?: 'electronics' | 'clothing' | 'accessories' | 'home' | null;
};
export default function ProductsPage() {
  const { data, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const products: Product[] = data?.results ?? [];
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = React.useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(products.map((product) => product.id.toString()));
    } else {
      setSelectedRows([]);
    }
  };
  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`api/products/${id}/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
  });

  const handleDeleteProducts = (ids: string[]) => {
    for (const id of ids) {
      deleteProductMutation.mutate(id);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const getStockStatus = (stock: number) => {
    if (stock === 0) return "inactive" as const;
    if (stock <= 5) return "low" as const;
    return "in-stock" as const;
  };
  return (
    <>
      <AddProductDialog open={openDialog} setOpen={setOpenDialog} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">Product Management</h1>
          <Button
            icon={<PlusIcon size={16} />}
            onClick={() => setOpenDialog(true)}
          >
            Add New Product
          </Button>
        </div>
        <Card>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              {/* <Button variant="outline" icon={<FilterIcon size={16} />}> */}
              {/*   Filter */}
              {/* </Button> */}
              {selectedRows.length > 0 && (
                <Button
                  variant="danger"
                  onClick={() => handleDeleteProducts(selectedRows)}
                >
                  Delete Selected
                </Button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      onChange={handleSelectAll}
                      checked={
                        selectedRows.length === products.length &&
                        products.length > 0
                      }
                    />
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Stock
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedRows.includes(product.id.toString())}
                        onChange={() => handleSelectRow(product.id.toString())}
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={product.image_url}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 text-sm">
                            {product.name}
                          </div>
                          <div className="text-gray-500 text-sm">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-sm">
                      ${product.price}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                      {product.in_stock}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusPill status={getStockStatus(product.in_stock)} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                      <div className="flex items-center justify-center gap-x-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-primary hover:text-primary-dark"
                        >
                          <EditIcon size={16} />
                        </Link>
                        <button
                          type="button"
                          className="cursor-pointer text-[#DC2626] hover:text-[#b91c1c]"
                          onClick={() =>
                            handleDeleteProducts([product.id.toString()])
                          }
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-gray-700 text-sm">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{filteredProducts.length}</span> of{" "}
              <span className="font-medium">{products.length}</span> products
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                type="button"
                className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
