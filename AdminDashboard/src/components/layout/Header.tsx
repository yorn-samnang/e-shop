"use client";

import ThemeSelector from "@/components/theme/ThemeSelector";
import { api } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FC } from "react";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/api/auth/me/")).data,
  });

  useEffect(() => {
    const closeProfile = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsProfileOpen(false);
    };

    document.addEventListener("mousedown", closeProfile);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeProfile);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const logout = () => {
    window.localStorage.removeItem("token");
    queryClient.clear();
    setIsProfileOpen(false);
    router.replace("/login");
  };

  const username = data?.username ?? "Admin";

  return (
    <header className="z-20 flex items-center justify-between border-divider border-b bg-white px-4 py-3 dark:bg-slate-900">
      <div className="flex items-center">
        <button
          type="button"
          onClick={toggleSidebar}
          className="mr-4 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <MenuIcon size={24} />
        </button>
        <h1 className="font-semibold text-primary text-xl md:hidden">{username}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="relative rounded-full p-1 hover:bg-gray-100 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <BellIcon size={20} />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-600" />
        </button>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((open) => !open)}
            className="flex items-center rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800"
            aria-haspopup="menu"
            aria-expanded={isProfileOpen}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              <UserIcon size={16} />
            </span>
            <span className="ml-2 hidden font-medium text-sm md:block">{username}</span>
            <ChevronDownIcon
              size={16}
              className={`ml-1 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isProfileOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-divider bg-white p-3 shadow-xl dark:bg-slate-900"
              role="menu"
            >
              <div className="border-divider border-b px-2 pb-3">
                <p className="font-semibold text-sm">{username}</p>
                {data?.email && (
                  <p className="mt-0.5 truncate text-gray-500 text-xs">{data.email}</p>
                )}
              </div>

              <div className="py-3">
                <p className="mb-2 px-2 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  Appearance
                </p>
                <ThemeSelector />
              </div>

              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 border-divider border-t px-2 pt-3 font-medium text-red-600 text-sm hover:text-red-700"
                role="menuitem"
              >
                <LogOutIcon size={17} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
