import { api } from "@/lib/axios";

export const fetchProducts = async () => {
  const response = await api.get("/api/products?format=json");
  return response.data;
};
