"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { api } from "@/lib/axios";
import { fetchUser } from "@/utils/quries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
};

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
  });

  const user: User | undefined = data;

  const toggleActiveMutation = useMutation({
    mutationFn: async (is_active: boolean) => {
      const res = await api.patch(`/api/auth/admin/users/${id}/`, {
        is_active,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        User not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/users" className="mr-4 rounded-md p-1 hover:bg-gray-100">
            <ArrowLeftIcon size={20} />
          </Link>
          <h1 className="font-bold text-2xl">User #{user.id}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Info */}
        <Card title="User Information">
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-500">Username</span>
              <span className="text-gray-900">{user.username}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-500">Email</span>
              <span className="text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-500">First Name</span>
              <span className="text-gray-900">{user.first_name || "—"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-500">Last Name</span>
              <span className="text-gray-900">{user.last_name || "—"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-500">Role</span>
              <span className="text-gray-900">
                {user.is_staff ? "Admin" : "Customer"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-500">Status</span>
              <span
                className={`font-medium ${user.is_active ? "text-green-600" : "text-gray-500"}`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Joined</span>
              <span className="text-gray-900">
                {new Date(user.date_joined).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card title="Account Actions">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              {user.is_active
                ? "This account is currently active. You can deactivate it to prevent the user from logging in."
                : "This account is currently inactive. Activate it to allow the user to log in."}
            </p>
            {user.is_active ? (
              <Button
                variant="danger"
                fullWidth
                disabled={toggleActiveMutation.isPending}
                onClick={() => toggleActiveMutation.mutate(false)}
              >
                {toggleActiveMutation.isPending
                  ? "Saving…"
                  : "Deactivate Account"}
              </Button>
            ) : (
              <Button
                variant="success"
                fullWidth
                disabled={toggleActiveMutation.isPending}
                onClick={() => toggleActiveMutation.mutate(true)}
              >
                {toggleActiveMutation.isPending
                  ? "Saving…"
                  : "Activate Account"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
