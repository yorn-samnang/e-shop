"use client";
import { fetchProducts } from "@/utils/quries";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data, error, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchProducts,
  });

  return <h1>{data?.count}</h1>;
}
