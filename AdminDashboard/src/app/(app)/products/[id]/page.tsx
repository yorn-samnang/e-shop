"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  DollarSignIcon,
  ImageIcon,
  LayoutIcon,
  PackageIcon,
  SaveIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import type { Product } from "../page";

type Props = {
  params: Promise<{ id: string }>;
};
const schema = z.object({
  name: z.string().optional(),
  price: z.string().optional(),
  description: z.string().optional(),
  in_stock: z.string().optional(),
  image_url: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

export default function ProductDetailPage({ params }: Props) {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("basic");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { control, register, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const { data, isPending } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get(`/api/products/${id}/`);
      console.log(res.data);
      return res.data;
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (product: Schema) => {
      const res = await api.patch(`api/products/${id}/`, product);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
      toast.success("Product updated successfully");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`api/products/${id}/`);
      return res.data;
    },
    onSuccess: () => {
      router.push("/products");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleDeleteProduct = () => {
    deleteProductMutation.mutate();
  };

  const handleUpdateProduct = (data: Schema) => {
    updateProductMutation.mutate(data);
  };

  const product: Product = data;

  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      icon: <LayoutIcon size={16} />,
    },
    {
      id: "pricing",
      label: "Pricing",
      icon: <DollarSignIcon size={16} />,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: <PackageIcon size={16} />,
    },
    {
      id: "images",
      label: "Images",
      icon: <ImageIcon size={16} />,
    },
  ];

  if (isPending) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/products"
            className="mr-4 rounded-md p-1 hover:bg-gray-100"
          >
            <ArrowLeftIcon size={20} />
          </Link>
          <h1 className="font-bold text-2xl">Edit Product</h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Cancel</Button>
          <Button
            onClick={handleSubmit(handleUpdateProduct)}
            type="submit"
            icon={<SaveIcon size={16} />}
          >
            Save Changes
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <div className="mb-6 border-b">
              <nav className="flex space-x-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center rounded-md px-4 py-2 font-medium text-sm ${activeTab === tab.id ? "bg-[#1E40AF] text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block font-medium text-gray-700 text-sm"
                  >
                    Product Name
                  </label>
                  <input
                    {...register("name")}
                    name="name"
                    id="name"
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    defaultValue={product.name}
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="mb-1 block font-medium text-gray-700 text-sm"
                  >
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    name="description"
                    id="description"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                    rows={6}
                    defaultValue={product.description}
                  />
                </div>
              </div>
            )}
            {activeTab === "pricing" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="price"
                      className="mb-1 block font-medium text-gray-700 text-sm"
                    >
                      Price ($)
                    </label>
                    <input
                      {...register("price")}
                      name="price"
                      id="price"
                      type="number"
                      step="0.01"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      defaultValue={product.price}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "inventory" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="in_stock"
                      className="mb-1 block font-medium text-gray-700 text-sm"
                    >
                      Stock Quantity
                    </label>
                    <input
                      {...register("in_stock")}
                      name="in_stock"
                      id="in_stock"
                      type="number"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                      defaultValue={product.in_stock}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <div className="mb-4">
              <h3 className="font-medium text-lg">Product Preview</h3>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={product.image_url}
                alt={product.name}
                className="mb-4 h-48 w-full rounded-md object-cover"
              />
              <h4 className="font-medium">{product.name}</h4>
              <div className="mt-1 flex items-center space-x-2">
                <span className="font-medium text-[#1E40AF]">
                  ${product.price}
                </span>
              </div>
              <div className="mt-2">
                {product.in_stock > 0 ? (
                  <span className="text-green-600 text-xs">
                    In Stock ({product.in_stock})
                  </span>
                ) : (
                  <span className="text-red-600 text-xs">Out of Stock</span>
                )}
              </div>
            </div>
          </Card>
          <Card>
            <div className="space-y-4">
              <Button fullWidth onClick={handleDeleteProduct} variant="danger">
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
    </div>
  );
}
