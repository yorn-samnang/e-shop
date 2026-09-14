import { api } from "@/lib/axios";

export const fetchProducts = async () => {
  const response = await api.get("/api/products?format=json");
  console.log(response.data);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await api.get("/api/orders/admin/");
  return response.data;
};

export const fetchOrder = async (id: string) => {
  const response = await api.get(`/api/orders/admin/${id}/`);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get("/api/auth/admin/users/");
  return response.data;
};

export const fetchUser = async (id: string) => {
  const response = await api.get(`/api/auth/admin/users/${id}/`);
  return response.data;
};
