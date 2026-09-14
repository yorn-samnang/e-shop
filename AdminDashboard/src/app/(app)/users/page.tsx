"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { StatusPill } from "@/components/common/StatusPill";
import { fetchUsers } from "@/utils/quries";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

const PAGE_SIZE = 20;

export default function UsersPage() {
  const { data, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const users: User[] = Array.isArray(data) ? data : data?.results ?? [];

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const filtered = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Users</h1>
      </div>

      <Card>
        {/* Search */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by username or email..."
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isPending ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    Loading users…
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500 text-sm"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                      {user.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 text-sm">
                      {user.username}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusPill
                        status={user.is_active ? "active" : "inactive"}
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                      {user.is_staff ? "Admin" : "Customer"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <Link href={`/users/${user.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-gray-700 text-sm">
            Showing{" "}
            <span className="font-medium">
              {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(page * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of <span className="font-medium">{filtered.length}</span> users
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
