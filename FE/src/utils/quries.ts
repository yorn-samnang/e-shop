import { api } from "@/lib/axios";

export const fetchProducts = async () => {
  const response = await api.get("/api/products?format=json");
  console.log(response.data);
  return response.data;
};
