"use client";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useAuthValidate = () => {
  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/api/auth/me/")).data,
  });

  if (!data && !isPending) {
    router.push("/login");
  }

  return { username: data?.username };

  // login(token!, "superuser"); // hard code cuz im lazy
};
